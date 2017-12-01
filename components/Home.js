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
  TouchableOpacity
} from 'react-native';


const style = StyleSheet.create({
    button: {
      backgroundColor:'#131313',
      padding:20,
      paddingLeft:40,
      paddingRight:40,
      opacity:0.6,
      borderRadius:60,
      borderWidth:2,
      borderColor:'#fff'
    },
    buttonText: {
      color:'#fff',
      fontSize:20,
      fontFamily:'Helvetica Neue',
      fontWeight:'bold'
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
      flex: 2,
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

        <TouchableOpacity
          style={{flex:1, justifyContent:'space-around'}}
          onPress={() => {

            Actions.map();
          }}>
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
