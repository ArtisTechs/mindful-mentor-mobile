import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const FullLoaderComponent = ({ isLoading }) => {
  const [visibleSpinners, setVisibleSpinners] = useState([]);
  const [animations] = useState(() =>
    Array.from({ length: 7 }, () => new Animated.Value(0))
  );

  useEffect(() => {
    if (isLoading) {
      setVisibleSpinners([]);

      const delays = [50, 100, 150, 200, 250, 300, 350];

      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleSpinners((prev) => [...prev, index]);

          const animation = Animated.loop(
            Animated.sequence([
              Animated.timing(animations[index], {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(animations[index], {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          );

          animation.start();

          return () => animation.stop();
        }, delay);
      });
    } else {
      setVisibleSpinners([]);
      animations.forEach((animation) => animation.stopAnimation());
    }
  }, [isLoading, animations]);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.loadingOverlay}>
      {Array.from({ length: 7 }).map((_, index) =>
        visibleSpinners.includes(index) ? (
          <Animated.View
            key={index}
            style={[
              styles.spinner,
              {
                opacity: animations[index],
                transform: [
                  {
                    scale: animations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#b4edd8",
    marginHorizontal: 5,
  },
});

export default FullLoaderComponent;
