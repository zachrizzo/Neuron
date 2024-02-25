const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");
const { PassThrough } = require("stream");
// Initialize OpenAI with the API key stored in Firebase Functions config
const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

exports.addMessageWithVoiceReply = functions.https.onRequest(
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const messageModel = req.body;
    const { conversationId, messages, modelType } = messageModel;

    const modelDict = {
      general_lang_chat: "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
      fr_Lesson1_alphabet_pronunciation:
        "ft:gpt-3.5-turbo-1106:personal::8RLCgNEw",
    };

    // Format messages for OpenAI
    const openAIFormatMessages = messages.map((msg) => ({
      role: msg.text.role,
      content: msg.text.content,
    }));

    try {
      // Get the reply from OpenAI
      const openaiResponse = await openai.chat.completions.create({
        model:
          modelDict[modelType] || "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
        messages: openAIFormatMessages,
      });

      const choice = openaiResponse.choices[0];
      const assistantReply = choice.message.content;

      // Assuming you have a function to generate the speech and return the audio URL
      const audioUrl = await generateSpeechAndUpload(assistantReply);

      // Prepare the new message object
      const newMessage = {
        id: `assistant${messages.length}`, // Adjust ID generation as needed
        createdAt: new Date().toLocaleString(),
        text: {
          content: assistantReply,
          role: "assistant",
        },
        type: "received",
        audioUrl: audioUrl,
      };

      // Update Firestore with the new message
      const docRef = admin.firestore().collection("chats").doc(conversationId);
      await docRef.set(
        {
          messages: admin.firestore.FieldValue.arrayUnion(newMessage),
        },
        { merge: true }
      );

      res.json({ success: true, audioUrl, newMessage });
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).send("Error processing the OpenAI request");
    }
  }
);

async function generateSpeechAndUpload(text) {
  const voiceResponse = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "shimmer",
    input: text,
  });

  if (!voiceResponse.ok) {
    console.error("Response from OpenAI was not OK.");
    return null;
  }

  const buffer = Buffer.from(await voiceResponse.arrayBuffer());
  const bucket = admin.storage().bucket();
  const fileName = `voiceReplies/${Date.now()}.mp3`;
  const file = bucket.file(fileName);

  await file.save(buffer, {
    metadata: {
      contentType: "audio/mp3",
    },
  });

  // Make the file publicly readable
  await file.makePublic();

  // Construct the public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return publicUrl;
}
