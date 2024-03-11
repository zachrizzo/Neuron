import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import RoundButton from "../buttons/roundButtons";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { updateSingleMessageInChat } from "../../firebase/chats/chats";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMessages,
  setFineTuneRating,
  setFineTurningMessages,
  updateMessageAtIndex,
  selectThreadID,
} from "../../redux/slices/userSlice";
import { playSpeech, stopPlaying } from "../../helperFunctions/audioHelpers";
import MessageModal from "../layout/messageModal";
import { colorsDark } from "../../utility/color";
import Banner from "../googleAds/banner";

const MessageThread = ({
  isUsingAssistant,
  playingSound,
  setPlayingSound,
  playingMessageIndex,
  setPlayingMessageIndex,
  isSoundLoading,
  setIsSoundLoading,
  setModalVisible,
}) => {
  const dispatch = useDispatch();
  const recentMessages = useSelector(selectMessages);
  const [rateLoading, setRateLoading] = useState(false);
  const thread_id = useSelector(selectThreadID);

  // const updateRating = async (rating, index, item) => {
  //   let listOfMessages = [];
  //   messages.forEach((message, index1) => {
  //     if (index1 <= index) {
  //       listOfMessages.push(message);
  //     }
  //   });

  //   dispatch(setFineTurningMessages(listOfMessages));
  //   dispatch(setFineTuneRating(rating));

  //   await updateSingleMessageInChat(thread_id, index, rating);
  //   //update this message in redux
  //   dispatch(
  //     updateMessageAtIndex({
  //       index: index,
  //       updatedMessage: { chatQuality: rating },
  //     })
  //   );
  //   setModalVisible(true);
  // };
  const updateRating = async (rating, index, item) => {
    let listOfMessages = [];
    let startIdx = 0; // Initialize starting index

    // Find the index of the last rated message
    for (let i = index - 1; i >= 0; i--) {
      if (recentMessages[i].chatQuality) {
        startIdx = i + 1;
        break;
      }
    }

    // Collect messages from the last rated message to the current message
    for (let i = startIdx; i <= index; i++) {
      listOfMessages.push(recentMessages[i]);
    }

    dispatch(setFineTurningMessages(listOfMessages));
    dispatch(setFineTuneRating(rating));

    await updateSingleMessageInChat(thread_id, index, rating);

    // Update this message in redux
    dispatch(
      updateMessageAtIndex({
        index: index,
        updatedMessage: { chatQuality: rating },
      })
    );

    setModalVisible(true);
  };

  // console.log("------------------------");
  // console.log("mess", messages);
  // console.log("------------------------");

  return (
    <FlatList
      data={recentMessages}
      style={styles.messageList}
      ref={(ref) => {
        this.flatListRef = ref;
      }}
      onContentSizeChange={() =>
        this.flatListRef.scrollToEnd({ animated: false })
      }
      onScrollToIndexFailed={(info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
          this.flatListRef.scrollToIndex({ index: info.index, animated: true });
        });
      }}
      renderItem={({ item, index }) => {
        createdAt = new Date(item.createdAt).toLocaleDateString();
        return (
          <View>
            {index % 10 === 0 && index !== 0 ? <Banner /> : null}
            <View
              style={[
                {
                  marginBottom:
                    index === recentMessages.length - 1 ? 100 : null,
                },
                item.type === "sent"
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <TextInput
                multiline={true}
                scrollEnabled={false}
                editable={false}
                style={
                  item.type === "sent"
                    ? styles.sentMessageText
                    : styles.receivedMessageText
                }
              >
                {!isUsingAssistant ? item.text.content : item.text}
              </TextInput>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={styles.messageLabel}>{createdAt}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  {index === recentMessages.length - 1 || item.chatQuality ? (
                    <View style={{ flexDirection: "row" }}>
                      <RoundButton
                        color={"#FFFFFF00"}
                        icon={
                          <Ionicons
                            name="thumbs-down"
                            size={20}
                            color={
                              item.chatQuality == "bad"
                                ? colorsDark.red
                                : "#FFFFFFA3"
                            }
                          />
                        }
                        loading={rateLoading === index}
                        size={40}
                        marginRight={10}
                        onPress={async () => {
                          setRateLoading(index);
                          if (!item.chatQuality) {
                            await updateRating("bad", index, item);
                          }
                          setRateLoading(undefined);
                        }}
                      />
                      <RoundButton
                        color={"#FFFFFF00"}
                        icon={
                          <Ionicons
                            name="thumbs-up"
                            size={20}
                            color={
                              item.chatQuality == "good"
                                ? colorsDark.green
                                : "#FFFFFFA3"
                            }
                          />
                        }
                        size={40}
                        loading={rateLoading === index}
                        onPress={async () => {
                          setRateLoading(index);
                          if (!item.chatQuality) {
                            await updateRating("good", index, item);
                          }
                          setRateLoading(undefined);
                        }}
                      />
                    </View>
                  ) : null}
                  {item.audioUrl && (
                    <RoundButton
                      color={"#FFFFFF00"}
                      loading={index === playingMessageIndex && isSoundLoading}
                      pulse={index === playingMessageIndex && !isSoundLoading}
                      icon={
                        <AntDesign
                          name="sound"
                          size={25}
                          color={
                            playingMessageIndex === index
                              ? "#FFFFFF91"
                              : "#FFFFFF"
                          }
                        />
                      }
                      size={40}
                      marginRight={5}
                      onPress={async () => {
                        if (playingMessageIndex === index) {
                          await stopPlaying(
                            playingSound,
                            setPlayingSound,
                            setPlayingMessageIndex
                          );
                          return;
                        } else {
                          setPlayingMessageIndex(index);
                          await playSpeech(
                            item.audioUrl,
                            index,
                            playingMessageIndex,
                            setPlayingMessageIndex,
                            setPlayingSound,
                            setIsSoundLoading
                          );
                        }
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
      inverted={isUsingAssistant}
    />
  );
};

export default MessageThread;

const styles = StyleSheet.create({
  messageList: {
    width: "100%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: colorsDark.blue,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    marginLeft: 30,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: colorsDark.accent,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    marginRight: 30,
  },
  sentMessageText: {
    color: "white",
    fontSize: 16,
  },
  receivedMessageText: {
    color: "white",
    fontSize: 16,
  },
  messageLabel: {
    fontWeight: "light",
    fontSize: 12,
    color: "#FFFFFFA3",
  },
});
