import { StyleSheet } from "react-native";

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
    height: "45%",
    width: "100%"
  },
});

export default DashboardScreenStyles;
