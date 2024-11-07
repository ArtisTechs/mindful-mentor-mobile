import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  fetchJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  EErrorMessages,
  toastService,
  useGlobalContext,
  modalService,
  loadingService,
} from "../../shared";
import theme from "../../shared/styles/theme";

const JournalDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { journalId, isNew } = route.params || {};
  const { currentUserDetails, setIsRefetch } = useGlobalContext();
  const [formState, setFormState] = useState({
    title: "",
    message: "",
    entryDate: (() => {
      const today = new Date();
      const adjustedToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
      );
      return adjustedToday;
    })(),
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(isNew);
  const [titleError, setTitleError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (journalId && !isNew) {
      loadJournal();
    }
  }, [journalId, isNew]);

  const loadJournal = async () => {
    try {
      const journal = await fetchJournalById(journalId);
      setFormState({
        title: journal.title,
        message: journal.message,
        entryDate: new Date(journal.entryDate),
      });
      setIsUpdating(true);
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    }
  };

  const handleInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
    if (name === "title" && value.trim() !== "") {
      setTitleError("");
    }
    if (name === "message" && value.trim() !== "") {
      setMessageError("");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formState.entryDate;
    setShowDatePicker(false);
    setFormState({ ...formState, entryDate: currentDate });

    if (currentDate) {
      setDateError("");
    }
  };

  const handleSave = async () => {
    let hasError = false;
    loadingService.show();

    if (!formState.title.trim()) {
      setTitleError("Title is required.");
      hasError = true;
    }

    if (!formState.message.trim()) {
      setMessageError("Message is required.");
      hasError = true;
    }

    if (!formState.entryDate) {
      setDateError("Date is required.");
      hasError = true;
    }

    if (hasError) {
       loadingService.hide();
      return;
    }

    // Format the date as "YYYY-MM-DD"
    const formattedDate = formState.entryDate.toISOString().split("T")[0];
    const journalData = {
      ...formState,
      entryDate: formattedDate,
    };

    try {
      let response;
      if (isUpdating) {
        response = await updateJournal(journalId, journalData);
        toastService.show("Journal successfully updated.", "success");
      } else {
        response = await createJournal(currentUserDetails?.id, journalData);
        toastService.show("Journal successfully created.", "success");
      }
      navigation.goBack();
      setIsRefetch((prev) => !prev);
    } catch (error) {
      if (error?.data?.errorCode === "DATE_ALREADY_TAKEN") {
        setDateError(error?.data?.message);
      } else {
        toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
      }
    } finally {
      loadingService.hide();
    }
  };

  const handleDelete = async () => {
    modalService.show({
      title: "Delete Journal?",
      message: `Are you sure you want to delete this journal?`,
      onConfirm: async () => {
        loadingService.show();
        setTimeout(async () => {
          try {
            await deleteJournal(journalId);
            toastService.show("Journal successfully deleted.", "success");
            loadingService.hide();
            navigation.goBack();
            setIsRefetch((prev) => !prev);
          } catch (error) {
            loadingService.hide();
            toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
          }
        }, 500);
      },
      onCancel: () => {},
      confirmText: "Delete",
      confirmButtonColor: theme.colors.danger,
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {!isEditMode && (
          <TouchableOpacity style={styles.deleteIcon} onPress={handleDelete}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        )}

        {isEditMode ? (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.dateText}>
                Date: {formState.entryDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {dateError ? (
              <Text style={styles.errorText}>{dateError}</Text>
            ) : null}

            {showDatePicker && (
              <DateTimePicker
                value={formState.entryDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formState.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />
            {titleError ? (
              <Text style={styles.errorText}>{titleError}</Text>
            ) : null}

            <TextInput
              style={styles.textarea}
              placeholder="Message"
              value={formState.message}
              onChangeText={(value) => handleInputChange("message", value)}
              multiline
            />
            {messageError ? (
              <Text style={styles.errorText}>{messageError}</Text>
            ) : null}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {isUpdating ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.viewTextTitle}>{formState.title}</Text>
            <Text style={styles.viewTextDate}>
              Date: {formState.entryDate.toDateString()}
            </Text>
            <ScrollView style={styles.messageScrollView}>
              <Text style={styles.viewTextMessage}>{formState.message}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.editButton}
              onPress={toggleEditMode}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  container: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    width: "100%",
    borderRadius: 25,
  },
  deleteIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  textarea: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    height: "60%",
    textAlignVertical: "top",
    marginBottom: 15,
  },
  datePickerButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: theme.colors.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: theme.colors.tertiary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },
  viewTextTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  viewTextDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  messageScrollView: {
    height: "70%",
    marginBottom: 16,
  },
  viewTextMessage: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: theme.colors.secondary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 8,
  },
  editButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },
});

export default JournalDetailScreen;
