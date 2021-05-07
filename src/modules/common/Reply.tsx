import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, Text, View ,TouchableOpacity, FlatList} from 'react-native';
import { Button, ListItem, Avatar, Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import firebase from 'firebase'
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';

type Props = {
  reply,
  userData,
  refreshData
}

const Reply: React.FC<Props> = (props) => {
  const { reply, userData, refreshData } = props
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteModalState, setDeleteModalState] = useState(false)
  const [reportState, setReportState] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    getSource(reply)
  },[]);

  const deletePost = async () => {
    Alert.alert(
      "返信の削除",
      "本当に削除してもよろしいですか？",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setDeleteModalState(false)
        },
        { text: "OK",
          onPress: () => {
            axios.delete('/api/replys/' + reply.id)
            .then(res => {
              setDeleteModalState(false)
              refreshData()
              Toast.show('返信を削除しました',{
                position: 50
              })
            })
            .catch(e => console.log(e))
          } 
        }
      ]
    )
  }

  const getAvatar =  (post) => {
    return new Promise((resolve) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var spaceRef = storageRef.child(`images/${post.user.uid}.jpg`);
      spaceRef.getDownloadURL().then(function(url){
        console.log("ファイルURLを取得")
        console.log(url)
        resolve(url);
      }).catch(function(error) {
        // Handle any errors
        console.log("getTokoImage 画像を取得する");
        console.log(error);
      });
    });
  };
  const getSource = (userData) => {
    getAvatar(userData)
    .then(res => {
      setImageSrc(res)
    })
  }

  const parseDate = (val) => {
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$2/$3 $4:$5")
  }
  const reportReply = async () => {
    if(reportState){
      Toast.show('既に報告済みです！',{
        position: 50
      })
      return
    }
    Alert.alert(
      "報告",
      "悪意のある投稿として報告しますか？",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setDeleteModalState(false)
        },
        { text: "OK",
          onPress: async () => {
            const url = 'https://slack.com/api/chat.postMessage';
            const token = 'xoxb-1900997433024-2053652851089-YV2n9gLy04gzRecCIDqXSOST'
            const result = await axios.request({
              headers: {
              'authorization': `Bearer ${token}`
              },
              url,
              method: "POST",
              data: {
              channel: '#report',
              text: `reply_id:${reply.id}\n name: ${reply.user.name}\n content: ${reply.content}\n report from: ${userData.id} ${userData.name}`,
            }
            });
            console.log(result.data);
            setDeleteModalState(false)
            setReportState(true)
            Toast.show('Thank you!',{
                position: 50
            })
          } 
        }
      ]
    )
  }
  return (
    <ListItem 
      bottomDivider
    >
      <Modal
      isVisible={deleteModalState}
      onBackdropPress={() => setDeleteModalState(false)}
      animationIn='slideInRight'
      animationOut='slideOutRight'
      backdropOpacity={0.3}
      style={{backgroundColor: 'white', position: 'absolute',top: '30%', right: 30, width: 100, height: 60, borderRadius: 10}}
      >
        <View 
          style={{backgroundColor: 'white'}}
        >
          {userData.id == reply.user.id ?
          <Button 
            icon={
              <Icon
                name="trash"
                type="font-awesome"
                color="#EF4444"
                size={20}
              />
            }
              title='削除' 
              type='clear'
              titleStyle={{color: '#EF4444', marginLeft: 10}}
              onPress={() => deletePost()}
            />
            :
          <Button 
            icon={
              <Icon
                name="flag"
                type="font-awesome"
                color="black"
                size={20}
              />
            }
              title='報告' 
              type='clear'
              titleStyle={{color: 'black', marginLeft: 10}}
              onPress={() => reportReply()}
            />
          }
        </View>
      </Modal>
      <ListItem.Content>
        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
          <View  style={{flexDirection: 'row', alignItems: 'center'}}>
            {imageSrc && <Avatar 
          rounded
          size='small'
          source={{
          uri: imageSrc
        }}
        containerStyle={{backgroundColor: 'gray', marginRight: 10}}
        onPress={() => navigation.push('UserPage', 
        {
          user: reply.user
        })}         
        />}
        {!imageSrc && <Avatar 
          rounded
          size='small'
          title={reply.user.name[0]} 
          containerStyle={{backgroundColor: 'gray', marginRight: 10}}
          onPress={() => navigation.push('UserPage', 
          {
            user: reply.user
          })}
        />}
          <ListItem.Title  style={{paddingBottom: 0,fontWeight: 'bold', fontSize: 16}}>{reply.user.name}</ListItem.Title>
          </View>
          <View
          >
            <Icon
              name='ellipsis-v'
              type='font-awesome'
              color='gray'
              size={20}
              style={{padding: 10}}
              onPress={() => setDeleteModalState(true)}
            />
          </View>
        </View>
        <View style={{width: '100%', paddingLeft: '12%'}}>
          <ListItem.Title  style={{fontSize: 13}}>{reply.content}</ListItem.Title>
          <Text style={{fontSize: 10, color: 'gray', width: '100%', textAlign: 'right'}}>{parseDate(reply.created_at)}</Text>
        </View>
      </ListItem.Content>
    </ListItem>
  )
 
}

export default Reply
