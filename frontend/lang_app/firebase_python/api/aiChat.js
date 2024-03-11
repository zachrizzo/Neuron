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

export async function addMessageFromVoiceInputWithAudioReply(formData) {
  const response = await fetch(
    "https://addmessagefromvoiceinputwithaudioreply-fg5stlof5q-uc.a.run.app",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  if (response.ok) {
    console.log("Success:", result);
    return result;
  } else {
    throw new Error(result.error || "Unknown error");
  }
}
