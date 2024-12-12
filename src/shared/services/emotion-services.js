import axios from "axios";
import { API_URL, emotionCode } from "../enum";
import { getTokenAsync } from "./global-services";
import JoyfulImage from "../../assets/img/Joyful.png";
import MotivatedImage from "../../assets/img/Motivated.png";
import CalmImage from "../../assets/img/Calm.png";
import AnxiousImage from "../../assets/img/Anxious.png";
import SadImage from "../../assets/img/Sad.png";
import FrustratedImage from "../../assets/img/Frustrated.png";
import logo from "../../assets/img/mindful-mentor-logo.png";

const moodURL = `${API_URL.BASE_URL}${API_URL.MOODS}`;

// Add a new mood
export const addMood = async (moodDetails) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.post(`${moodURL}${API_URL.ADD}`, moodDetails, {
      headers: {
        "Content-Type": "application/json",
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      },
    });
    return response.data; // Return the added mood object
  } catch (error) {
    throw error.response || error.message;
  }
};

// Get moods with filters
export const getMoods = async (filters) => {
  try {
    const storedToken = await getTokenAsync();
    const {
      userId,
      moodCode,
      startDate,
      endDate,
      sortAscending = true,
    } = filters;

    const response = await axios.get(moodURL, {
      params: {
        userId,
        moodCode,
        startDate,
        endDate,
        sortAscending,
      },
      headers: {
        "Content-Type": "application/json",
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      },
    });
    return response.data; // Return the filtered moods
  } catch (error) {
    throw error.response || error.message;
  }
};

// Update mood by ID
export const updateMoodById = async (id, moodDetails) => {
  try {
    const storedToken = await getTokenAsync();
    const response = await axios.put(
      `${moodURL}${API_URL.UPDATE}/${id}`,
      moodDetails,
      {
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error.message;
  }
};

// Get students with mood today
export const getStudentsWithMoodToday = async (filters) => {
  try {
    const storedToken = await getTokenAsync();
    const {
      sortBy = "lastName",
      sortAscending = true,
      page = 0,
      size = null,
      ignorePagination = false,
    } = filters;

    const response = await axios.get(
      `${moodURL}${API_URL.STUDENT_MOOD_TODAY}`,
      {
        params: {
          sortBy,
          sortAscending,
          page,
          size,
          ignorePagination,
        },
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response || error.message;
  }
};

export const getEmotionImage = (code) => {
  switch (code) {
    case emotionCode.JOY.code:
      return JoyfulImage; // Direct reference to the imported image
    case emotionCode.MOTIVATED.code:
      return MotivatedImage;
    case emotionCode.CALM.code:
      return CalmImage;
    case emotionCode.ANXIOUS.code:
      return AnxiousImage;
    case emotionCode.SAD.code:
      return SadImage;
    case emotionCode.FRUSTRATED.code:
      return FrustratedImage;
    default:
      return logo; // Make sure this is a valid import as well
  }
};