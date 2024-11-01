import { StyleSheet } from "react-native";
import theme from "../../shared/styles/theme";

const CalendarScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "90%",
    backgroundColor: "white",
  },
  dropdownContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
  },
  calendarComponentAdminView: {
    marginBottom: 10,
    height: "65%",
    padding: 10,
  },
  calendarComponentStudentView: {
    marginBottom: 10,
    height: "90%",
    padding: 10,
  },
});

export default CalendarScreenStyles;
