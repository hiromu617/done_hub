import React, {useReducer,useContext, useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {generateNewTask} from '../TaskUtil';
import TaskList from './TaskList';
import {Task} from '../'
import CircleBtn from './CircleBtn'
import ModalContent from './ModalContent'
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 

let initialState: Task[] = [
  {
    id: 12434,
    name: "taskName",
    comment: "taskComment",
    checked: false
  },
  {
    id: 12484,
    name: "taskName2",
    comment: "taskComment2",
    checked: false
  },
]

function reducer(state, action) {
  switch (action.type) {
    case 'checked':
      // alert(action.id)
      let checkedState = state.slice()
      checkedState.map((t) => {
        if(t.id === action.id) t.checked = !t.checked
      })
      return checkedState
    case 'delete':
      let deletedState = []
      for(let i = 0; i < state.length; i++){
        if(state[i].id !== action.id) deletedState.push(state[i])
      }
      return deletedState
    case 'create':
      let uniqueId: number = generateRandomNumber(10000)
      while(state.find((t) => t.id === uniqueId) !== undefined){
        uniqueId = generateRandomNumber(10000)
      }
      let newTask :Task = {
        id: uniqueId,
        name: action.data.name,
        comment: action.data.comment,
        checked: false
      }
      state.push(newTask)
      return state
    default : 
      return state
  }
}

const generateRandomNumber = (range: number): number => {
  return Math.floor(Math.random() * range);
};

export const SiteContext = React.createContext(null);

const SiteProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <SiteContext.Provider value={{state, dispatch}}>
    {children}
  </SiteContext.Provider>
}

const TodoScreen: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(true);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SiteProvider>
        <Modal
         isVisible={isModalVisible}
         hasBackdrop={true}
        >
          <ModalContent CloseModal={toggleModal}></ModalContent>
        </Modal>

      <View style={{ flex: 1, justifyContent: 'center'}}>
        <TaskList/>

        <CircleBtn onPressBtn={toggleModal}></CircleBtn>
      </View>
    </SiteProvider>
  )
}

export default TodoScreen


