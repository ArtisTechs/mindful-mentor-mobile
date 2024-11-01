import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  AppointmentStatusEnum,
  capitalizeText,
  formatDate,
  stringAvatar,
} from "../../shared";
import { DateFormat } from "../../shared/enum/date-format.enum";
import { Avatar } from "react-native-paper";

const AppointmentCard = ({
  title,
  student,
  date,
  status,
  reason,
  onApprove,
  onReject,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {`${title} Counseling Session` || "Request"}
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.userInfo}>
          {student.profilePicture && student.profilePicture !== "undefined" ? (
            <Avatar.Image
              source={{ uri: student.profilePicture }}
              style={styles.avatar}
              size={60}
            />
          ) : (
            <Avatar.Text
              {...stringAvatar(student.firstName, student.lastName, 50, 12)}
              style={styles.avatar}
            />
          )}
        </View>
        <View style={styles.labels}>
          <View style={styles.userDetails}>
            <Text
              style={styles.userName}
            >{`${student.lastName}, ${student.firstName}`}</Text>
            <Text style={styles.userRole}>{capitalizeText(student.role)}</Text>
          </View>
          <View style={styles.appointmentDate}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {formatDate(date, DateFormat.MONTH_DAY_YEAR)}
            </Text>
          </View>
          {reason && (
            <View style={styles.appointmentReason}>
              <Text style={styles.label}>Reason</Text>
              <Text style={styles.value}>{reason}</Text>
            </View>
          )}
        </View>
      </View>

      {status !== AppointmentStatusEnum.APPROVED && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.dangerButton} onPress={onReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onApprove}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    minWidth: "90%", // Ensures each card spans most of the screen width
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 10,
    width: "100%",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap", // Allows content to wrap if it overflows
  },
  userInfo: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  labels: {
    flex: 1,
    justifyContent: "space-between",
  },
  userDetails: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
  },
  userRole: {
    color: "#555",
    fontSize: 14,
  },
  appointmentDate: {
    marginBottom: 10,
  },
  appointmentReason: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dangerButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AppointmentCard;
