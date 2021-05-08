import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList } from "react-native";
import axios from "../../../constants/axios";
import UserListItem from "../../common/UserListItem";
import { Icon, SearchBar } from "react-native-elements";

function SearchHome() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(null);
  const [latestUsers, setLatestUsers] = useState([]);
  const [resultText, setresultText] = useState(null);

  useEffect(() => {
    fetchLatestUsers();
  }, []);

  const updateSearch = (search) => {
    setresultText(null);
    if (search == "") return;
    axios
      .get("/api/users/search", {
        params: {
          q: search,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0)
          setresultText("一致するユーザーは見つかりませんでした");
        setUsers(res.data);
      });
  };
  const onClear = () => {
    setUsers([]);
    setresultText(null);
  };
  const fetchLatestUsers = () => {
    axios.get("/api/latest_users").then((res) => {
      console.log(res.data);
      setLatestUsers(res.data);
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        lightTheme
        round
        placeholder="Type Here..."
        onChangeText={updateSearch}
        onClear={onClear}
        value={search}
        containerStyle={{ backgroundColor: "#E2E8F0" }}
        inputContainerStyle={{ backgroundColor: "#CBD5E1" }}
      />
      <View style={{ paddingVertical: 20 }}>
        {users.length === 0 && !resultText && (
          <Text style={{ paddingHorizontal: 10, color: "#1F2937" }}>
            ユーザーを検索することができます
          </Text>
        )}
        {resultText && (
          <Text style={{ paddingHorizontal: 10, color: "#1F2937" }}>
            {resultText}
          </Text>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={users}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => {
            return <UserListItem user={item} />;
          }}
        />
      </View>
      {users.length === 0 && !resultText && (
        <FlatList
          ListHeaderComponent={
            <View
              style={{
                padding: 20,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="history" type="font-awesome" color="#1F2937" />
              <Text style={{ fontSize: 18, marginLeft: 10, color: "#1F2937" }}>
                最近登録したユーザー
              </Text>
            </View>
          }
          style={{ position: "absolute", bottom: 0, width: "100%" }}
          showsVerticalScrollIndicator={false}
          data={latestUsers}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => {
            return <UserListItem user={item} />;
          }}
        />
      )}
    </SafeAreaView>
  );
}

export default SearchHome;
