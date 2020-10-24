import { all, put, call, fork, take } from 'redux-saga/effects';
import * as API from '../../rest/api';
import {
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  authActionCreators,
} from './actions';

export function* asyncUserLogin({ payload, resolve, reject }) {
  try {
    const response = yield call(API.login, payload);
    if (response.data) {
      yield put(authActionCreators.loginSuccess(response.data));
    }
    resolve(response.data);
  } catch (err) {
    reject(err)
  }
}

export function* watchUserLogin() {
  while (true) {
    const action = yield take(LOGIN_REQUEST);
    yield* asyncUserLogin(action);
  }
}

export function* asyncUserRegister({ payload, resolve, reject }) {
  try {
    const response = yield call(API.register, payload);
    if (response.data) {
      yield put(authActionCreators.registerSuccess(response.data));
    }
    resolve(response.data);
  } catch (err) {
    reject(err)
  }
}

export function* watchUserRegister() {
  while (true) {
    const action = yield take(REGISTER_REQUEST);
    yield* asyncUserRegister(action);
  }
}

export default function* () {
  yield all([
    fork(watchUserRegister),
    fork(watchUserLogin)
  ]);
}
