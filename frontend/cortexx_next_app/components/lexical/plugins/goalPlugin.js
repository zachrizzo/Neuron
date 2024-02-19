"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import { $createGoalNode, GoalNode } from "../nodes/goalNode";

export const INSERT_GOAL_COMMAND = createCommand("INSERT_GOAL_COMMAND");

export default function GoalPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GoalNode])) {
      throw new Error("GoalPlugin: GoalNode not registered on editor");
    }

    return editor.registerCommand(
      INSERT_GOAL_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const goalNode = $createGoalNode(payload);
            selection.insertNodes([goalNode]);
          }
          return true;
        });
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
