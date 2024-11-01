// hooks/useGlobalState.js
import { useState } from "react";

const useGlobalState = () => {
  const [isRefetch, setIsRefetch] = useState(false);
  const [currentUserDetails, setCurrentUserDetails] = useState("");
  const [selectedStudentDetails, setSelectedStudentDetails] = useState("");
  const [isAppAdmin, setIsAppAdmin] = useState(false);
  const [adminMessages, setAdminMessages] = useState([]);
  const [isMessagesFetch, setIsMessagesFetch] = useState(false);

  return {
    isRefetch,
    setIsRefetch,
    currentUserDetails,
    setCurrentUserDetails,
    isAppAdmin,
    setIsAppAdmin,
    adminMessages,
    setAdminMessages,
    isMessagesFetch,
    setIsMessagesFetch,
    selectedStudentDetails,
    setSelectedStudentDetails,
  };
};

export default useGlobalState;
