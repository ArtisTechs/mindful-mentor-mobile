import { StyleSheet } from "react-native";

const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#b4edd8",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#b4edd8",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    color: "black",
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    borderBlockColor: "red",
    borderRadius: 25,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  switchText: {
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },
  logoImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
});

export default LoginScreenStyles;
