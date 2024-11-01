import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  capitalizeText,
  changeAppointmentStatus,
  deleteAppointment,
  EErrorMessages,
  formatDate,
  modalService,
  toastService,
} from "../../../shared";
import { DateFormat } from "../../../shared/enum/date-format.enum";
import AppointmentCard from "../../appointment-card/AppointmentCard";
import theme from "../../../shared/styles/theme";

const AppointmentCardList = ({ appointments, isLoading, refetch }) => {
  const handleApprove = (appointment) => {
    const student = appointment.user;
    modalService.show({
      title: "Approved Requested Schedule?",
      message: `Are you sure you want to approve ${student.firstName} ${
        student.lastName
      }'s Requested Schedule on ${formatDate(
        appointment.scheduledDate,
        DateFormat.MONTH_DAY_YEAR
      )}?`,
      onConfirm: async () => {
        try {
          const statusUpdateDTO = { status: "APPROVED" };
          await changeAppointmentStatus(appointment.id, statusUpdateDTO);
          toastService.show(
            `${student.firstName} ${student.lastName}'s Requested Schedule successfully approved.`,
            "success"
          );
          refetch();
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        }
      },
      onCancel: () => {},
      confirmText: "Approve",
    });
  };

  const handleReject = (appointment) => {
    const student = appointment.user;
    modalService.show({
      title: "Reject Requested Schedule?",
      message: `Are you sure you want to reject ${student.firstName} ${
        student.lastName
      }'s Requested Schedule on ${formatDate(
        appointment.scheduledDate,
        DateFormat.MONTH_DAY_YEAR
      )}? This will also be deleted.`,
      onConfirm: async () => {
        try {
          await deleteAppointment(appointment.id);
          toastService.show(
            `${student.firstName} ${student.lastName}'s Requested Schedule successfully rejected.`,
            "success-toast"
          );
          refetch();
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "danger-toast");
        }
      },
      onCancel: () => {},
      confirmText: "Reject",
      confirmButtonColor: theme.colors.danger,
    });
  };

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          {renderSkeletonLoader()}
          {renderSkeletonLoader()}
          {renderSkeletonLoader()}
          {renderSkeletonLoader()}
        </>
      ) : appointments.length === 0 ? (
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>
            No appointments available.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.appointmentList}>
          {appointments.map((appointment, index) => {
            const student = appointment.user;
            const isValidAppointment =
              appointment &&
              student &&
              student.firstName &&
              student.lastName &&
              appointment.scheduledDate;

            return isValidAppointment ? (
              <AppointmentCard
                key={index}
                title={`${capitalizeText(appointment.status)}`}
                student={student}
                date={appointment.scheduledDate || "Date not available"}
                status={appointment.status}
                reason={appointment.reason}
                onApprove={() => handleApprove(appointment)}
                onReject={() => handleReject(appointment)}
              />
            ) : (
              <Text key={index}>
                Invalid appointment data for appointment ID: {appointment.id}
              </Text>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 25,
    minHeight: 400,
  },
  appointmentList: {
    width: "100%",
    paddingHorizontal: 16,
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    width: "90%",
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
  skeletonText: {
    height: 12,
    width: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  noAppointmentsText: {
    fontSize: 18,
    color: "#555",
  },
});

export default AppointmentCardList;
