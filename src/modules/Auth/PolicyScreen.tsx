import React, { useEffect, useState } from 'react';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { Text,SafeAreaView } from 'react-native';


const PolicyScreen: React.FC = () => {
  const navigation = useNavigation()
  return (
      <SafeAreaView>
        <Text>プライバシーポリシー</Text>
        <Button
          title="同意する"
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </SafeAreaView>
  )
}

export default PolicyScreen
