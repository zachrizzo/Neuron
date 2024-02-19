"use client";

import { $getRoot, $getSelection } from "lexical";
import { useEffect, useState } from "react";
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import OnChangePlugin from "./plugins/onChange";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import "../../app/globals.css";
import RestoreStatePlugin from "./plugins/restoreStatePlugin";
import { useFormik } from "formik";
import MyCustomAutoFocusPlugin from "./plugins/autoFocusPlugin";
import ComponentPickerMenuPlugin from "./plugins/componentPickerPlugin";
import { GoalNode } from "./nodes/goalNode";
import GoalPlugin from "./plugins/goalPlugin";

export const jsonBlankStep =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const editorConfig = {
  onError(error) {
    throw error;
  },
  nodes: [GoalNode],
};

function Editor() {
  const [hydrated, setHydrated] = useState(false);
  const [editorState, setEditorState] = useState();
  const [step, setStep] = useState({ id: 1, json: jsonBlankStep });
  const savedState = JSON.parse(localStorage.getItem("step")) || {
    id: 1,
    json: jsonBlankStep,
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      json: savedState.json,
    },
  });

  function onChange(editorState) {
    const json = editorState.toJSON();
    const jsonStr = JSON.stringify(json);
    // setStep({ id: 1, json: jsonStr });
    console.log("json", json);
    formik.setFieldValue("json", JSON.stringify(json));

    setEditorState(editorState);
  }

  const handleSave = (step) => {
    //save the step locally to local storage

    localStorage.setItem("step", JSON.stringify(step));
  };
  useEffect(() => {
    // Restore the state from localStorage
    if (savedState.id) {
      formik.setFieldValue("title", savedState.title);
      formik.setFieldValue("json", savedState.json);
      setHydrated(true);
      console.log("json saved", savedState.json);
    }
  }, []);

  useEffect(() => {
    if (!step.id) return;

    formik.setFieldValue("title", step.title);
    formik.setFieldValue("json", step.json);

    setHydrated(true);
  }, [step.id]);

  useEffect(() => {
    if (!hydrated) return;

    const data = formik.values;

    step.title = data.title;
    step.json = data.json;
    // console.log("step2", step);

    // save(plan, step);
    // onStartSave();
  }, [formik.values]);

  useEffect(() => {
    if (!step.id) return;

    const data = formik.values;

    step.title = data.title;
    step.json = data.json;

    handleSave(step);
  }, [formik.values]);

  //

  return (
    <LexicalComposer
      initialConfig={{
        editorState: formik.values.json || jsonBlankStep,
        ...editorConfig,
      }}
    >
      <PlainTextPlugin
        contentEditable={
          <ContentEditable className="relative h-52 rounded-lg outline-none text-black p-4 w-96 bg-white" />
        }
        placeholder={
          <div className="absolute top-2 left-2 p-4 text-[#00000084] pointer-events-none">
            Enter some text...
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <GoalPlugin />
      <MyCustomAutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
      <ComponentPickerMenuPlugin />
      <RestoreStatePlugin step={step} />
    </LexicalComposer>
  );
}

export default Editor;
