import { createStackNavigator } from "@react-navigation/stack";
import JournalListScreen from "./JournalListScreens";
import JournalDetailScreen from "./JournalDetailScreen";

const Stack = createStackNavigator();

function JournalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JournalList"
        component={JournalListScreen}
        options={{ headerShown: false, title: "Journal Entries" }}
      />
      <Stack.Screen
        name="JournalDetail"
        component={JournalDetailScreen}
        options={{ headerShown: false, title: "Journal Detail" }}
      />
    </Stack.Navigator>
  );
}

export default JournalStack;
