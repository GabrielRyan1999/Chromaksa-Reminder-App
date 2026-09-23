import sys

def fix_reminder_list():
    with open('src/components/ReminderList.tsx', 'r') as f:
        content = f.read()

    old_effect = '''  useEffect(() => {
    async function fetchReminders() {
      // Use cache for instant UI if available
      if (remindersCache[dateKey]) {
        setReminders(remindersCache[dateKey]);
        setLoading(false);
      } else {
        setReminders([]); // Clear immediately when switching to uncached date
        setLoading(true);
      }

      try {
        const data = await getReminders(dateKey);
        remindersCache[dateKey] = data;
        setReminders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReminders();
  }, [dateKey]);'''
    
    new_effect = '''  useEffect(() => {
    let ignore = false;
    async function fetchReminders() {
      let hasCache = false;
      // Use cache for instant UI if available
      if (remindersCache[dateKey]) {
        setReminders(remindersCache[dateKey]);
        setLoading(false);
        hasCache = true;
      } else {
        setReminders([]); // Clear immediately when switching to uncached date
        setLoading(true);
      }
      
      // Skip fetch if this is initial server prefetch
      if (hasCache && initialReminders && dateKey === format(new Date(), "yyyy-MM-dd")) {
        return;
      }

      try {
        const data = await getReminders(dateKey);
        if (!ignore) {
          remindersCache[dateKey] = data;
          setReminders(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchReminders();
    return () => { ignore = true; };
  }, [dateKey]);'''
    
    content = content.replace(old_effect, new_effect)
    with open('src/components/ReminderList.tsx', 'w') as f:
        f.write(content)

def fix_tiptap():
    with open('src/components/TiptapEditor.tsx', 'r') as f:
        content = f.read()

    old_effect = '''  useEffect(() => {
    if (!editor) return;
    
    async function loadNote() {
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
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      
      // If we are switching away from a date, and the content isn't empty
      const content = editor.getJSON();
      if (Object.keys(content).length > 0) {
         saveNote(dateKeyRef.current, content).catch(console.error);
         notesCache[dateKeyRef.current] = content;
      }
    }
    
    loadNote();
  }, [dateKey, editor]);'''

    new_effect = '''  useEffect(() => {
    let ignore = false;
    if (!editor) return;
    
    async function loadNote() {
      isProgrammaticUpdate.current = true;
      if (notesCache[dateKey]) {
        editor!.commands.setContent(notesCache[dateKey]);
        setInitialLoading(false);
      } else {
        editor!.commands.clearContent();
        setInitialLoading(true);
      }
      isProgrammaticUpdate.current = false;
      
      try {
        const note = await getNote(dateKey);
        if (!ignore) {
          if (note && note.content) {
            notesCache[dateKey] = note.content;
            isProgrammaticUpdate.current = true;
            editor!.commands.setContent(note.content as any);
            isProgrammaticUpdate.current = false;
          } else if (!notesCache[dateKey]) {
            isProgrammaticUpdate.current = true;
            editor!.commands.clearContent();
            isProgrammaticUpdate.current = false;
          }
        }
      } catch (error) {
        console.error("Failed to load note", error);
      } finally {
        if (!ignore) setInitialLoading(false);
      }
    }
    
    // If there is a pending save for the PREVIOUS date when we switch dates, 
    // we should flush it immediately before loading the new date.
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      
      // If we are switching away from a date, and the content isn't empty
      const content = editor!.getJSON();
      if (Object.keys(content).length > 0) {
         saveNote(dateKeyRef.current, content).catch(console.error);
         notesCache[dateKeyRef.current] = content;
      }
    }
    
    loadNote();
    return () => { ignore = true; };
  }, [dateKey, editor]);'''

    content = content.replace(old_effect, new_effect)
    with open('src/components/TiptapEditor.tsx', 'w') as f:
        f.write(content)

fix_reminder_list()
fix_tiptap()
