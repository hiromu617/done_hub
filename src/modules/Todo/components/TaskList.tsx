import React, { useContext, useState, useEffect } from "react";
import { SiteContext } from "./TodoScreen";
import { Text, View, FlatList, StyleSheet } from "react-native";
import Task from "../objects/Task";
import TaskCard from "./TaskCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, ListItem, Button, Icon } from "react-native-elements";

const getTasks = async () => {
  try {
    const value = await AsyncStorage.getItem("@tasks_Key");
    if (value !== null) {
      // value previously stored
    }
    let tasksState = JSON.parse(value);
    return tasksState;
  } catch (e) {
    // error reading value
    return "error";
  }
};
const TaskList: React.FC = () => {
  const { state } = useContext(SiteContext);
  // console.log(state)
  const [tasksData, setTask] = useState();
  // console.log(tasksData)
  useEffect(() => {
    getTasks().then((data) => {
      // console.log(data)
      setTask(data);
    });
  }, [state]);

  return (
    <Card>
      <Card.Title>
        TODO LIST {new Date().getMonth() + 1}/{new Date().getDate()}
      </Card.Title>
      <Card.Divider />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={tasksData}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <TaskCard task={item} />
              <Card.Divider />
            </View>
          );
        }}
      />
    </Card>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  taskWrap: {
    // width: '100%',
    // flex: 1,
    // alignItems: 'center',
    padding: "5%",
  },
  taskList: {
    width: "100%",
    flex: 1,
    // alignItems: 'center'
  },
});
