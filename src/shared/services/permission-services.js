import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const requestStoragePermission = async () => {
  // Request permission to access media library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    toastService.show(
      "Permission Required. We need permission to access your photos to change your profile picture.",
      "error"
    );
    return false; // Permission not granted
  }

  return true; // Permission granted
};

export default {
  requestStoragePermission,
};
