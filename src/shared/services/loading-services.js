let loadingServiceInstance = {
  show: () => {},
  hide: () => {},
};

export const initializeLoadingService = (showLoader, hideLoader) => {
  loadingServiceInstance.show = showLoader;
  loadingServiceInstance.hide = hideLoader;
};

export const loadingService = loadingServiceInstance;
