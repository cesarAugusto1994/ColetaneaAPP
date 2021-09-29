import { call, put, takeLatest } from 'redux-saga/effects';

import {
    playerActions,
  playerTypes,
} from '../reducers/player/player';
import playerStoreService from '../../services/api/playerService';

export default function* playerStoreSaga() {
  try {
    const response = yield call(playerStoreService.fetchPlayers);

    // {
		// 	id: 1,
		// 	title: 'Heartless',
		// 	author: 'The Weeknd',
		// 	img: 'https://res.cloudinary.com/jsxclan/image/upload/v1623984884/GitHub/Projects/Musicont/mock/images/heartless_du9yxe.jpg',
		// 	uri: 'https://coletanea.s3.us-east-2.amazonaws.com/001_O_Sangue_de_Jesus_Tem_Poder_65fb4db8ac.mp3',
		// 	durationMillis: 249740,
		// },

    response.data.map(dt => {
      dt.title = dt.nome
      dt.author = Array.isArray(dt.autores) && dt.autores.length > 0 ? dt.autores[0].nome : ""
      dt.img = dt.imagem ? dt.imagem.url : 'https://coletanea.s3.us-east-2.amazonaws.com/musicdot_362668c1a5.jpg'
      dt.uri = dt.anexo.url
      dt.durationMillis = dt.duracao ? dt.duracao : 0
    })

    const resp = { songs: response.data }

    yield put(playerActions.playerSuccess(resp));
  } catch (error) {
    console.log({error})
    yield put(playerActions.playerError(error));
  }
}

export function* watchPlayerStore() {
  yield takeLatest(playerTypes.PLAYER_REQUEST, playerStoreSaga);
}
