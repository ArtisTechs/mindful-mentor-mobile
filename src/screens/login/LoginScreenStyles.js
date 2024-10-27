import { StyleSheet } from "react-native";

const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  switchText: {
    color: "blue",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default LoginScreenStyles;
