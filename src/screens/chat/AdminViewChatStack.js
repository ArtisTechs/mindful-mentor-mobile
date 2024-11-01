import { createStackNavigator } from "@react-navigation/stack";
import AdminViewChatList from "./AdminViewChatList";
import AdminViewChatScreen from "./AdminViewChatScreen";

const Stack = createStackNavigator();

const AdminViewChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="StudentList">
      <Stack.Screen
        name="AdminChatList"
        component={AdminViewChatList}
        options={{ headerShown: false, title: "Students" }}
      />
      <Stack.Screen
        name="AdminChatView"
        component={AdminViewChatScreen}
        options={{ headerShown: false, title: "Chat" }}
      />
    </Stack.Navigator>
  );
};

export default AdminViewChatStack;
