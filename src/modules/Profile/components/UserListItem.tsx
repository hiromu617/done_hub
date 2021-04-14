import React, {useReducer, useContext, useCallback, useState} from 'react';
import { StyleSheet,FlatList, Text, View ,TouchableOpacity} from 'react-native';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const UserListItem: React.FC = (props) => {
  const { user } = props
  return (
      <ListItem>
        <Avatar
          title={user.name[0]}
          rounded
          containerStyle={{backgroundColor: 'gray'}}            
        />
        <ListItem.Content>
          <ListItem.Title>{user.name}</ListItem.Title>
        </ListItem.Content>
        <Button
          title='フォロー中'
          buttonStyle={{ borderRadius: 18, paddingHorizontal: 10}}
          titleStyle={{fontSize: 16}}
          onPress={() => alert('follow')}
        />
      </ListItem>
  )
}

export default UserListItem
