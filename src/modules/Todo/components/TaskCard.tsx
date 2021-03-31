import React, {useReducer, useContext, useCallback} from 'react';
import { SiteContext } from './TodoScreen'
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import Task from '../objects/Task';
import TaskCheckBox from './TaskCheckBox';
import {
  reflectDeleteToList,
  reflectEditToList,
} from '../TaskUtil';
import {Alert} from 'react-native';

type Props = {
  task: Task;
}

const TaskCard: React.FC<Props> = (props) => {
  const {task} = props;
  const { dispatch } = useContext(SiteContext);
  const onPressTask = () => {
    dispatch({type: 'checked', id: task.id})
  }
  const checkTask = useCallback(
    () => {
      dispatch({type: 'checked', id: task.id})
    },
    [task],
  );
  const deleteTask = useCallback(
    () => {
      dispatch({type: 'delete', id: task.id})
    },
    [],
  )
  return (
    <View style={styles.taskCard}>
      <TaskCheckBox checked={task.checked} onCheck={checkTask}/>
      <TouchableOpacity onPress={onPressTask}>
        <Text>{task.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteTask}>
        <Text>削除</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TaskCard

const styles = StyleSheet.create({
  taskCard: {
    width: '100%',
    height: '100%',
    flex: 1, 
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: '10%',
    justifyContent: 'space-between',
  },
})