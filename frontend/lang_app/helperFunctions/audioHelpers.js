import { Audio } from "expo-av";

export const playSpeech = async (
  audioUrl,
  index,
  playingMessageIndex,
  setPlayingMessageIndex,
  setPlayingSound,
  setIsSoundLoading
) => {
  setIsSoundLoading(true);
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    setPlayingSound(sound);
    // setPlayingMessageIndex(index);

    sound.setProgressUpdateIntervalAsync(100);

    // Set the playback status update listener
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
    stopPlaying(setPlayingSound, setPlayingMessageIndex);
  }
};

export const stopPlaying = async (
  playingSound,
  setPlayingSound,
  setPlayingMessageIndex
) => {
  if (playingSound) {
    await playingSound.unloadAsync();
    setPlayingSound(null);
    setPlayingMessageIndex(null);
  } else {
    setPlayingSound((sound) => {
      if (sound) {
        sound.unloadAsync();
      }
      return null;
    });
    setPlayingMessageIndex(null);
  }
};
