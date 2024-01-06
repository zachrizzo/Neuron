import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ConversationLesson from "./conversationLesson";

describe("ConversationLesson", () => {
  test("renders without errors", () => {
    render(<ConversationLesson />);
  });

  test("updates current step index when clicking on next button", () => {
    const { getByText } = render(<ConversationLesson />);
    const nextButton = getByText("Next");
    fireEvent.click(nextButton);
    // Add your assertions here to check if the current step index has been updated correctly
  });

  test("stops recording when all words are present in recognized or partial speech", () => {
    const { getByText } = render(<ConversationLesson />);
    const stopButton = getByText("Stop");
    fireEvent.click(stopButton);
    // Add your assertions here to check if recording has stopped
  });

  // Add more tests for other functionality in your component
});
