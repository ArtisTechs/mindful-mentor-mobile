import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  deleteAppointment,
  formatDate,
  EErrorMessages,
  ROUTES,
  toastService,
} from "../../shared";
import { DateFormat } from "../../shared/enum/date-format.enum";
import ButtonStyles from "../../shared/styles/button-styles";
import { Button, IconButton, Menu } from "react-native-paper";

const UpcomingEventsCard = ({ event, onDelete }) => {
  const { title, date, description, studentName, isAppAdmin } = event;
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleDelete = () => {
    closeMenu();
    onDelete(event);
  };

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventCardHeader}>
        <View>
          <Text style={styles.eventTitle}>{title}</Text>
          <Text style={styles.eventDate}>
            {formatDate(date, DateFormat.MONTH_DAY_YEAR)}
          </Text>
        </View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
        >
          <Menu.Item onPress={handleDelete} title="Delete" />
        </Menu>
      </View>
      <View style={styles.eventCardBody}>
        {description && (
          <Text style={styles.eventDescription}>
            <Text style={styles.boldText}>Reason:</Text> {description}
          </Text>
        )}
        {isAppAdmin && (
          <Text>
            <Text style={styles.boldText}>Student:</Text> {studentName}
          </Text>
        )}
      </View>
    </View>
  );
};

const UpcomingEvents = ({
  appointments,
  isAppAdmin,
  setFullLoadingHandler,
}) => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const formattedEvents = appointments.map((appointment) => ({
        id: appointment.id,
        title: "Counseling Appointment",
        date: appointment.scheduledDate,
        description: appointment.reason,
        studentName: `${appointment.user.firstName} ${appointment.user.lastName}`,
        isAppAdmin: isAppAdmin,
      }));
      setEvents(formattedEvents);
    }
  }, [appointments, isAppAdmin]);

  const handleDeleteEvent = (eventToDelete) => {
    toastService.show(
      `Are you sure you want to delete the appointment for ${
        isAppAdmin
          ? eventToDelete.studentName
          : formatDate(eventToDelete.date, DateFormat.MONTH_DAY_YEAR)
      }?`,
      "confirm",
      {
        onConfirm: async () => {
          try {
            setFullLoadingHandler(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            await deleteAppointment(eventToDelete.id);
            const updatedEvents = events.filter(
              (event) => event.id !== eventToDelete.id
            );
            setEvents(updatedEvents);
            setFullLoadingHandler(false);
            toastService.show(
              `Appointment deleted for ${formatDate(
                eventToDelete.date,
                DateFormat.MONTH_DAY_YEAR
              )}`,
              "success"
            );
          } catch (error) {
            setFullLoadingHandler(false);
            toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
          }
        },
        onCancel: () => {},
      }
    );
  };

  const handleScheduleClick = () => {
    navigation.navigate(ROUTES.APPOINTMENTS);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {events && events.length > 0
          ? "Upcoming Appointments"
          : "No upcoming appointments"}
      </Text>
      <View style={styles.divider}></View>
      <ScrollView style={styles.eventList}>
        {events && events.length > 0 ? (
          events.map((item) => (
            <UpcomingEventsCard
              key={item.id}
              event={item}
              onDelete={handleDeleteEvent}
            />
          ))
        ) : (
          <View style={styles.noEventsMessage}>
            {!isAppAdmin ? (
              <>
                <Text style={styles.noScheduleText}>
                  Schedule a personal appointment with a guidance counselor?
                </Text>
                <Button
                  style={ButtonStyles.secondaryButton}
                  onPress={handleScheduleClick}
                >
                  <Text style={styles.scheduleBtnText}>Schedule Now</Text>
                </Button>
              </>
            ) : (
              <Text>
                You don't have any upcoming counseling schedule today.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#b4edd8",
    alignItems: "center",
    minHeight: "35%",
    maxHeight: 300,
  },
  divider: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 16,
    width: "100%",
  },
  eventList: {
    width: "100%",
    maxHeight: 200,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  scheduleBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4682b4",
    borderRadius: 4,
    alignItems: "center",
  },
  noScheduleText: {
    color: "black",
    marginBottom: 15,
  },
  scheduleBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  eventCard: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: "white",
    marginBottom: 16,
  },
  eventCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDate: {
    fontStyle: "italic",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  ellipsis: {
    fontSize: 24,
  },
  noEventsMessage: {
    alignItems: "center",
  },
});

export default UpcomingEvents;
