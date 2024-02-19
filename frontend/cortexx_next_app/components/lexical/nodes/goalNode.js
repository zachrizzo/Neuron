"use client";

import { $applyNodeReplacement, createEditor, DecoratorNode } from "lexical";
import { useState } from "react";
import { Suspense } from "react";
import React from "react";
import GoalComponent from "../components/goalComponent";

export class GoalNode extends DecoratorNode {
  static getType() {
    return "goal";
  }
  static getKey() {
    return this.__key;
  }

  static clone(node) {
    return new GoalNode(
      node.__student,
      node.__goal,
      node.__objective,
      node.__accuracy,
      node.getKey()
    );
  }

  static importJSON(serializedNode) {
    console.log("serializedNode", serializedNode);

    const node = $createGoalNode({
      goal: serializedNode.goal,
      key: serializedNode.key,
    });

    return node;
  }

  constructor(goal, key) {
    super(key);
    this.__goal = goal || "";
  }

  getKey() {
    return this.__key;
  }

  setGoal(goal) {
    const writable = this.getWritable();
    writable.__goal = goal;
  }

  setObjective(objective) {
    const writable = this.getWritable();
    writable.__objective = objective;
  }

  exportJSON() {
    return {
      //kept this as student because __student.ref.path still is not defined
      goal: this.__goal || "",
      type: "goal",
      version: 1,
    };
  }

  createDOM(config) {
    return document.createElement("div");
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <Suspense fallback={null}>
        <GoalComponent goal={this.__goal} nodeKey={this.getKey()} />
      </Suspense>
    );
  }
}

export function $createGoalNode({ goal, key }) {
  console.log("create goal", goal);

  goal = goal || "";

  return $applyNodeReplacement(new GoalNode(goal, key));
}

export function $isGoalNode(node) {
  return node instanceof GoalNode;
}
