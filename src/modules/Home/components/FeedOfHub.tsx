import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View ,StatusBar, FlatList, ScrollView, RefreshControl,} from 'react-native';
import axios from '../../../constants/axios';
import { getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import DonePost from '../../common/DonePost'
import Detail from '../../common/Detail'
import UserPage from '../../common/UserPage'
import Following from '../../common/Following'
import Follower from '../../common/Follower'
import { CheckBox, ListItem, FAB, Icon, BottomSheet } from 'react-native-elements';
import Modal from 'react-native-modal';

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
  const [isVisible, setIsVisible] = useState(false);
  const [hubList, sethubList] = useState(null);

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
      if(hubList.length > 1){
        let list = []
        for(let i = 0; i < data.hub_list.length; i++){
          list.push({name: data.hub_list[i], checked: true})
        }
        sethubList(list)
      }
      console.log("----------------------=")
      // console.log(data)
      // let list = []
      // for(let i = 0; i < hubList.length; i++){
      //   if((hubList[i].checked == true)) list.push(hubList[i].name)
      // }
      // console.log(list)
      axios.get('/api/users/feed_by_hub', {
        params: {
          page: 1,
          hub_list: []
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
        if(Data !== undefined){
          let newData = Data.concat(res.data)
          setFeed(newData)
        }
      })
  }

  return (
    <View>
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
          return <DonePost post={item} userData={userData} image={null}/>;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
    </ScrollView>


      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
      >
        {hubList && hubList.map((l, i) => (
          <ListItem key={i} bottomDivider>
              <CheckBox
                checked={l.checked}
                onPress={() => {
                  let list = []
                  for(let i = 0 ; i < hubList.length; i++){
                    if(hubList[i].name === l.name){
                      list.push({name: hubList[i].name, checked: !hubList[i].checked})
                    }else{
                      list.push(hubList[i])
                    }
                  }
                  sethubList(list)
                }}
              />
            <ListItem.Content>
              <ListItem.Title>{l.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </Modal>


      <FAB placement='right' 
        icon={
          <Icon
            name="arrow-right"
            color="white"
          />
        }
        onPress={() => setIsVisible(true)}
      />
    </View>
  )
}

export default FeedOfHub