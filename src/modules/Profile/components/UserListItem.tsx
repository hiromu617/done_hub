import React from 'react';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';

const UserListItem: React.FC = (props) => {
  const navigation = useNavigation()
  const { user } = props
  console.log(111111111111)
  console.log(user)
  return (
      <ListItem
        onPress={() => navigation.navigate('UserPage', 
        {
          user: user
        })}
      >
        <Avatar
          title={user.name[0]}
          rounded
          containerStyle={{backgroundColor: 'gray'}}            
        />
        <ListItem.Content>
          <ListItem.Title>{user.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
  )
}

export default UserListItem
