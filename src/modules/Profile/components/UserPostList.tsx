import React, {useContext, useState, useEffect} from 'react';
import {View,FlatList,StyleSheet, Text, ActivityIndicator,ScrollView} from 'react-native';
import UserPost from './UserPost'
import { ListItem, Avatar, Icon } from 'react-native-elements'
type Props = {
  posts,
  fetchData
}

const UserPostList: React.FC<Props>= (props) => {
  const {posts, fetchData} = props;
  // console.log(posts)
  if(posts == undefined){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
  return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={ posts}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({item}) => {
          return <UserPost post={item} />;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
    // posts.map((l, i) => (
    //   <ListItem key={i} bottomDivider>
    //     <ListItem.Content>
    //       <View style={{flexDirection: 'row', alignItems: 'center'}}>
    //         <Avatar 
    //         // source={{uri: l.avatar_url}} 
    //           rounded
    //           title='h'
    //           containerStyle={{backgroundColor: 'gray', marginRight: 10}}
    //         />
    //         <ListItem.Title  style={{paddingBottom: 5,fontWeight: 'bold'}}>ひろ</ListItem.Title>
    //       </View>
    //       <View  style={{paddingLeft: 40, width: '100%'}}>
    //         <Text style={{backgroundColor: '#EFF6FF', width: '100%', padding: 8, borderRadius: 10}}>{l.comment}</Text>
    //         <ListItem.Title  style={{paddingVertical: 5,fontWeight: 'bold'}}>「{l.title}」 DONE！✨</ListItem.Title>
    //         <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
    //           <Icon
    //           name='comment'
    //           type="font-awesome-5"
    //           size={20}
    //           color='gray' />
    //           <Text style={{color: 'gray', marginHorizontal: 7}}>0</Text>
    //           <Icon
    //           name='heart'
    //           type="font-awesome-5"
    //           size={20}
    //           color='#F87171' />
    //           <Text style={{color: '#F87171', marginHorizontal: 7}}>5</Text>
    //           <Text style={{fontSize: 10, color: 'gray', width: '70%', textAlign: 'right'}}>5 hours ago</Text>
    //         </View>
    //       </View>
    //     </ListItem.Content>
    //   </ListItem>
    // ))
  )
}

export default UserPostList;

const styles = StyleSheet.create({
  taskWrap: {
  },
  taskList: {
    
  },
})
