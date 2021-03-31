import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {generateNewTask} from '../TaskUtil';
import TaskList from './TaskList';
import {Task} from '../'

const TodoScreen: React.FC = () => {
  const list: Task[] = [
    {
      id: 12434,
      name: "taskName",
      comment: "taskComment",
      checked: true
    },
    {
      id: 12484,
      name: "taskName2",
      comment: "taskComment2",
      checked: false
    },
  ]

  return (
    <View style={{ width: '100%'}}>
      <TaskList taskList={list}/>
    </View>
  )
}

export default TodoScreen

