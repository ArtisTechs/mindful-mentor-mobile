import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  inputBorder: { borderWidth: 2, borderRadius: 20 },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
});

export default GlobalStyles;