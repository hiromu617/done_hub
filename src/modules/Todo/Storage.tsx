import React, {useReducer,useContext, useState, useEffect} from 'react';
import {Task} from '.'
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../Profile/objects/User'
let initialState: Task[] = []

const storeTasks = async (tasks: Task[]) => {
  try {
    const jsonValue = JSON.stringify(tasks)
    // console.log(jsonValue)
    await AsyncStorage.setItem('@tasks_Key', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }
}
const getTasks = async () => {
  try {
    const value = await AsyncStorage.getItem('@tasks_Key')
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

const storeUser = async (user: User) => {
  await AsyncStorage.removeItem('@user_Key')
  try {
    const jsonValue = JSON.stringify(user)
    console.log(jsonValue)
    await AsyncStorage.setItem('@user_Key', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }
}
const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('@user_Key')
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
  initialState, storeTasks, getTasks, storeUser, getUser
}






