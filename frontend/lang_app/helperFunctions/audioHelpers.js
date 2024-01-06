import { Audio } from "expo-av";

export const playSpeech = async (
  audioUrl,
  index = null,
  // playingMessageIndex = null,
  setPlayingMessageIndex = null,
  setPlayingSound = null,
  setIsSoundLoading
) => {
  setIsSoundLoading(true);
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );

    if (!sound) {
      throw new Error("Failed to create sound object");
    }

    // Define a playback status update callback
    const playbackStatusUpdateCallback = (playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        // console.log("Finished playing");
        stopPlaying(sound, setPlayingSound, setPlayingMessageIndex);
      }
    };

    // console.log(
    //   "Sound object properties:",
    //   Object.getOwnPropertyDescriptors(sound)
    // );

    // try {
    sound.setOnPlaybackStatusUpdate(playbackStatusUpdateCallback);
    // } catch (error) {
    //   console.error("Failed to set playback status update callback:", error);
    // }

    if (setPlayingSound && typeof setPlayingSound === "function") {
      setPlayingSound(sound);
    }

    if (
      setPlayingMessageIndex &&
      typeof setPlayingMessageIndex === "function" &&
      index !== null
    ) {
      setPlayingMessageIndex(index);
    }

    setIsSoundLoading(false);
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing speech", error);
    setIsSoundLoading(false);
    if (setPlayingSound && typeof setPlayingSound === "function") {
      setPlayingSound(null);
    }
  }
};

export const stopPlaying = async (
  playingSound,
  setPlayingSound,
  setPlayingMessageIndex = null
) => {
  if (playingSound) {
    await playingSound.unloadAsync();
    if (setPlayingSound && typeof setPlayingSound === "function") {
      setPlayingSound(null);
    }
    if (
      setPlayingMessageIndex &&
      typeof setPlayingMessageIndex === "function"
    ) {
      setPlayingMessageIndex(null);
    }
  }
};
