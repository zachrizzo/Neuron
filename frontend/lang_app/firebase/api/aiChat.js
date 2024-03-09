export async function sendMessageWithVoiceReply(
  conversationId,
  messages,
  modelType
) {
  const functionUrl =
    "https://addmessagewithvoicereply-fg5stlof5q-uc.a.run.app";

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

    // Check if the response is OK and content type is JSON before parsing
    const contentType = response.headers.get("Content-Type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const result = await response.json();
      console.log("Success:", result);
      return result;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    // Handle error, e.g., show error message to user
  }
}
