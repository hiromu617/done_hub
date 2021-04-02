import React, {useReducer,useContext, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {generateNewTask} from '../TaskUtil';
import TaskList from './TaskList';
import {Task} from '../'
import CircleBtn from './CircleBtn'
import ModalContent from './ModalContent'
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

let initialState: Task[] = []

function reducer(state, action) {
  switch (action.type) {
    case 'checked':
      // alert(action.id)
      let checkedState = state.slice()
      checkedState.map((t) => {
        if(t.id === action.id) t.checked = !t.checked
      })
      storeTasks(checkedState)
      return checkedState
    case 'delete':
      let copy = state.slice()
      let newDeletedState = []
      for(let i = 0; i < state.length; i++){
        if(copy[i].id !== action.id) newDeletedState.push(copy[i])
      }
      storeTasks(newDeletedState)
      return newDeletedState
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
      let newState = state.slice()
      newState.push(newTask)
      storeTasks(newState)
      return newState
    default : 
      return state
  }
}
const storeTasks = async (tasks: Task[]) => {
  try {
    const jsonValue = JSON.stringify(tasks)
    console.log(jsonValue)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }
}
const getTasks = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      // value previously stored
    }
    let tasksState = JSON.parse(value)
    return tasksState
  } catch(e) {
    // error reading value
    return 'error'
  }
}
const generateRandomNumber = (range: number): number => {
  return Math.floor(Math.random() * range);
};

export const SiteContext = React.createContext(null);

const SiteProvider = ({children}) => {
  let loadedState: Task[];
  
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


