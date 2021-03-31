import React, {useCallback} from 'react';
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
  const checkTask = () => {

  }
  return (
    <View style={styles.taskCard}>
      <TaskCheckBox checked={task.checked} onCheck={checkTask}/>
      <TouchableOpacity>
        <Text>{task.name}</Text>
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
    paddingBottom: '20',
    justifyContent: 'space-between',
  },
})