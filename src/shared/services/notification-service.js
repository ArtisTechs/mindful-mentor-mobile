import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to request and check notification permissions
export const requestNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return false;
  }

  return true;
};

// Create notification channel for Android
export const createNotificationChannel = () => {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "mindful-mentor-app-sound.mp3",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

// Function to initialize notifications
export const initializeNotifications = async () => {
  createNotificationChannel(); // Create notification channel for Android
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn("Notification permissions not granted");
  }

  await getInitialNotification();
};

// Function to get the initial notification
export const getInitialNotification = async () => {
  const initialNotification =
    await Notifications.getLastNotificationResponseAsync();
  if (initialNotification) {
    console.log("Initial Notification:", initialNotification);
  }
};

// Function to display a local notification
export const showLocalNotification = async (title, message) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      sound: "mindful-mentor-app-sound.mp3",
    },
    trigger: { seconds: 1 }, // Delay of 1 second before the notification is shown
  });
};
