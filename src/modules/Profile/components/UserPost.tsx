import React, {useReducer, useContext, useCallback, useState} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';

type Props = {
  post
}

const UserPost: React.FC<Props> = (props) => {
  const {post} = props;

  return (
    <View>
      <View style={styles.Card}>
        <TouchableOpacity>
          <Text>comment: {post.comment}</Text>
          <Text>{post.title} DONE!</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UserPost

const styles = StyleSheet.create({
  Card: {
    width: '100%',
    // height: '100%',
    // flex: 1, 
    // alignItems: 'center',
    // flexDirection: 'row',
    padding: '5%',
    marginBottom: '1%',
    // justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'grey'
  },
})