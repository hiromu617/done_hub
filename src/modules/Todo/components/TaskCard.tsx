import React, { useReducer, useContext, useCallback, useState } from "react";
import { SiteContext } from "./TodoScreen";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Task from "../objects/Task";
import TaskCheckBox from "./TaskCheckBox";
import { reflectDeleteToList, reflectEditToList } from "../TaskUtil";
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CheckTaskModal from "./CheckTaskModal";
import { Button, Overlay, Icon } from "react-native-elements";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";

type Props = {
  task: Task;
};

const TaskCard: React.FC<Props> = (props) => {
  const { task } = props;
  const { dispatch } = useContext(SiteContext);
  const onPressTask = () => {};
  const [isModalVisible, setModalVisible] = useState(false);
  const [dateState, setDateState] = useState(() => {
    if (
      new Date(Date.now()) > new Date(task.expired) &&
      new Date(Date.now()).getDate() != new Date(task.expired).getDate()
    ) {
      return "expired";
    } else if (
      new Date(Date.now()).getDate() == new Date(task.expired).getDate()
    ) {
      return "today";
    } else {
      return "notExpired";
    }
  });
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const checkTask = useCallback(() => {
    if (task.checked) return;

    setModalVisible(!isModalVisible);
    // dispatch({type: 'checked', id: task.id})
  }, [task]);
  const deleteTask = useCallback(() => {
    Alert.alert("タスクの削除", "本当に削除してもよろしいですか？", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch({ type: "delete", id: task.id });
          Toast.show("タスクを削除しました", {
            position: 50,
          });
        },
      },
    ]);
  }, []);

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        animationIn="zoomInUp"
        animationOut="zoomOut"
        avoidKeyboard
      >
        <CheckTaskModal
          CloseModal={toggleModal}
          TaskObj={task}
        ></CheckTaskModal>
      </Modal>
      <View style={styles.taskCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TaskCheckBox checked={task.checked} onCheck={checkTask} />
          {/* {task.expired && (
            <Text style={{ color: "#1F2937" }}>
              ~{new Date(task.expired).getMonth() + 1}/
              {new Date(task.expired).getDate()}
            </Text>
          )} */}
        </View>
        <TouchableOpacity onPress={onPressTask} style={{ maxWidth: "65%", paddingHorizontal: 5 }}>
          <Text style={{ color: "#1F2937", fontWeight: 'bold', fontSize: 18 }}>{task.name}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={deleteTask}>
          <AntDesign name="close" size={24} color="#EF4444" />
        </TouchableOpacity> */}
        {task.expired && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="clock"
              type="font-awesome-5"
              size={12}
              color={dateState == "expired" ? "red" : "#6B7280"}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                color: dateState == "expired" ? "red" : "#6B7280",
                fontSize: 12,
              }}
            >
              {dateState == "expired" && <Text>expired</Text>}
              {dateState == "today" && <Text style={{fontWeight: 'bold'}}>Today</Text>}
              {dateState == "notExpired" && (
                <Text>
                  Due on {new Date(task.expired).getMonth() + 1}/
                  {new Date(task.expired).getDate()}
                </Text>
              )}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  taskCard: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    padding: "1%",
    marginBottom: "1%",
    justifyContent: "space-between",
    // borderWidth: 2,
    // borderRadius: 10,
    // borderColor: 'grey'
  },
});
