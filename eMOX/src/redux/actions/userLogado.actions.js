
export const GET_USER_LOGADO = '[USER LOGADO APP] GET USER LOGADO';
export const UPDATE_USER_LOGADO = '[USER LOGADO APP] UPDATE USER LOGADO';
export const UPDATE_FOTO_USER_LOGADO = '[USER LOGADO APP] UPDATE FOTO USER LOGADO';
export const DELETE_FOTO_USER_LOGADO = '[USER LOGADO APP] DELETE FOTO USER LOGADO';

import Storage from '../../services/Storage';

export async function getUserLogado()
{
    let data = await Storage.getUserLogged();
    
    return {
        type   : GET_USER_LOGADO,
        payload: data
    };
}

export async function updateUserLogado(user)
{
    let data = await Storage.updateUserLogged(user);

    return {
        type   : UPDATE_USER_LOGADO,
        payload: data
    }
}

export async function updateFotoUserLogado(foto)
{
    let data = await Storage.updateFotoUserLogado(foto)

    return {
        type   : UPDATE_FOTO_USER_LOGADO,
        payload: data
    }
}

export async function deleteFotoUserLogado()
{
    let data = await Storage.updateFotoUserLogado('')

    return {
        type   : DELETE_FOTO_USER_LOGADO,
        payload: data
    }
}

