import React from "react";
// import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

type Props = {
  checked: boolean;
  onCheck: () => void;
};

const TaskCheckBox: React.FC<Props> = (props) => {
  const { checked, onCheck } = props;
  const color: string = checked ? "#1D4ED8" : "#D1D5DB";
  return (
    <TouchableOpacity style={styles.checkBox} onPress={onCheck}>
      <Icon name="check" color={color} />
      {/* <Entypo name="check" size={24} color={color} /> */}
    </TouchableOpacity>
  );
};

export default TaskCheckBox;

const styles = StyleSheet.create({
  checkBox: {
    padding: 6,
    marginRight: "1%",
    borderColor: '#D1D5DB',
    borderWidth: 1.5,
    borderRadius: 50
  },
});
