import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList } from "react-native";
import axios from "../../../constants/axios";
import UserListItem from "../../common/UserListItem";
import { SearchBar } from "react-native-elements";

function SearchHome() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(null);
  const [resultText, setresultText] = useState(null);

  useEffect(() => {
    // fetchUsers()
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
        if (res.data.length === 0) setresultText("Not Found");
        setUsers(res.data);
      });
  };
  const onClear = () => {
    setUsers([]);
    setresultText(null);
  };
  // const fetchUsers = () => {
  //   axios.get('/api/users')
  //   .then(res => {
  //     console.log(res.data)
  //     setUsers(res.data)
  //   })
  // }
  return (
    <SafeAreaView>
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
            ユーザー名を検索することができます
          </Text>
        )}
        {resultText && (
          <Text
            style={{
              padding: 20,
              fontWeight: "bold",
              fontSize: 26,
              color: "#1F2937",
            }}
          >
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
    </SafeAreaView>
  );
}

export default SearchHome;
