import React, {useReducer,useContext, useState} from 'react';
import { Alert,StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import { AntDesign } from '@expo/vector-icons'; 
import { Input, Button, Icon} from 'react-native-elements';
import axios from '../../constants/axios';

type Props = {
  CloseModal: () => void;
  post,
  userData
}

const ReplyModal: React.FC<Props> = (props) => {
  const {CloseModal, post, userData} = props
  const {control, handleSubmit, errors, setValue} = useForm();
  const onSubmit = (data) => {
    axios.post('/api/replys', {
      reply: {
        user_id: userData.id,
        done_post_id: post.id,
        content: data.content
      }
    })
    .then(() => {

      CloseModal()
    })
  };

  return (
    <View  style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", height:300, borderRadius: 20, padding: 20,width: 300}}>
      <View style={styles.btnWrap}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={CloseModal} 
          >
            <AntDesign name="close" size={30} color="grey" />
          </TouchableOpacity>
      </View>
      <Controller
          control={control}
          render={({onChange, value}) => (
            <Input
              multiline = {true}
              label='返信内容'
              placeholder='content'
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="content"
          defaultValue=""
          rules={{
            maxLength: 140,
          }}
        />
        {errors.name && errors.name.type === 'maxLength' && (
          <Text style={styles.errorText}>140文字以内で入力してください。</Text>
        )}
      <Button 
        title="送信" 
        type='outline'
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}

export default ReplyModal

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
