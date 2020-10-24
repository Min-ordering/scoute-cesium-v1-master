import { initialState } from './selectors';
import {
  LOGIN_SUCCESS, LOGOUT_REQUEST, REGISTER_SUCCESS
} from './actions';

export default function auth(state = initialState, action = {}) {
  const { type, payload } = action
  switch (type) {
    // Auth check
    case LOGIN_SUCCESS:
      if (payload && payload.token) {
      }

      return {
        ...state,
        isAuthenticated: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
