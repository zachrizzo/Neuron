"use client";

import React, { use, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { $isGoalNode } from "../nodes/goalNode";

function GoalComponent({ goal, nodeKey }) {
  const [selectedGoal, setSelectedGoal] = useState(goal);
  const [editor] = useLexicalComposerContext();

  console.log("goal from node", goal);

  const setData = (goal, objective) => {
    console.log("hi");
    if (!editor.isEditable()) {
      return console.log("not editable");
    }

    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      console.log("key", nodeKey);

      if (node && $isGoalNode(node)) {
        if (goal) {
          node.setGoal(goal);
        }
        if (objective) {
          node.setObjective(objective);
        }
      }
    });
  };

  useEffect(() => {
    console.log("goal", editor.toJSON());
  }, [goal]);

  return (
    <>
      <Select
        onValueChange={(value) => {
          setSelectedGoal(value);
          setData(value, null);
        }}
        value={selectedGoal ? selectedGoal : goal ? goal : "apple"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export default GoalComponent;
