"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import { getNote, saveNote } from '@/app/actions/notes'

interface TiptapEditorProps {
  selectedDate: Date;
}

const notesCache: Record<string, any> = {};

export default function TiptapEditor({ selectedDate }: TiptapEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dateKeyRef = useRef(dateKey);
  const isProgrammaticUpdate = useRef(false);

  // Keep dateKeyRef in sync so onUpdate closures always have the latest date
  useEffect(() => {
    dateKeyRef.current = dateKey;
  }, [dateKey]);

  // Clean up pending saves on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Jot down your notes for the day...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-p:max-w-[80ch] focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (isProgrammaticUpdate.current) return;
      
      setIsSaving(true);
      const json = editor.getJSON();
      const currentDateKey = dateKeyRef.current;
      notesCache[currentDateKey] = json; // Update cache immediately
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await saveNote(currentDateKey, json);
        } catch (error) {
          console.error("Failed to save note", error);
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (editor) {
          setIsSaving(true);
          const json = editor.getJSON();
          notesCache[dateKey] = json;
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveNote(dateKey, json).then(() => setIsSaving(false));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dateKey, editor]);

  useEffect(() => {
    async function loadNote() {
      if (!editor) return;
      
      isProgrammaticUpdate.current = true;
      if (notesCache[dateKey]) {
        editor.commands.setContent(notesCache[dateKey]);
        setInitialLoading(false);
      } else {
        editor.commands.clearContent();
        setInitialLoading(true);
      }
      isProgrammaticUpdate.current = false;
      
      try {
        const note = await getNote(dateKey);
        if (note && note.content) {
          notesCache[dateKey] = note.content;
          isProgrammaticUpdate.current = true;
          editor.commands.setContent(note.content as any);
          isProgrammaticUpdate.current = false;
        }
      } catch (error) {
        console.error("Failed to load note", error);
      } finally {
        setInitialLoading(false);
      }
    }
    
    // If there is a pending save for the PREVIOUS date when we switch dates, 
    // we should flush it immediately before loading the new date.
    // (Skipped for simplicity as debouncing usually handles fast typing, but if needed we can await flush).
    
    loadNote();
  }, [dateKey, editor]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-sans font-semibold text-lg text-[var(--color-brand-graphite)] uppercase tracking-wider text-xs">
          Notes
        </h3>
        <span className="text-xs text-[var(--color-brand-graphite)] italic">
          {initialLoading ? "Loading..." : isSaving ? "Saving..." : "Saved"}
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
