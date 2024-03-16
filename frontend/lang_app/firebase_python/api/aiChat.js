export async function sendMessageWithVoiceReply(conversationId, messages, userMessage) {
  const functionUrl = "https://addmessagewithvoicereply-fg5stlof5q-uc.a.run.app";

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        messages,
        userMessage
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Success:", result);
    return result; // Return the entire response for handling by the caller
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Rethrow to handle it in the calling function
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
