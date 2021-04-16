import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View ,StatusBar, FlatList, ScrollView, RefreshControl,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from '../../../constants/axios';
import { getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase'
import DonePost from './DonePost'
function FeedOfFollow() {
  const navigation = useNavigation()
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [feed, setFeed] = useState();
  const [pageData, setPageData] = useState(2);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    refreshData()
  },[]);

  const refreshData = () => {
    setImageSrc(null)
    setRefreshData(true)
    getUser().then((data) => {
      if(data.uid !== undefined) {
        setData(data);
      }
      console.log("----------------------")
      console.log(data)
      axios.get('/api/users/' + data.uid + '/feed', {
        params: {
          page: 1,
        }
      })
      .then(res => {
        setPageData(2)
        // console.log("----------------------")
        // let postsData = res.data.done_posts.reverse()
        // setUserPostData(postsData)
        setFeed(res.data)
        setRefreshData(false)
      })
      .catch(e => console.log(e))
    })
  }

  const fetchData = () => {
    console.log(userData)
      axios.get('/api/users/' + userData.uid + '/feed', {
        params: {
          page: pageData,
        }
      })
      .then(res => {
        if(res.data.length === 0 ) return
        setPageData(pageData + 1)
        console.log("----------------------")
        console.log(res.data)
        let Data = feed
        let newData = Data.concat(res.data)
        setFeed(newData)
      })
  }

  return (
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
        data={ feed }
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({item}) => {
          return <DonePost post={item}/>;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
    </ScrollView>
  )
}

export default FeedOfFollow