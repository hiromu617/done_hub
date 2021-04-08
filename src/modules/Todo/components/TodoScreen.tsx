import React, {useReducer, useState} from 'react';
import { View,SafeAreaView } from 'react-native';
import TaskList from './TaskList';
import {Task} from '../'
import CircleBtn from './CircleBtn'
import ModalContent from './ModalContent'
import Modal from 'react-native-modal';
import { initialState, storeTasks, getTasks } from '../Storage'
import reducer from '../Reducer'
import { Button, Overlay } from 'react-native-elements';

export const SiteContext = React.createContext(null);

const SiteProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <SiteContext.Provider value={{state, dispatch}}>
    {children}
  </SiteContext.Provider>
}

const TodoScreen: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
 
  return (
    
    <SiteProvider>
        <Overlay
         isVisible={isModalVisible}
         onBackdropPress={toggleModal}
         overlayStyle={{width: '80%'}}
        >
          <ModalContent CloseModal={toggleModal}></ModalContent>
        </Overlay>

      <SafeAreaView style={{ flex: 1, justifyContent: 'center'}}>
        <TaskList/>

        <CircleBtn onPressBtn={toggleModal}></CircleBtn>
      </SafeAreaView>
    </SiteProvider>
  )
}

export default TodoScreen


