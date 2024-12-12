import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Avatar, Button, Menu, Divider, IconButton } from "react-native-paper";
import { Icon } from "react-native-elements";
import {
  AccountStatusEnum,
  changeUserStatus,
  deleteUser,
  EErrorMessages,
  emotionCode,
  getEmotionImage,
  modalService,
  stringAvatar,
  toastService,
} from "../../../shared";
import theme from "../../../shared/styles/theme";
import { useNavigation } from "@react-navigation/native";

// Skeleton loader component
const SkeletonLoader = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonAvatar} />
    <View style={styles.skeletonText} />
    <View style={styles.skeletonText} />
  </View>
);

const StudentList = ({
  students,
  loading,
  size = "full",
  showHeader = true,
  hideOptions,
  hideEmotion,
  hideDelete,
  isItemClickable,
  onSelectStudent,
  isSelectedStudent,
  isRequest = false,
  refetch,
  showEmotionFilter = false,
}) => {
  const navigation = useNavigation();
  const [selectedStudent, setSelectedStudent] = useState(
    isSelectedStudent || null
  );
  const hasInitialized = useRef(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [filteredEmotion, setFilteredEmotion] = useState(null);

  useEffect(() => {
    if (!hasInitialized.current && students.length > 0 && onSelectStudent) {
      hasInitialized.current = true;
    }
  }, [students, onSelectStudent]);

  const handleFilterClick = (code) => {
    setFilteredEmotion((prev) => (prev === code ? null : code)); // Toggle filter
  };

  const filteredStudents = filteredEmotion
    ? students.filter((student) => student.moodCode === filteredEmotion)
    : students;

  const handleItemClick = (student) => {
    if (isItemClickable && onSelectStudent) {
      setSelectedStudent(student);
      onSelectStudent(student);
    }
  };

  const toggleMenu = (studentId) => {
    setMenuVisible((prev) => (prev === studentId ? null : studentId));
  };

  const handleMenuItemClick = (student, action) => {
    toggleMenu(student.id);
    switch (action) {
      case "calendar":
        navigation.navigate("Calendar", { student });
        break;
      case "chat":
        navigation.navigate("AdminChat", {
          screen: "AdminChatView",
          params: { student },
        });
        break;
      case "profile":
        navigation.navigate("AdminProfile", { student });
        break;
      case "delete":
        handleDeleteClick(student);
        break;
      default:
        break;
    }
  };

  const handleApproveClick = (studentDetails) => {
    modalService.show({
      title: "Approve Student?",
      message: `Are you sure you want to approve ${studentDetails.firstName} ${studentDetails.lastName}'s account?`,
      onConfirm: async () => {
        try {
          const status = AccountStatusEnum.ACTIVE;
          const response = await changeUserStatus(studentDetails.id, status);
          toastService.show(
            `${studentDetails.firstName} ${studentDetails.lastName} successfully approved.`,
            "success"
          );
          refetch();
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        }
      },
      onCancel: () => {
        // console.log("Approval cancelled");
      },
      confirmText: "Approved",
    });
  };

  const handleRejectClick = (studentDetails) => {
    modalService.show({
      title: "Reject Student?",
      message: `Are you sure you want to reject ${studentDetails.firstName} ${studentDetails.lastName}'s account? 
      The account will also be deleted.`,
      onConfirm: async () => {
        try {
          const response = await deleteUser(studentDetails.id);
          toastService.show(
            `${studentDetails.firstName} ${studentDetails.lastName} has been rejected.`,
            "success"
          );
          refetch();
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        }
      },
      confirmText: "Reject",
      confirmButtonColor: theme.colors.danger,
    });
  };

  const handleDeleteClick = (studentDetails) => {
    modalService.show({
      title: "Delete Student",
      message: `Are you sure you want to Delete ${studentDetails.firstName} ${studentDetails.lastName}'s account?`,
      onConfirm: async () => {
        try {
          const response = await deleteUser(studentDetails.id);
          toastService.show(
            `${studentDetails.firstName} ${studentDetails.lastName} has been deleted.`,
            "success"
          );
          refetch();
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        }
      },
      confirmText: "Delete",
      confirmButtonColor: theme.colors.danger,
    });
  };

  return (
    <View style={styles.container}>
      {showHeader && <Text style={styles.header}>Students</Text>}

      {showEmotionFilter && (
        <View style={styles.emotionFilterContainer}>
          {Object.values(emotionCode).map((emotion) => (
            <TouchableOpacity
              key={emotion.code}
              style={[
                styles.emotionIconContainer,
                filteredEmotion === emotion.code && styles.selectedEmotion,
              ]}
              onPress={() => handleFilterClick(emotion.code)}
            >
              <Image
                source={getEmotionImage(emotion.code)}
                style={[
                  styles.emotionIcon,
                  filteredEmotion !== emotion.code && {
                    filter: "grayscale(100%)",
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))
      ) : filteredStudents && filteredStudents.length > 0 ? (
        <ScrollView
          style={styles.scrollableList}
          contentContainerStyle={styles.studentList}
        >
          {filteredStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentCard,
                selectedStudent?.id === student.id ? styles.selected : {},
              ]}
              onPress={() => handleItemClick(student)}
            >
              <View
                style={
                  isRequest
                    ? styles.studentInfoRequest
                    : !hideOptions
                    ? styles.studentInfo
                    : styles.studentInfoHideOptions
                }
              >
                {student.profilePicture &&
                student.profilePicture !== "undefined" ? (
                  <Avatar.Image
                    source={{ uri: student.profilePicture }}
                    style={isRequest ? null : styles.avatar}
                    size={60}
                  />
                ) : (
                  <Avatar.Text
                    {...stringAvatar(
                      student.firstName,
                      student.lastName,
                      60,
                      12
                    )}
                    style={isRequest ? null : styles.avatar}
                  />
                )}
                <View
                  style={
                    isRequest
                      ? styles.studentLabelsRequest
                      : styles.studentLabels
                  }
                >
                  <Text
                    style={styles.studentName}
                  >{`${student.lastName}, ${student.firstName}`}</Text>
                  {student.email && size === "full" && (
                    <Text style={styles.studentDetailLabel}>
                      {student.email}
                    </Text>
                  )}
                  {student.studentNumber && size === "full" && (
                    <Text style={styles.studentDetailLabel}>
                      {student.studentNumber}
                    </Text>
                  )}
                </View>
              </View>
              {student?.Messages?.length > 0 && (
                <View style={styles.messageCount}>
                  <Text style={styles.messageCountText}>
                    {student.Messages.length}
                  </Text>
                </View>
              )}
              {/* Options and Emotion Icons */}
              {!hideOptions && !isRequest && (
                <Menu
                  visible={menuVisible === student.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <Button onPress={() => toggleMenu(student.id)}>
                      <IconButton icon="dots-vertical" />
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => handleMenuItemClick(student, "calendar")}
                    title="Calendar"
                  />
                  <Menu.Item
                    onPress={() => handleMenuItemClick(student, "chat")}
                    title="Chat"
                  />
                  <Menu.Item
                    onPress={() => handleMenuItemClick(student, "profile")}
                    title="Profile"
                  />
                  {!hideDelete && (
                    <Menu.Item
                      onPress={() => handleMenuItemClick(student, "delete")}
                      title="Delete"
                    />
                  )}
                </Menu>
              )}

              {!hideEmotion && student.moodCode && !isRequest && (
                <Image
                  source={getEmotionImage(student.moodCode)}
                  style={styles.emotionIcon}
                />
              )}

              {isRequest && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => handleApproveClick(student)}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleRejectClick(student)}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noStudentDisplay}>
          <Text>No students to display</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#b4edd8",
    width: "100%",
    borderRadius: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  scrollableList: {
    maxHeight: "100%",
  },
  studentList: {
    paddingBottom: 16,
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    width: "100%",
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
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "100%",
  },
  selected: {
    backgroundColor: "#769f90",
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  studentInfoHideOptions: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  studentInfoRequest: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
  },
  avatar: {
    marginRight: 12,
  },
  studentLabels: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "90%",
  },
  studentLabelsRequest: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  studentDetailLabel: {
    fontSize: 14,
    color: "#666",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "500",
  },
  emotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "40%",
    gap: 8,
    marginTop: 8,
  },
  noStudentDisplay: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: theme.colors.danger,
  },
  rejectButtonText: { color: "white" },
  approveButton: {
    backgroundColor: theme.colors.primary,
  },
  approveButtonText: { color: "black" },
  messageCount: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: theme.colors.danger,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  messageCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emotionFilterContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  emotionIconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  selectedEmotion: {
    backgroundColor: "#e0f7fa",
  },
});

export default StudentList;
