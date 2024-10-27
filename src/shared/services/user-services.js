import axios from "axios";
import { API_URL, RoleEnum } from "../enum";
import { capitalizeText, getTokenAsync } from "./global-services";

const usersURL = `${API_URL.BASE_URL}${API_URL.USERS}`;

export const userSignIn = async (userDetails) => {
  try {
    const response = await axios.post(
      `${usersURL}${API_URL.LOGIN}`,
      userDetails
    );
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userSignUp = async (userDetails) => {
  try {
    const response = await axios.post(
      `${usersURL}${API_URL.SIGNUP}`,
      userDetails
    );
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.get(
      `${usersURL}${API_URL.PROFILE}/${userId}`,
      {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Adjusted function for updating user profile with file upload
export const saveUserProfile = async (userId, profileData) => {
  try {
    const storedToken = await getTokenAsync();
    const formData = new FormData();

    // Append profile data fields with the correct structure
    formData.append("firstName", capitalizeText(profileData.firstName));
    formData.append("middleName", capitalizeText(profileData.middleName) || "");
    formData.append("lastName", capitalizeText(profileData.lastName));
    formData.append("email", profileData.email);
    formData.append("password", profileData.password || "");
    formData.append("phoneNumber", profileData.phoneNumber || "");
    formData.append("studentNumber", profileData.studentNumber);

    // Handle profile picture differently for React Native
    if (profileData.profilePicture) {
      // React Native requires a specific structure for the file upload
      formData.append("profilePicture", {
        uri: profileData.profilePicture.uri, // Make sure this is the correct URI from the image picker
        type: profileData.profilePicture.type, // e.g., "image/jpeg"
        name: profileData.profilePicture.name || "profile.jpg", // Default name if not provided
      });
    }

    // Perform the PUT request with FormData
    const response = await axios.put(
      `${usersURL}${API_URL.PROFILE}/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const fetchStudentList = async ({
  status = "",
  searchName = "",
  page = 0,
  sortBy = "lastName",
  sortDirection = "ASC",
  ignorePagination = false,
}) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.get(`${usersURL}${API_URL.LIST}`, {
      params: {
        status,
        role: RoleEnum.STUDENT,
        searchName,
        page,
        sortBy,
        sortDirection,
        ignorePagination,
      },
      headers: {
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const changeUserStatus = async (id, status) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.post(`${usersURL}${API_URL.STATUS}`, null, {
      params: { id, status },
      headers: {
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    throw error.response.data; // Handle error
  }
};

export const deleteUser = async (userId) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.delete(
      `${usersURL}${API_URL.DELETE}/${userId}`,
      {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      }
    );
    return response.data; // Return the response from the server (success message)
  } catch (error) {
    throw error.response.data; // Handle error
  }
};

export const fetchCounselorList = async ({
  status = "",
  searchName = "",
  page = 0,
  size = null,
  sortBy = "lastName",
  sortDirection = "ASC",
}) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.get(`${usersURL}${API_URL.LIST}`, {
      params: {
        status,
        role: RoleEnum.COUNSELOR,
        searchName,
        page,
        size,
        sortBy,
        sortDirection,
      },
      headers: {
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Load Cloudinary credentials from the environment variables
const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/" +
  process.env.CLOUDINARY_CLOUD_NAME + // Use your cloud name directly or import from a config
  "/image/upload";
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET; // Ensure this is available in your environment

// Function for uploading a profile picture to Cloudinary
export const uploadProfilePicture = async (profilePicture) => {
  try {
    const formData = new FormData();

    // Append the profile picture file
    if (profilePicture) {
      formData.append("file", {
        uri: profilePicture.uri, // Use the correct URI from the image picker
        type: profilePicture.type, // e.g., "image/jpeg"
        name: profilePicture.name || "profile.jpg", // Default name if not provided
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    }

    // Make a POST request to Cloudinary
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Get the URL of the uploaded image from the response
    const imageUrl = response.data.secure_url;

    // Return the image URL (you can use it to update the user's profile)
    return imageUrl;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error.response;
  }
};
