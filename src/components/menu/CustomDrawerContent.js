// CustomDrawerContent.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "../../shared/styles/theme";
import { Image } from "react-native-elements";

const CustomDrawerContent = (props) => {
  const { handleLogout, navigation } = props;

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/img/mindful-mentor-logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Mindful Mentor</Text>
        </View>

        {/* Drawer Items */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Logout Button at the Bottom */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          handleLogout(navigation);
          navigation.closeDrawer();
        }}
      >
        <Icon name="log-out-outline" size={20} color="#ffffff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.danger,
    borderRadius: 8,
    margin: 16,
    marginBottom: 20, // Extra margin to keep it above the screen edge
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: 40,
    height: 40,
  },
});
