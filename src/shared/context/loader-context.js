// src/shared/context/LoaderContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import FullLoaderComponent from "../../components/full-loading-screen/FullLoaderComponent";
import { initializeLoadingService } from "../services";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  // Initialize loadingService after the provider mounts
  useEffect(() => {
    initializeLoadingService(showLoader, hideLoader);
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      <FullLoaderComponent isLoading={isLoading} />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  return useContext(LoaderContext);
};
