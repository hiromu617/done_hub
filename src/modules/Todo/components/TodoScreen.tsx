import React, {useReducer,useContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {generateNewTask} from '../TaskUtil';
import TaskList from './TaskList';
import {Task} from '../'

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
    default : 
      return state
  }
}

export const SiteContext = React.createContext();

const SiteProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <SiteContext.Provider value={{state, dispatch}}>
    {children}
  </SiteContext.Provider>
}

const TodoScreen: React.FC = () => {
  return (
    <SiteProvider>
      <View style={{ width: '100%'}}>
        <TaskList/>
      </View>
    </SiteProvider>
  )
}

export default TodoScreen

