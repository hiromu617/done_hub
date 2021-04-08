import React, {useReducer,useContext, useState} from 'react';
import { Alert,StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import TaskForm from '../objects/TaskForm'
import Task from '../objects/Task'
import {useForm, Controller} from 'react-hook-form';
import { SiteContext } from './TodoScreen'
import { AntDesign } from '@expo/vector-icons'; 

type Props = {
  CloseModal: () => void;
  TaskObj: Task;
}

const ModalContent: React.FC<Props> = (props) => {
  const {CloseModal, TaskObj} = props
  const {control, handleSubmit, errors, setValue} = useForm<TaskForm>();
  const {dispatch} = useContext(SiteContext);
  const onSubmit = (data) => {
    dispatch({type: 'checked', id: TaskObj.id, comment: data.comment})
    CloseModal()
  };

  return (
    <View  style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", height:300, borderRadius: 20, padding: 20}}>
      <View style={styles.btnWrap}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={CloseModal} 
          >
            <AntDesign name="close" size={30} color="black" />
          </TouchableOpacity>
      </View>
      <Text>{TaskObj.id}</Text>
      <Text>{TaskObj.name}</Text>
      <Text>コメント</Text>
      <Controller
          control={control}
          render={({onChange, value}) => (
            <TextInput
              style={styles.input}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="comment"
          defaultValue=""
          rules={{
            maxLength: 140,
          }}
        />
        {errors.name && errors.name.type === 'maxLength' && (
          <Text style={styles.errorText}>タイトルは140文字以内で入力してください。</Text>
        )}
      <Button title="Done" onPress={handleSubmit(onSubmit)}/>
    </View>
  )
}

export default ModalContent

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'grey',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: '100%',
    fontSize: 18,
    padding: '4%',
    margin: '4%',
  },
  errorText: {
    color: 'red',
  },
  btnWrap: {
    position: 'absolute',
    top: '5%',
    right: '5%',
  },
  btn: {

  },

})
