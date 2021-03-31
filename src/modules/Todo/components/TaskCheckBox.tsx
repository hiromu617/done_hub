import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';

type Props = {
  checked: boolean;
  onCheck: () => void;
}

const TaskCheckBox: React.FC<Props> = (props) => {
  const {checked, onCheck} = props
  const color: string = checked ? 'red' : 'black';
  return (
    <TouchableOpacity style={styles.checkBox} onPress={onCheck}>
      <Entypo name="check" size={24} color={color} />
    </TouchableOpacity>
  )
}

export default TaskCheckBox;

const styles = StyleSheet.create({
  checkBox: {
    borderWidth: '2px',
    borderRadius: '10px',
    padding: '8px',
    marginRight: '1%',
  },
})