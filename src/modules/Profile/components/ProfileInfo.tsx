import React, {useReducer, useContext, useState, useEffect} from 'react';
import { Text, StyleSheet,View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import { ButtonGroup, Avatar,Button,Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function ProfileInfo(props) {
  const {userData, toggleModal, imageSrc, followData} = props;
  // console.log(followData.following)
  // console.log(followData.follower)
  const navigation = useNavigation()
  if(!userData){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
  return (
    <View>
      <View  style={{ padding: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{}}>
            {imageSrc && <Avatar 
              rounded
              source={{
                uri: imageSrc
              }}
              size="large"
              containerStyle={{backgroundColor: 'gray'}}
            />}
            {!imageSrc && <Avatar 
              rounded
              title={userData.name[0]} 
              size="large"
              containerStyle={{backgroundColor: 'gray'}}
            />}
            <Text h4 style={{fontWeight: 'bold', margin: 5}}>{userData.name}</Text>
          </View>
          <View>
            <Button 
              title='変更'
              style={{margin: 10}} 
              buttonStyle={{ borderRadius: 18, paddingHorizontal: 10}}
              titleStyle={{fontSize: 16}}
              type='outline'
              onPress={toggleModal}
            />
          </View>
          
        </View>
        <View>
          <Text
            style={{paddingBottom: 10}}
          >
          {
            userData.hub_list.map((l, i) => (
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
              onPress={() => navigation.push('HubSelect', 
             {
               user: userData 
             })}
            />
              ))
            }
            {/* {userData.hub_list.length > 0 && <Button 
              icon={
                <Icon
                  name="tag"
                  color="#60A5FA"
                  size={20}
                />
              }
              type='clear'
              titleStyle={{fontSize: 14, color: "#60A5FA"}}
              buttonStyle={{ marginLeft: 7}}
              title={userData.hub_list[0]}
              onPress={() => navigation.push('HubSelect', 
             {
               user: userData 
             })}
            />} */}
            {/* <ButtonGroup
            buttons={userData.hub_list}
            containerStyle={{borderRadius: 50}}
            onPress={() => navigation.push('HubSelect', 
             {
               user: userData 
             })}
            /> */}
          </Text>
          
          <Text  style={{paddingBottom: 15, paddingHorizontal: 10}}>
            {userData.profile}
          </Text>
          <Text  style={{marginLeft: 10}}>
            <TouchableOpacity
             onPress={() => navigation.push('Following', 
             {
               following: followData.following
             })}
            >
              <Text style={{fontWeight: 'bold', marginRight: 10}}>{followData.following.length} フォロー</Text>
            </TouchableOpacity>  
            <TouchableOpacity onPress={() => navigation.push('Follower', {follower: followData.follower})}>
              <Text style={{fontWeight: 'bold'}}>{followData.follower.length} フォロワー</Text>
            </TouchableOpacity>
          </Text>
          <Button 
            title="sign out" 
            type="clear"
            onPress={() =>{
              firebase.auth().signOut()
              navigation.navigate('LoadingScreen')
            }
          }/>
        </View>
    </View>
        
  );
}

export default ProfileInfo