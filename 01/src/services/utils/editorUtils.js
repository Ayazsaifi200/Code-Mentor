/**
 * Enhanced utilities for professional CodeEditor component
 */

/**
 * Ensures keyboard shortcuts work properly in CodeMirror
 * @param {EditorView} view - The CodeMirror EditorView instance
 */
export const ensureKeyboardShortcuts = (view) => {
  if (!view) return;
  
  const contentElement = view.dom.querySelector('.cm-content');
  if (!contentElement) return;
  
  contentElement.setAttribute('tabindex', '0');
  contentElement.focus();
  view.dom.setAttribute('tabindex', '0');
};

/**
 * Gets the current cursor position
 * @param {EditorView} view - CodeMirror EditorView instance
 * @returns {number} Cursor position
 */
export const getCursorPosition = (view) => {
  if (!view) return 0;
  return view.state.selection.main.head;
};

/**
 * Sets cursor position
 * @param {EditorView} view - CodeMirror EditorView instance
 * @param {number} pos - Position to set cursor
 */
export const setCursorPosition = (view, pos) => {
  if (!view) return;
  view.dispatch({
    selection: {main: {anchor: pos, head: pos}}
  });
};

// Create a named object for export
const editorUtils = {
  ensureKeyboardShortcuts,
  getCursorPosition,
  setCursorPosition
};

export default editorUtils;