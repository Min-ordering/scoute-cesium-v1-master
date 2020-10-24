import { createAction } from 'redux-actions';
import { createPromiseAction } from '../../rest/createPromiseAction';

export const PROJECT_LOAD_ALL_REQUEST = 'project/PROJECT_LOAD_ALL_REQUEST';
export const PROJECT_LOAD_ALL_SUCCESS = 'project/PROJECT_LOAD_ALL_SUCCESS';
export const ASSETS_LOAD_REQUEST = 'project/ASSETS_LOAD_REQUEST';
export const ASSETS_LOAD_SUCCESS = 'project/ASSETS_LOAD_SUCCESS';
export const ANNOTATE_SET_HIGH_LIGHTED_COLOR_REQEUST = 'project/ANNOTATE_SET_HIGH_LIGHTED_COLOR_REQEUST';
export const SET_SELECTED_TOOL_INDEX_REQUEST = 'project/SET_SELECTED_TOOL_INDEX_REQUEST';
export const SET_SELECTED_BOTTOM_BUTTON_INDEX_REQUEST = 'project/SET_SELECTED_BOTTOM_BUTTON_INDEX_REQUEST';
export const SET_SELECTED_HEADER_BUTTON_INDEX_REQUEST = 'project/SET_SELECTED_HEADER_BUTTON_INDEX_REQUEST';
export const SET_SELECTED_ASSET_REQUEST = 'project/SET_SELECTED_ASSET_REQUEST';
export const SET_SELECTED_TIMELINES_REQUEST = 'project/SET_SELECTED_TIMELINES_REQUEST';

export const projectActionCreators = {
    loadProjects: createPromiseAction(PROJECT_LOAD_ALL_REQUEST),
    loadProjectsSuccess: createAction(PROJECT_LOAD_ALL_SUCCESS),
    loadAssets: createPromiseAction(ASSETS_LOAD_REQUEST),
    loadAssetsSuccess: createAction(ASSETS_LOAD_SUCCESS),
    setHighlightedColor: createAction(ANNOTATE_SET_HIGH_LIGHTED_COLOR_REQEUST),
    setSelectedToolIndex: createAction(SET_SELECTED_TOOL_INDEX_REQUEST),
    setSelectedBottomButtonIndex: createAction(SET_SELECTED_BOTTOM_BUTTON_INDEX_REQUEST),
    setSelectedHeaderButtonIndex: createAction(SET_SELECTED_HEADER_BUTTON_INDEX_REQUEST),
    setSelectedAsset: createAction(SET_SELECTED_ASSET_REQUEST),
    setSelectedTimelines: createAction(SET_SELECTED_TIMELINES_REQUEST),
};