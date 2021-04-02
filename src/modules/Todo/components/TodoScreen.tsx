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
      storeTasks(checkedState)
      return checkedState
    case 'delete':
      let deletedState = []
      for(let i = 0; i < state.length; i++){
        if(state[i].id !== action.id) deletedState.push(state[i])
      }
      storeTasks(deletedState)
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
      storeTasks(state)
      return state
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
  const [tasksData, setData] = useState(initialState);

  useEffect(() => {
    // console.log(getTasks())
    getTasks().then((data) => {
      console.log(data)
      setData(data);
    })
  });
  return (
    <SiteProvider>
        <Modal
         isVisible={isModalVisible}
         hasBackdrop={true}
        >
          <ModalContent CloseModal={toggleModal}></ModalContent>
        </Modal>

      <View style={{ flex: 1, justifyContent: 'center'}}>
        <TaskList tasks={tasksData}/>

        <CircleBtn onPressBtn={toggleModal}></CircleBtn>
      </View>
    </SiteProvider>
  )
}

export default TodoScreen


