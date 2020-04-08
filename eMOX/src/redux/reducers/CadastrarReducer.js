//import { modifica_cpf, modifica_senha } from '../actions/ContinuarAction'; 
import { cadastrar } from '../actions/CadastrarAction'; 

const INITIAL_STATE = {
  //cpf: " ",
  //senha: " ",
  email: " ",
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case cadastrar:
      return { 
        //...state, 
        //cpf: action.payload,
        //senha: senha.payload,
        email: email.payload
      }

    default:
      return state;

  }
};
