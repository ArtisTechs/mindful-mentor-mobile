import React from "react";
import { View, Text } from "react-native";
import DashboardScreenStyles from "./DashboardScreenStyles";

const DashboardScreen = () => {
  return (
    <View style={DashboardScreenStyles.container}>
      <Text style={DashboardScreenStyles.title}>Dashboard</Text>
      {/* Additional components */}
    </View>
  );
};

export default DashboardScreen;
