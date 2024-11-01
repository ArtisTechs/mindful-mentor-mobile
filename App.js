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
  LoaderProvider,
  ModalProvider,
  RoleEnum,
  STORAGE_KEY,
  toastService,
} from "./src/shared";
import FullLoaderComponent from "./src/components/full-loading-screen/FullLoaderComponent";
import CustomDrawerContent from "./src/components/menu/CustomDrawerContent";
import theme from "./src/shared/styles/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import AppointmentScreen from "./src/screens/appointment/AppointmentScreen";
import CalendarScreen from "./src/screens/calendar/CalendarScreen";
import StudentListPage from "./src/screens/student-list/StudentListScreen";

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
  const [drawerTitle, setDrawerTitle] = useState("Dashboard");
  const {
    currentUserDetails,
    setCurrentUserDetails,
    setIsAppAdmin,
    setIsRefetch,
  } = useGlobalContext();

  useEffect(() => {
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
      console.log("profileDatasss", profileData);
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
      setLoggedIn(false);
      setCurrentUserDetails(null);
      setIsAppAdmin(false);
      const profileID = await AsyncStorage.getItem(STORAGE_KEY.PROFILE_ID);
      console.log("profileID", profileID);
    } catch (error) {
      console.error("Error clearing AsyncStorage", error);
    }
  };

  const handleTabChange = (title) => {
    setDrawerTitle(title);
  };

  const handleRefresh = () => {
    setIsRefetch((prev) => !prev);
  };

  const TabNavigator = ({ navigation }) => (
    <View style={{ flex: 1 }}>
      {/* Wrap in a View to manage layout */}
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
              style={{ paddingLeft: 20 }}
            >
              <Icon name="menu" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleRefresh}
              style={{ paddingRight: 20 }}
            >
              <Icon name="refresh" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="DashboardTab" options={{ title: "Dashboard" }}>
          {(props) => <DashboardScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="AppointmentTab"
          component={AppointmentScreen}
          options={{ title: "Appointments" }}
        />
        <Tab.Screen
          name="CalendarTab"
          component={CalendarScreen}
          options={{ title: "Calendar" }}
        />
        <Tab.Screen name="ProfileTab" options={{ title: "Profile" }}>
          {(props) => {
            const student = null;
            const isViewSelf = true;
            return (
              <ProfileScreen
                {...props}
                student={student}
                isViewSelf={isViewSelf}
              />
            );
          }}
        </Tab.Screen>
      </Tab.Navigator>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          marginLeft: -35,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: theme.colors.secondary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
        onPress={() => {
          console.log("FAB pressed");
          // Example: navigation.navigate("YourNewScreen");
        }}
      >
        <Icon name="chatbubble-outline" size={30} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );

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
        component={TabNavigator}
        options={{
          headerShown: false,
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
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
                      size={24}
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
  success: ({ text1 }) => (
    <View style={ToastStyles.toastContainer}>
      <Text style={ToastStyles.toastText}>{text1}</Text>
    </View>
  ),
  error: ({ text1 }) => (
    <View style={[ToastStyles.toastContainer, ToastStyles.errorContainer]}>
      <Text style={ToastStyles.toastText}>{text1}</Text>
    </View>
  ),
  info: ({ text1 }) => (
    <View style={[ToastStyles.toastContainer, ToastStyles.infoContainer]}>
      <Text style={ToastStyles.toastText}>{text1}</Text>
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
    justifyContent: "center",
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
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "100%",
  },
});
