import axios from "axios";
import { API_URL } from "../api";
import { Alert } from "react-native";

export const createThread = async () => {
  try {
    const response = await axios.get(`${API_URL}/create_thread`);
    return response.data;
  } catch (error) {
    console.error("Error creating thread", error);
    Alert.alert();
  }
};

export const createMessage = async (thread_id, content) => {
  try {
    const response = await axios.post(
      `${API_URL}/create_message/${thread_id}`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating message", error);
  }
};

export const runAssistant = async (thread_id, instructions) => {
  try {
    const response = await axios.post(`${API_URL}/run/${thread_id}`, {
      instructions,
    });
    return response.data;
  } catch (error) {
    console.error("Error running assistant", error);
  }
};

export const generateReply = async (thread_id) => {
  try {
    const response = await axios.get(`${API_URL}/generate_reply/${thread_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching replies", error);
  }
};

export const readItem = async (item_id) => {
  try {
    const response = await axios.get(`${API_URL}/items/${item_id}`);
    return response.data;
  } catch (error) {
    console.error("Error reading item", error);
  }
};

export const textToSpeech = async (content) => {
  try {
    const response = await axios.post(`${API_URL}/text_to_speech/`, {
      content,
    });
    console.log("Response from text-to-speech", response.data.audio_url);
    return response.data.audio_url; // This should be the URL of the audio file
  } catch (error) {
    console.error("Error in text-to-speech conversion", error);
  }
};

export const transcribeAudio = async (formData, languageCode) => {
  try {
    // Append languageCode to the formData
    formData.append("lang", languageCode);

    const response = await axios.post(`${API_URL}/transcribe_audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.text;
  } catch (error) {
    console.error("Error in audio transcription", error);
  }
};

export const addMessageWithVoiceReply = async (thread_id, message) => {
  try {
    const response = await axios.post(
      `${API_URL}/add_message_with_voice_reply/${thread_id}`,
      message
    );
    return response.data; // This will contain both the messages and audio URL
  } catch (error) {
    console.error("Error in adding message with voice reply", error);
  }
};
export const addMessageWithVoiceReplyNoAssistant = async (messages) => {
  try {
    console.log("Sending request with payload:", messages); // Log the request payload
    const response = await axios.post(
      `${API_URL}/add_message_with_voice_reply_no_assistant`,
      messages
    );
    return response.data;
  } catch (error) {
    console.error("Error in adding message with voice reply", error);
    console.log("Failed request payload:", messages); // Log the failed payload
  }
};

// Add this function to your service layer
export const createPertainingData = async () => {
  try {
    const response = await axios.post(`${API_URL}/create_pertaining_data`);
    return response.data; // Contains the status and file name
  } catch (error) {
    console.error("Error creating pertaining data", error);
  }
};
