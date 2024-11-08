import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Updated import
import CalendarComponent from "../../components/calendar/CalendarComponent";
import { useGlobalContext } from "../../shared/context";
import {
  AccountStatusEnum,
  EErrorMessages,
  fetchStudentList,
  formatDate,
  getMoods,
  loadingService,
  toastService,
} from "../../shared";
import { DateFormat } from "../../shared/enum/date-format.enum";
import { useNavigation, useRoute } from "@react-navigation/native";
import CalendarScreenStyles from "./CalendarScreenStyles";

const CalendarScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { student } = route.params || {};
  const { currentUserDetails, isAppAdmin } = useGlobalContext();
  const [moodsData, setMoodsData] = useState([]);
  const [students, setStudents] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(() => student || null);

  useEffect(() => {
    if (student) {
      setSelectedStudent(student);
    }
  }, [student]);
  
  useEffect(() => {
    if (currentUserDetails?.id && dateRange?.startDate && dateRange?.endDate) {
      const fetchMoods = async () => {
        try {
          loadingService.show();
          await new Promise((resolve) => setTimeout(resolve, 500));

          const filters = {
            userId: selectedStudent
              ? selectedStudent?.id
              : currentUserDetails?.id,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          };

          const data = await getMoods(filters);
          console.log(data);
          setMoodsData(data);
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        } finally {
          loadingService.hide();
        }
      };

      fetchMoods();
    }
  }, [dateRange, currentUserDetails, selectedStudent]);

  useEffect(() => {
    if (isAppAdmin && currentUserDetails) {
      loadStudents();
    }
  }, [isAppAdmin]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetchStudentList({
        status: AccountStatusEnum.ACTIVE,
        ignorePagination: true,
      });
      setStudents(response.content);
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      setLoading(false);
    }
  };

  const onDateRangeChange = useCallback(
    (startDate, endDate) => {
      // Create new Date objects to avoid modifying the original dates
      const adjustedStartDate = new Date(startDate);
      const adjustedEndDate = new Date(endDate);

      // Subtract 1 day from startDate
      adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);
      // Add 1 day to endDate
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      // Format the adjusted dates
      const formattedStartDate = formatDate(
        adjustedStartDate,
        DateFormat.YYYY_MM_DD
      );
      const formattedEndDate = formatDate(
        adjustedEndDate,
        DateFormat.YYYY_MM_DD
      );

      if (
        formattedStartDate !== dateRange?.startDate ||
        formattedEndDate !== dateRange?.endDate
      ) {
        setDateRange({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      }
    },
    [dateRange]
  );


  const handleSelectStudent = (studentId) => {
    const selected = students.find((student) => student.id === studentId);
    setSelectedStudent(selected);
  };

  return (
    <ScrollView contentContainerStyle={CalendarScreenStyles.container}>
      {isAppAdmin && (
        <View style={CalendarScreenStyles.dropdownContainer}>
          <Text style={CalendarScreenStyles.label}>Select Student:</Text>
          <Picker
            selectedValue={selectedStudent?.id || ""}
            onValueChange={(value) => handleSelectStudent(value)}
            style={CalendarScreenStyles.picker}
          >
            <Picker.Item label="Select a student" value="" />
            {students.map((student) => (
              <Picker.Item
                key={student.id}
                label={`${student.lastName}, ${student.firstName}`}
                value={student.id}
              />
            ))}
          </Picker>
        </View>
      )}

      <View
        style={
          isAppAdmin
            ? CalendarScreenStyles.calendarComponentAdminView
            : CalendarScreenStyles.calendarComponentStudentView
        }
      >
        <CalendarComponent
          onDateRangeChange={onDateRangeChange}
          data={moodsData}
        />
      </View>
    </ScrollView>
  );
};

export default CalendarScreen;
