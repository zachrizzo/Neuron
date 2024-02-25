export async function sendMessageWithVoiceReply(
  conversationId,
  messages,
  modelType
) {
  const functionUrl =
    "https://us-central1-lang-learning-app-gpt.cloudfunctions.net/ai-addMessageWithVoiceReply";

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        messages,
        modelType,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Success:", result);
    // Handle success, e.g., update UI or state as necessary
  } catch (error) {
    console.error("Error sending message:", error);
    // Handle error, e.g., show error message to user
  }
}
