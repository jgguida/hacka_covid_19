import { combineReducers } from 'redux'

// MEUS REDUCERS
import ContinuarReducer from './ContinuarReducer'  // FUNCAO DE LOGIN 

import userLogado from './userLogado.reducer';
   
const Reducers = combineReducers({
    ContinuarReducer: ContinuarReducer,
    userLogadoReducer: userLogado
});

export default Reducers;