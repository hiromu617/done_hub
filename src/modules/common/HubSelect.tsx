import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import { ButtonGroup, Avatar,Button,Icon} from 'react-native-elements';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import {storeUser} from '../Todo/Storage'
import User from '../Profile/objects/User'
import { LinearGradient } from 'expo-linear-gradient';

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
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 10}}>
        <View style={{flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
          <Text style={{fontSize: 26, fontWeight: 'bold'}}>選択中のHub</Text>
          <Button 
            title='保存'
            type='clear'
            onPress={() => save()}
          /> 
        </View>
        
        <Text>
        {
            selectedHub.map((l, i) => (
            <TouchableOpacity
            onPress={() => {
              let list = []
                selectedHub.map((item) => {
                if(item !== l) list.push(item)
              })
              setSelectedHub(list)
            }}
             >  
               <LinearGradient 
               start={[0,1]}
               end={[1,0]}
                style={{flexDirection: 'row',alignItems: 'center', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 5, margin: 1.5}}
                colors={['#0EA5E9', '#60A5FA']}
                >
                  <Icon
                  name="tag"
                  color="white"
                  size={16}
                />
                  <Text style={{color: 'white', fontWeight: 'bold', lineHeight: 14, fontSize: 14}}>{l}</Text>
                </LinearGradient>
              </TouchableOpacity>
              ))
            }
        </Text>

        <Text style={{fontSize: 26, fontWeight: 'bold', padding: 20}}>Hub一覧</Text>
        <Text>
        {
            hub_list.map((l, i) => {
              if(selectedHub.includes(l)){
                return (
                  <TouchableOpacity
                  onPress={() => {
                    let list = []
                      selectedHub.map((item) => {
                      if(item !== l) list.push(item)
                    })
                    setSelectedHub(list)
                  }}
             >  
               <LinearGradient 
               start={[0,1]}
               end={[1,0]}
                style={{flexDirection: 'row',alignItems: 'center', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 5, margin: 1.5}}
                colors={['#0EA5E9', '#60A5FA']}
                >
                  <Icon
                  name="tag"
                  color="white"
                  size={16}
                />
                  <Text style={{color: 'white', fontWeight: 'bold', lineHeight: 14, fontSize: 14}}>{l}</Text>
                </LinearGradient>
              </TouchableOpacity>
                )
              }else{
                return (
                  <TouchableOpacity
                  onPress={() => {
                    let list = selectedHub.slice()
                    list.push(l)
                    setSelectedHub(list)
                  }}
                  
             >  
               <LinearGradient 
               start={[0,1]}
               end={[1,0]}
                style={{flexDirection: 'row',alignItems: 'center', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 5, margin: 1.5}}
                colors={['transparent', 'transparent']}
                >
                  <Icon
                  name="tag"
                  color="#0EA5E9"
                  size={16}
                />
                  <Text style={{color: '#0EA5E9', fontWeight: 'bold', lineHeight: 14, fontSize: 14}}>{l}</Text>
                </LinearGradient>
              </TouchableOpacity>
                )
              }
            })
            }
        </Text>
      </SafeAreaView>
  );
}

export default HubSelect