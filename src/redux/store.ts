import { applyMiddleware, createStore } from "redux";
import allReducers from './reducers';
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';

export default createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)))