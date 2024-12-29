"use client"
import React, { useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from "@monaco-editor/react";
type InteractiveEditorProps = {

};

const InteractiveEditor: React.FC<InteractiveEditorProps> = () => {

    const [code, setCode] = useState<string>("// Write your JavaScript code here");

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    };

    return (
        <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={code}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
            }}
        />
    );
}
export default InteractiveEditor;