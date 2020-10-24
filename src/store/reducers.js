import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import camelCase from 'lodash.camelcase';

const reducers = {};

const req = require.context('.', true, /\.\/.+\/reducer\.js$/);

req.keys().forEach(key => {
  const storeName = camelCase(key.replace(/\.\/(.+)\/.+$/, '$1'));
  reducers[storeName] = req(key).default;
});

export default (history) => combineReducers({
  router: connectRouter(history),
  ...reducers
});
