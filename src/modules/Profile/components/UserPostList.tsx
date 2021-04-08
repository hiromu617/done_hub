import React, {useContext, useState, useEffect} from 'react';
import {View,FlatList,StyleSheet, Text} from 'react-native';
import UserPost from './UserPost'
type Props = {
  posts
}

const UserPostList: React.FC<Props>= (props) => {
  const {posts} = props;
  console.log(posts)
  return (
    <View  style={styles.taskWrap}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={ posts}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({item}) => {
          return <UserPost post={item} />;
        }}
      />
    </View>
  )
}

export default UserPostList;

const styles = StyleSheet.create({
  taskWrap: {
  },
  taskList: {
    
  },
})
