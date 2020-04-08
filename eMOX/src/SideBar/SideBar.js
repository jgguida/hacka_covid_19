import React from "react";
import { Image, Linking, Alert, BackHandler, Platform, TouchableOpacity } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import {
  Text,
  Container,
  List,
  ListItem,
  Icon,
  Thumbnail,
  Label,
  View,
  Left,
  Right,
  Badge,
  Toast,
} from "native-base";

import ImagePicker from 'react-native-image-picker';

import styles from "./style";

import DeviceInfo from 'react-native-device-info';

import Axios from 'axios'

import PATH from '../Path/path';

import AsyncStorage from '@react-native-community/async-storage';

import Storage from '../services/Storage';


import { connect } from 'react-redux';
import * as Actions from '../redux/actions/userLogado.actions';


// FOTO PERFIL SELECIONAR CAMERA OU GALERIA
const options = {
  title: 'Selecione uma foto',
  takePhotoButtonTitle: 'Usar câmera do dispositivo',
  chooseFromLibraryButtonTitle: 'Escolher foto da galeria',
  customButtons: [{ name: 'fb', title: 'Excluir foto do perfil' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  cancelButtonTitle: 'Cancelar',
};

const datas = [
  {
    name: "Início",
    route: "Início",
    icon: "home",
    bg: "#C5F442"
  },
  {
    name: "Meu Perfil",
    // route: "Meu Perfil",
    type: "Entypo",
    icon: "user",
    bg: "#C5F442"
  },
  {
    name: "Opção 03",
    // route: "Beneficiary",
    type: "Entypo",
    icon: "newsletter",
    bg: "#C5F442"
  },
  {
    name: "Outra Opção",
    // route: "Trocar Pessoa",
    type: "Entypo",
    icon: "users",
    bg: "#C5F442"
  },
  
  {
    name: "Sair",
    route: "Sair",
    type: "FontAwesome",
    icon: "power-off",
    bg: "#C5F442"
  },
];




import { StackActions, NavigationActions } from 'react-navigation';
const resetAction = StackActions.reset({
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({ routeName: 'Login' }),
  ],
});

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      nome: "",
      cpf: "",
      token: "",
      idUser: "",
      isConnected: true,
      foto: '',
      userLogado: { foto64: null }
    };

  }

  async componentDidMount() {

    //verificando conexão de internet do dispositivo
    let self = this

    function handleFirstConnectivityChange(isConnected) {
      (isConnected ? self.setState({ isConnected: true }) : self.setState({ isConnected: false }))
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      );
    }
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );


    this._isMount = true; //controle de montagem do elemento
  }

  

  //gerenciamento de montagem e desvantagem do elemento.
  componentWillUnmount() {
    this._isMount = false;
  }

  setState(params) {
    if (this._isMount) {
      super.setState(params);
    }
  }

  
  getVersionBuild = () => {
    const version = DeviceInfo.getVersion(); // versão de build
    let n1 = version.charAt(0);
    let n2 = version.charAt(1);
    if (n2 == 0) {
      n2 = '.'
    }
    else {
      n2 = n2 + '.'
    }
    let n3 = version.charAt(2);
    let n4 = version.charAt(3);
    if (n4 == 0) {
      n4 = '.'
    }
    else {
      n4 = '.' + n4
    }
    let n5 = version.charAt(4);
    let versionBuild = n1 + n2 + n3 + n4 + n5


    if (Platform.OS === 'ios') {
      versionBuild = version

    }


    return (versionBuild)

  }

  








  render() {

    let foto = this.props.userLogado.foto64;

    const { navigation } = this.props
    

      return (
        <Container>
        
              <View>
                <View style={{
                  height: "90%",
                }}>
                  <Image
                    source={
                      require('../imgs/sidebar.png')
                    }
                    style={{
                      height: 120,
                      width: "100%",
                      alignSelf: "stretch",
                      position: "absolute",
                    }}
                  />


                  {
                    (foto == '' || foto == null || foto == 'null' || foto == undefined || foto == 'undefined') ?

                      <Thumbnail style={{
                        height: 80,
                        width: 80,
                        position: "absolute",
                        alignSelf: "center",
                        top: 20,
                      }}
                        large
                        source={require('../imgs/perfil.jpg')}
                      />

                      :

                      <Thumbnail
                        large
                        style={{
                          height: 80,
                          width: 80,
                          position: "absolute",
                          alignSelf: "center",
                          top: 20,
                        }}
                        source={}
                      />

                  }

                  {/*<TouchableOpacity
                    onPress={() => { this.enviarFoto() }}
                  >*/}
                    <Label style={{
                      marginTop: 100,
                      marginBottom: 10,
                      fontSize: 12,
                      textAlign: "center",
                      fontFamily: 'SourceSansPro-Regular',
                      color: '#ffffff'
                    }}>
                      {this.state.nome}
                    </Label>
                  {/*</TouchableOpacity>*/}

                  <List
                    dataArray={datas}
                    renderRow={(data, indice) =>

                      <ListItem
                        key={indice}
                        button
                        noBorder
                        onPress={() => {
                         
                          if (data.route == "Sair") {

                            Alert.alert(
                              '',
                              'Deseja encerrar o aplicativo?',
                              [
                                {
                                  text: 'Não',
                                  onPress: () => console.log('Não Pressionado.')
                                },
                                {
                                  text: 'Sim',
                                  onPress: () => {
                                    this.props.navigation.dispatch(resetAction);
                                  }
                                }
                              ],
                              { cancelable: false }
                            )

                            return
                          }

                          this.props.navigation.closeDrawer()
                          this.props.navigation.navigate(data.route, { cpf: this.state.cpf, })


                        }}
                      >
                        <Left style={{ marginBottom: -5 }}>
                          <Icon
                            active
                            type={data.type}
                            name={data.icon}
                            style={{ color: "#777", fontSize: 20, width: 24 }}
                          />

                          {data.color == undefined
                            ?
                            <Text style={styles.text}>
                              {data.name}
                            </Text>
                            :
                            <Text style={{
                              color: data.color,
                              fontSize: 14,
                              marginLeft: 20
                            }}>
                              {data.name}
                            </Text>}


                        </Left>
                        {data.types &&
                          <Right style={{ flex: 1 }}>
                            <Badge
                              style={{
                                borderRadius: 3,
                                height: 25,
                                width: 72,
                                backgroundColor: '#2b579e'
                              }}
                            >
                              <Text
                                style={styles.badgeText}
                              >{`${data.types}`}</Text>
                            </Badge>
                          </Right>}
                      </ListItem>}
                  />

                </View>

                <View style={{
                  height: "10%", backgroundColor: '#fafafa', marginTop: 10,
                }}>
                  <Label style={{ marginTop: 8, fontSize: 10, textAlign: "center", }}>Versão {this.getVersionBuild()}</Label>
                </View>
              </View>

          
        </Container>
      );

    

  }
}


const mapStateToProps = state => {
  return {
    userLogado: state.userLogadoReducer.userLogado
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateFotoUserLogado: async (foto) => {
      let ul = await Actions.updateFotoUserLogado(foto)
      dispatch(ul)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar)