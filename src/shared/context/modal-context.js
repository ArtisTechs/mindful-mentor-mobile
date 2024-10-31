// ModalContext.js
import React, { createContext, useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { modalService } from "../services";
import theme from "../styles/theme";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const showModal = (props) => {
    setModalProps(props);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalProps({});
  };

  // Register the callbacks
  modalService.registerShowModalCallback(showModal);
  modalService.registerHideModalCallback(hideModal);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{modalProps.title}</Text>
            <Text style={styles.message}>{modalProps.message}</Text>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: modalProps.confirmButtonColor || theme.colors.primary },
              ]} // Default blue color
              onPress={() => {
                if (modalProps.onConfirm) {
                  modalProps.onConfirm();
                }
                hideModal();
              }}
            >
              <Text style={styles.buttonText}>
                {modalProps.confirmText || "OK"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                if (modalProps.onCancel) {
                  modalProps.onCancel();
                }
                hideModal();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: theme.colors.tertiary, // Red color for cancel button
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

// Custom hook to use modal context
export const useModal = () => {
  return useContext(ModalContext);
};
