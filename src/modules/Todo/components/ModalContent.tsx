import React, {useReducer,useContext, useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {generateNewTask} from '../TaskUtil';
import TaskList from './TaskList';
import {Task} from '../'
import CircleBtn from './CircleBtn'
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 

type Props = {
  CloseModal: () => void;
}

const ModalContent: React.FC<Props> = (props) => {
  const {CloseModal} = props

  return (
    <View  style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", height:300, borderRadius: 20}}>
      <Text>I am the modal content!</Text>
      <Button title="Close" onPress={CloseModal} />
    </View>
  )
}

export default ModalContent


