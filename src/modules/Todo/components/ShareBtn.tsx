import React from 'react';
import { StyleSheet, View,Text} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 
import { Icon } from 'react-native-elements'

type Props = {
  onPressBtn: () => void;
}

const ShareBtn: React.FC<Props> = (props) => {
  const {onPressBtn} = props
  return (
        <View style={styles.btnWrap}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={onPressBtn} 
          >
          <Icon 
            size={20}
            name="share"
            type='font-awesome'
            color='white'
          />
          <Text style={{color: 'white', fontWeight: 'bold'}} >Todoリストをシェアする</Text>
          </TouchableOpacity>
      </View>
  )
}

export default ShareBtn

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#60A5FA',
    width: 210,
    height: 60,
    borderRadius: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  btnWrap: {
    position: 'absolute',
    bottom: '6%',
    left: '18%'
  },
})