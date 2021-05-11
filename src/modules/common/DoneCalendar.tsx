import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import axios from "../../constants/axios";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

type Props = {
  userData;
};

const DoneCalendar: React.FC<Props> = (props) => {
  const { userData } = props;
  const [DoneLog, setDonelog] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchDoneCalendarData();
  }, []);

  const fetchDoneCalendarData = () => {
    setLoading(true);
    axios
      .get("/api/done_log/" + userData.uid)
      .then((res) => {
        console.log(res.data);
        const colors = [
          "#BFDBFE",
          "#93C5FD",
          "#3B82F6",
          "#2563EB",
          "#1D4ED8",
          "#1E40AF",
          "#1E3A8A",
        ];
        const parseLog = Object.fromEntries(
          Object.entries(res.data).map(([key, val]) => {
            let color: string;
            if (val >= 7) color = colors[6];
            else color = colors[val - 1];
            return [key, { color: color, textColor: "white" }];
          })
        );
        console.log(parseLog);
        setDonelog(parseLog);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <SafeAreaView style={{backgroundColor: "white", padding: 15, height: 330}}>
      {loading ? (
        <View style={{width: '100%', height: '100%',flex: 1,
        alignItems: 'center',
        justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : (
        <Calendar
          markingType={"period"}
          markedDates={DoneLog}
        />
      )}
    </SafeAreaView>
  );
};

export default DoneCalendar;
