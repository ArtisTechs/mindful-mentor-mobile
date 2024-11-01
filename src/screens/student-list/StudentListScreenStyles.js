import { StyleSheet } from "react-native";

const StudentListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    padding: 20,
    backgroundColor: "white",
  },
  searchBar: {
    width: "100%",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  studentList: {
    height: "90%",
    width: "100%",
  },
});

export default StudentListScreenStyles;
