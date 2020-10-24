import { createAction } from 'redux-actions';
import { createPromiseAction } from '../../rest/createPromiseAction';

export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const REGISTER_REQUEST = 'auth/REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';

export const authActionCreators = {
    login: createPromiseAction(LOGIN_REQUEST),
    loginSuccess: createAction(LOGIN_SUCCESS),
    register: createPromiseAction(REGISTER_REQUEST),
    registerSuccess: createAction(REGISTER_SUCCESS),
    logout: createAction(LOGOUT_REQUEST)
};