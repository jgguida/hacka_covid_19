
// ACTION DE CADASTRO DE USUARIO 
export const cadastrar = ( senha ) => {

    return {
        type: 'cadastrar',
        payload: {
            senha
        }
    }
}
