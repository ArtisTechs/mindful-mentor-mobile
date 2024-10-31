import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashboardScreenStyles from "./DashboardScreenStyles";
import EmotionPicker from "../../components/emotion-picker/EmotionPickerComponent";
import UpcomingEvents from "../../components/upcoming-events/UpcomingEvents";
import StudentList from "../../components/listing/student-list/StudentList";
import {
  fetchAppointmentList,
  getStudentsWithMoodToday,
  loadingService,
  useGlobalContext,
} from "../../shared";

const DashboardScreen = () => {
  const { currentUserDetails, isAppAdmin } = useGlobalContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const loadData = async () => {
      if (currentUserDetails) {
        loadingService.show();
        await loadAppointments();
        if (isAppAdmin) {
          console.log("isAppAdmin", isAppAdmin);
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
          <StudentList
            students={students}
            loading={studentLoading}
            hideDelete={true}
          />
        )}
      </View>
    </View>
  );
};

export default DashboardScreen;
