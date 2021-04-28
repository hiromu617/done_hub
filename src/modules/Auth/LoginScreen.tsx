import React, { Component } from 'react';
import {ActivityIndicator,TouchableOpacity, Image, View, StyleSheet, Button,SafeAreaView } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import {  SocialIcon, Text } from 'react-native-elements'

class LoginScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {loading: true};
  }
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser){
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken,
        );
  
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential)
        // .then((result) => console.log(result))
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  signInWithGoogleAsync = async () => {
    this.setState({
      loading: false
    })
    try {
      const result = await Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        behavior: 'web',
        iosClientId: '964059427466-3cv0o83gfa1lrhc9he6ngfu9js5lhavi.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      // console.log(result)
      if (result.type === 'success') {
        this.onSignIn(result)
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render() {
    return(
      <SafeAreaView style={styles.container}>
        <Image
          style={{
            width: '100%',
            height: undefined,
            aspectRatio: 5 / 1,
          }}
          source={require('./images/DoneHub.png')}
        />
        <Text
          style={{paddingHorizontal: 65, paddingVertical: 50, textAlign: 'center', fontSize: 16, lineHeight: 22}}
        >
          利用規約とプライバシーポリシーに同意した上でログインしてください
        </Text>
        {this.state.loading &&
        <TouchableOpacity
          style={{
            width: '100%', 
            paddingHorizontal: 70, 
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,}}
            onPress={() => this.signInWithGoogleAsync()}
        >
            <Image
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: 5 / 1,
              }}
              source={require('./images/btn_google_signin.png')}
            />
        </TouchableOpacity>
          }
          {!this.state.loading && 
            <ActivityIndicator size='large'/>
          }
      </SafeAreaView>
    )
  }
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})