import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';

const middlewares = [];

// const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;

const sagaMonitor = null

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

middlewares.push(sagaMiddleware);

const composer = __DEV__
  ? compose(applyMiddleware(...middlewares))
  : compose(applyMiddleware(...middlewares));

const store = createStore(rootReducer, composer);

sagaMiddleware.run(rootSaga);

export default store;