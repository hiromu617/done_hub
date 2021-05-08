import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet,View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { Text, Avatar,Button,Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

function OtherProfileInfo(props) {
  const {userData, imageSrc, followData, isFollowed, follow, unfollow, isCurrentUser, doneCounts} = props;
  console.log(userData)
  const navigation = useNavigation()
  if(!userData){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
  return (
    <View style={{backgroundColor: 'white'}}>
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
            {!isCurrentUser && isFollowed && <Button 
              title='follow中'
              style={{margin: 10}} 
              buttonStyle={{ borderRadius: 18, paddingHorizontal: 10, backgroundColor: '#3B82F6'}}
              titleStyle={{fontSize: 16}}
              type='solid'
              onPress={() => unfollow()}
            />}
            {!isCurrentUser && !isFollowed && <Button 
              title='followする'
              style={{margin: 10}} 
              buttonStyle={{ borderRadius: 18, paddingHorizontal: 10}}
              titleStyle={{fontSize: 16}}
              type='outline'
              onPress={() => follow()}
            />}
            
          </View>
          
        </View>
        <View style={{paddingHorizontal: 12, paddingBottom: 10}}>
          <Text>
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
          </Text>
          <Text  style={{paddingVertical: 10}}>
            {userData.profile}
          </Text>
          <Text>
            <TouchableOpacity
             onPress={() => navigation.push('Following', 
             {
               following: followData.following
             })}
            >
              <Text style={{fontWeight: 'bold', marginRight: 10}}>{followData.following.length} フォロー</Text>
            </TouchableOpacity>  
            <TouchableOpacity 
            onPress={() => navigation.push('Follower', {follower: followData.follower})}>
              <Text style={{fontWeight: 'bold'}}>{followData.follower.length} フォロワー</Text>
            </TouchableOpacity>
            <View>
              <Text style={{fontWeight: 'bold'}}>  {doneCounts} Done</Text>
            </View>
          </Text>
        </View>
    </View>
        
  );
}

export default OtherProfileInfo