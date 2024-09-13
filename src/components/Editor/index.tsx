import React, { useEffect } from 'react';
import { Editor, loader } from "@monaco-editor/react";
import { cairoLanguageDef, cairoSnippets, cairoTheme } from './config';



interface CairoEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    height?: string;
}

export const CairoEditor: React.FC<CairoEditorProps> = ({ value, onChange, height = "40vh" }) => {
    useEffect(() => {
        loader.init().then(monaco => {
            monaco.languages.register({ id: 'cairo' });
            monaco.languages.setMonarchTokensProvider('cairo', cairoLanguageDef as any);
            monaco.editor.defineTheme('cairoDark', cairoTheme as any);

            monaco.languages.registerCompletionItemProvider('cairo', {
                provideCompletionItems: (model, position) => {
                    const suggestions = [];
                    for (const [name, snippet] of Object.entries(cairoSnippets)) {
                        suggestions.push({
                            label: name,
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: snippet.description,
                            detail: snippet.description,
                        });
                    }
                    return { suggestions };
                }
            });
        });


    }, []);

    return (
        <Editor
            theme="cairoDark"
            height={height}
            defaultLanguage="cairo"
            value={value}
            onChange={onChange}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
            }}
        />
    );
};