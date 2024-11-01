import React, { useState, useEffect } from "react";
import { View, TextInput, ActivityIndicator } from "react-native";
import {
  AccountStatusEnum,
  EErrorMessages,
  fetchStudentList,
  loadingService,
  toastService,
} from "../../shared";
import StudentListScreenStyles from "./StudentListScreenStyles";
import StudentList from "../../components/listing/student-list/StudentList";

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const loadStudents = async () => {
    loadingService.show();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetchStudentList({
        searchName: debouncedSearchTerm || undefined,
        status: AccountStatusEnum.ACTIVE,
        ignorePagination: true,
        sortBy: "lastName",
      });
      setStudents(response.content);
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      setLoading(false);
      loadingService.hide();
    }
  };

  useEffect(() => {
    loadStudents();
  }, [debouncedSearchTerm]);

  const refetch = () => {
    loadStudents();
  };

  return (
    <View style={StudentListScreenStyles.container}>
      <View style={StudentListScreenStyles.searchBar}>
        <TextInput
          placeholder="Search students..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={StudentListScreenStyles.searchInput}
        />
      </View>

      <View style={StudentListScreenStyles.studentList}>
        <StudentList
          students={students}
          loading={loading}
          size="full"
          showHeader={false}
          refetch={refetch}
        />
      </View>
    </View>
  );
};

export default StudentListPage;
