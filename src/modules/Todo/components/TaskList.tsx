import React, { useContext, useState, useEffect, useCallback } from "react";
import { SiteContext } from "./TodoScreen";
import {
  Alert,
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Task from "../objects/Task";
import TaskCard from "./TaskCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-root-toast";

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
  const { state, dispatch } = useContext(SiteContext);
  // console.log(state)
  const [tasksData, setTask] = useState();
  // console.log(tasksData)
  useEffect(() => {
    getTasks().then((data) => {
      console.log(data);
      data.sort(function (a, b) {
        if (a.expired < b.expired) return -1;
        if (a.expired > b.expired) return 1;
        return 0;
      });
      // let newData = data.filter((t) => new Date(t.expired) > new Date())
      setTask(data);
    });
  }, [state]);

  const deleteTask = useCallback((id) => {
    Alert.alert("タスクの削除", "本当に削除してもよろしいですか？", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch({ type: "delete", id: id });
          Toast.show("タスクを削除しました", {
            position: 50,
          });
        },
      },
    ]);
  }, []);

  return (
    <View
      style={{
        // backgroundColor: "white",
        position: "absolute",
        top: "14%",
        bottom: "12%",
        width: "100%",
      }}
    >
      <View style={{ padding: 15 }}>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#3B82F6",
            fontSize: 22,
          }}
        >
          All Tasks
        </Text>
      </View>
      <SwipeListView
        useFlatList={true}
        // style={{
        //   backgroundColor: "white",
        //   position: "absolute",
        //   top: "14%",
        //   bottom: "12%",
        //   width: "100%",
        // }}
        // ListHeaderComponent={
        //   <View style={{ padding: 20 }}>
        //     <Text
        //       style={{
        //         textAlign: "center",
        //         fontWeight: "bold",
        //         color: "#374151",
        //         fontSize: 20
        //       }}
        //       >
        //       All Tasks
        //     </Text>
        //   </View>
        // }
        ListFooterComponent={<Card.Divider />}
        ListEmptyComponent={
          <View style={{ padding: 10 }}>
            <Card.Divider />
            <Text style={{ textAlign: "center", color: "#374151" }}>
              No Tasks
            </Text>
          </View>
        }
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <View></View>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              // style={{ height: "100%", backgroundColor: "red" }}
              onPress={() => deleteTask(data.item.id)}
            >
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        leftOpenValue={0}
        showsVerticalScrollIndicator={false}
        data={tasksData}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return (
            <View style={{ backgroundColor: "white" }}>
              <Card.Divider />
              <TaskCard task={item} />
            </View>
          );
        }}
      />
    </View>
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
  rowBack: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "#EF4444",
    right: 0,
  },
});
