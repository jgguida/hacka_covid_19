import React, { Component } from 'react';
import { TextInputMask } from 'react-native-masked-text';

import Axios from 'axios';
import DeviceInfo from 'react-native-device-info';

import PATH from '../Path/path'

import SpinnerButton from 'react-native-spinner-button';
import firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Storage from '../services/Storage';

let idNotification = '';


import {
  StyleSheet,
  View,
  Switch,
  Image,
  Alert,
  TouchableOpacity,
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  ScrollView,
  Platform,
  YellowBox,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Content,
  Body,
  List,
  Button,
  Text,
  Label,
  ListItem,
  Left,
  Right,
  Icon,
  Spinner,
  Toast,
  Header,

  Thumbnail
} from "native-base";

import { Grid, Row } from "react-native-easy-grid";

import { connect } from 'react-redux'
import { modifica_cpf, modifica_senha, continuar, cadastrar } from '../redux/actions/ContinuarAction'

import * as Actions from '../redux/actions/userLogado.actions';

const deviceWidth = Dimensions.get("window").width;

YellowBox.ignoreWarnings([
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);


class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.backPressSubscriptions = new Set()
    this.state = {
      cpf: "",
      senha: "",
      guardarCpf: true,
      hidePassword: true,
      materialLoading: false,
      cpfReady: false,
      loaded: false,
      renderClear: false,
      dadosLocais: '',
      typeMask: 'custom',

      usuario: '',

      isModalVisible: false,
      contratos: [],
      contrato_selecionado: ''


    }
   

    console.ignoredYellowBox = [
      'Setting a timer'
    ];

  }



  componentDidMount = async () => {
    let statusCPF = true;

    let value = await AsyncStorage.getItem('userLogado');
    let usuario = JSON.parse(value)

    //BACKHANDLER
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      let invokeDefault = true
      const subscriptions = []

      this.backPressSubscriptions.forEach(sub => subscriptions.push(sub))

      for (let i = 0; i < subscriptions.reverse().length; i += 1) {
        if (subscriptions[i]() == undefined) {
          invokeDefault = false
          this.props.navigation.navigate('Login');
          break
        }
      }

      if (invokeDefault) {
        this.props.navigation.navigate('Login');
      }
    })

    this.backPressSubscriptions.add(this.handleHardwareBack)

  }

  componentWillUnmount() {
    //BACKHANDLER
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    this.backPressSubscriptions.clear()

    

  }

  handleHardwareBack = () => { /* do your thing */ }

  validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs inválidos conhecidos	
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    // Valida 1o digito	
    add = 0;
    for (i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    // Valida 2o digito	
    add = 0;
    for (i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  }

  validaFormulario() {
    let cpf = this.props.cpf;
    let senha = this.props.senha;
    let validaForm = false;

    let validaCPF = this.validarCPF(cpf)
    if (validaCPF == false) {
      this.loadingDisable()
      Alert.alert(
        '',
        'CPF inválido.',
        [
          {
            text: 'OK', onPress: () => {
              let el = this.refs.cpfInput.getElement()
              el.focus()
            }
          },
        ],
        { cancelable: false }
      )
    }
    else if (senha.length < 6) {
      this.loadingDisable()
      Alert.alert(
        '',
        'Senha menor que 6 caracteres.',
        [
          {
            text: 'OK', onPress: () => {
              let el = this.refs.senhaInput.getElement()
              el.focus()
            }
          },
        ],
        { cancelable: false }
      )
    }
    else {
      validaForm = true;
    }
    return validaForm
  }

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  clearCPF = () => {
    this.props.modifica_cpf("")
  }

  loadingDisable = () => {
    this.setState({ materialLoading: false });
  }

  // MODIFICAR STATUS DO USUARIO - GUARDAR CPF - CONTROLADO SEM REDUX - OBSERVAÇÃO MODIFICAÇÃO DO STATUS
  _GUARDAR_CPF = () => {
    this.setState({ guardarCpf: !this.state.guardarCpf });
    const status = this.state.guardarCpf;
    return console.log("STATUS guardarCPF: " + !status)
  }

  // FUNCAO DE LOGIN - CONTROLADO SEM REDUX - EVENTO AO ACIONAR O BOTAO ' CONTINUAR '
  async _CONTINUAR(navigation) {

    this.setState({ materialLoading: true });

    const cpf = this.props.cpf

    const senha = this.props.senha

    let statusCPF = this.state.guardarCpf
    let form = this.validaFormulario();
    //pegando dados locais
    let dadosLocais = this.state.dadosLocais

    let qtd = await AsyncStorage.getItem('qtdContratos');
    let qtdcontratosLocal = JSON.parse(qtd)


    navigation.navigate('Home', { tipo: 'titular' })
    this.loadingDisable()


  }




  mudaTypeMask() {
    this.setState({ typeMask: 'cpf' })
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

    const { navigation } = this.props

    return (

      <Container style={styles.container}>



        <Image
          source={
            require('')
          }
          style={{
            flex: 1,
            top: 400,
            height: '50%',
            width: '200%',
            resizeMode: 'stretch',
            position: "absolute",
          }}
        />

        {this.state.loaded == false ? <Spinner color='#0C3D62' /> : <Label></Label>}

        {!this.state.cpfReady ?
          <View style={styles.textBoxBtnHolder}>
            <TextInputMask
              style={styles.item}
              keyboardType='numeric'
              type={'cpf'}
              placeholder="CPF"
              value={this.props.cpf}
              maxLength={14}
              ref='cpfInput'
              returnKeyType='next'
              onChangeText={(cpf) => {
                if (this.state.renderClear == false) this.setState({ renderClear: true })
                this.props.modifica_cpf(cpf)
              }
              }
              onEndEditing={() => {
                let e = this.props.cpf.length
                let cpf = this.props.cpf
                let validaCPF = this.validarCPF(cpf)
                if (e < 14) {
                  Toast.show({
                    text: "CPF incompleto!",
                    position: "top",
                  })
                  return
                }
                if (e == 14 && validaCPF == false) {
                  Toast.show({
                    text: "CPF inválido!",
                    type: "danger",
                    position: "top",
                  })
                  return
                }

                let el = this.refs.senhaInput.getElement()
                el.focus()
                this.setState({ renderClear: false })

              }
              }
            />
            {this.state.renderClear && (

              this.state.renderClear ?
                <TouchableOpacity activeOpacity={0.8} style={styles.btnClear} onPress={this.clearCPF}>
                  <Icon style={{ color: '#0C3D62' }} type='Ionicons' name='ios-close' style={styles.btnImage} />
                </TouchableOpacity>
                :
                <View></View>

            )}
          </View>

          :
          <View style={styles.textBoxBtnHolder}>
            <TextInputMask
              style={styles.item}
              type={this.state.typeMask}
              options={{
                mask: '999.$$$.$$$-99',
                translation: {
                  $: val => {
                    return '*'
                  },
                },

              }}
              placeholder="CPF"
              value={this.props.cpf}
              maxLength={14}
              ref='cpfInput'
              returnKeyType='next'
              onFocus={() => { this.mudaTypeMask() }}
              onChangeText={(cpf) => {
                this.setState({ renderClear: true })
                this.props.modifica_cpf(cpf)
              }
              }
              onEndEditing={() => {
                let e = this.props.cpf.length
                let cpf = this.props.cpf
                let validaCPF = this.validarCPF(cpf)
                if (e < 14) {
                  Toast.show({
                    text: "CPF incompleto!",
                    position: "top",
                  })
                  return
                }
                if (e == 14 && validaCPF == false) {
                  Toast.show({
                    text: "CPF inválido!",
                    type: "danger",
                    position: "top",
                  })
                  return
                }
                let el = this.refs.senhaInput.getElement()
                el.focus()
              }
              }
            />
            {this.state.renderClear && (
              <TouchableOpacity activeOpacity={0.8} style={styles.btnClear} onPress={this.clearCPF}>
                <Icon style={{ color: '#0C3D62' }} type='Ionicons' name='ios-close' style={styles.btnImage} />
              </TouchableOpacity>
            )}
          </View>

        }

        <View style={styles.textBoxBtnHolder}>
          <TextInputMask
            style={styles.item}
            keyboardType='default'
            secureTextEntry={this.state.hidePassword}
            style={styles.textBox}
            ref='senhaInput'
            type={'custom'}
            placeholder="Senha"
            options={{ mask: '*********************' }}
            onChangeText={(senha) => {
              let e = this.props.senha.length
              this.props.modifica_senha(senha)
              if (e < 6) {
                Toast.show({
                  text: "Mínimo de 6 e máximo de 20 caracteres!",
                  position: "top",
                })
              }
            }
            }
            onEndEditing={() => {
              let e = this.props.senha.length
              if (e < 6) {
                Toast.show({
                  text: "Senha incompleta",
                  type: "danger",
                  position: "top",
                })
                return
              }
            }}
            value={this.props.senha}
            maxLength={20}
          />
          <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
            <Image source={(this.state.hidePassword) ? require('../imgs/hide.png') : require('../imgs/view.png')} style={styles.btnImage} />
          </TouchableOpacity>

        </View>

        <View style={styles.markCPF}>

          <Label style={styles.markCPFText}> Manter Conectado </Label>

          <Switch
            onValueChange={this._GUARDAR_CPF}
            value={this.state.guardarCpf}
            style={styles.switchButton}
            thumbColor="#fff"
            trackColor="#2383C6"
          />
        </View>

        <View style={styles.viewSpinner}>

          <SpinnerButton
            buttonStyle={styles.buttonStyle}
            isLoading={this.state.materialLoading}
            spinnerType='MaterialIndicator'
            onPress={() => {
              this._CONTINUAR(navigation)
            }}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </SpinnerButton>
        </View>
        <Content>
          <Grid>
            <Row size={1} style={{ marginTop: 30, justifyContent: 'space-between' }}>

              <Button transparent onPress={() => { navigation.push('Entry') }}>
                <Label style={{ fontSize: 14, fontFamily: 'SourceSansPro-Regular' }}>Novo Usuário</Label>
              </Button>
              <Button transparent onPress={() => { navigation.push('Recover') }}>
                <Label style={{ fontSize: 14, fontFamily: 'SourceSansPro-Regular' }}>Esqueci a Senha</Label>
              </Button>

            </Row>


            <Row size={1} style={{ justifyContent: 'flex-end', flexDirection: "column" }}>
              <View>
                <Label style={{ color: 'black', fontSize: 8, textAlign: 'center', justifyContent: 'flex-start', marginBottom: 10, marginTop: 30, fontFamily: 'SourceSansPro-Regular' }}>ANS Nº 37928-0</Label>

                <Label style={{ fontSize: 12, textAlign: 'center', justifyContent: 'flex-start', fontFamily: 'SourceSansPro-Regular' }}>Versão {this.getVersionBuild()}</Label>
              </View>
            </Row>
          </Grid>

        </Content>
      </Container >

    );
  }
}

LoginScreen.navigationOptions = ({ navigation }) => {
  return {
    header: (
      <Header style={{ backgroundColor: '#fafafa' }}>
        <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />

        <Left>
          <Button
            transparent
            onPress={() => navigation.navigate('Login')}
          >
            <Icon style={{ color: '#2b579e' }} type='Ionicons' name='ios-arrow-back' />
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
          <Button transparent onPress={() => { }}>

          </Button>
        </Right>

      </Header>
    )
  };
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingTop: 20,
  },
  item: {
    marginTop: 20,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,


  },
  markCPF: {
    marginTop: 40,
    marginBottom: 40,
    width: 200,
    alignSelf: "flex-end",
  },
  markCPFText: {
    fontSize: 12,
    fontFamily: 'SourceSansPro-Regular',
    alignSelf: "flex-end",
    marginRight: 50,
  },
  switchButton: {
    marginTop: -25,
    alignSelf: "flex-end",
  },

  textBoxBtnHolder:
  {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },

  textBox:
  {
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    paddingVertical: 0,

  },

  visibilityBtn:
  {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5
  },

  btnClear: {
    position: 'absolute',
    right: -3,
    height: 40,
    width: 35,
    padding: 5
  },

  btnImage:
  {
    height: '100%',
    width: '100%'
  },

  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'SourceSansPro-SemiBold',
    //paddingHorizontal: 20,
  },
  buttonStyle: {
    backgroundColor: "#2b579e",
    alignItems: 'center',
    width: (deviceWidth - 100),
    borderRadius: 60,
  },

  viewSpinner: {
    alignItems: 'center',
    //marginTop: 30,
    flexDirection: 'column',
  },



});

const mapStateToProps = state => {
  return ({
    cpf: state.ContinuarReducer.cpf,
    senha: state.ContinuarReducer.senha,
    //guardarCpf: state.ContinuarReducer.guardarCpf
  })
};

const mapDispatchToProps = dispatch => {
  return {
    modifica_cpf: (cpf) => {
      dispatch(modifica_cpf(cpf))
    },
    modifica_senha: (senha) => {
      dispatch(modifica_senha(senha))
    },
    continuar: () => {
      dispatch(continuar())
    },
    cadastrar: () => {
      dispatch(cadastrar())
    },
    updateUserLogado: async (user) => {
      let ul = await Actions.updateUserLogado(user)
      dispatch(ul)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
