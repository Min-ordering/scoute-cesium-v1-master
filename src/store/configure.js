/* globals window */
import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory as createHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';

import sagas from './sagas';
import createRootReducer from './reducers';

export const history = createHistory();

const configureStore = (initialState = {}, services = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  if (process.env.NODE_ENV === 'development') {
    // middlewares.push(createLogger());
  }

  const enhancers = [
    applyMiddleware(...middlewares), // empty for now;
  ];

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = process.env.NODE_ENV !== 'production'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
  /* eslint-disable no-underscore-dangle */

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(...enhancers),
  );

  let sagaTask = sagaMiddleware.run(sagas);

  if (module.hot) {
    const reducersComponent = require('./reducers').default;
    module.hot.accept(reducersComponent, () => {
      const nextReducer = require('./reducers').default;
      store.replaceReducer(nextReducer);
    });

    const sagasComponent = require('./sagas').default;
    module.hot.accept(sagasComponent, () => {
      const nextSagas = require('./sagas').default;
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas, services);
      });
    });
  }

  return store;
};

export default configureStore;
