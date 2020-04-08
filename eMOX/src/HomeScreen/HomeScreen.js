import React from "react";
import {
  StatusBar,
  View,
  Image,
  StyleSheet,
  Alert,
  Linking,
  BackHandler,
  DeviceEventEmitter,
  Platform,
  YellowBox,
  TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

YellowBox.ignoreWarnings([
  'VirtualizedList:'

]);

import {
  Button,
  Text,
  Container,
  Body,
  Header,
  Left,
  Icon,
  Right,
} from "native-base";

import LinearGradient from 'react-native-linear-gradient';

import DeviceInfo from 'react-native-device-info';
import { getAppstoreAppVersion } from "react-native-appstore-version-checker";


import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.backPressSubscriptions = new Set()
    this.state = {
      cpf: "",
      isModalVisible: false,
      status: true,

      modalContrato: false,
      contratos: [],
      contrato_selecionado: '',
      nomeNavigation: "",

    }

  }

  componentDidMount = async () => {

 

    //método me sobrescreve o backhandler nativo
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      let invokeDefault = true
      const subscriptions = []

      this.backPressSubscriptions.forEach(sub => subscriptions.push(sub))

      for (let i = 0; i < subscriptions.reverse().length; i += 1) {
        if (subscriptions[i]() == undefined) {
          invokeDefault = false
          Alert.alert(
            '',
            'Deseja encerrar o aplicativo?',
            [
              {
                text: 'Não',
                onPress: () => console.log('Não Pressionado.')
              },
              { text: 'Sim', onPress: () => this.props.navigation.navigate('Login') }
            ],
            { cancelable: false }
          )
          break
        }
      }

    })

    this.backPressSubscriptions.add(this.handleHardwareBack)
  }

  componentWillUnmount = () => {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    this.backPressSubscriptions.clear()
  }

  // CASO O USUARIO DESEJE SAIR DO APP
  handleHardwareBack = () => {

  }

  // MODAL - FUNCAO PARA EXIBIR O MODAL
  _toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  }

  trocaPessoa() {
    this._toggleModal
  }

 

  homeController = () => {

    let { navigation } = this.props


    /*let link = navigation.getParam('link')
    if (link == 'Agendar') {
      console.log("executou link agenda====>>>")
      let cpf = navigation.getParam('cpfNavigationLink')
      let nome = navigation.getParam('nomeNavigationLink')
      let id = navigation.getParam('idContratoLink')
      console.log("id do link do contrato no alterna contrato==>>")
      console.log(id)


      if (id) await this.linkLogin(cpf, nome, id)
    }*/

   

      return (

        //HOME PADRÃO
        <View style={styles.mainView}>

          <View style={styles.viewButton}>

            <TouchableOpacity
              transparent
              onPress={() => alert('opção 01') }
              style={{
                height: '100%', width: '100%', alignItems: "center", justifyContent: 'center', flexDirection: 'column',
              }}>
              <View
                style={{
                  position: 'relative',
                  alignItems: "center",
                  flexDirection: 'row',
                  width: wp('100%'),
                  height: hp('22%')
                }}
              >

                <Image
                  style={{
                    flex: 1,
                    width: '80%',
                    height: '80%',
                    justifyContent: 'center',
                    resizeMode: 'contain'
                  }}
                  source={
                    require('')
                  }
                />
              </View>


              <Text style={styles.text}>Menu 01</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.viewButton}>

            <TouchableOpacity
              transparent
              onPress={() => {
                alert('menu 02')
              }}
              style={{
                height: '100%', width: '100%', alignItems: "center", justifyContent: 'center', flexDirection: 'column',
              }}>
              <View
                style={{
                  position: 'relative',
                  alignItems: "center",
                  flexDirection: 'row',
                  width: wp('100%'),
                  height: hp('22%')
                }}
              >

                <Image
                  style={{
                    flex: 1,
                    width: '80%',
                    height: '80%',
                    justifyContent: 'center',
                    resizeMode: 'contain'
                  }}
                  source={
                    require('')
                  }
                />
              </View>


              <Text style={styles.text}>Menu 02</Text>
            </TouchableOpacity>


          </View>

          <View style={styles.viewButton}>

            <TouchableOpacity
              transparent
              onPress={() => alert('opção 03')}
              style={{
                height: '100%', width: '100%', alignItems: "center", justifyContent: 'center', flexDirection: 'column',
              }}>
              <View
                style={{
                  position: 'relative',
                  alignItems: "center",
                  flexDirection: 'row',
                  width: wp('100%'),
                  height: hp('22%')
                }}
              >

                <Image
                  style={{
                    flex: 1,
                    width: '80%',
                    height: '80%',
                    justifyContent: 'center',
                    resizeMode: 'contain'
                  }}
                  source={
                    require('')
                  }
                />
              </View>


              <Text style={styles.text}>Menu 03</Text>
            </TouchableOpacity>

          </View>
          
          <View style={styles.viewButton}>

          <TouchableOpacity
            transparent
            onPress={() => alert('opção 04')}
            style={{
              height: '100%', width: '100%', alignItems: "center", justifyContent: 'center', flexDirection: 'column',
            }}>
            <View
              style={{
                position: 'relative',
                alignItems: "center",
                flexDirection: 'row',
                width: wp('100%'),
                height: hp('22%')
              }}
            >

              <Image
                style={{
                  flex: 1,
                  width: '80%',
                  height: '80%',
                  justifyContent: 'center',
                  resizeMode: 'contain'
                }}
                source={
                  require('')
                }
              />
            </View>


            <Text style={styles.text}>Menu 04</Text>
          </TouchableOpacity>

        </View>

          <View style={styles.viewButton}>

            <TouchableOpacity
              transparent
              onPress={() => {
                alert('menu 05')
              }}
              style={{
                height: '100%', width: '100%', alignItems: "center", justifyContent: 'center', flexDirection: 'column',
              }}>
              <View
                style={{
                  position: 'relative',
                  alignItems: "center",
                  flexDirection: 'row',
                  width: wp('100%'),
                  height: hp('22%')
                }}
              >

                <Image
                  style={{
                    flex: 1,
                    width: '80%',
                    height: '80%',
                    justifyContent: 'center',
                    resizeMode: 'contain'
                  }}
                  source={
                    require('')
                  }
                />
              </View>


              <Text style={styles.text}>Menu 05</Text>
            </TouchableOpacity>

          </View>

          
          <View style={styles.viewButton}>

            <TouchableOpacity
              transparent
              onPress={() => { alert('menu 06') }}
              style={{
                height: '100%', width: '100%', alignItems: "center", justifyContent: 'center', flexDirection: 'column',
              }}>
              <View
                style={{
                  position: 'relative',
                  alignItems: "center",
                  flexDirection: 'row',
                  width: wp('100%'),
                  height: hp('22%')
                }}
              >

                <Image
                  style={{

                    flex: 1,
                    width: '80%',
                    height: '80%',
                    justifyContent: 'center',
                    resizeMode: 'contain'
                  }}
                  source={
                    require('')
                  }
                />
              </View>


              <Text style={styles.text}>Menu 06</Text>
            </TouchableOpacity>
          </View>
        
        
        </View>

      )

    

  }

  render() {

    let { navigation } = this.props
    let tipo = navigation.getParam('tipo')

    return (
      <Container>
        <Header style={{ backgroundColor: '#fafafa' }}>
          <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />

          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon style={{ color: '#2b579e' }} name="menu" />
            </Button>

          </Left>

          <Body
            style={{
              position: "absolute",
              alignItems: 'center',
              justifyContent: 'center',
            }}>

           

          </Body>

          <Right>

          
          </Right>

        </Header>

        {this.homeController()}


      </Container>
    );
  }


}


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
  },
  viewButton: {
    width: '50%',
    height: '33.3%',
    padding: 5,
    elevation: 5,
  },

  viewButtonFaleConosco: {
    width: '50%',
    height: '33.3%',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    padding: 5,
    elevation: 5,
    backgroundColor: '#ccc',
    opacity: 0.3
  },

  icon: {
    width: 80,
    height: 30,
    paddingLeft: 30,
    color: "#0C3D62",
  },
  text: {
    position: "relative",
    color: "#0C3D62",
    fontSize: 14,
    paddingTop: 2,
    textAlign: "center",
    fontFamily: 'SourceSansPro-Regular',
  },
  iconDisable: {
    width: 80,
    height: 30,
    paddingLeft: 30,
    color: "grey"
  },
  textDisable: {
    position: "relative",
    color: "grey",
    fontSize: 14,
    paddingTop: 2,
    textAlign: "center",
  },

  modal: {
    backgroundColor: "#fff",
    width: 350,
    height: 130,
  },

});
