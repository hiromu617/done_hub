import React, {useContext} from 'react';
import { SiteContext } from './TodoScreen'
import {View,FlatList,StyleSheet} from 'react-native';
import Task from '../objects/Task';
import TaskCard from './TaskCard';

type Props = {
  tasks: Task[];
}

const TaskList: React.FC<Props> = (props) => {
  const {state} = useContext(SiteContext)
  const {tasks} = props

  return (
    <View  style={styles.taskWrap}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={ tasks}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({item}) => {
          return <TaskCard task={item} />;
        }}
      />
    </View>
  )
}

export default TaskList;

const styles = StyleSheet.create({
  taskWrap: {
    // width: '100%',
    // flex: 1, 
    // alignItems: 'center',
    padding: '20%',
  },
  taskList: {
    width: '100%',
    flex: 1, 
    alignItems: 'center' 
  },
})
