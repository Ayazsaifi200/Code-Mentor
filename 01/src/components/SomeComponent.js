import React from 'react';
import CodeEditorWrapper from './CodeEditor/CodeEditorWrapper';

const SomeComponent = () => {
  const handleCodeChange = (newCode) => {
    // Handle code changes
    console.log(newCode);
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <CodeEditorWrapper
        code="// Write your code here"
        language="java"
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default SomeComponent;