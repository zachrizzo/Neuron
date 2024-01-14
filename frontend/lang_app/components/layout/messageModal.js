import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import InputBox from "../inputs/inputBox";
import MainButton from "../buttons/mainButton";
import RoundButton from "../buttons/roundButtons";
import { Ionicons } from "@expo/vector-icons";
import { addFineTunningConversation } from "../../firebase/chats/fineTunningPrompts";
import { useSelector } from "react-redux";
import {
  selectFineTurningMessages,
  selectFineTuneRating,
  selectUser,
  selectIsCurrentChatALesson,
} from "../../redux/slices/userSlice";
import ProceduralCheckBox from "../inputs/proceduralCheckBox";
import { updateLesson } from "../../firebase/lessons/lesson";
import { arrayUnion } from "firebase/firestore";
const MessageModal = ({
  visible,
  setModalVisible,
  isLesson = false,
  lessonRating = null,
  lessonID = null,
  exerciseID = null,
}) => {
  const [message, setMessage] = useState("");
  const fineTunningMessages = useSelector(selectFineTurningMessages);
  const fineTunningRating = useSelector(selectFineTuneRating);
  const [whatWasWrong, setWhatWasWrong] = useState([]);
  const user = useSelector(selectUser);
  const setIsCurrentChatALesson = useSelector(selectIsCurrentChatALesson);

  const handleSubmit = async () => {
    if (isLesson) {
      updateLesson(lessonID, {
        lessonRatings: arrayUnion({
          exerciseRating: lessonRating,
          whatWasWrong: whatWasWrong,
          message: message,
          language: user.language,
          exerciseID: exerciseID,
        }),
      });
      setMessage(""); // Clear the input field after submit
      setModalVisible(false);
    } else {
      const collectionName = setIsCurrentChatALesson
        ? "LessonFineTunningConversations"
        : "fineTunningConversations";

      addFineTunningConversation(collectionName, {
        fineTunningMessages: fineTunningMessages,
        rating: fineTunningRating,
        message: message,
        whatWasWrong: whatWasWrong,
        language: user.language,
      });
      setMessage(""); // Clear the input field after submit
      setModalVisible(false);
    }
  };
  console.log(lessonRating);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          {/* New Container */}
          {/* <View style={styles.modalHeader}>
            {whatWasWrong.length > 0 && message != "" && (
              <RoundButton
                icon={<Ionicons name="close" size={30} color="black" />}
                size={50}
                color={"#FFFFFF9A"}
                onPress={handleSubmit}
              />
            )}
          </View> */}

          {/* Rest of Modal Content */}
          <View style={styles.modalContent}>
            <Text
              style={{ color: "#00000089", fontSize: 20, fontWeight: "bold" }}
            >
              Thank You for Your Feedback!
            </Text>
            {isLesson ? (
              <ProceduralCheckBox
                multiSelect={true}
                options={
                  lessonRating == "good"
                    ? [
                        "Lesson was good",
                        "Options were engaging",
                        "Translation was perfect",
                        "This lesson is correct",
                        "Pronunciation was good",
                      ]
                    : [
                        "Lesson was bad/easy",
                        "Not enough options",
                        "Translation was bad",
                        "This is not correct",
                        "Pronunciation was bad",
                      ]
                }
                onUpdateSelectedOptions={(selectedOptions) => {
                  setWhatWasWrong(selectedOptions);
                }}
                boxShadow={true}
                textColor={"#00000089"}
              />
            ) : (
              <ProceduralCheckBox
                multiSelect={true}
                options={
                  fineTunningRating == "good"
                    ? [
                        "Reply was Great!",
                        "Audio was correct",
                        "Translation made sense",
                        "That's what I said",
                        "Pronunciation was good",
                      ]
                    : [
                        "Reply was bad",
                        "Audio was not correct",
                        "Translation didn't make sense",
                        "That's not what I said",
                        "Pronunciation was bad",
                      ]
                }
                onUpdateSelectedOptions={(selectedOptions) => {
                  setWhatWasWrong(selectedOptions);
                }}
                boxShadow={true}
                textColor={"#00000089"}
              />
            )}
            <Text
              style={{
                textAlign: "center",
                marginHorizontal: 10,
                color: "#00000089",
                fontSize: 18,
                fontWeight: "bold",
                marginVertical: 10,
              }}
            >
              Please let us know what was wrong with the reply in detail
            </Text>
            <InputBox
              onChangeText={(text) => setMessage(text)}
              value={message}
              placeholder={"More detailed feedback"}
              editable={true}
              width={"80%"}
              height={50}
              borderRadius={10}
              fontSize={16}
              textColor={"#000000"}
              placeholderTextColor={"#9D9D9D8D"}
              backgroundColor={"#E7E7E79A"}
            />

            <MainButton
              onPress={handleSubmit}
              title={"Submit"}
              margin={10}
              isLoading={false}
              shadow={true}
              borderRadius={10}
              disabled={whatWasWrong.length == 0 || message == ""}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MessageModal;

// Updated styles
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000B3",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    alignItems: "flex-start", // Aligns the close button to the left
  },
  modalContent: {
    alignItems: "center", // Keeps the rest of your modal content centered
    width: "100%",
  },
});
