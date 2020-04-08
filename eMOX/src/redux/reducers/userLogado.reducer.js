
import * as Actions from '../actions/userLogado.actions'

const initialState = {
    userLogado: {}
};

export default (state = initialState, action) => {
    switch (action.type) {

        case Actions.UPDATE_USER_LOGADO:
            return {
                ...state,
                userLogado: action.payload
            };

        case Actions.UPDATE_FOTO_USER_LOGADO:
            return {
                ...state,
                userLogado: action.payload
            };

        case Actions.GET_USER_LOGADO:
            return {
                ...state,
                userLogado: action.payload
            };

        case Actions.DELETE_FOTO_USER_LOGADO:
            return {
                ...state,
                userLogado: action.payload
            };

        default:
            return state;
    }
};