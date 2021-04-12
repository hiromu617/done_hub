import React, {useReducer, useContext, useCallback, useState} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements'

type Props = {
  post,
  imageSrc
}

const UserPost: React.FC<Props> = (props) => {
  const {post, imageSrc} = props;
  console.log(post)

  const parseDate = (val) => {
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$4:$5")
  }

  return (
    <ListItem bottomDivider>
    <ListItem.Content>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {imageSrc && <Avatar 
              rounded
              source={{
                uri: imageSrc
              }}
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
            />}
            {!imageSrc && <Avatar 
              rounded
              title={post.user.name[0]} 
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
            />}
        <ListItem.Title  style={{paddingBottom: 5,fontWeight: 'bold'}}>{post.user.name}</ListItem.Title>
      </View>
      <View  style={{paddingLeft: 40, width: '100%'}}>
        <Text style={{backgroundColor: '#EFF6FF', width: '100%', padding: 8, borderRadius: 10}}>{post.comment}</Text>
        <ListItem.Title  style={{paddingVertical: 15,fontWeight: 'bold'}}>「{post.title}」 DONE！✨</ListItem.Title>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Icon
          name='comment'
          type="font-awesome-5"
          size={20}
          color='gray' />
          <Text style={{color: 'gray', marginHorizontal: 7}}>0</Text>
          <Icon
          name='heart'
          type="font-awesome-5"
          size={20}
          color='#F87171' />
          <Text style={{color: '#F87171', marginHorizontal: 7}}>5</Text>
          <Text style={{fontSize: 10, color: 'gray', width: '70%', textAlign: 'right'}}>{parseDate(post.created_at)}</Text>
        </View>
      </View>
    </ListItem.Content>
  </ListItem>
  )
}

export default UserPost
