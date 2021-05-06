import React, {useState, useEffect, useRef} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View ,StatusBar, FlatList, ScrollView, RefreshControl,} from 'react-native';
import axios from '../../../constants/axios';
import { getUser } from '../../Todo/Storage'
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import DonePost from '../../common/DonePost'
import Detail from '../../common/Detail'
import UserPage from '../../common/UserPage'
import Following from '../../common/Following'
import Follower from '../../common/Follower'

const FeedOfHubStack = createStackNavigator();

function FeedOfHub() {
  return (
    <FeedOfHubStack.Navigator
      headerMode="none" 
    >
      <FeedOfHubStack.Screen name="Feed" component={FeedOfHubScreen} />
      <FeedOfHubStack.Screen 
        name="Detail" 
        component={Detail} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
      <FeedOfHubStack.Screen 
        name="Following" 
        component={Following} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
      <FeedOfHubStack.Screen 
        name="Follower" component={Follower} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
      <FeedOfHubStack.Screen 
        name="LikedUsers" 
        component={Following} 
        options={{
          title: 'いいねしたユーザー',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false
        }}
      />
      <FeedOfHubStack.Screen 
        name="UserPage" component={UserPage} 
        options={{
          gestureDirection: 'horizontal'
        }}
      />
    </FeedOfHubStack.Navigator>
  );
}

function FeedOfHubScreen() {
  const navigation = useNavigation()
  const [userData, setData] = useState(null);
  const [refreshState, setRefreshData] = useState(false);
  const [feed, setFeed] = useState();
  const [pageData, setPageData] = useState(2);
  const [imageSrc, setImageSrc] = useState(null);
  const ref = useRef(null);

  useScrollToTop(ref);

  useEffect(() => {
    refreshData()
  },[]);

  const refreshData = () => {
    setFeed(null)
    setImageSrc(null)
    setRefreshData(true)
    getUser().then((data) => {
      if(data.uid !== undefined) {
        setData(data);
      }
      // console.log("----------------------")
      // console.log(data)
      axios.get('/api/users/' + data.uid + '/feed_by_hub', {
        params: {
          page: 1,
        }
      })
      .then(res => {
        setPageData(2)
        console.log("----------------------")
        // let postsData = res.data.done_posts.reverse()
        // setUserPostData(postsData)
        setFeed(res.data)
        setRefreshData(false)
      })
      .catch(e => console.log(e))
    })
  }

  const fetchData = async () => {
    // console.log(userData)
      console.log("----------------------")
      axios.get('/api/users/' + userData.uid + '/feed_by_hub', {
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
      ref={ref}
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
          return <DonePost post={item} userData={userData} image={null}/>;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.3}
      />
    </ScrollView>
  )
}

export default FeedOfHub