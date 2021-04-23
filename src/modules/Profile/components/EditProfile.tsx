import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { Avatar,Text, Button,Icon, Input} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import axios from '../../../constants/axios'
import {storeUser} from '../../Todo/Storage'
import User from '../../Profile/objects/User'
import ImagePick from './ImagePick'

function EditProfile(props) {
  const {toggleModal, userData, imageSrc} = props;
  const {control, handleSubmit, errors, setValue} = useForm();
  const onSubmit = (data) => {
    // console.log(data)
    axios.post('/api/users/' + userData.uid, { 
      user: {
        name: data.name,
        profile: data.profile
      }
    })
    .then(res => {
      console.log('--------------------')
      // console.log(res.data)
      let newUser: User = {
        uid: res.data.uid,
        name: res.data.name,
        profile: res.data.profile,
        hub_list: res.data.hub_list
      }
      console.log('--------------------')
      // console.log(newUser)
      storeUser(newUser)
      toggleModal()
    })
    .catch(e => console.log(e))
  };
  return (
    <SafeAreaView>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button 
          title='閉じる' 
          type='clear'
          onPress={toggleModal}/>
        <Button 
          title="保存" 
          type='clear'
          onPress={handleSubmit(onSubmit)}
        />
      </View>
        <Avatar 
          rounded
          title={userData.name[0]} 
          source={{uri: imageSrc}} 
          size="large"
          containerStyle={{backgroundColor: 'gray',margin: 10}}
        />
        <ImagePick userData={userData} toggleModal={toggleModal}/>
        <Controller
          control={control}
          render={({onChange, value}) => (
            <Input
              multiline = {true}
              label='名前'
              placeholder='名前を追加'
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          defaultValue={userData.name}
          rules={{
            maxLength: 10,
          }}
        />
        {errors.name && errors.name.type === 'maxLength' && (
          <Text style={styles.errorText}>名前は10文字以内で入力してください。</Text>
        )}
        <Controller
          control={control}
          render={({onChange, value}) => (
            <Input
              multiline = {true}
              label='自己紹介'
              placeholder='プロフィールを追加'
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="profile"
          defaultValue={userData.profile}
          rules={{
            maxLength: 140,
          }}
        />
        {errors.name && errors.name.type === 'maxLength' && (
          <Text style={styles.errorText}>タイトルは140文字以内で入力してください。</Text>
        )}
    </SafeAreaView>
  );
}

export default EditProfile

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