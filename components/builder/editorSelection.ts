export { selectionKey, selectionExists } from '../../lib/types/editorSelection';
export type { EditorSelection } from '../../lib/types/editorSelection';

export type DragPayload =
  { type: 'section'; sectionId: string } | { type: 'item'; sectionId: string; itemId: string };
