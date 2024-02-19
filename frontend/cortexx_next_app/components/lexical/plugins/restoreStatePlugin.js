"use client";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const RestoreStatePlugin = (props) => {
  const { step } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!step || !step.json) return;

    try {
      const editorState = editor.parseEditorState(step.json);
      editor.update(() => {
        editor.setEditorState(editorState);
      });
    } catch (error) {
      console.error("Error restoring editor state:", error);
    }
  }, [editor, step]);

  return null;
};

export default RestoreStatePlugin;
