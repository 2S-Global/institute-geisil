import React from "react";
import {
  LexicalComposer
} from "@lexical/react/LexicalComposer";

import {
  RichTextPlugin
} from "@lexical/react/LexicalRichTextPlugin";

import {
  ContentEditable
} from "@lexical/react/LexicalContentEditable";

import {
  HistoryPlugin
} from "@lexical/react/LexicalHistoryPlugin";

import {
  OnChangePlugin
} from "@lexical/react/LexicalOnChangePlugin";

import {
  LexicalErrorBoundary
} from "@lexical/react/LexicalErrorBoundary";

import "./editor.css"; // 👈 IMPORTANT (THIS IS WHAT YOU WERE MISSING)

const theme = {
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-bold",
    italic: "editor-italic",
  },
};

const initialConfig = {
  namespace: "MyEditor",
  theme,
  onError(error) {
    console.error(error);
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-wrapper">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input" />
          }
          placeholder={
            <div className="editor-placeholder">
              Start typing...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              console.log(editorState.toJSON());
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}