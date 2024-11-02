import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import DashboardScreenStyles from "./DashboardScreenStyles";
import EmotionPicker from "../../components/emotion-picker/EmotionPickerComponent";
import UpcomingEvents from "../../components/upcoming-events/UpcomingEvents";
import StudentList from "../../components/listing/student-list/StudentList";
import {
  AppointmentStatusEnum,
  fetchAppointmentList,
  getStudentsWithMoodToday,
  loadingService,
  useGlobalContext,
} from "../../shared";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "../../shared/styles/theme";
import FabStyles from "../../shared/styles/fab-styles";
import { useNavigation } from "@react-navigation/native";
import useMessageService from "../../shared/services/get-message-service";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { currentUserDetails, isAppAdmin } = useGlobalContext();
  const { adminMessages, newMessageCount } = useMessageService();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (currentUserDetails) {
        loadingService.show();
        await loadAppointments();
        if (isAppAdmin) {
          await loadStudentsWithMoodToday();
        }
      } else {
        if (isMounted) {
          setAppointments([]);
          setStudents([]);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentUserDetails, isAppAdmin]);
  const loadAppointments = async () => {
    if (!currentUserDetails) return;
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const finalEndDate = tomorrow.toISOString().split("T")[0];

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userId = isAppAdmin ? null : currentUserDetails?.id;
      const response = await fetchAppointmentList({
        userId: userId,
        sortBy: "scheduledDate",
        sortDirection: "DSC",
        startDate: today,
        endDate: isAppAdmin ? finalEndDate : null,
        status: isAppAdmin ? AppointmentStatusEnum.APPROVED : null,
      });

      setAppointments(response.content);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
      loadingService.hide();
    }
  };

  const loadStudentsWithMoodToday = async () => {
    if (!currentUserDetails) return;
    setStudentLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await getStudentsWithMoodToday({
        sortBy: "lastName",
        ignorePagination: true,
      });
      setStudents(response);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setStudentLoading(false);
      loadingService.hide();
    }
  };

  const handleFabClick = () => {
    navigation.navigate("AdminChat", { student: null });
  };

  return (
    <View style={DashboardScreenStyles.scrollContainer}>
      {!isAppAdmin && (
        <View style={DashboardScreenStyles.emotionPickerContainer}>
          <EmotionPicker />
        </View>
      )}

      <View style={DashboardScreenStyles.homePageCards}>
        <UpcomingEvents appointments={appointments} isAppAdmin={isAppAdmin} />
        {isAppAdmin && (
          <View style={DashboardScreenStyles.studentList}>
            <StudentList
              students={students}
              loading={studentLoading}
              hideDelete={true}
            />
          </View>
        )}
      </View>

      {isAppAdmin && (
        <TouchableOpacity
          style={DashboardScreenStyles.fab}
          onPress={handleFabClick}
        >
          <Icon
            name="chatbubble-outline"
            size={30}
            color={theme.colors.white}
          />
          {newMessageCount > 0 && (
            <View style={FabStyles.badge}>
              <Text style={FabStyles.badgeText}>{newMessageCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DashboardScreen;
