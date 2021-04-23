import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import { ButtonGroup, Avatar,Button,Icon} from 'react-native-elements';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import {storeUser} from '../Todo/Storage'
import User from '../Profile/objects/User'

function HubSelect({route}) {
  const {user} = route.params;
  const navigation = useNavigation()
  const [selectedHub, setSelectedHub] = useState(user.hub_list)
  const hub_list = ['英語', '数学', '物理', '化学','プログラミング' , 'CS', '経済学', 'スペイン語', '心理学', '人文学', '医学', '薬学']
  const save = () => {
    axios.get('/api/users/' + user.uid + '/hubs', {
      params: {
        hub_list: selectedHub
      }
    })
    .then(res => {
      let newUser: User = {
        uid: res.data.uid,
        name: res.data.name,
        profile: res.data.profile,
        hub_list: res.data.hub_list
      }
      console.log('--------------------')
      // console.log(newUser)
      storeUser(newUser)
      navigation.navigate('ProfileHome')
    })
  }
  return (
      <SafeAreaView style={{ flex: 1}}>
        <View style={{flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
          <Text style={{fontSize: 26, fontWeight: 'bold'}}>選択中のハブ</Text>
          <Button 
            title='保存'
            type='clear'
            onPress={() => save()}
          /> 
        </View>
        
        <Text>
        {
            selectedHub.map((l, i) => (
              <Button 
              icon={
                <Icon
                  name="tag"
                  color="white"
                  size={16}
                />
              }
              type='clear'
              titleStyle={{fontSize: 12, color: "white", fontWeight: 'bold'}}
              containerStyle={{backgroundColor: '#0EA5E9', borderRadius: 50, padding: 0, height: 30,}}
              buttonStyle={{ marginLeft: 7}}
              title={l}
              onPress={() => {
                let list = []
                  selectedHub.map((item) => {
                  if(item !== l) list.push(item)
                })
                setSelectedHub(list)
              }}
            />
              ))
            }
        </Text>

        <Text style={{fontSize: 26, fontWeight: 'bold', padding: 20}}>ハブ一覧</Text>
        <Text>
        {
            hub_list.map((l, i) => {
              if(selectedHub.includes(l)){
                return (
                  <Button 
                icon={
                <Icon
                  name="tag"
                  color="white"
                  size={16}
                />
              }
              type='clear'
              titleStyle={{fontSize: 12, color: "white", fontWeight: 'bold'}}
              containerStyle={{backgroundColor: '#0EA5E9', borderRadius: 50, padding: 0, height: 30,}}
              title={l}
              onPress={() => {
                let list = []
                  selectedHub.map((item) => {
                  if(item !== l) list.push(item)
                })
                setSelectedHub(list)
              }}
            />
                )
              }else{
                return (
                  <Button 
              icon={
                <Icon
                  name="tag"
                  color="#0EA5E9"
                  size={16}
                />
              }
              type='clear'
              titleStyle={{fontSize: 12, color: "#0EA5E9", fontWeight: 'bold'}}
              containerStyle={{backgroundColor: 'transparent', borderRadius: 50, padding: 0, height: 30,}}
              title={l}
              onPress={() => {
                let list = selectedHub.slice()
                list.push(l)
                setSelectedHub(list)
              }}
            />
                )
              }
            })
            }
        </Text>
      </SafeAreaView>
  );
}

export default HubSelect