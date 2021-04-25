import React, {useState, useEffect} from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import axios from '../../../constants/axios';
import { ListItem, Divider,Overlay} from 'react-native-elements';
import firebase from 'firebase'

function NotificationHome() {
  // const {state} = useContext(SiteContext);
  const navigation = useNavigation()
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    refreshData()
  },[]);


  const refreshData = () => {
    setRefreshData(true)
    setNotificationData([])
    getUser().then((data) => {
      if(data.uid !== undefined) {
        setData(data);
        console.log(data)
      }
      console.log("----------------------")
      // console.log(data)
      axios.get('/api/notifications', {
        params: {
          uid: data.uid
        }
      })
      .then((res) => {
        setRefreshData(false)
        setNotificationData(res.data)
        console.log(res.data)
      })
    })
  }

  return (
      <SafeAreaView style={{ flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => refreshData()}
            />
          }
        >
          <FlatList
        showsVerticalScrollIndicator={false}
        data={ notificationData }
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({item}) => {
          if(item.action === 'like'){
            return (
            <ListItem
              bottomDivider
              onPress={() => navigation.navigate('Detail', 
              {
                post: item.done_post,
                userData: userData,
                initialLikeNum: item.done_post.likes.length
              })}
              >
              <ListItem.Content>
              <ListItem.Title>{item.visiter.name}さんが投稿にいいねしました</ListItem.Title>
              </ListItem.Content>
           </ListItem>
          );
          }
          if(item.action === 'follow'){
            return (
            <ListItem
              bottomDivider
              onPress={() => navigation.navigate('UserPage', 
              {
                user: item.visiter
              })}
              >
              <ListItem.Content>
              <ListItem.Title>{item.visiter.name}さんがあなたをフォローしました</ListItem.Title>
              </ListItem.Content>
           </ListItem>
          );
          }
        }}
    />
        </ScrollView>
      </SafeAreaView>
  );
}

export default NotificationHome