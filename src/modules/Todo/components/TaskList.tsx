import React from 'react';
import {View,FlatList,StyleSheet} from 'react-native';
import Task from '../objects/Task';
import TaskCard from './TaskCard';

type Props = {
  taskList: Task[];
}

const TaskList: React.FC<Props> = (props: React.PropsWithChildren<Props>) => {
  const {taskList} = props;
  return (
    <View  style={styles.taskWrap}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={taskList}
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
    width: '100%',
    flex: 1, 
    alignItems: 'center',
    paddingTop: '20%',
  },
  taskList: {
    width: '100%',
    flex: 1, 
    alignItems: 'center' 
  },
})
