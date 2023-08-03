import { combineReducers } from "redux";
import userReduecer from './user';

export default combineReducers({
    user: userReduecer
})