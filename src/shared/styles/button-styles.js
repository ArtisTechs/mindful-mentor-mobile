import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#b4edd8",
    height: 42,
    width: 200,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: "black",
  },
  secondaryButton: {
    backgroundColor: "#b1abab",
    height: 42,
    width: 200,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  secondaryButtonText: {
    color: "white",
  },
  dangerButton: {
    backgroundColor: "#ff6f6f",
    height: 42,
    width: 200,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  dangerButtonText: {
    color: "white",
  },
  whiteButton: {
    backgroundColor: "white",
    height: 42,
    width: 200,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  whiteButtonText: {
    color: "black",
  },
  ellipsisButton: {
    width: 10,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },
  buttonContainerColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default ButtonStyles;
