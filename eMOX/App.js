/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
//import SplashScreen from 'react-native-smart-splash-screen';
import { Root } from "native-base";

// MEUS COMPONENTES - TELAS -
import HomeScreen from "./src/HomeScreen/index.js";
import LoginScreen from './src/LoginScreen/LoginScreen';



// CONFIGURAÇÃO DO REDUX NO PROJETO
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Reducers from './src/redux/reducers/index'

// PILHA DE NAVEGAÇÃO DAS PAGINAS DA APLICAÇÃO
import { createStackNavigator } from 'react-navigation';


const AppStackNavigator = createStackNavigator(
  {
   
    Login: { screen: LoginScreen }, // TELA DE LOGIN

    Home: {
      screen: HomeScreen,
      navigationOptions: ({ header: null })
    },
  
  },
  {
    initialRouteName: "Login",
  }
);

export default class App extends Component {
  constructor(props){
    super(props);


  }

 


  



 




  componentDidMount() {
    // SplashScreen.close({
    //   animationType: SplashScreen.animationType.scale,
    //   duration: 2000,
    //   delay: 300,
    // })
  }

 

  render() {
    // ARMAZENANDO OS ATRIBUTOS NA STORE CONTROLADOS PELO REDUCERS 
    return (
      <Provider store={createStore(Reducers)}>
        <Root>
          <SafeAreaView style={styles.safeArea}>
            <AppStackNavigator />
          </SafeAreaView>
        </Root>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#e9e9ea'
  }
})