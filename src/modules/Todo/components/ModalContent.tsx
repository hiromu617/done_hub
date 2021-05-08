import React, { useReducer, useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import TaskForm from "../objects/TaskForm";
import { useForm, Controller } from "react-hook-form";
import { SiteContext } from "./TodoScreen";
import { AntDesign } from "@expo/vector-icons";
import { Input, Button, Icon } from "react-native-elements";
import Toast from "react-native-root-toast";

type Props = {
  CloseModal: () => void;
};

const ModalContent: React.FC<Props> = (props) => {
  const { CloseModal } = props;
  const { control, handleSubmit, errors, setValue } = useForm<TaskForm>();
  const { dispatch } = useContext(SiteContext);
  const onSubmit = (data: TaskForm) => {
    dispatch({ type: "create", data: data });
    CloseModal();
    Toast.show("タスクを追加しました", {
      position: 50,
    });
  };

  return (
    <View style={{ borderRadius: 20 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          height: 170,
          padding: 20,
          borderTopStartRadius: 10,
          borderTopEndRadius: 10,
        }}
      >
        <View style={styles.btnWrap}>
          {/* <TouchableOpacity 
            style={styles.btn}
            onPress={CloseModal} 
          >
            <AntDesign name="close" size={30} color="grey" />
          </TouchableOpacity> */}
        </View>
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Input
              // label='タイトル'
              placeholder="タイトル"
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          defaultValue=""
          rules={{
            required: true,
            maxLength: 100,
          }}
        />
        {errors.name && errors.name.type === "required" && (
          <Text style={styles.errorText}>タイトルは必須です。</Text>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <Text style={styles.errorText}>
            タイトルは100文字以内で入力してください。
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#3B82F6",
          width: "100%",
          padding: 20,
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              marginRight: 5,
            }}
          >
            リストに追加する
          </Text>
          <Icon name="plus" size={17} type="font-awesome" color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ModalContent;

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: "100%",
    fontSize: 18,
    padding: "4%",
    margin: "4%",
  },
  errorText: {
    color: "red",
  },
  btnWrap: {
    position: "absolute",
    top: "5%",
    right: "5%",
  },
  btn: {},
});
