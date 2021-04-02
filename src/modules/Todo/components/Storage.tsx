import React, {useReducer,useContext, useState, useEffect} from 'react';
import {Task} from '../'
import AsyncStorage from '@react-native-async-storage/async-storage';

let initialState: Task[] = []

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

export {
  initialState, storeTasks, getTasks
}






