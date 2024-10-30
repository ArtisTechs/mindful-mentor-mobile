import React, { useEffect, useState } from "react";
import { StatusBar, SafeAreaView, View, TouchableOpacity } from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
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
  RoleEnum,
  STORAGE_KEY,
  toastService,
} from "./src/shared";
import FullLoaderComponent from "./src/components/full-loading-screen/FullLoaderComponent";
import CustomDrawerContent from "./src/components/menu/CustomDrawerContent";
import theme from "./src/shared/styles/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
      <AppContent />
    </GlobalStateProvider>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("Dashboard");
  const { currentUserDetails, setCurrentUserDetails, setIsAppAdmin } =
    useGlobalContext();

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
        })}
      >
        <Tab.Screen name="DashboardTab" options={{ title: "Dashboard" }}>
          {(props) => (
            <DashboardScreen {...props} setFullLoadingHandler={setIsLoading} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="AppointmentTab"
          component={DashboardScreen}
          options={{ title: "Appointment" }}
        />
        <Tab.Screen
          name="CalendarTab"
          component={DashboardScreen}
          options={{ title: "Calendar" }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={DashboardScreen}
          options={{ title: "Profile" }}
        />
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
      drawerStyle={{ backgroundColor: theme.colors.surface }}
      screenOptions={{
        drawerActiveTintColor: theme.colors.white,
        drawerInactiveTintColor: theme.colors.black,
        drawerActiveBackgroundColor: theme.colors.darkPrimary,
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

        {isLoading && <FullLoaderComponent isLoading={isLoading} />}

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
                  setFullLoadingHandler={setIsLoading}
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
                  setFullLoadingHandler={setIsLoading}
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
        <Toast />
      </SafeAreaView>
    </PaperProvider>
  );
}
