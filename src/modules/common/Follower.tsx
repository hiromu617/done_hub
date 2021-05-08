import React, { useReducer, useContext, useCallback, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { ListItem, Avatar, Icon, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import UserListItem from "./UserListItem";

const Follower: React.FC = ({ route }) => {
  const navigation = useNavigation();
  const { follower } = route.params;
  console.log("-------");
  console.log(follower);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={follower}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return <UserListItem user={item} />;
        }}
      />
      <Icon
        name="arrow-left"
        type="font-awesome"
        color="#3B82F6"
        size={24}
        reverse
        raised
        containerStyle={{ position: "absolute", bottom: "5%", left: "3%" }}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default Follower;
