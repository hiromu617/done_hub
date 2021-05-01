import React, {useReducer, useContext, useCallback, useState} from 'react';
import { StyleSheet,FlatList, Text, View ,TouchableOpacity} from 'react-native';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import UserListItem from './UserListItem'

const Following: React.FC = ({route}) => {
  const navigation = useNavigation()
  const { following } = route.params;

  return (
    <View style={{flex: 1}}>
      <FlatList
          showsVerticalScrollIndicator={false}
          data={ following}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({item}) => {
            return <UserListItem user={item}/>;
          }}
      />
      <Icon
          name='arrow-left'
          type="font-awesome" 
          color="#3B82F6"
          size={27}
          reverse
          raised
          containerStyle={{position: 'absolute', bottom: '5%', left: '5%'}}
          onPress={() => navigation.goBack()}
          />
    </View>
    
  )
}

export default Following
