import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import GetStartedScreenStyle from "./GetStartedScreenStyles";
import {
  ESuccessMessages,
  getUserDetails,
  RoleEnum,
  STORAGE_KEY,
  toastService,
  useGlobalContext,
} from "../../shared";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: viewportWidth } = Dimensions.get("window");

const carouselItems = [
  {
    title: "Welcome to Mindful Mentor",
    description: "A place to help your mental wellness.",
    image: require("../../assets/img/carousel-1.png"),
  },
  {
    title: "Track Your Mood",
    description: "Easily log your emotions and get insights.",
    image: require("../../assets/img/carousel-2.png"),
  },
  {
    title: "Live Chat",
    description: "Instantly connect with counselors for real-time support.",
    image: require("../../assets/img/carousel-3.png"),
  },
  {
    title: "Appointments",
    description: "Schedule one-on-one sessions with school counselors.",
    image: require("../../assets/img/carousel-4.png"),
  },
];

// Memoized carousel item to prevent unnecessary re-renders
const CarouselItem = React.memo(({ item }) => (
  <View style={GetStartedScreenStyle.slide}>
    <Image
      source={item.image}
      style={GetStartedScreenStyle.image}
      resizeMode="contain"
    />
    <Text style={GetStartedScreenStyle.title}>{item.title}</Text>
    <Text style={GetStartedScreenStyle.description}>{item.description}</Text>
  </View>
));

const GetStartedScreen = ({
  navigation,
  setFullLoadingHandler,
  onLoginSuccess,
  handleLogout,
}) => {
  const {
    currentUserDetails,
    setCurrentUserDetails,
    setIsAppAdmin,
    setAdminMessages,
    setIsMessagesFetch,
  } = useGlobalContext();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Create a large array for looping effect
  const infiniteData = [...carouselItems, ...carouselItems, ...carouselItems];
  const centerIndex = carouselItems.length;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const profileID = await AsyncStorage.getItem(STORAGE_KEY.PROFILE_ID);
        const role = await AsyncStorage.getItem(STORAGE_KEY.ROLE);
        console.log("profileID", profileID);

        if (profileID) {
          setIsAppAdmin(role === RoleEnum.COUNSELOR);

          const storedProfile = await getUserDetails(profileID);
          onLoginSuccess(storedProfile);
        }
      } catch (error) {
        console.error("Error fetching user details", error);
      } finally {
        setFullLoadingHandler(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    flatListRef.current.scrollToIndex({ index: centerIndex, animated: false });
    setActiveIndex(centerIndex);
  }, []);

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  const handleNext = useCallback(() => {
    if (activeIndex < infiniteData.length - 1) {
      flatListRef.current.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex((prevIndex) => prevIndex + 1);
    }
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      flatListRef.current.scrollToIndex({ index: activeIndex - 1 });
      setActiveIndex((prevIndex) => prevIndex - 1);
    }
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setActiveIndex(index);

      // Adjust to the center set when scrolling ends
      if (index === 0) {
        flatListRef.current.scrollToIndex({
          index: centerIndex,
          animated: false,
        });
        setActiveIndex(centerIndex);
      } else if (index === infiniteData.length - 1) {
        flatListRef.current.scrollToIndex({
          index: centerIndex - 1,
          animated: false,
        });
        setActiveIndex(centerIndex - 1);
      }
    }
  }).current;

  const renderCarouselItem = useCallback(
    ({ item }) => <CarouselItem item={item} />,
    []
  );

  return (
    <View style={GetStartedScreenStyle.container}>
      <View style={GetStartedScreenStyle.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={infiniteData}
          renderItem={renderCarouselItem}
          keyExtractor={(item, index) => `${item.title}-${index}`} // Unique keys
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          initialScrollIndex={centerIndex}
          getItemLayout={(data, index) => ({
            length: viewportWidth,
            offset: viewportWidth * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
        <View style={GetStartedScreenStyle.navigationContainer}>
          <TouchableOpacity
            onPress={handlePrev}
            style={GetStartedScreenStyle.arrowButton}
          >
            <Text style={GetStartedScreenStyle.arrowText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={GetStartedScreenStyle.arrowButton}
          >
            <Text style={GetStartedScreenStyle.arrowText}>{">"}</Text>
          </TouchableOpacity>
        </View>
        <View style={GetStartedScreenStyle.paginationContainer}>
          {carouselItems.map((_, index) => (
            <View
              key={index}
              style={[
                GetStartedScreenStyle.dot,
                activeIndex % carouselItems.length === index
                  ? GetStartedScreenStyle.activeDot
                  : GetStartedScreenStyle.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={GetStartedScreenStyle.button}
        onPress={handleGetStarted}
      >
        <Text style={GetStartedScreenStyle.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStartedScreen;
