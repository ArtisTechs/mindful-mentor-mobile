import { StyleSheet } from "react-native";
import theme from "../../shared/styles/theme"; // Adjust the import path as necessary

const AppointmentScreenStyles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "white",
  },
  counselorContainer: {
    padding: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  counselorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  counselorDetails: {
    marginLeft: 16,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  counselorRole: {
    color: "gray",
  },
  datePickerButton: {
    marginBottom: 8,
    backgroundColor: "white",
    paddingLeft: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  datePickerLabel: {
    fontSize: 16,
  },
  datePickerLabelDate: {
    fontSize: 18,
    margin: 5,
    fontWeight: "bold",
  },
  reasonInput: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    textAlignVertical: "top",
    height: 300,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentScreenStyles;
