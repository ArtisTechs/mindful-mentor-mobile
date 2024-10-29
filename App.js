import React from "react";
import { StatusBar, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
} from "react-native-paper";

// Screen imports
import DashboardScreen from "./src/screens/dashboard/DashboardScreen";
import LoginScreen from "./src/screens/login/LoginScreen";
import GetStartedScreen from "./src/screens/get-started/GetStartedScreen";

const Stack = createStackNavigator();

// Custom theme configuration
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007AFF",
    accent: "#f1c40f",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#333333",
    error: "#FF3B30",
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: "System",
        fontWeight: "400",
      },
      medium: {
        fontFamily: "System",
        fontWeight: "500",
      },
      light: {
        fontFamily: "System",
        fontWeight: "300",
      },
      thin: {
        fontFamily: "System",
        fontWeight: "100",
      },
    },
  }),
  roundness: 8,
};

// Navigation theme matching our app theme
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
              headerShown: false,
              cardStyle: { backgroundColor: theme.colors.background },
              cardOverlayEnabled: true,
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 0.5, 0.9, 1],
                    outputRange: [0, 0.25, 0.7, 1],
                  }),
                },
                overlayStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: "clamp",
                  }),
                },
              }),
            }}
          >
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                gestureEnabled: false, // Prevent going back to login
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}
