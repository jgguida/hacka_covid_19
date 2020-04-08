// NOTIFICACAO NO CADASTRO PUSH
//import firebase from 'firebase'
//import PushNotification from 'react-native-push-notification'

// CONFIGURACAO DO PUSH BEM VINDO
/*PushNotification.configure({

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: "YOUR GCM (OR FCM) SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
    soundName: "rush"
  },

  popInitialNotification: true,
  requestPermissions: true,

});*/

export const modifica_cpf = (cpf) => {
    return {
        type: 'modifica_cpf',
        payload: cpf
    }
}

export const modifica_senha = (senha) => {   

    return {
        type: 'modifica_senha',
        payload: senha
    }
}

export const cadastrar = () => {
    navigation.navigate('Entry')
    return {
        type: 'cadastrar'
    }
}