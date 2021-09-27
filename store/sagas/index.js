import { all } from 'redux-saga/effects';

/**
 * watchPlayerStore
 */
import { watchPlayerStore } from './player';

export default function* rootSaga() {
    yield all([
        watchPlayerStore(),
    ]);
}
