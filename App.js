import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "./src/screens/dashboard/DashboardScreen";
import LoginScreen from "./src/screens/login/LoginScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hides the app bar
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }} // Optionally hide the app bar here as well
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
