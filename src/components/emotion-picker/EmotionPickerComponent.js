import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import JoyfulImage from "../../assets/img/Joyful.png";
import MotivatedImage from "../../assets/img/Motivated.png";
import CalmImage from "../../assets/img/Calm.png";
import AnxiousImage from "../../assets/img/Anxious.png";
import SadImage from "../../assets/img/Sad.png";
import FrustratedImage from "../../assets/img/Frustrated.png";
import {
  addMood,
  getMoods,
  emotionCode,
  updateMoodById,
  useGlobalContext,
  toastService,
  EErrorMessages,
} from "../../shared";

const emotions = [
  { image: JoyfulImage, ...emotionCode.JOY },
  { image: MotivatedImage, ...emotionCode.MOTIVATED },
  { image: CalmImage, ...emotionCode.CALM },
  { image: AnxiousImage, ...emotionCode.ANXIOUS },
  { image: SadImage, ...emotionCode.SAD },
  { image: FrustratedImage, ...emotionCode.FRUSTRATED },
];

const EmotionPicker = () => {
  const { currentUserDetails } = useGlobalContext();
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [todayMoodId, setTodayMoodId] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    const adjustedDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    );
    return adjustedDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    // Only fetch mood if currentUserDetails exists
    if (currentUserDetails) {
      const fetchUserMood = async () => {
        const today = getTodayDate();
        try {
          const moods = await getMoods({
            userId: currentUserDetails?.id,
            startDate: today,
            endDate: today,
          });

          if (moods.length > 0) {
            const todayMood = moods[0];
            setSelectedEmotion(todayMood.mood.description);
            setTodayMoodId(todayMood.id);
          } else {
            // Reset mood state if no moods found
            setSelectedEmotion(null);
            setTodayMoodId(null);
          }
        } catch (error) {
          toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
        }
      };

      fetchUserMood();
    } else {
      // Reset mood state if user details are not present
      setSelectedEmotion(null);
      setTodayMoodId(null);
    }
  }, [currentUserDetails]);

  const handleEmotionClick = async (emotion) => {
    setSelectedEmotion(emotion.description);

    const moodDetails = {
      userId: currentUserDetails?.id,
      date: getTodayDate(),
      mood: {
        code: emotion.code,
        description: emotion.description,
      },
    };

    try {
      if (todayMoodId) {
        await updateMoodById(todayMoodId, moodDetails);
        toastService.show(
          `Mood updated to "${moodDetails.mood.description}".`,
          "success"
        );
      } else {
        await addMood(moodDetails);
        toastService.show(
          `Mood set to "${moodDetails.mood.description}".`,
          "success"
        );
      }
    } catch (error) {
      toastService.show(EErrorMessages.CONTACT_ADMIN, "error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How are you feeling today?</Text>
      <View style={styles.emotionList}>
        {emotions.map((emotion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion.description && styles.selected,
            ]}
            onPress={() => handleEmotionClick(emotion)}
          >
            <Image source={emotion.image} style={styles.emotionImage} />
            <Text style={styles.emotionName}>{emotion.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emotionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emotionButton: {
    alignItems: "center",
    margin: 15,
    transform: [{ scale: 1 }],
  },
  emotionImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 5,
  },
  emotionName: {
    fontSize: 14,
    color: "black",
  },
  selected: {
    transform: [{ scale: 1.3 }],
    fontWeight: "bold",
  },
});

export default EmotionPicker;
