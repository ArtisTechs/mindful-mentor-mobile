// src/navigation/TabNavigator.js
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { showLocalNotification, useGlobalContext, webSocketService } from "../../shared";
import FabStyles from "../../shared/styles/fab-styles";
import DashboardScreen from "../../screens/dashboard/DashboardScreen";
import AppointmentScreen from "../../screens/appointment/AppointmentScreen";
import CalendarScreen from "../../screens/calendar/CalendarScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import StudentViewChatScreen from "../../screens/chat/StudentViewChatScreen";
import theme from "../../shared/styles/theme";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
  const [newMessageCount, setNewMessageCount] = useState(0);
  const { currentUserDetails, isAppAdmin, setIsRefetch } = useGlobalContext();
  const [refetch, setRefetch] = useState(false);
  const [messageIncrement, setMessageIncrement] = useState(0); // New state to track increments

  // Establish WebSocket connection and handle incoming messages
  useEffect(() => {
    if (currentUserDetails && !isAppAdmin) {
      const userId = currentUserDetails.id;

      const handleReceivedMessage = (message) => {
        if (message.receiverId === userId) {
          setMessageIncrement((prev) => prev + 1); // Increment the message count
          const notificationTitle = "New Message from Your Counselor";
          const notificationMessage =
            message.content || "You have a new message!";

          showLocalNotification(notificationTitle, notificationMessage);
        }
      };

      // Connect to the WebSocket
      webSocketService.connect(userId, handleReceivedMessage);

      // Clean up the WebSocket connection on unmount
      return () => {
        webSocketService.disconnect();
      };
    }
  }, [currentUserDetails, isAppAdmin]);

  // Use effect to update newMessageCount when messageIncrement changes
  useEffect(() => {
    setNewMessageCount(messageIncrement);
  }, [messageIncrement]);

  const handleRefetch = () => {
    setIsRefetch((prev) => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "DashboardTab") {
              iconName = "home-outline";
            } else if (route.name === "AppointmentTab") {
              iconName = "clipboard-outline";
            } else if (route.name === "CalendarTab") {
              iconName = "calendar-outline";
            } else if (route.name === "ProfileTab") {
              iconName = "person-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.white,
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarActiveBackgroundColor: theme.colors.darkPrimary,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ paddingLeft: 15 }}
            >
              <Icon name="menu" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleRefetch}
              style={{ paddingRight: 20 }}
            >
              <Icon name="refresh" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen
          name="DashboardTab"
          component={DashboardScreen}
          options={{ title: "Dashboard" }}
        />
        <Tab.Screen
          name="AppointmentTab"
          component={AppointmentScreen}
          options={{ title: "Appointments" }}
        />
        <Tab.Screen name="ChatTab" options={{ title: "Chat" }}>
          {(props) => (
            <StudentViewChatScreen
              {...props}
              setMessageCount={setMessageIncrement}
              refetch={refetch}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="CalendarTab"
          component={CalendarScreen}
          options={{ title: "Calendar" }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
      </Tab.Navigator>
      <TouchableOpacity
        style={FabStyles.fab}
        onPress={() => navigation.navigate("ChatTab")}
      >
        <Icon name="chatbubble-outline" size={30} color={theme.colors.white} />
        {newMessageCount > 0 && (
          <View style={FabStyles.badge}>
            <Text style={FabStyles.badgeText}>{newMessageCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TabNavigator;
