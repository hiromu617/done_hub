import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase'
function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
      <Button title="sign out" onPress={() =>{
        firebase.auth().signOut()
        this.props.navigation.navigate('LoadingScreen')
      }}/>
    </View>
  );
}

export default ProfileScreen