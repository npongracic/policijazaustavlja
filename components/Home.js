import React,  { Component } from 'react';
import {
  Actions
} from 'react-native-router-flux';
import styles from '../styles';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';


const style = StyleSheet.create({
    button: {
      backgroundColor:'#03a9f4',
      marginLeft:40,
      marginTop:10,
      marginRight:40,
      marginBottom:40,
      flex:1,
      alignItems:'center',
      paddingTop:20,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 0.6
    },
    buttonText: {
      color:'#fff',
      fontSize:25,
      fontFamily: Platform.OS == 'ios' ? 'Helvetica Neue' : 'Roboto',
      fontWeight:'bold',

    },
    backgroundImage: {
      flex:1,
      position:'absolute',
      width: '100%',
      height:'100%'
    },
    title: {
      fontSize: 40,
      paddingTop: 55,
      paddingLeft:45,
      backgroundColor: 'transparent',
      color:'#fff',
      flex: 4,
      flexWrap: 'nowrap',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      transform:[
        { rotate: '-15deg'}
      ]
    }
});

export default class Home extends Component<{}> {


  render() {
    return(
      <View style={styles.container}>
        <Image style={style.backgroundImage}
          source={require('../assets/background.jpg')} />

        <Text style={style.title}>Policija Zaustavlja!</Text>

        <TouchableOpacity activeOpacity={0.8}
          style={{flex:1, justifyContent:'space-around'}}
          onPress={() => Actions.map()}>
          <View style={style.button}>
            <Text style={style.buttonText}>
              Pokret!
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}
