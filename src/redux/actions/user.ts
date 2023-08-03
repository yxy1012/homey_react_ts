import { STORE_USER, REMOVE_USER } from "../constant";
export const createStoreUserAction = (userObj:any) => {
    sessionStorage.setItem('userId', userObj.id);
    sessionStorage.setItem('userEmail', userObj.email);
    return {type: STORE_USER, data: userObj};
}
export const createRemoveUserAction = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    return {type: REMOVE_USER};
}