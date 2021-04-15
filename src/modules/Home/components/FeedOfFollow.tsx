import React from 'react';
import { StyleSheet, Text, View ,StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


function FeedOfFollow() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </SafeAreaView>
  );
}

export default FeedOfFollow