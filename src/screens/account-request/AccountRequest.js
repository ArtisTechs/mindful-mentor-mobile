import React, { useState, useEffect } from "react";
import { View, TextInput, ActivityIndicator } from "react-native";
import {
  AccountStatusEnum,
  EErrorMessages,
  fetchStudentList,
  toastService,
} from "../../shared";
import StudentList from "../../components/listing/student-list/StudentList";
import AccountRequestScreenStyles from "./AccountRequestStyles";

const AccountRequestScreen = () => {
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
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await fetchStudentList({
        searchName: debouncedSearchTerm || undefined,
        status: AccountStatusEnum.REGISTERED,
        ignorePagination: true,
      });
      setStudents(response.content);
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [debouncedSearchTerm]);

  const refetch = () => {
    loadStudents();
  };

  return (
    <View style={AccountRequestScreenStyles.container}>
      <View style={AccountRequestScreenStyles.searchBar}>
        <TextInput
          placeholder="Search students..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={AccountRequestScreenStyles.searchInput}
        />
      </View>

      <View style={AccountRequestScreenStyles.studentList}>
        <StudentList
          students={students}
          loading={loading}
          size="full"
          showHeader={false}
          isRequest={true}
          refetch={refetch}
        />
      </View>
    </View>
  );
};

export default AccountRequestScreen;
