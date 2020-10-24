import { all, put, call, fork, take } from 'redux-saga/effects';
import * as API from '../../rest/api';
import {
	projectActionCreators, PROJECT_LOAD_ALL_REQUEST, ASSETS_LOAD_REQUEST
} from './actions';

export function* asyncLoadProjects({ payload, resolve, reject }) {
	try {
		const response = yield call(API.getProjects, payload);
		if (response.data) {
			yield put(projectActionCreators.loadProjectsSuccess(response.data));
		}
		resolve(response.data);
	} catch (err) {
		reject(err)
	}
}

export function* watchLoadProjects() {
	while (true) {
		const action = yield take(PROJECT_LOAD_ALL_REQUEST);
		yield* asyncLoadProjects(action);
	}
}

export function* asyncLoadAssets({ payload, resolve, reject }) {
	try {
		const response = yield call(API.getAssetsByProjectID, payload);
		if (response.data) {
			yield put(projectActionCreators.loadAssetsSuccess(response.data));
		}
		resolve(response.data);
	} catch (err) {
		reject(err)
	}
}

export function* watchLoadAssets() {
	while (true) {
		const action = yield take(ASSETS_LOAD_REQUEST);
		yield* asyncLoadAssets(action);
	}
}

export default function* () {
	yield all([
		fork(watchLoadProjects),
		fork(watchLoadAssets)
	]);
}
