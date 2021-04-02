import React, {useReducer,useContext, useState} from 'react';
import { Alert,StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import TaskForm from '../objects/TaskForm'
import {useForm, Controller} from 'react-hook-form';
import { SiteContext } from './TodoScreen'
import { AntDesign } from '@expo/vector-icons'; 

type Props = {
  CloseModal: () => void;
}

const ModalContent: React.FC<Props> = (props) => {
  const {CloseModal} = props
  const {control, handleSubmit, errors, setValue} = useForm<TaskForm>();
  const {dispatch} = useContext(SiteContext);
  const onSubmit = (data: TaskForm) => {
    dispatch({type: 'create', data: data})
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
      <Text>タイトル(必須)</Text>
      <Controller
          control={control}
          render={({onChange, value}) => (
            <TextInput
              style={styles.input}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          defaultValue=""
          rules={{
            required: true,
            maxLength: 20,
          }}
        />
        {errors.name && errors.name.type === 'required' && (
          <Text style={styles.errorText}>タイトルは必須です。</Text>
        )}
        {errors.name && errors.name.type === 'maxLength' && (
          <Text style={styles.errorText}>タイトルは20文字以内で入力してください。</Text>
        )}
      <Button title="add todo" onPress={handleSubmit(onSubmit)}/>
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
