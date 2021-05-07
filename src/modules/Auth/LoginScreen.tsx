import React, { Component } from 'react';
import {ActivityIndicator,TouchableOpacity, Image, View, StyleSheet, Button,SafeAreaView } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import {  SocialIcon, Text } from 'react-native-elements'
import {useNavigation } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

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
        .then((result) => {
          this.props.navigation.navigate('LoadingScreen')
        })
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
        iosStandaloneAppClientId: '964059427466-dadsmlkqj6cr1pqos9ddcpk8o7oap4h9.apps.googleusercontent.com',
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

  signInWithApple = async () => {
    try {
      const nonce = this.nonceGen(32); // ランダム文字列（ノンス）を生成
      const digestedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      ); // SHA256でノンスをハッシュ化
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [ // ユーザー情報のスコープを設定（名前とメールアドレスのみ可）
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ],
        nonce: digestedNonce // Apple側にはハッシュ化したノンスを渡す
      });
      console.log('Apple Sign In result: ', result);
      let provider = new firebase.auth.OAuthProvider("apple.com");
      let credential = provider.credential({
        idToken: result.identityToken,
        rawNonce: nonce // Firebase側には元のノンスを渡して検証させる
      });
      const firebaseResult = await firebase.auth().signInWithCredential(credential);
      console.log('Firebase Auth result: ', firebaseResult);
      this.props.navigation.navigate('LoadingScreen')
    } catch (e) {
      console.error(e);
    }
  }
  // 001063.a889f51ed7204b0b8fd6ebede5678dbe.1344
  nonceGen  = (length) => {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  render() {
    const { navigation } = this.props;

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
        <View
            style={{paddingHorizontal: 65, paddingVertical: 50}}
        >
          <Text
            style={{textAlign: 'center', fontSize: 14, lineHeight: 22}}
          >
            <TouchableOpacity
             onPress={() => navigation.navigate('TermsScreen')}
            ><Text style={{color: '#2563EB'}}>利用規約</Text></TouchableOpacity>
            と
            <TouchableOpacity
             onPress={() => navigation.navigate('PolicyScreen')}
            ><Text style={{color: '#2563EB'}}>プライバシーポリシー</Text></TouchableOpacity>
            に同意した上でログインしてください
          </Text>
        </View>
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
            marginBottom: 20,
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
          {this.state.loading &&
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
            cornerRadius={5}
            style={{ width: 240, height: 54}}
            onPress={() => this.signInWithApple()}
          />
          }
          
      </SafeAreaView>
    )
  }
}
export default function(props) {
  const navigation = useNavigation();

  return <LoginScreen {...props} navigation={navigation} />;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})