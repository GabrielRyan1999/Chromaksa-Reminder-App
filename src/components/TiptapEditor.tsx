"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import { getNote, saveNote } from '@/app/actions/notes'

interface TiptapEditorProps {
  selectedDate: Date;
}

export default function TiptapEditor({ selectedDate }: TiptapEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose prose-p:max-w-[80ch] focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      setIsSaving(true);
      const json = editor.getJSON();
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await saveNote(dateKey, json);
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
          saveNote(dateKey, editor.getJSON()).then(() => setIsSaving(false));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dateKey, editor]);

  useEffect(() => {
    async function loadNote() {
      if (!editor) return;
      setInitialLoading(true);
      
      try {
        const note = await getNote(dateKey);
        if (note && note.content) {
          editor.commands.setContent(note.content as any);
        } else {
          editor.commands.setContent('<p>Jot down your notes for the day...</p>');
        }
      } catch (error) {
        console.error("Failed to load note", error);
      } finally {
        setInitialLoading(false);
      }
    }
    
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
