import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { emotionCode, getEmotionImage } from "../../shared";

const BarGraphEmotion = ({ students }) => {
  const graphWidth = 320; // Set a fixed width for the chart
  const chartHeight = 250;
  const { width } = Dimensions.get("window"); // Get screen width

  // Extract emotion list dynamically
  const emotions = Object.values(emotionCode) || [];

  // Count occurrences of each emotion
  const emotionCounts = emotions.reduce((acc, emotion) => {
    acc[emotion.code] = 0; // Initialize count
    return acc;
  }, {});

  // Ensure students is an array
  if (!Array.isArray(students)) {
    console.error("Expected 'students' to be an array, but got:", students);
  }

  students.forEach(({ moodCode }) => {
    if (moodCode && emotionCounts[moodCode] !== undefined) {
      emotionCounts[moodCode] += 1; // Increment count for each student with that mood
    }
  });

  // Prepare data for the graph
  const labels =
    emotions && emotions.length > 0
      ? emotions.map((emotion) => emotion.description.slice(0, 3)) // Get first 3 letters
      : [];
  const data =
    emotions && emotions.length > 0
      ? emotions.map((emotion) => emotionCounts[emotion.code])
      : [];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        colors: [
          (opacity = 1) => `rgba(235, 255, 0, ${opacity})`, // Joy
          (opacity = 1) => `rgba(0, 255, 10, ${opacity})`, // Motivated
          (opacity = 1) => `rgba(0, 56, 255, ${opacity})`, // Calm
          (opacity = 1) => `rgba(255, 184, 0, ${opacity})`, // Anxious
          (opacity = 1) => `rgba(103, 130, 171, ${opacity})`, // Sad
          (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Frustrated
        ],
      },
    ],
  };

  // Graph config
  const chartConfig = {
    backgroundColor: "#b4edd8",
    backgroundGradientFrom: "#b4edd8",
    backgroundGradientTo: "#b4edd8",
    color: () => `rgba(0, 56, 255, 1)`, // Solid color for bars
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for labels
    barPercentage: 0.5, // Adjust bar width to prevent label overlap
    useShadowColorFromDataset: false,
    decimalPlaces: 1, // No decimal places
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Emotions Bar Graph</Text>
      <BarChart
        data={chartData}
        width={graphWidth} // Fixed width for the chart
        height={chartHeight}
        yAxisLabel=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        showValuesOnTopOfBars={true}
        fromZero
      />
      {/* Displaying icons below the chart */}
      <View style={[styles.iconContainer, { width: graphWidth }]}>
        {emotions.map((emotion, index) => (
          <View
            key={emotion.code}
            style={[
              styles.iconWrapper,
              { width: graphWidth / emotions.length },
            ]}
          >
            <Image source={getEmotionImage(emotion.code)} style={styles.icon} />
            <Text style={styles.iconLabel}>{emotion.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#b4edd8",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 20, // Smaller width for icons
    height: 20, // Smaller height for icons
    marginBottom: 5,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default BarGraphEmotion;
