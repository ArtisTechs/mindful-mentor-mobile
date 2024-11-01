// src/screens/appointment/AppointmentScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGlobalContext } from "../../shared/context";
import {
  EErrorMessages,
  ESuccessMessages,
  fetchAppointmentList,
  fetchCounselorList,
  createAppointment,
  AccountStatusEnum,
  loadingService,
  stringAvatar,
  toastService,
} from "../../shared";
import theme from "../../shared/styles/theme";
import AppointmentCardList from "../../components/listing/appointment-list/AppointmentCardList";
import styles from "./AppointmentScreenStyles"; // Import the separated styles

const AppointmentScreen = () => {
  const { currentUserDetails, isAppAdmin } = useGlobalContext();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [counselorDetails, setCounselorDetails] = useState(null);
  const [dateError, setDateError] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    if (currentUserDetails) {
      if (isAppAdmin) {
        loadAppointments();
      } else {
        fetchCounselorDetails();
      }
    }
  }, [currentUserDetails]);

  const fetchCounselorDetails = async () => {
    loadingService.show();
    try {
      const response = await fetchCounselorList({
        status: AccountStatusEnum.ACTIVE,
      });
      setCounselorDetails(response.content[0]);
    } catch (error) {
      setDateError(EErrorMessages.CONTACT_ADMIN);
    } finally {
      loadingService.hide();
    }
  };

  const loadAppointments = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await fetchAppointmentList({
        sortBy: "scheduledDate",
        sortDirection: "DSC",
        startDate: today,
      });
      setAppointments(response.content);
    } catch (error) {
      setDateError(EErrorMessages.CONTACT_ADMIN);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    if (currentDate) {
      setDateError("");
    }
  };

  const handleSubmit = async () => {
    loadingService.show();

    // Validate that both date and reason are provided
    let valid = true;
    if (!selectedDate) {
      setDateError(EErrorMessages.DATE_REQUIRED);
      valid = false;
    } else {
      setDateError("");
    }

    if (!reason.trim()) {
      setReasonError("Reason is required.");
      valid = false;
    } else {
      setReasonError("");
    }

    if (!valid) {
      loadingService.hide();
      return;
    }

    try {
      const appointmentDTO = {
        userId: currentUserDetails.id,
        scheduledDate: selectedDate.toISOString().split("T")[0],
        reason,
      };
      const createdAppointment = await createAppointment(appointmentDTO);

      if (createdAppointment) {
        setSelectedDate(new Date());
        setReason("");
        toastService.show(ESuccessMessages.APPOINTMENT, "success");
      }
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    } finally {
      loadingService.hide();
    }
  };

  return (
    <View style={styles.container}>
      {!isAppAdmin && (
        <View style={styles.counselorContainer}>
          <View style={styles.counselorInfo}>
            {counselorDetails?.profilePicture &&
            counselorDetails?.profilePicture !== "undefined" ? (
              <Avatar.Image
                source={{ uri: counselorDetails.profilePicture }}
                style={styles.avatar}
                size={60}
              />
            ) : (
              <Avatar.Text
                {...stringAvatar(
                  counselorDetails?.firstName,
                  counselorDetails?.lastName,
                  60,
                  12
                )}
                style={styles.avatar}
              />
            )}
            <View style={styles.counselorDetails}>
              <Text style={styles.counselorName}>
                {`${counselorDetails?.firstName} ${counselorDetails?.lastName}`}
              </Text>
              <Text style={styles.counselorRole}>Counselor</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerLabel}>Select Date:</Text>
            <Text style={styles.datePickerLabelDate}>
              {selectedDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <TextInput
            style={styles.reasonInput}
            placeholder="Enter reason for appointment"
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              if (text.trim()) {
                setReasonError("");
              }
            }}
            multiline
            numberOfLines={4}
            maxLength={255}
          />
          {reasonError ? (
            <Text style={styles.errorText}>{reasonError}</Text>
          ) : null}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Schedule</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAppAdmin && (
        <View>
          <AppointmentCardList
            appointments={appointments}
            isLoading={loading}
            refetch={loadAppointments}
          />
        </View>
      )}
    </View>
  );
};

export default AppointmentScreen;
