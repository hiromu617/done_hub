import React, { Component } from 'react';
import {View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase'

class LoadingScreen extends Component{

  componentDidMount(){
    this.checkedIfLogin()
  }

  checkedIfLogin = () => {  
    firebase.auth().onAuthStateChanged(
      function(user){
        alert(user)
        if(user){
          this.props.navigation.navigate('MyTabs')
        }else {
          this.props.navigation.navigate('LoginScreen')
        }
      }.bind(this)
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
}

export default LoadingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})