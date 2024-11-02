// shared/messageService.js
import { useEffect, useState } from "react";
import { getMessagesForReceiver } from "./messages-services";
import { showLocalNotification } from "./notification-service";

const useMessageService = () => {
  // Lazy load useGlobalContext to break the circular dependency
  const { currentUserDetails, isAppAdmin } =
    require("../context").useGlobalContext();

  const [adminMessages, setAdminMessages] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isMessagesFetch, setIsMessagesFetch] = useState(false);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  useEffect(() => {
    if (currentUserDetails?.id && isAppAdmin) {
      // Start polling for messages
      fetchNewMessages();

      const intervalId = setInterval(() => {
        fetchNewMessages();
      }, 15000); // 15 seconds

      return () => clearInterval(intervalId);
    }
  }, [currentUserDetails, isAppAdmin]);

  useEffect(() => {
    setNewMessageCount(adminMessages.length);
    if (newMessageCount > prevMessageCount) {
      const notificationTitle = "New Message";
      const notificationMessage =
        newMessageCount > 1
          ? `You have ${newMessageCount - prevMessageCount} new messages!`
          : "You have a new message!";
      showLocalNotification(notificationTitle, notificationMessage);
    }
    setPrevMessageCount(newMessageCount);
  }, [adminMessages]);

  const fetchNewMessages = async () => {
    try {
      const recentMessages = await getMessagesForReceiver(
        currentUserDetails.id,
        isMessagesFetch
      );

      if (!isMessagesFetch) {
        setIsMessagesFetch(true);
      }

      if (!recentMessages || recentMessages.length === 0) {
        return;
      }

      const uniqueNewMessages = recentMessages.filter(
        (newMsg) => !adminMessages.some((msg) => msg.id === newMsg.id)
      );

      setAdminMessages((prevMessages) => {
        const combinedMessages = [...prevMessages, ...uniqueNewMessages];
        const uniqueMessagesById = Array.from(
          new Set(combinedMessages.map((msg) => msg.id))
        ).map((id) => combinedMessages.find((msg) => msg.id === id));

        return uniqueMessagesById;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { adminMessages, newMessageCount };
};

export default useMessageService;
