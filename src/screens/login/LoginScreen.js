import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  validateEmail,
  validateStudentNumber,
  validatePhoneNumber,
  validatePassword,
} from "../../shared";
import LoginScreenStyles from "./LoginScreenStyles";
import GlobalStyles from "../../shared/styles/global-styles";
import ButtonStyles from "../../shared/styles/button-styles";

const LoginScreen = ({ navigation }) => {
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

  const handleFormSubmit = () => {
    let valid = true;
    let validationErrors = {};

    // Form validation logic goes here based on `formStep` and `isSignUp`
    if (isSignUp) {
      if (formStep === 1) {
        // First step validation
        if (!formData.firstName) {
          validationErrors.firstName = "First Name is required";
          valid = false;
        }
        if (!formData.lastName) {
          validationErrors.lastName = "Last Name is required";
          valid = false;
        }
        if (!validateStudentNumber(formData.studentNumber)) {
          validationErrors.studentNumber = "Invalid Student Number";
          valid = false;
        }
        if (!validatePhoneNumber(formData.phoneNumber)) {
          validationErrors.phoneNumber = "Invalid Phone Number";
          valid = false;
        }
      } else {
        // Second step validation
        if (!validateEmail(formData.email)) {
          validationErrors.email = "Invalid Email";
          valid = false;
        }
        if (!validatePassword(formData.password)) {
          validationErrors.password = "Invalid Password";
          valid = false;
        }
        if (formData.password !== formData.reEnterPassword) {
          validationErrors.reEnterPassword = "Passwords do not match";
          valid = false;
        }
      }
    } else {
      // Login validation
      if (!validateEmail(formData.email)) {
        validationErrors.email = "Invalid Email";
        valid = false;
      }
      if (!formData.password) {
        validationErrors.password = "Password is required";
        valid = false;
      }
    }

    setErrors(validationErrors);
    if (valid) {
      if (isSignUp && formStep === 1) {
        setFormStep(2); // Move to step 2
      } else {
        // Submit form or authenticate
        alert(
          isSignUp ? "Account created successfully" : "Logged in successfully"
        );
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
