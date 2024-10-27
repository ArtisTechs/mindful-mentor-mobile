import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  validateEmail,
  validateStudentNumber,
  validatePhoneNumber,
  validatePassword,
} from "../../shared";
import LoginScreenStyles from "./LoginScreenStyles";

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
      <Text style={LoginScreenStyles.title}>Mindful Mentor</Text>

      {isSignUp ? (
        <>
          <Text style={LoginScreenStyles.subtitle}>
            {formStep === 1 ? "Sign Up - Step 1" : "Sign Up - Step 2"}
          </Text>

          {formStep === 1 ? (
            <>
              <TextInput
                placeholder="First Name"
                style={LoginScreenStyles.input}
                value={formData.firstName}
                onChangeText={(text) => handleChange("firstName", text)}
              />
              {errors.firstName && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.firstName}
                </Text>
              )}

              <TextInput
                placeholder="Middle Name"
                style={LoginScreenStyles.input}
                value={formData.middleName}
                onChangeText={(text) => handleChange("middleName", text)}
              />
              <TextInput
                placeholder="Last Name"
                style={LoginScreenStyles.input}
                value={formData.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
              />
              {errors.lastName && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.lastName}
                </Text>
              )}

              <TextInput
                placeholder="Student Number"
                style={LoginScreenStyles.input}
                value={formData.studentNumber}
                onChangeText={(text) => handleChange("studentNumber", text)}
              />
              {errors.studentNumber && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.studentNumber}
                </Text>
              )}

              <TextInput
                placeholder="Phone Number"
                style={LoginScreenStyles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
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
                placeholder="Email"
                style={LoginScreenStyles.input}
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
              {errors.email && (
                <Text style={LoginScreenStyles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                placeholder="Password"
                style={LoginScreenStyles.input}
                value={formData.password}
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TextInput
                placeholder="Re-enter Password"
                style={LoginScreenStyles.input}
                value={formData.reEnterPassword}
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange("reEnterPassword", text)}
              />
              {errors.reEnterPassword && (
                <Text style={LoginScreenStyles.errorText}>
                  {errors.reEnterPassword}
                </Text>
              )}

              <TouchableOpacity onPress={handleTogglePassword}>
                <Text>{showPassword ? "Hide Password" : "Show Password"}</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            style={LoginScreenStyles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && (
            <Text style={LoginScreenStyles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            placeholder="Password"
            style={LoginScreenStyles.input}
            value={formData.password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => handleChange("password", text)}
          />
          {errors.password && (
            <Text style={LoginScreenStyles.errorText}>{errors.password}</Text>
          )}

          <TouchableOpacity onPress={handleTogglePassword}>
            <Text>{showPassword ? "Hide Password" : "Show Password"}</Text>
          </TouchableOpacity>
        </>
      )}

      <Button
        title={
          isSignUp && formStep === 1 ? "Next" : isSignUp ? "Sign Up" : "Login"
        }
        onPress={handleFormSubmit}
      />

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={LoginScreenStyles.switchText}>
          {isSignUp
            ? "Already have an account? Login"
            : "New here? Get Started"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
