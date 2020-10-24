import { initialState } from './selectors';
import {
	PROJECT_LOAD_ALL_SUCCESS, ASSETS_LOAD_SUCCESS, ANNOTATE_SET_HIGH_LIGHTED_COLOR_REQEUST, SET_SELECTED_TOOL_INDEX_REQUEST,
	SET_SELECTED_BOTTOM_BUTTON_INDEX_REQUEST, SET_SELECTED_HEADER_BUTTON_INDEX_REQUEST, SET_SELECTED_ASSET_REQUEST, SET_SELECTED_TIMELINES_REQUEST
} from './actions';

export default function project(state = initialState, action = {}) {
	const { type, payload } = action
	switch (type) {
		case PROJECT_LOAD_ALL_SUCCESS:
			return {
				...state,
				projects: payload.projects,
				assets: payload.assets,
				annotations: payload.annotations,
				isProjectLoaded: true
			}

		case ASSETS_LOAD_SUCCESS:
			return {
				...state,
				assets: payload
			}

		case SET_SELECTED_TOOL_INDEX_REQUEST:
			return {
				...state,
				selectedToolIndex: payload
			}

		case SET_SELECTED_BOTTOM_BUTTON_INDEX_REQUEST:
			return {
				...state,
				selectedBottomButtonIndex: payload
			}

		case SET_SELECTED_HEADER_BUTTON_INDEX_REQUEST:
			return {
				...state,
				selectedHeaderButtonIndex: payload
			}

		case ANNOTATE_SET_HIGH_LIGHTED_COLOR_REQEUST:
			return {
				...state,
				highlightedColor: payload
			}

		case SET_SELECTED_ASSET_REQUEST:
			return {
				...state,
				selectedAsset: payload
			}

		case SET_SELECTED_TIMELINES_REQUEST:
			return {
				...state,
				selectedTimelines: payload
			}
		default:
			return state;
	}
}
