import React, {useReducer, useContext, useCallback, useState} from 'react';
import { SiteContext } from './TodoScreen'
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import Task from '../objects/Task';
import TaskCheckBox from './TaskCheckBox';
import {
  reflectDeleteToList,
  reflectEditToList,
} from '../TaskUtil';
import {Alert} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import CheckTaskModal from './CheckTaskModal'
import { Button, Overlay } from 'react-native-elements';



type Props = {
  task: Task;
}

const TaskCard: React.FC<Props> = (props) => {
  const {task} = props;
  const { dispatch } = useContext(SiteContext);
  const onPressTask = () => {
  }
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const checkTask = useCallback(
    () => {
      if(task.checked) return
      
      setModalVisible(!isModalVisible);
      // dispatch({type: 'checked', id: task.id})
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
    <View>
      <Overlay
         isVisible={isModalVisible}
         onBackdropPress={toggleModal}
         overlayStyle={{width: '80%'}}
        >
          <CheckTaskModal CloseModal={toggleModal} TaskObj={task}></CheckTaskModal>
        </Overlay>
      <View style={styles.taskCard}>
        <TaskCheckBox checked={task.checked} onCheck={checkTask}/>
        <TouchableOpacity onPress={onPressTask}>
          <Text>{task.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={deleteTask} 
        >
          <AntDesign name="close" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
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
    padding: '1%',
    marginBottom: '1%',
    justifyContent: 'space-between',
    // borderWidth: 2,
    // borderRadius: 10,
    // borderColor: 'grey'
  },
})