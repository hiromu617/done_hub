import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { Avatar,Text, Button,Icon} from 'react-native-elements';


function EditProfile(props) {
  const {toggleModal} = props;
  return (
    <SafeAreaView>
      <Text></Text>
        <Button title='close' onPress={toggleModal}/>
    </SafeAreaView>
  );
}

export default EditProfile