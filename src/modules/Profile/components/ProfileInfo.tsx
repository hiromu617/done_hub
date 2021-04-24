import React, {useReducer, useContext, useState, useEffect} from 'react';
import { TouchableHighlight,Button, Text, StyleSheet,View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import { ButtonGroup, Avatar,Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

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
            style={{paddingHorizontal: 10}}
          >
          {
            userData.hub_list.map((l, i) => (
              <TouchableOpacity
              onPress={() => navigation.push('HubSelect', 
             {
               user: userData 
             })}
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
          
          <Text  style={{paddingVertical: 10, paddingHorizontal: 10}}>
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