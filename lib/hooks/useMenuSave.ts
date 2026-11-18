'use client';

import { useRef, useState } from 'react';
import type { Menu } from '@/lib/types/menu';

function contentSignature(menu: Menu): string {
  const { id: _id, ownerId: _owner, createdAt: _created, updatedAt: _updated, ...content } = menu;
  return JSON.stringify(content);
}

/** Save an immutable submitted version while later edits remain in the editor. */
export function useMenuSave({
  menu,
  initialMenu,
  initiallyPublished,
  saveMenu,
  onSaved,
}: {
  menu: Menu;
  initialMenu: Menu;
  initiallyPublished: boolean;
  saveMenu: (menu: Menu) => Promise<Menu>;
  onSaved: (menu: Menu, submittedMenu: Menu) => void;
}) {
  const [savedContent, setSavedContent] = useState<string | null>(() =>
    initiallyPublished ? contentSignature(initialMenu) : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const dirty = contentSignature(menu) !== savedContent;

  const save = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsSaving(true);
    setError('');
    const submitted = menu;
    try {
      const result = await saveMenu(submitted);
      setSavedContent(contentSignature(result));
      onSaved(result, submitted);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : 'Unable to save your menu. Your edits are still here.'
      );
    } finally {
      inFlight.current = false;
      setIsSaving(false);
    }
  };

  return {
    save,
    isSaving,
    error,
    dirty,
    hasPublished: savedContent !== null,
    status: isSaving ? 'Saving…' : error ? 'Save failed' : dirty ? 'Unsaved changes' : 'Saved',
  };
}
