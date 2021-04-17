import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View ,StatusBar, FlatList, ScrollView, RefreshControl,} from 'react-native';
import axios from '../../../constants/axios';
import { getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import DonePost from './DonePost'
import DetailOfFeed from './DetailOfFeed'
import UserPage from '../../common/UserPage'
import Following from '../../common/Following'
import Follower from '../../common/Follower'

const FeedOfFollowStack = createStackNavigator();

function FeedOfFollow() {
  return (
    <FeedOfFollowStack.Navigator
      headerMode="none" 
    >
      <FeedOfFollowStack.Screen name="Feed" component={FeedOfFollowScreen} />
      <FeedOfFollowStack.Screen 
        name="Detail" 
        component={DetailOfFeed} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
      <FeedOfFollowStack.Screen 
        name="Following" 
        component={Following} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
      <FeedOfFollowStack.Screen 
        name="Follower" component={Follower} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
      <FeedOfFollowStack.Screen 
        name="UserPage" component={UserPage} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
    </FeedOfFollowStack.Navigator>
  );
}

function FeedOfFollowScreen() {
  const navigation = useNavigation()
  const [userData, setData] = useState(null);
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
      // console.log(data)
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
    // console.log(userData)
      axios.get('/api/users/' + userData.uid + '/feed', {
        params: {
          page: pageData,
        }
      })
      .then(res => {
        if(res.data.length === 0 ) return
        setPageData(pageData + 1)
        console.log("----------------------")
        // console.log(res.data)
        let Data = feed
        if(Data !== undefined){
          let newData = Data.concat(res.data)
          setFeed(newData)
        }
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
          return <DonePost post={item} userData={userData}/>;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
    </ScrollView>
  )
}

export default FeedOfFollow