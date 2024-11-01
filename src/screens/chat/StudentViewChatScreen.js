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
  showLocalNotification,
  stringAvatar,
  toastService,
  useGlobalContext,
  webSocketService,
} from "../../shared";
import theme from "../../shared/styles/theme";
import { Avatar } from "react-native-paper";

const StudentViewChatScreen = ({ setMessageCount, refetch }) => {
  const { currentUserDetails, isAppAdmin } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [newMessageCount, setNewMessageCount] = useState(0);
  const chatBodyRef = useRef(null);
  const [counselorDetails, setCounselorDetails] = useState(null);

  useEffect(() => {
    if (currentUserDetails) {
      fetchCounselorDetails();
    }
    if (webSocketService.isConnected()) {
      webSocketService.disconnect();
    }
  }, [currentUserDetails, refetch]);

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
    if (counselorDetails && currentUserDetails && !isAppAdmin) {
      const receiverId = counselorDetails?.id;
      const userId = currentUserDetails?.id;

      const handleReceivedMessage = (message) => {
        console.log("message", message);
        if (message.receiverId === currentUserDetails?.id) {
          setNewMessageCount((prevCount) => {
            const updatedCount = prevCount + 1;
            // Delay the update to avoid updating the parent state while rendering
            setTimeout(() => {
              setMessageCount(updatedCount);
            }, 10);
            return updatedCount;
          });

          const notificationTitle = "New Message from Your Counselor";
          const notificationMessage =
            message.content || "You have a new message!";

          showLocalNotification(notificationTitle, notificationMessage);
        } else {
          // Resetting the message count
          setTimeout(() => {
            setNewMessageCount(0);
            setMessageCount(0);
          }, 10);
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
  }, [counselorDetails, currentUserDetails, refetch]);

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
          counselorDetails?.id,
          currentUserDetails?.id,
          currentUserDetails?.id
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
          <View style={styles.chatAvatar}>
            {counselorDetails?.profilePicture &&
            counselorDetails?.profilePicture !== "undefined" ? (
              <Avatar.Image
                source={{ uri: counselorDetails.profilePicture }}
                style={styles.avatar}
                size={60}
              />
            ) : (
              <Avatar.Text
                {...stringAvatar(
                  counselorDetails?.firstName,
                  counselorDetails?.lastName,
                  60,
                  12
                )}
                style={styles.avatar}
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
                  msg.senderId === currentUserDetails?.id
                    ? styles.userBubble
                    : styles.counselorBubble,
                ]}
              >
                <Text
                  style={[
                    msg.senderId === currentUserDetails?.id
                      ? styles.userBubbleText
                      : styles.counselorBubbleText,
                  ]}
                >
                  {msg.content}
                </Text>
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

export default StudentViewChatScreen;
