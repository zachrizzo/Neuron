import { Audio } from "expo-av";

export const playSpeech = async (
  audioUrl,
  index = null,
  playingMessageIndex = null,
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

    if (setPlayingSound) {
      setPlayingSound(sound);
    }

    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        console.log("Finished playing");
        stopPlaying(sound, setPlayingSound, setPlayingMessageIndex);
      }
    });

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
    if (setPlayingSound != null && typeof setPlayingSound === "function") {
      setPlayingSound(null);
    }
    if (
      setPlayingMessageIndex != null &&
      typeof setPlayingMessageIndex === "function"
    ) {
      setPlayingMessageIndex(null);
    }
  }
};
