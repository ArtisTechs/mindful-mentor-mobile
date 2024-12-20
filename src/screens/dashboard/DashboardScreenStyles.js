import { StyleSheet } from "react-native";
import theme from "../../shared/styles/theme";

const DashboardScreenStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  emotionPickerContainer: {
    width: "100%",
    marginBottom: 16,
  },
  homePageCards: {
    width: "95%",
    padding: 5,
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  studentList: {
    height: "50%",
    width: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    marginLeft: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  switchButton: {
    backgroundColor: theme.colors.primary, // Primary color for the button
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", // Center the button horizontally
    marginBottom: 2
  },

  switchButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black", // White text color for contrast
  },
});

export default DashboardScreenStyles;
