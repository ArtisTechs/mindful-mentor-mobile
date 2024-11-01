import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AccountStatusEnum,
  combineMessagesBySender,
  EErrorMessages,
  fetchStudentList,
  loadingService,
  sortByLatestDateOrLastName,
  toastService,
  useGlobalContext,
} from "../../shared";
import StudentList from "../../components/listing/student-list/StudentList";

const AdminViewChatList = () => {
  const navigation = useNavigation();
  const { currentUserDetails } = useGlobalContext();
  const [students, setStudents] = useState([]);
  const [formattedStudentsData, setFormattedStudentsData] = useState([]);

  useEffect(() => {
    if (currentUserDetails) {
      loadStudents();
    }
  }, [currentUserDetails]);

  useEffect(() => {
    if (students.length > 0) {
      const combinedMessages = combineMessagesBySender([], students);
      const arrangedStudents = sortByLatestDateOrLastName(combinedMessages);
      setFormattedStudentsData(arrangedStudents);
    }
  }, [students]);

  const loadStudents = async () => {
    loadingService.show();
    try {
      const response = await fetchStudentList({
        status: AccountStatusEnum.ACTIVE,
        ignorePagination: true,
      });
      setStudents(response.content);
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      loadingService.hide();
    }
  };

  const handleSelectStudent = (student) => {
    console.log("select Student", student);
    navigation.navigate("AdminChatView", { student });
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <StudentList
          students={formattedStudentsData}
          size="full"
          hideEmotion={true}
          hideOptions={true}
          isItemClickable={true}
          onSelectStudent={handleSelectStudent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  listContainer: {
    width: "100%",
    height: "85%",
  },
});

export default AdminViewChatList;
