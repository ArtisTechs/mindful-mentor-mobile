import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import {
  AccountStatusEnum,
  arrangeMessagesByTimestamp,
  EErrorMessages,
  fetchCounselorList,
  loadingService,
  stringAvatar,
  toastService,
  useGlobalContext,
  webSocketService,
} from "../../shared";
import theme from "../../shared/styles/theme";

const StudentViewChatScreen = () => {
  const { currentUserDetails } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [newMessageCount, setNewMessageCount] = useState(0);
  const chatBodyRef = useRef(null);
  const [counselorDetails, setCounselorDetails] = useState(null);

  useEffect(() => {
    fetchCounselorDetails();
  }, [currentUserDetails]);

  const fetchCounselorDetails = async () => {
    loadingService.show();
    try {
      const response = await fetchCounselorList({
        status: AccountStatusEnum.ACTIVE,
      });

      if (response.content && response.content.length > 0) {
        setCounselorDetails(response.content[0]);
      }
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      loadingService.hide();
    }
  };

  useEffect(() => {
    if (counselorDetails) {
      const receiverId = counselorDetails.id;
      const userId = currentUserDetails.id;

      const handleReceivedMessage = (message) => {
        if (message.senderId === receiverId) {
          setNewMessageCount((prevCount) => prevCount + 1);
        } else {
          setNewMessageCount(0);
        }
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      webSocketService.connect(userId, handleReceivedMessage);

      const fetchHistory = async () => {
        loadingService.show();
        try {
          const senderHistory = await webSocketService.fetchMessageHistory(
            userId,
            receiverId
          );
          const receiverHistory = await webSocketService.fetchMessageHistory(
            receiverId,
            userId
          );
          const messageHistory = arrangeMessagesByTimestamp(
            senderHistory,
            receiverHistory
          );
          setMessages(messageHistory);
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        } finally {
          loadingService.hide();
        }
      };

      fetchHistory();

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [counselorDetails, currentUserDetails]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    const messageText = String(inputValue).trim();
    if (messageText && counselorDetails) {
      try {
        webSocketService.sendMessage(
          messageText,
          counselorDetails.id,
          currentUserDetails.id,
          currentUserDetails.id
        );
        setInputValue("");
      } catch (error) {
        toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <View style={styles.chatAvatar}>
          {counselorDetails && (
            <Ionicons
              name="person-circle"
              size={40}
              color={theme.colors.secondary}
            />
          )}
          <Text style={styles.chatHeaderText}>
            {counselorDetails
              ? `${counselorDetails.firstName} ${counselorDetails.lastName} (Counselor)`
              : "Counselor"}
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
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.chatBubble,
                msg.senderId === currentUserDetails.id
                  ? styles.userBubble
                  : styles.counselorBubble,
              ]}
            >
              <Text>{msg.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noMessagesText}>
            No messages yet. Feel free to reach out to your counselor — start
            the conversation anytime!
          </Text>
        )}
      </ScrollView>

      <View style={styles.chatFooter}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type a message..."
          maxLength={255}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  chatAvatar: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatHeaderText: {
    fontSize: 18,
    color: "white",
    marginLeft: 8,
  },
  chatBody: {
    flex: 1,
    padding: 16,
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
    backgroundColor: theme.colors.tertiary,
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
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudentViewChatScreen;
