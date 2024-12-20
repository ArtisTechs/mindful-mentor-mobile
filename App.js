import React, { useEffect, useState } from "react";
import {
  StatusBar,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons"; // Install this for icons

// Context and Screen imports
import {
  GlobalStateProvider,
  useGlobalContext,
} from "./src/shared/context/global-state-provider";
import DashboardScreen from "./src/screens/dashboard/DashboardScreen";
import LoginScreen from "./src/screens/login/LoginScreen";
import GetStartedScreen from "./src/screens/get-started/GetStartedScreen";
import Toast from "react-native-toast-message";
import {
  getUserDetails,
  initializeNotifications,
  LoaderProvider,
  ModalProvider,
  RoleEnum,
  STORAGE_KEY,
  toastService,
  webSocketService,
} from "./src/shared";
import FullLoaderComponent from "./src/components/full-loading-screen/FullLoaderComponent";
import CustomDrawerContent from "./src/components/menu/CustomDrawerContent";
import theme from "./src/shared/styles/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import AppointmentScreen from "./src/screens/appointment/AppointmentScreen";
import CalendarScreen from "./src/screens/calendar/CalendarScreen";
import StudentListPage from "./src/screens/student-list/StudentListScreen";
import JournalStack from "./src/screens/jounal/JournalStack";
import StudentViewChatScreen from "./src/screens/chat/StudentViewChatScreen";
import FabStyles from "./src/shared/styles/fab-styles.js";
import TabNavigator from "./src/components/tab-navigator/TabNavigator.js";
import AccountRequestScreen from "./src/screens/account-request/AccountRequest.js";
import AdminViewChatStack from "./src/screens/chat/AdminViewChatStack.js";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  dark: false,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: "transparent",
    notification: theme.colors.error,
  },
};

export default function App() {
  return (
    <GlobalStateProvider>
      <LoaderProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </LoaderProvider>
    </GlobalStateProvider>
  );
}

function AppContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const {
    currentUserDetails,
    setCurrentUserDetails,
    setIsAppAdmin,
    setIsRefetch,
    isAppAdmin,
  } = useGlobalContext();

  useEffect(() => {
    initializeNotifications();
    toastService.registerShowToastCallback((message, variant) => {
      Toast.show({
        type: variant,
        text1: message,
        position: "bottom",
        visibilityTime: 3000,
      });
    });
  }, []);

  const handleLoginSuccess = async (profileData, navigate) => {
    try {
      if (profileData?.token) {
        await AsyncStorage.setItem(STORAGE_KEY.TOKEN, profileData.token);
      }
      await AsyncStorage.setItem(STORAGE_KEY.PROFILE_ID, profileData.id);
      await AsyncStorage.setItem(STORAGE_KEY.ROLE, profileData.role);
      setCurrentUserDetails(profileData);
      setIsAppAdmin(profileData.role === RoleEnum.COUNSELOR);
      setLoggedIn(true);
      navigate.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
    } catch (error) {
      console.error("Error storing login data", error);
    }
  };

  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.clear();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
      if (webSocketService.isConnected) {
        webSocketService.disconnect();
      }

      setLoggedIn(false);
      setCurrentUserDetails(null);
      setIsAppAdmin(false);
      const profileID = await AsyncStorage.getItem(STORAGE_KEY.PROFILE_ID);
    } catch (error) {
      console.log("Error clearing AsyncStorage", error);
    }
  };

  const handleRefresh = () => {
    setIsRefetch((prev) => !prev);
  };

  const handleNewMessages = (count) => {
    console.log(count);
    if (count) {
      setNewMessageCount(count);
    } else {
      setNewMessageCount(0);
    }
  };

  const DrawerNavigator = () => (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} handleLogout={handleLogout} />
      )}
      drawerStyle={{ backgroundColor: theme.colors.tertiary }}
      screenOptions={{
        drawerActiveTintColor: theme.colors.white,
        drawerInactiveTintColor: theme.colors.black,
        drawerActiveBackgroundColor: theme.colors.darkPrimary,
        headerRight: () => (
          <TouchableOpacity
            onPress={handleRefresh}
            style={{ paddingRight: 20 }}
          >
            <Icon name="refresh" size={24} color={theme.colors.black} />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={isAppAdmin ? DashboardScreen : TabNavigator}
        options={{
          headerShown: isAppAdmin ? true : false,
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      {isAppAdmin && (
        <>
          <Drawer.Screen
            name="AdminProfile"
            component={ProfileScreen}
            options={{
              title: "Profile",
              drawerIcon: ({ color, size }) => (
                <Icon name="person-circle-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="AdminChat"
            component={AdminViewChatStack}
            options={{
              title: "Chats",
              drawerIcon: ({ color, size }) => (
                <Icon name="chatbubble-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="StudentList"
            component={StudentListPage}
            options={{
              title: "Students",
              drawerIcon: ({ color, size }) => (
                <Icon name="school-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{
              title: "Calendar",
              drawerIcon: ({ color, size }) => (
                <Icon name="calendar-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Appointments"
            component={AppointmentScreen}
            options={{
              title: "Appointments",
              drawerIcon: ({ color, size }) => (
                <Icon name="clipboard-outline" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Request"
            component={AccountRequestScreen}
            options={{
              title: "Account Request",
              drawerIcon: ({ color, size }) => (
                <Icon name="person-add-outline" color={color} size={size} />
              ),
            }}
          />
        </>
      )}
      {!isAppAdmin && (
        <Drawer.Screen
          name="Journal"
          component={JournalStack}
          options={{
            title: "Journal",
            drawerIcon: ({ color, size }) => (
              <Icon name="book-outline" color={color} size={size} />
            ),
          }}
        />
      )}

      {/* Add additional drawer screens here */}
    </Drawer.Navigator>
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
          translucent
        />

        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            initialRouteName="GetStarted"
            screenOptions={{
              cardStyle: { backgroundColor: theme.colors.background },
            }}
          >
            <Stack.Screen name="GetStarted" options={{ headerShown: false }}>
              {(props) => (
                <GetStartedScreen
                  {...props}
                  onLoginSuccess={(profileData) =>
                    handleLoginSuccess(profileData, props.navigation)
                  }
                  handleLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={(profileData) =>
                    handleLoginSuccess(profileData, props.navigation)
                  }
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Dashboard"
              component={DrawerNavigator}
              options={({ navigation }) => ({
                headerShown: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon
                      name="menu"
                      size={28}
                      color={theme.colors.primary}
                      style={{ marginLeft: 15 }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaView>
    </PaperProvider>
  );
}

const toastConfig = {
  success: ({ text1, hide }) => (
    <View style={ToastStyles.toastContainer}>
      <Text style={ToastStyles.toastText}>{text1}</Text>
      <TouchableOpacity onPress={hide} style={ToastStyles.closeButton}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
  error: ({ text1, hide }) => (
    <View style={[ToastStyles.toastContainer, ToastStyles.errorContainer]}>
      <Text style={ToastStyles.toastText}>{text1}</Text>
      <TouchableOpacity onPress={hide} style={ToastStyles.closeButton}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
  info: ({ text1, hide }) => (
    <View style={[ToastStyles.toastContainer, ToastStyles.infoContainer]}>
      <Text style={ToastStyles.toastText}>{text1}</Text>
      <TouchableOpacity onPress={hide} style={ToastStyles.closeButton}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
};

const ToastStyles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: "#f44336",
  },
  infoContainer: {
    backgroundColor: "#2196F3",
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    marginLeft: 10,
    padding: 5,
  },
});
