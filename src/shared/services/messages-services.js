import "text-encoding";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { API_URL } from "../enum";
import { getTokenAsync } from "./global-services";

// Construct the WebSocket URL
const protocol = API_URL.BASE_URL.startsWith("https") ? "https" : "http";
const brokerURL = `${protocol}:${API_URL.MAIN_URL}${API_URL.CHAT}`;

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.retryInterval = 5000; // Initial retry interval in milliseconds
    this.maxRetryInterval = 60000; // Maximum retry interval (1 minute)
    this.subscriptions = {};
  }

  isConnected() {
    return this.stompClient && this.stompClient.connected;
  }

  // Establish WebSocket connection
  async connect(userId, onMessageReceived) {
    console.log;
    try {
      const storedToken = await getTokenAsync();
      if (!storedToken) {
        console.log("No auth token found!");
        return;
      }

      if (this.stompClient && this.stompClient.connected) {
        console.log("WebSocket client already connected.");
        return;
      }

      // Initialize STOMP Client
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(brokerURL),
        connectHeaders: {
          Authorization: `Bearer ${storedToken}`,
        },
        debug: (str) => console.log(str),
        onConnect: () => {
          console.log("WebSocket Connected");
          this.subscribeToPrivateMessages(userId, onMessageReceived);
          this.retryInterval = 5000;
        },
        onStompError: (frame) => {
          console.log("STOMP error:", frame);
          this.retryConnection(userId, onMessageReceived);
        },
        onWebSocketClose: (event) => {
          console.log("WebSocket closed:", event);
          this.retryConnection(userId, onMessageReceived);
        },
      });

      // Activate WebSocket connection
      this.stompClient.activate();
    } catch (error) {
      console.log("Error establishing WebSocket connection:", error);
    }
  }

  // Subscribe to private messages for a specific user
  subscribeToPrivateMessages(userId, onMessageReceived) {
    const subscriptionPath = `/user/${userId}/topic/messages`;

    if (this.subscriptions[userId]) {
      console.log(`Already subscribed to private messages for user ${userId}`);
      return;
    }

    console.log(`Subscribing to: ${subscriptionPath}`);
    this.subscriptions[userId] = this.stompClient.subscribe(
      subscriptionPath,
      (message) => {
        const newMessage = JSON.parse(message.body);
        onMessageReceived(newMessage);
      }
    );
  }

  // Retry connection using exponential backoff
  retryConnection(userId, onMessageReceived) {
    console.log(`Attempting to reconnect in ${this.retryInterval}ms...`);
    setTimeout(() => {
      this.connect(userId, onMessageReceived);
      this.retryInterval = Math.min(
        this.retryInterval * 2,
        this.maxRetryInterval
      ); // Double the retry interval up to the max limit
    }, this.retryInterval);
  }

  // Disconnect the WebSocket client
  disconnect() {
    if (this.stompClient) {
      console.log("Disconnecting WebSocket...");
      this.stompClient.deactivate();
      this.stompClient = null;
      this.subscriptions = {};
    } else {
      console.log("WebSocket client is not connected.");
    }
  }

  // Send a message to a specific receiver
  sendMessage(msg, receiverId, userId, chatToken) {
    if (this.stompClient && this.stompClient.connected && msg.trim()) {
      const messagePayload = {
        senderId: userId,
        receiverId: receiverId,
        chatToken: chatToken,
        content: msg.trim(),
      };

      this.stompClient.publish({
        destination: `/app/sendMessage`,
        body: JSON.stringify(messagePayload),
        headers: {},
      });
    } else {
      console.log("WebSocket client not connected or message is empty.");
    }
  }

  // Fetch chat history between two users using axios
  async fetchMessageHistory(senderId, receiverId) {
    try {
      const storedToken = await getTokenAsync();
      const response = await axios.get(
        `${protocol}:${API_URL.MAIN_URL}${API_URL.MESSAGES}/${senderId}/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          `Error fetching message history: ${response.statusText}`
        );
      }

      return response.data;
    } catch (error) {
      console.log("Failed to fetch message history:", error);
      return [];
    }
  }
}

export const webSocketService = new WebSocketService();
