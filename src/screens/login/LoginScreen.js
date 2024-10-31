import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  validateEmail,
  validateStudentNumber,
  validatePhoneNumber,
  validatePassword,
  ESuccessMessages,
  EErrorMessages,
  userSignUp,
  toastService,
  userSignIn,
  capitalizeText,
  RoleEnum,
  loadingService,
} from "../../shared";
import LoginScreenStyles from "./LoginScreenStyles";
import GlobalStyles from "../../shared/styles/global-styles";
import ButtonStyles from "../../shared/styles/button-styles";

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    reEnterPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    studentNumber: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setFormStep(1);
    setFormData({
      email: "",
      password: "",
      reEnterPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      studentNumber: "",
      phoneNumber: "",
    });
    setErrors({
      email: "",
      password: "",
      reEnterPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      studentNumber: "",
      phoneNumber: "",
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    loadingService.show();

    let formIsValid = true;
    let newErrors = {
      email: "",
      password: "",
      reEnterPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      studentNumber: "",
      phoneNumber: "",
    };

    if (isSignUp) {
      if (formStep === 1) {
        // Step 1 validation
        if (!formData.firstName) {
          newErrors.firstName = EErrorMessages.FIRST_NAME_REQUIRED;
          formIsValid = false;
        }
        if (!formData.lastName) {
          newErrors.lastName = EErrorMessages.LAST_NAME_REQUIRED;
          formIsValid = false;
        }
        if (!formData.studentNumber) {
          newErrors.studentNumber = EErrorMessages.STUDENT_NUMBER_REQUIRED;
          formIsValid = false;
        } else if (!validateStudentNumber(formData.studentNumber)) {
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
      } else if (formStep === 2) {
        // Step 2 validation
        if (!formData.email) {
          newErrors.email = EErrorMessages.EMAIL_REQUIRED;
          formIsValid = false;
        } else if (!validateEmail(formData.email)) {
          newErrors.email = EErrorMessages.EMAIL_INVALID;
          formIsValid = false;
        }
        if (!formData.password) {
          newErrors.password = EErrorMessages.PASSWORD_REQUIRED;
          formIsValid = false;
        }
        if (formData.password !== formData.reEnterPassword) {
          newErrors.reEnterPassword = EErrorMessages.PASSWORD_NOT_MATCH;
          formIsValid = false;
        }
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
          formIsValid = false;
        }
      }

      if (formIsValid) {
        if (formStep === 1) {
          setFormStep(2);
          loadingService.hide();
        } else {
          setTimeout(async () => {
            try {
              const userDetails = {
                firstName: capitalizeText(formData.firstName),
                middleName: capitalizeText(formData.middleName),
                lastName: capitalizeText(formData.lastName),
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                studentNumber: formData.studentNumber,
                role: RoleEnum.STUDENT,
              };
              const user = await userSignUp(userDetails);

              toggleForm();
              toastService.show(ESuccessMessages.REGISTER, "success");
              loadingService.hide();
            } catch (error) {
              console.log(error);
              if (error.errorCode === "EMAIL_ALREADY_REGISTERED") {
                newErrors.email = error.message;
                setErrors(newErrors);
              } else if (
                error.errorCode === "STUDENT_NUMBER_ALREADY_REGISTERED"
              ) {
                newErrors.studentNumber = error.message;
                setErrors(newErrors);
                setFormStep(1);
              } else {
                toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
              }
              loadingService.hide();
            }

            loadingService.hide();
          }, 500);
        }
      } else {
        setErrors(newErrors);
        loadingService.hide();
      }
    } else {
      // Handle Sign In submission
      if (!formData.email) {
        newErrors.email = EErrorMessages.EMAIL_REQUIRED;
        formIsValid = false;
      } else if (!validateEmail(formData.email)) {
        newErrors.email = EErrorMessages.EMAIL_INVALID;
        formIsValid = false;
      }

      if (!formData.password) {
        newErrors.password = EErrorMessages.PASSWORD_REQUIRED;
        formIsValid = false;
      }

      if (formIsValid) {
        setTimeout(async () => {
          try {
            const userDetails = {
              email: formData.email,
              password: formData.password,
            };
            const user = await userSignIn(userDetails);
            toastService.show(ESuccessMessages.LOGIN, "success");
            onLoginSuccess(user);
            loadingService.hide();
          } catch (error) {
            if (error.errorCode === "EMAIL_NOT_REGISTERED") {
              newErrors.email = EErrorMessages.EMAIL_UNREGISTERED;
              setErrors(newErrors);
            } else if (error.errorCode === "WRONG_PASSWORD") {
              newErrors.password = EErrorMessages.PASSWORD_INCORRECT;
              setErrors(newErrors);
            } else if (
              error.message ===
              "User account is not active. Wait for the counselor for approval."
            ) {
              toastService.show(error.message, "error");
            } else {
              toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
            }
            loadingService.hide();
          }

          loadingService.hide();
        }, 500);
      } else {
        setErrors(newErrors);
        loadingService.hide();
      }
    }
  };

  return (
    <View style={LoginScreenStyles.container}>
      <View style={LoginScreenStyles.header}>
        <Image
          source={require("../../assets/img/mindful-mentor-logo.png")}
          style={LoginScreenStyles.logoImage}
        />
        <Text style={LoginScreenStyles.logoTitle}>Mindful Mentor</Text>
        <Text style={LoginScreenStyles.title}>
          {isSignUp ? "Create Account" : "Login"}
        </Text>
      </View>

      {isSignUp ? (
        <>
          <Text style={LoginScreenStyles.subtitle}>
            {formStep === 1 ? "Sign Up - Step 1" : "Sign Up - Step 2"}
          </Text>

          {formStep === 1 ? (
            <>
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
              />
              {errors.firstName && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.firstName}
                </Text>
              )}

              <TextInput
                label="Middle Name"
                mode="outlined"
                outlineColor="#b4edd8"
                activeOutlineColor="black"
                outlineStyle={GlobalStyles.inputBorder}
                style={GlobalStyles.input}
                value={formData.middleName}
                onChangeText={(text) => handleChange("middleName", text)}
              />

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
              />
              {errors.lastName && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.lastName}
                </Text>
              )}

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
              {errors.studentNumber && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.studentNumber}
                </Text>
              )}

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
              {errors.phoneNumber && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.phoneNumber}
                </Text>
              )}
            </>
          ) : (
            <>
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
              />
              {errors.email && (
                <Text style={LoginScreenStyles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Password"
                mode="outlined"
                outlineColor="#b4edd8"
                activeOutlineColor="black"
                outlineStyle={GlobalStyles.inputBorder}
                style={GlobalStyles.input}
                value={formData.password}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon icon="eye" onPress={handleTogglePassword} />
                }
                onChangeText={(text) => handleChange("password", text)}
                error={!!errors.password}
              />

              <TextInput
                label="Re-enter Password"
                mode="outlined"
                outlineColor="#b4edd8"
                activeOutlineColor="black"
                outlineStyle={GlobalStyles.inputBorder}
                style={GlobalStyles.input}
                value={formData.reEnterPassword}
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange("reEnterPassword", text)}
                error={!!errors.reEnterPassword}
              />
              {errors.reEnterPassword && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.reEnterPassword}
                </Text>
              )}
            </>
          )}
        </>
      ) : (
        <>
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
          />
          {errors.email && (
            <Text style={GlobalStyles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            label="Password"
            mode="outlined"
            outlineColor="#b4edd8"
            activeOutlineColor="black"
            outlineStyle={GlobalStyles.inputBorder}
            style={GlobalStyles.input}
            value={formData.password}
            secureTextEntry={!showPassword}
            right={<TextInput.Icon icon="eye" onPress={handleTogglePassword} />}
            onChangeText={(text) => handleChange("password", text)}
            error={!!errors.password}
          />
          {errors.password && (
            <Text style={GlobalStyles.errorText}>{errors.password}</Text>
          )}
        </>
      )}

      <View style={ButtonStyles.buttonContainerColumn}>
        <Button
          mode="contained"
          onPress={handleFormSubmit}
          style={ButtonStyles.primaryButton}
          rippleColor="#769f90"
          textColor="black"
        >
          {isSignUp && formStep === 1 ? "Next" : isSignUp ? "Sign Up" : "Login"}
        </Button>

        <Button
          mode="contained"
          onPress={toggleForm}
          style={ButtonStyles.secondaryButton}
          rippleColor="#5b5959"
        >
          {isSignUp ? "Back to Sign In" : "Sign Up"}
        </Button>
      </View>
      <Text style={LoginScreenStyles.switchText}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
      </Text>
    </View>
  );
};

export default LoginScreen;
