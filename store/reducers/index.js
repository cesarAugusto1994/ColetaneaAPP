import { combineReducers } from 'redux';

import app from './app';
import { playerReducer as player } from './player/player';
import storage from './storage';

const reducers = combineReducers({
    app, player, storage
});

export default reducers;
