import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "../../constants/axios";
import { ButtonGroup, Avatar, Button, Icon } from "react-native-elements";
import { ListItem } from "react-native-elements/dist/list/ListItem";
import { storeUser } from "../Todo/Storage";
import User from "../Profile/objects/User";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-root-toast";

function HubSelect({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [selectedHub, setSelectedHub] = useState(user.hub_list);
  const hub_list =['中国語','ウルドゥー語','ドイツ語','朝鮮語','アラビア語','英語','モンゴル語','ペルシア語','フランス語','インドネシア語','トルコ語','イタリア語','フィリピン語','スワヒリ語','スペイン語','タイ語','ロシア語','ポルトガル語','ベトナム語','ハンガリー語','日本語','ビルマ語','デンマーク語','ヒンディー語','スウェーデン語','ポーランド語','チェコ語','ベンガル語','マレーシア語','言語学','哲学','経済学','文学','人間科学','社会学','教育学','共生学','行動学','法学','国際公共政策学','理学部','数学','物理学','化学','生物科学','生命理学','医学','看護学','放射線技術科学','検査技術科学','歯学','薬学','工学','応用自然科学','応用理工学','電子情報工学','環境・エネルギー工学','地球総合工学','基礎工学','電子物理科学','化学応用科学','システム科学','情報科学','経営学','商学','農学','国際学','政治学','政策科学','獣医学','生活科学','心理学','スポーツ健康科学','神学','植物栄養科学','建築学部','音楽学','映像学','食マネジメント学','情報学','社会安全学','都市工学','福祉学','統計学','開発学','TOEIC','TOEFL IBT','TOFLE ITP','IELTs','英検','簿記','米国公認会計士','日経TEST','MOS','秘書検定','FP技能検定','ITパスポート','基本情報技術者試験','応用技術者試験','秘書検定','社会保険労務士','行政書士','建築士','技術士','社会保険労務士','医師免許','歯科医師免許','薬剤師','看護師','社会福祉士','介護福祉士','管理栄養士・栄養士','保育士','司法試験','公務員','公認会計士','税理士','教員採用試験','宅建士','米国公認会計士（USCPA）','中小企業診断士','情報処理・パソコン','FP（ファイナンシャルプランナー）','動画制作','プログラミング','競技プログラミング','CS','WEB制作','WEBデザイン','色彩検定','医師免許','歯科医師免許','薬剤師','看護師','社会福祉士','介護福祉士','管理栄養士・栄養士','保育士','司法試験', '23卒','24卒','25卒']
  const save = () => {
    if (selectedHub.length > 5) {
      Toast.show("5個以内選択して下さい。", {
        position: 50,
      });
      return;
    }
    axios
      .get("/api/users/" + user.uid + "/hubs", {
        params: {
          hub_list: selectedHub,
        },
      })
      .then((res) => {
        let newUser: User = {
          uid: res.data.uid,
          name: res.data.name,
          profile: res.data.profile,
          hub_list: res.data.hub_list,
          college: res.data.college,
          faculty: res.data.faculty,
          department: res.data.department,
          id: res.data.id,
        };
        console.log("--------------------");
        // console.log(newUser)
        storeUser(newUser);
        navigation.navigate("ProfileHome");
        Toast.show("Hubを変更しました", {
          position: 50,
        });
      });
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 5 }}>
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "bold", color: "#1F2937" }}>
          選択中のHub
        </Text>
        <Button title="保存" type="clear" onPress={() => save()} />
      </View>

      <Text>
        {selectedHub.map((l, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              let list = [];
              selectedHub.map((item) => {
                if (item !== l) list.push(item);
              });
              setSelectedHub(list);
            }}
          >
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 13,
                paddingHorizontal: 11,
                paddingVertical: 5,
                marginRight: 10,
                marginBottom: 5,
              }}
              colors={["#2563EB", "#1D4ED8"]}
            >
              <Icon name="tag" color="white" size={16} />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  lineHeight: 14,
                  fontSize: 14,
                }}
              >
                {l}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Text>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          padding: 20,
          color: "#1F2937",
        }}
      >
        Hub一覧
      </Text>
      <ScrollView>
        <Text>
          {hub_list.map((l, i) => {
            if (selectedHub.includes(l)) {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    let list = [];
                    selectedHub.map((item) => {
                      if (item !== l) list.push(item);
                    });
                    setSelectedHub(list);
                  }}
                >
                  <LinearGradient
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 13,
                      paddingHorizontal: 11,
                      paddingVertical: 5,
                      margin: 0,
                    }}
                    colors={["#2563EB", "#1D4ED8"]}
                  >
                    <Icon name="tag" color="white" size={16} />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        lineHeight: 14,
                        fontSize: 14,
                      }}
                    >
                      {l}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let list = selectedHub.slice();
                    list.push(l);
                    setSelectedHub(list);
                  }}
                >
                  <LinearGradient
                    start={[0, 1]}
                    end={[1, 0]}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 13,
                      paddingHorizontal: 11,
                      paddingVertical: 5,
                      margin: 0,
                    }}
                    colors={["transparent", "transparent"]}
                  >
                    <Icon name="tag" color="#0EA5E9" size={16} />
                    <Text
                      style={{
                        color: "#0EA5E9",
                        fontWeight: "bold",
                        lineHeight: 14,
                        fontSize: 14,
                      }}
                    >
                      {l}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HubSelect;
