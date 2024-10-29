import { StyleSheet, Dimensions } from "react-native";

const { width: viewportWidth } = Dimensions.get("window");

const GetStartedScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    width: viewportWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: viewportWidth * 0.8,
    height: viewportWidth * 0.8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#b4edd8",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  navigationContainer: {
    position: "absolute",
    top: "50%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  arrowButton: {
    backgroundColor: "#b1abab",
    borderRadius: 20,
    padding: 10,
  },
  arrowText: {
    color: "white",
    fontSize: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#b4edd8",
  },
  inactiveDot: {
    backgroundColor: "#b1abab",
  },
});

export default GetStartedScreenStyle;
