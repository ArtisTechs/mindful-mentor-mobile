import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { daysOfWeek, daysOfWeekShort, emotionCode } from "../../shared";
import JoyfulImage from "../../assets/img/Joyful.png";
import MotivatedImage from "../../assets/img/Motivated.png";
import CalmImage from "../../assets/img/Calm.png";
import AnxiousImage from "../../assets/img/Anxious.png";
import SadImage from "../../assets/img/Sad.png";
import FrustratedImage from "../../assets/img/Frustrated.png";
import logo from "../../assets/img/mindful-mentor-logo.png";
import theme from "../../shared/styles/theme";

const CalendarComponent = ({ data, onDateRangeChange }) => {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLegendVisible, setLegendVisible] = useState(false);

  const toggleLegend = () => setLegendVisible(!isLegendVisible);

  const getDateRange = useCallback(() => {
    let start, end;
    if (view === "month") {
      start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      start = new Date(startOfWeek);
      end = new Date(startOfWeek);
      end.setDate(startOfWeek.getDate() + 6);
    }
    onDateRangeChange(start, end);
    return { start, end };
  }, [currentDate, view, onDateRangeChange]);

  useEffect(() => {
    getDateRange();
  }, [getDateRange]);

  const handlePrev = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(currentDate.setMonth(currentDate.getMonth() - 1))
      );
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(currentDate.setMonth(currentDate.getMonth() + 1))
      );
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const startDay = firstDay.getDay();
    const daysToDisplay = Array(startDay).fill(null).concat(days);

    const endDay = lastDay.getDay();
    if (endDay < 6) {
      daysToDisplay.push(...Array(6 - endDay).fill(null));
    }

    return daysToDisplay;
  };

  const getDayColor = (day) => {
    const dateStr = new Date(day.getTime() - day.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    const entry = data.find((data) => data.date.startsWith(dateStr));
    if (entry) {
      switch (entry.mood.code) {
        case emotionCode.JOY.code:
          return styles.yellow;
        case emotionCode.MOTIVATED.code:
          return styles.green;
        case emotionCode.CALM.code:
          return styles.blue;
        case emotionCode.ANXIOUS.code:
          return styles.orange;
        case emotionCode.SAD.code:
          return styles.gray;
        case emotionCode.FRUSTRATED.code:
          return styles.red;
        default:
          return styles.default;
      }
    }
    return styles.default;
  };

  const getEmotionImage = (moodCode) => {
    switch (moodCode) {
      case emotionCode.JOY.code:
        return JoyfulImage;
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
        return logo;
    }
  };

  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  };

  const renderDays = () => {
    const days =
      view === "month"
        ? getDaysInMonth(currentDate)
        : getDaysInWeek(currentDate);

    return days.map((day, index) => {
      if (day) {
        const dateStr = new Date(
          day.getTime() - day.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        const entry = data.find((data) => data.date.startsWith(dateStr));

        return (
          <View
            key={index}
            style={[
              view === "month"
                ? styles.monthDayContainer
                : styles.weekDayContainer,
              getDayColor(day),
            ]}
          >
            <Text style={styles.dayNumber}>{day.getDate()}</Text>
            {view === "week" && (
              <>
                <Text style={styles.dayName}>{daysOfWeek[day.getDay()]}</Text>
                {entry && (
                  <View style={styles.emotionInfo}>
                    <Text style={styles.emotionDescription}>
                      {entry.mood.description}
                    </Text>
                    <Image
                      source={getEmotionImage(entry.mood.code)}
                      style={styles.emotionIcon}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        );
      } else {
        return <View key={index} style={styles.emptyDay}></View>;
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewControls}>
        <TouchableOpacity
          style={view === "month" ? styles.activeButton : styles.button}
          onPress={() => setView("month")}
        >
          <Text
            style={
              view === "month" ? styles.activeButtonText : styles.buttonText
            }
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={view === "week" ? styles.activeButton : styles.button}
          onPress={() => setView("week")}
        >
          <Text
            style={
              view === "week" ? styles.activeButtonText : styles.buttonText
            }
          >
            Weekly
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {currentDate.toLocaleString("default", {
            year: "numeric",
            month: "long",
          })}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={toggleLegend}
            style={styles.controlButtonLegend}
          >
            <Text>?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrev} style={styles.controlButton}>
            <Text>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToday} style={styles.controlButton}>
            <Text>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
            <Text>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {view === "month" && (
        <View style={styles.dayIndicatorContainer}>
          {daysOfWeekShort.map((day, index) => (
            <Text key={index} style={styles.dayIndicator}>
              {day}
            </Text>
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={
          view === "month"
            ? styles.monthViewContainer
            : styles.weekViewContainer
        }
      >
        {renderDays()}
      </ScrollView>

      <Modal isVisible={isLegendVisible} onBackdropPress={toggleLegend}>
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Mood Colors</Text>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, styles.yellow]} />
            <Text>Joyful</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, styles.green]} />
            <Text>Motivated</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, styles.blue]} />
            <Text>Calm</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, styles.orange]} />
            <Text>Anxious</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, styles.gray]} />
            <Text>Sad</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, styles.red]} />
            <Text>Frustrated</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  viewControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "black",
  },
  activeButtonText: {
    color: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
  },
  controlButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  controlButtonLegend: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
    height: 35,
    width: 35,
    alignItems: "center",
  },
  dayIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayIndicator: {
    width: "13%",
    textAlign: "center",
    fontWeight: "bold",
  },
  monthViewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  weekViewContainer: {
    flexDirection: "column",
  },
  monthDayContainer: {
    width: "13%",
    height: "13%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 10,
  },
  weekDayContainer: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  dayNumber: {
    fontSize: 16,
  },
  dayName: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  emptyDay: {
    width: "13%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  yellow: { backgroundColor: "#ebff00" },
  green: { backgroundColor: "#00ff0a" },
  blue: { backgroundColor: "#0038ff" },
  orange: { backgroundColor: "#ffb800" },
  gray: { backgroundColor: "#6782ab" },
  red: { backgroundColor: "#ff0000" },
  default: { backgroundColor: "white" },
  emotionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  emotionDescription: {
    fontSize: 12,
    marginRight: 10,
  },
  emotionIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  legendContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default CalendarComponent;
