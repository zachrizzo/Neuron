import React, { useContext, useState, useCallback, useMemo } from "react";
import * as ReactDOM from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { RECORD_INSERT_GOAL_COMMAND, INSERT_GOAL_COMMAND } from "./goalPlugin";
import { $createGoalNode } from "../nodes/goalNode";
import { $getSelection, $isRangeSelection } from "lexical";

// Define the MenuOption subclass for the component picker
class ComponentPickerOption extends MenuOption {
  constructor(title, options) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

// Define the menu item component
function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}) {
  let className = "py-2 px-4 flex items-center cursor-pointer";
  if (isSelected) {
    className += " bg-blue-500 text-white";
  } else {
    className += " hover:bg-blue-100";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="ml-2 text-sm">{option.title}</span>
    </li>
  );
}

// Define the ComponentPickerMenuPlugin component
export default function ComponentPickerMenuPlugin(props) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = [
      new ComponentPickerOption("Goal", {
        keywords: ["goal", "objective", "student"],
        onSelect: () => {
          console.log("Goal component selected");
          const payload = {
            student: "student",
            goal: "goal",
            objective: "objective",
            accuracy: "accuracy",
            key: "key",
          };
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const goalNode = $createGoalNode({ goal: "" });
              selection.insertNodes([goalNode]);
            }
          });
        },
      }),
      new ComponentPickerOption("AI", {
        keywords: ["ai", "artificial intelligence", "student"],
        onSelect: () => console.log("AI component selected"),
      }),

      // Add other options here if needed
    ];

    return queryString
      ? baseOptions.filter((option) => {
          return (
            new RegExp(queryString, "gi").exec(option.title) ||
            option.keywords.some((keyword) =>
              new RegExp(queryString, "gi").exec(keyword)
            )
          );
        })
      : baseOptions;
  }, [queryString]);

  const onSelectOption = useCallback(
    (selectedOption, nodeToRemove, closeMenu, matchingString) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="absolute mt-1 shadow-md rounded-md  bg-white overflow-hidden z-10">
                <ul className="text-gray-700">
                  {options.map((option, i) => (
                    <ComponentPickerMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
}
