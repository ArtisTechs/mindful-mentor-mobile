import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { TextInput, Avatar } from "react-native-paper"; // Ensure Avatar is from react-native-paper
import {
  getUserDetails,
  toastService,
  stringAvatar,
  EErrorMessages,
  loadingService,
  RoleEnum,
  uploadProfilePicture,
  ESuccessMessages,
  modalService,
  validatePassword,
  validatePhoneNumber,
  validateStudentNumber,
  validateEmail,
  removeEmptyFields,
  saveUserProfile,
} from "../../shared"; // Adjust path as needed
import { useGlobalContext } from "../../shared/context";
import GlobalStyles from "../../shared/styles/global-styles";
import ProfileScreenStyles from "./ProfileScreenStyles"; // Adjust your style import
import ButtonStyles from "../../shared/styles/button-styles";
import { Icon } from "react-native-elements";
import permissionServices from "../../shared/services/permission-services";
import { launchImageLibraryAsync } from "expo-image-picker";

const ProfileScreen = () => {
  const {
    currentUserDetails,
    isAppAdmin,
    selectedStudentDetails,
    setCurrentUserDetails,
  } = useGlobalContext();

  const [profile, setProfile] = useState(() => {
    return selectedStudentDetails || currentUserDetails;
  });
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    studentNumber: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUserDetails) {
      const fetchUserDetails = async () => {
        try {
          loadingService.show();
          await new Promise((resolve) => setTimeout(resolve, 500));
          const userId = selectedStudentDetails
            ? selectedStudentDetails.id
            : currentUserDetails.id;
          const userDetails = await getUserDetails(userId);
          setProfile(userDetails);
          setFormData(userDetails);
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        } finally {
          loadingService.hide();
        }
      };
      fetchUserDetails();
    }
  }, [selectedStudentDetails, currentUserDetails]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!selectedStudentDetails && isAppAdmin) {
      if (!formData.firstName) {
        newErrors.firstName = EErrorMessages.FIRST_NAME_REQUIRED;
        formIsValid = false;
      }
      if (!formData.lastName) {
        newErrors.lastName = EErrorMessages.LAST_NAME_REQUIRED;
        formIsValid = false;
      }
      if (!formData.email) {
        newErrors.email = EErrorMessages.EMAIL_REQUIRED;
        formIsValid = false;
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = EErrorMessages.PHONE_NUMBER_REQUIRED;
        formIsValid = false;
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = EErrorMessages.PHONE_NUMBER_INVALID;
        formIsValid = false;
      }
    } else {
      if (!formData.firstName) {
        newErrors.firstName = EErrorMessages.FIRST_NAME_REQUIRED;
        formIsValid = false;
      }
      if (!formData.lastName) {
        newErrors.lastName = EErrorMessages.LAST_NAME_REQUIRED;
        formIsValid = false;
      }
      if (!formData.email) {
        newErrors.email = EErrorMessages.EMAIL_REQUIRED;
        formIsValid = false;
      } else if (!validateEmail(formData.email)) {
        newErrors.email = EErrorMessages.EMAIL_INVALID;
        formIsValid = false;
      }
      if (!formData.studentNumber && !isAppAdmin) {
        newErrors.studentNumber = EErrorMessages.STUDENT_NUMBER_REQUIRED;
        formIsValid = false;
      } else if (
        !validateStudentNumber(formData.studentNumber) &&
        !isAppAdmin
      ) {
        newErrors.studentNumber = EErrorMessages.STUDENT_NUMBER_INVALID;
        formIsValid = false;
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = EErrorMessages.PHONE_NUMBER_REQUIRED;
        formIsValid = false;
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = EErrorMessages.PHONE_NUMBER_INVALID;
        formIsValid = false;
      }
    }
    if (formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
        formIsValid = false;
      }
    }

    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    const filteredFormData = removeEmptyFields(formData);

    modalService.show({
      title: "Update Profile?",
      message: `Are you sure you want to update profile details?`,
      onConfirm: async () => {
        loadingService.show();
        setTimeout(async () => {
          try {
            const response = await saveUserProfile(
              profile.id,
              filteredFormData
            );
            console.log("response", response);
            setProfile((prev) => ({
              ...prev,
              ...filteredFormData,
            }));
            setIsEditing(false);
            loadingService.hide();

            if (currentUserDetails.id === filteredFormData.id) {
              setCurrentUserDetails(filteredFormData);
            }

            toastService.show(ESuccessMessages.UPDATE_PROFILE, "success");
          } catch (error) {
            console.log(error);
            toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
            loadingService.hide();
          }
        }, 500);
      },
      onCancel: () => {
        // Optionally handle cancel action
      },
    });
  };

  const handleFileChange = async () => {
    const hasPermission = await permissionServices.requestStoragePermission();

    if (!hasPermission) {
      toastService.show(
        "Permission Denied. You need to give storage permission to select an image.",
        "error"
      );
      return;
    }

    const options = {
      mediaType: "photo",
      quality: 1,
    };

    // Use launchImageLibraryAsync to select an image
    const response = await launchImageLibraryAsync(options);

    if (response.canceled) {
    } else if (response.assets && response.assets.length > 0) {
      const file = response.assets[0];
      if (file && file.uri) {
        const fileType = file.uri.split(".").pop();

        if (["jpg", "jpeg", "png", "gif"].includes(fileType.toLowerCase())) {
          const fileURL = file.uri;
          console.log(fileURL);

          try {
            loadingService.show();
            const uploadedImageUrl = await uploadProfilePicture(file);

            setFormData((prev) => ({
              ...prev,
              profilePicture: uploadedImageUrl,
            }));
            console.log(uploadedImageUrl);
          } catch (error) {
            console.log(error);
            console.error("Error uploading the profile picture:", error);
          } finally {
            loadingService.hide();
          }
        } else {
          toastService.show(
            "Invalid File Type. Please upload an image file.",
            "error"
          );
        }
      }
    } else {
      console.log("ImagePicker Error: ", response.error);
    }
  };

  const handleClearProfileClick = () => {
    setFormData((prev) => ({ ...prev, profilePicture: null }));
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const renderError = (field) => {
    return errors[field] ? (
      <Text style={ProfileScreenStyles.errorText}>{errors[field]}</Text>
    ) : null;
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <ScrollView style={ProfileScreenStyles.profilePage}>
      <View style={ProfileScreenStyles.avatarContainer}>
        {(!isEditing &&
          profile.profilePicture &&
          profile.profilePicture !== "undefined") ||
        (formData.profilePicture && formData.profilePicture !== "undefined") ? (
          <Avatar.Image
            size={120}
            source={{ uri: profile.profilePicture || formData.profilePicture }}
            style={ProfileScreenStyles.avatar}
          />
        ) : (
          <Avatar.Text
            {...stringAvatar(profile.firstName, profile.lastName, 120, 12)}
            style={ProfileScreenStyles.avatar}
          />
        )}
      </View>
      <View style={ProfileScreenStyles.profileContainer}>
        <View style={ProfileScreenStyles.profileHeader}></View>

        {isEditing ? (
          // Edit Mode
          <View style={ProfileScreenStyles.profileDetailsEdit}>
            {/* Change Profile Picture Section */}
            {isEditing && (
              <>
                <TouchableOpacity
                  style={ProfileScreenStyles.changeProfileIcon}
                  onPress={handleFileChange}
                >
                  <Icon name="image" size={24} color="white" />
                </TouchableOpacity>
                {formData.profilePicture && (
                  <TouchableOpacity
                    onPress={handleClearProfileClick}
                    style={ProfileScreenStyles.clearProfileIcon}
                  >
                    <Icon name="close" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </>
            )}
            {/* Other Input Fields */}
            <TextInput
              label="First Name"
              mode="outlined"
              outlineColor="#b4edd8"
              activeOutlineColor="black"
              outlineStyle={GlobalStyles.inputBorder}
              style={GlobalStyles.input}
              value={formData.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
              error={!!errors.firstName}
              editable={isEditing}
            />
            {renderError("firstName")}

            <TextInput
              label="Middle Name"
              mode="outlined"
              outlineColor="#b4edd8"
              activeOutlineColor="black"
              outlineStyle={GlobalStyles.inputBorder}
              style={GlobalStyles.input}
              value={formData.middleName}
              onChangeText={(text) => handleChange("middleName", text)}
              error={!!errors.middleName}
              editable={isEditing}
            />
            {renderError("middleName")}

            <TextInput
              label="Last Name"
              mode="outlined"
              outlineColor="#b4edd8"
              activeOutlineColor="black"
              outlineStyle={GlobalStyles.inputBorder}
              style={GlobalStyles.input}
              value={formData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              error={!!errors.lastName}
              editable={isEditing}
            />
            {renderError("lastName")}

            <TextInput
              label="Email"
              mode="outlined"
              outlineColor="#b4edd8"
              activeOutlineColor="black"
              outlineStyle={GlobalStyles.inputBorder}
              style={GlobalStyles.input}
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              error={!!errors.email}
              editable={isEditing}
              disabled={isAppAdmin && selectedStudentDetails}
            />
            {renderError("email")}

            {(isAppAdmin && selectedStudentDetails) ||
              (!isAppAdmin && !selectedStudentDetails && (
                <>
                  <TextInput
                    label="Student Number"
                    mode="outlined"
                    outlineColor="#b4edd8"
                    activeOutlineColor="black"
                    outlineStyle={GlobalStyles.inputBorder}
                    style={GlobalStyles.input}
                    value={formData.studentNumber}
                    onChangeText={(text) => handleChange("studentNumber", text)}
                    error={!!errors.studentNumber}
                  />
                  {renderError("studentNumber")}
                </>
              ))}

            <TextInput
              label="Phone Number"
              mode="outlined"
              outlineColor="#b4edd8"
              activeOutlineColor="black"
              outlineStyle={GlobalStyles.inputBorder}
              style={GlobalStyles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
              error={!!errors.phoneNumber}
            />
            {renderError("phoneNumber")}

            <TextInput
              label="Password"
              mode="outlined"
              outlineColor="#b4edd8"
              activeOutlineColor="black"
              outlineStyle={GlobalStyles.inputBorder}
              style={GlobalStyles.input}
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!showPassword}
              error={!!errors.password}
              editable={isEditing}
              right={
                <TextInput.Icon icon="eye" onPress={handleTogglePassword} />
              }
            />
            {renderError("password")}

            <View style={ButtonStyles.buttonContainerRow}>
              <TouchableOpacity
                style={ButtonStyles.whiteButton}
                onPress={handleFormSubmit}
              >
                <Text style={ButtonStyles.whiteButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // View Mode
          <View style={ProfileScreenStyles.profileDetails}>
            <Text style={ProfileScreenStyles.textLabel}>Name</Text>
            <Text style={ProfileScreenStyles.textValue}>
              {`${profile.firstName} ${
                profile.middleName ? profile.middleName + " " : ""
              }${profile.lastName}` || "N/A"}
            </Text>
            <Text style={ProfileScreenStyles.textLabel}>Email</Text>
            <Text style={ProfileScreenStyles.textValue}>
              {profile.email || "N/A"}
            </Text>
            {(isAppAdmin && selectedStudentDetails) ||
              (!isAppAdmin && !selectedStudentDetails && (
                <>
                  <Text style={ProfileScreenStyles.textLabel}>
                    Student Number
                  </Text>
                  <Text style={ProfileScreenStyles.textValue}>
                    {profile.studentNumber || "N/A"}
                  </Text>
                </>
              ))}
            <Text style={ProfileScreenStyles.textLabel}>Phone Number</Text>
            <Text style={ProfileScreenStyles.textValue}>
              {profile.phoneNumber || "N/A"}
            </Text>
            {((isAppAdmin && selectedStudentDetails) ||
              (!isAppAdmin && !selectedStudentDetails)) && (
              <>
                <Text style={ProfileScreenStyles.textLabel}>Counselor</Text>
                <Text style={ProfileScreenStyles.textValue}>
                  {profile.counselor || "N/A"}
                </Text>
              </>
            )}
          </View>
        )}
        <View style={ButtonStyles.buttonContainerRow}>
          <TouchableOpacity
            style={ButtonStyles.secondaryButton}
            onPress={handleEditClick}
          >
            <Text style={ButtonStyles.secondaryButtonText}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
