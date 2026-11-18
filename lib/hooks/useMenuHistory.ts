'use client';

import { useCallback, useReducer } from 'react';
import type { Menu } from '@/lib/types/menu';

const FIELD_GROUP_WINDOW_MS = 800;

type MenuUpdate = Menu | ((current: Menu) => Menu);

interface HistoryState {
  past: Menu[];
  present: Menu;
  future: Menu[];
  groupKey: string | null;
  groupAt: number;
}

type HistoryAction =
  | { type: 'update'; update: MenuUpdate; groupKey?: string; now: number }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; menu: Menu }
  | { type: 'saved'; menu: Menu; submittedMenu: Menu };

function createHistory(menu: Menu): HistoryState {
  return { past: [], present: menu, future: [], groupKey: null, groupAt: 0 };
}

function menuHistoryReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'update': {
      const nextMenu = typeof action.update === 'function' ? action.update(state.present) : action.update;
      if (nextMenu === state.present) return state;

      const canGroup =
        Boolean(action.groupKey) &&
        action.groupKey === state.groupKey &&
        action.now - state.groupAt <= FIELD_GROUP_WINDOW_MS;

      return {
        past: canGroup ? state.past : [...state.past, state.present],
        present: nextMenu,
        future: [],
        groupKey: action.groupKey || null,
        groupAt: action.now,
      };
    }
    case 'undo': {
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
        groupKey: null,
        groupAt: 0,
      };
    }
    case 'redo': {
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
        groupKey: null,
        groupAt: 0,
      };
    }
    case 'reset':
      return createHistory(action.menu);
    case 'saved': {
      // Keep newer content edits while accepting the server's menu identity.
      // Undo must not rewind the public URL or owner metadata after a save.
      const withSavedIdentity = (version: Menu): Menu => ({
        ...version,
        id: action.menu.id,
        ownerId: action.menu.ownerId,
        createdAt: action.menu.createdAt,
        updatedAt: action.menu.updatedAt,
      });
      return {
        ...state,
        past: state.past.map(withSavedIdentity),
        present:
          JSON.stringify(state.present) === JSON.stringify(action.submittedMenu)
            ? action.menu
            : withSavedIdentity(state.present),
        future: state.future.map(withSavedIdentity),
        groupKey: null,
        groupAt: 0,
      };
    }
  }
}

export function useMenuHistory(initialMenu: Menu) {
  const [history, dispatch] = useReducer(menuHistoryReducer, initialMenu, createHistory);

  const update = useCallback((next: MenuUpdate, groupKey?: string) => {
    dispatch({ type: 'update', update: next, groupKey, now: Date.now() });
  }, []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const reset = useCallback((menu: Menu) => dispatch({ type: 'reset', menu }), []);
  const saved = useCallback((menu: Menu, submittedMenu: Menu) => {
    dispatch({ type: 'saved', menu, submittedMenu });
  }, []);

  return {
    menu: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    update,
    undo,
    redo,
    reset,
    saved,
  };
}
