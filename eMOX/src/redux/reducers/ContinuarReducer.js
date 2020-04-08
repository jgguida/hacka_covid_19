const INITIAL_STATE = {
  cpf: "",
  senha: "",
};

export default (state = INITIAL_STATE, action) => {
  // ATUALIZAÇÃO DO ESTADO DA APLICAÇÃO
  switch (action.type) {
    case 'modifica_cpf':
      return { 
        ...state, 
        cpf: action.payload
      }

    case 'modifica_senha':
      return { 
        ...state, 
        senha: action.payload 
      }
    
    case 'guardaCpf': 
      return {
        ...state,
        guardaCpf: action.payload
      }

    default:
      return state;
  }
};

