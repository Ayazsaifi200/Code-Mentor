import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import '../../styles/editor.css';
 


/**
 * Standard CodeEditor with guaranteed cursor behavior for React 19
 * - When typing 'a', cursor appears after it: "a|"
 * - When typing 'p', cursor appears after both: "ap|"
 * - No internal toolbar (use external toolbar)
 */
const CodeEditor = ({ 
  code: initialCode = '', 
  language = 'javascript', 
  onChange,
  onRun,
  isDarkTheme = false // Accept theme from parent
}) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const lastCodeRef = useRef(initialCode);
  // Track mounted state for React 19 concurrent rendering
  const [isMounted, setIsMounted] = useState(false);
  const themeRef = useRef(isDarkTheme);
  
  // CRITICAL: Use useLayoutEffect instead of useEffect for DOM manipulation
  // This ensures DOM updates happen synchronously before browser paint
  useLayoutEffect(() => {
    if (!editorRef.current) return;
    
    // Clean up existing instance
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }
    
    try {
      // Force empty container for React 19
      if (editorRef.current.firstChild) {
        editorRef.current.innerHTML = '';
      }
      
      // Get language extension
      const getLangExtension = () => {
        switch (language) {
          case 'python': return python();
          case 'java': return java();
          case 'javascript':
          default: return javascript();
        }
      };
      
      // Get theme extension
      const getThemeExtension = () => {
        return isDarkTheme ? oneDark : [];
      };
      
      // Create state with full basicSetup (more reliable)
      const state = EditorState.create({
        doc: lastCodeRef.current,
        extensions: [
          basicSetup, // Using full basicSetup instead of minimal
          getLangExtension(),
          getThemeExtension(),
          keymap.of([...defaultKeymap, indentWithTab]),
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              // Update ref first to avoid loops
              const newCode = update.state.doc.toString();
              lastCodeRef.current = newCode;
              // Only call onChange if mounted to avoid React 19 warnings
              if (onChange && isMounted) {
                onChange(newCode);
              }
            }
          })
        ]
      });
      
      // Create and mount editor
      const view = new EditorView({
        state,
        parent: editorRef.current
      });
      
      // Store reference
      viewRef.current = view;
      themeRef.current = isDarkTheme;
      
      // Mark as mounted for React 19 compatibility
      setIsMounted(true);
      
      // Focus with delay (important for React 19)
      const focusTimer = setTimeout(() => {
        if (view && document.contains(editorRef.current)) {
          view.focus();
        }
      }, 100);
      
      return () => {
        clearTimeout(focusTimer);
      };
      
    } catch (error) {
      console.error('Error initializing editor:', error);
    }
  }, [language, isDarkTheme]); // Depends on language and theme
  
  // Clean up when component unmounts
  useLayoutEffect(() => {
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      setIsMounted(false);
    };
  }, []);
  
  // Handle code updates from props - THIS IS WHERE THE PROBLEM IS
  useLayoutEffect(() => {
    if (!viewRef.current || !isMounted) return;
    
    if (lastCodeRef.current !== initialCode) {
      try {
        // IMPORTANT: Don't update the editor if we're in the middle of typing
        // Only apply initialCode changes if they're coming from template changes
        const currentDoc = viewRef.current.state.doc.toString();
        
        // DEBUG what's happening
        console.log("Code prop changed:", { 
          currentDoc, 
          initialCode, 
          lastCodeRef: lastCodeRef.current,
          isSame: currentDoc === initialCode 
        });
        
        // CRITICAL FIX: Only apply changes if current doc is empty
        // or if it's a language change (template switch)
        const isEmptyEditor = !currentDoc.trim();
        const isTemplateSwitch = initialCode && initialCode.includes(`// ${language} Program`) ||
                                 initialCode && initialCode.includes(`# ${language} Program`);
        
        if (isEmptyEditor || isTemplateSwitch) {
          console.log("Applying external code update");
          lastCodeRef.current = initialCode;
          
          // Save selection
          const selection = viewRef.current.state.selection;
          
          // Apply the update
          viewRef.current.dispatch({
            changes: {
              from: 0,
              to: currentDoc.length,
              insert: initialCode
            },
            selection: selection.main.to <= initialCode.length ? selection : undefined
          });
        } else {
          // IMPORTANT: Instead of updating the editor, update the external state
          console.log("Keeping editor content, updating external state");
          lastCodeRef.current = currentDoc;
          
          // Update the external state instead
          if (onChange && currentDoc !== initialCode) {
            // This prevents the Run button from resetting your code
            onChange(currentDoc);
          }
        }
      } catch (error) {
        console.error('Error handling code update:', error);
      }
    }
  }, [initialCode, isMounted, language, onChange]);
  
  // Add this useEffect to prevent editor reset
  useEffect(() => {
    // This prevents the editor from resetting to template
    // when props change for reasons other than language change
    if (viewRef.current) {
      const currentCode = viewRef.current.state.doc.toString();
      
      // Simplified condition - just check if current code differs from initial code
      if (initialCode && initialCode !== currentCode) {
        console.log("Editor content being preserved:", currentCode);
        
        // Update the external code state without changing editor
        if (onChange && currentCode !== lastCodeRef.current) {
          onChange(currentCode);
          lastCodeRef.current = currentCode;
        }
      }
    }
  }, []);
  
  // Add this function to force-save the current content to the store
  const forceSaveContent = () => {
    if (viewRef.current && onChange) {
      const currentContent = viewRef.current.state.doc.toString();
      console.log("Force saving editor content:", currentContent);
      onChange(currentContent);
      lastCodeRef.current = currentContent;
    }
  };

  // Add this to the component
  useEffect(() => {
    // Create a function that can be called from outside
    if (typeof window !== 'undefined') {
      window.forceSaveEditor = forceSaveContent;
    }
    
    return () => {
      // Clean up
      if (typeof window !== 'undefined') {
        delete window.forceSaveEditor;
      }
    };
  }, []);
  
  // Focus handler
  const focusEditor = () => {
    if (viewRef.current) viewRef.current.focus();
  };

  return (
    <div className={`pure-editor-container ${isDarkTheme ? 'dark-theme' : ''}`}>
      {/* Removed internal EditorToolbar */}
      <div 
        ref={editorRef}
        className="pure-editor"
        onClick={focusEditor}
      />
    </div>
  );
};

export default CodeEditor;