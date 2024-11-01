import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation
import {
  arrangeMessagesByTimestamp,
  EErrorMessages,
  stringAvatar,
  toastService,
  useGlobalContext,
  webSocketService,
} from "../../shared";
import theme from "../../shared/styles/theme";
import { Avatar } from "react-native-paper";

const AdminViewChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { student } = route.params;
  const { currentUserDetails } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatBodyRef = useRef();

  useEffect(() => {
    loadMessages();
    connectWebSocket();
  }, [student]);

  const loadMessages = async () => {
    try {
      const senderHistory = await webSocketService.fetchMessageHistory(
        currentUserDetails.id,
        student.id
      );
      const receiverHistory = await webSocketService.fetchMessageHistory(
        student.id,
        currentUserDetails.id
      );
      const messageHistory = arrangeMessagesByTimestamp(
        senderHistory,
        receiverHistory
      );
      setMessages(messageHistory);
    } catch (error) {
      console.error(error);
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    }
  };

  const connectWebSocket = () => {
    webSocketService.disconnect();
    webSocketService.connect(student.id, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  };

  const handleSendMessage = () => {
    const messageText = inputValue.trim();
    if (messageText) {
      try {
        webSocketService.sendMessage(
          messageText,
          student.id,
          currentUserDetails.id,
          student.id
        );
        setInputValue("");
      } catch (error) {
        toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
      }
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.chatAvatar}>
            {student?.profilePicture &&
            student?.profilePicture !== "undefined" ? (
              <Avatar.Image
                source={{ uri: student.profilePicture }}
                style={styles.avatar}
                size={50}
              />
            ) : (
              <Avatar.Text
                {...stringAvatar(student?.firstName, student?.lastName, 50, 12)}
              />
            )}
            <Text
              style={styles.chatHeaderText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {student ? `${student.firstName} ${student.lastName}` : "Student"}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.chatBody}
          ref={chatBodyRef}
          onContentSizeChange={() =>
            chatBodyRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.chatBubble,
                msg.senderId === currentUserDetails.id
                  ? styles.userBubble
                  : styles.counselorBubble,
              ]}
            >
              <Text
                style={[
                  msg.senderId === currentUserDetails.id
                    ? styles.userBubbleText
                    : styles.counselorBubbleText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatFooter}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: theme.colors.primary,
    width: "95%",
    height: "85%",
    borderRadius: 25,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
  },
  backButton: {
    marginRight: 16,
  },
  chatAvatar: {
    flexDirection: "row",
    alignItems: "center",
  },
  Avatar: {
    marginRight: 12,
  },
  chatHeaderText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    marginLeft: 8,
    width: "80%"
  },
  chatBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.secondary,
  },
  counselorBubble: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  userBubbleText: {
    color: "white",
  },
  counselorBubbleText: {
    color: "black",
  },
  noMessagesText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
  chatFooter: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
});

export default AdminViewChatScreen;
