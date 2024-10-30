import { StyleSheet } from "react-native";
import { configureFonts, DefaultTheme } from "react-native-paper";

const theme = StyleSheet.create({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#b4edd8",
    secondary: "#041f4a",
    tertiary: "#b1abab",
    danger: "#ff6f6f",
    warning: "#ffe56f",
    darkPrimary: "#769f90",
    darkDanger: "#bb4343",
    darkTertiary: "#5b5959",
    accent: "#f1c40f",
    background: "#b4edd8",
    surface: "#b4edd8",
    text: "#333333",
    error: "#FF3B30",
    white: "#ffffff",
    black: "#000000",
  },
  fonts: configureFonts({
    default: {
      regular: { fontFamily: "System", fontWeight: "400" },
      medium: { fontFamily: "System", fontWeight: "500" },
      light: { fontFamily: "System", fontWeight: "300" },
      thin: { fontFamily: "System", fontWeight: "100" },
    },
  }),
  roundness: 8,
});

export default theme;
