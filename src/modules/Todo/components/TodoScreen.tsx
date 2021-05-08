import React, { useReducer, useState, useEffect, useContext } from "react";
import { View, SafeAreaView, Text } from "react-native";
import TaskList from "./TaskList";
import { Task } from "../";
import CircleBtn from "./CircleBtn";
import ShareBtn from "./ShareBtn";
import ModalContent from "./ModalContent";
import ShareModal from "./ShareModal";
import Modal from "react-native-modal";
import { initialState, storeTasks, getTasks } from "../Storage";
import reducer from "../Reducer";
import { Button, Overlay } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AdMobBanner } from "expo-ads-admob";

export const SiteContext = React.createContext({});

const SiteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SiteContext.Provider value={{ state, dispatch }}>
      {children}
    </SiteContext.Provider>
  );
};

const TodoScreen: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleShareModal = () => {
    setShareModalVisible(!isShareModalVisible);
  };

  return (
    <SiteProvider>
      <StatusBar style="dark" />
      <View style={{ position: "absolute", top: "6%" }}>
        <AdMobBanner
          style={{ width: "100%" }}
          adUnitID="ca-app-pub-2508838902910991/8671220332" // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds // true or false
        />
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        animationIn="zoomInUp"
        animationOut="zoomOut"
        avoidKeyboard
      >
        <ModalContent CloseModal={toggleModal}></ModalContent>
      </Modal>

      <Modal
        isVisible={isShareModalVisible}
        onBackdropPress={toggleShareModal}
        animationIn="zoomInUp"
        animationOut="zoomOut"
        avoidKeyboard
      >
        <ShareModal CloseModal={toggleShareModal}></ShareModal>
      </Modal>

      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <TaskList />

        <ShareBtn onPressBtn={toggleShareModal} />
        <CircleBtn onPressBtn={toggleModal}></CircleBtn>
      </SafeAreaView>
    </SiteProvider>
  );
};

export default TodoScreen;
