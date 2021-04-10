import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import { Avatar,Text, Button,Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


function ProfileInfo(props) {
  const {userData} = props;
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
            <Avatar 
              rounded
              title={userData.name[0]} 
              size="large"
              containerStyle={{backgroundColor: 'gray'}}
            />
            <Text h4 style={{fontWeight: 'bold', margin: 5}}>{userData.name}</Text>
          </View>
          <View>
            <Button 
              title='変更'
              style={{margin: 10}} 
              buttonStyle={{ borderRadius: 18, paddingHorizontal: 10}}
              titleStyle={{fontSize: 16}}
              type='outline'
              onPress={() => alert("hello")}
            />
          </View>
          
        </View>
        <View>
          <Text>
            <Button 
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
              title='プログラミング'
            />
          </Text>
          <Text  style={{paddingBottom: 15, paddingHorizontal: 10}}>
            プロフィール、プロフィール、プロフィール、プロフィール、
          </Text>
          <Text  style={{paddingLeft: 10}}>
            <Text style={{fontWeight: 'bold'}}>100</Text>フォロー <Text style={{fontWeight: 'bold'}}>100</Text>フォロワー
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