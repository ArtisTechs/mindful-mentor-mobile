import { StyleSheet } from "react-native";
import theme from "../../shared/styles/theme";

const ProfileScreenStyles = StyleSheet.create({
  profilePage: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profileContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "start",
    marginBottom: 30,
  },
  profileDetailsEdit: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginVertical: 4,
  },
  textLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 4,
  },
  textValue: {
    fontSize: 16,
    marginBottom: 12,
  },
  editProfileButton: {
    marginTop: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: "flex-end",
  },
  changeProfileIcon: {
    height: 30,
    width: 30,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: -20,
    left: "30%",
    zIndex: 1000,
  },
  clearProfileIcon: {
    height: 30,
    width: 30,
    backgroundColor: theme.colors.tertiary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: -50,
    left: "65%",
    zIndex: 1000,
  },
  avatarUploadLabel: {
    padding: 10,
    backgroundColor: "#b4edd8",
    borderRadius: 50,
    alignItems: "center",
  },
  avatarContainer: {
    position: "fixed",
    top: 50,
    left: "50%",
    marginLeft: -55,
    zIndex: 999,
  },
  avatar: {
    marginRight: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    left: -15,
    top: -15,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProfileScreenStyles;
