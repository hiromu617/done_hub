import React from 'react';
import { StyleSheet, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 

type Props = {
  onPressBtn: () => void;
}

const CircleBtn: React.FC<Props> = (props) => {
  const {onPressBtn} = props
  return (
        <View style={styles.btnWrap}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={onPressBtn} 
          >
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
      </View>
  )
}

export default CircleBtn

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: 'center',
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
    bottom: '5%',
    right: '5%',
  },
})