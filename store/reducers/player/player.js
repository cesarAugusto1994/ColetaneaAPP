import { DISPATCHES } from "../../../constants";

/**
 * Player Types
 */
export const playerTypes = {
  PLAYER_REQUEST: 'player/PLAYER_REQUEST',
  PLAYER_SUCCESS: 'player/PLAYER_SUCCESS',
  PLAYER_ERROR: 'player/PLAYER_ERROR',
  SET_CURRENT_SONG: 'player/SET_CURRENT_SONG',
};

/**
 * Player Actions
 */
export const playerActions = {
  player: () => ({
    type: playerTypes.PLAYER_REQUEST,
	payload: {}
  }),
  playerSuccess: (data) => ({
    type: playerTypes.PLAYER_SUCCESS,
    payload: data,
  }),
  playerError: (error) => ({
    type: playerTypes.PLAYER_ERROR,
    payload: error,
  }),
  playerSetCurrentSong: (data) => ({
    type: playerTypes.SET_CURRENT_SONG,
	payload: data
  }),
};

/**
 * Player Reducer
 */
const initialState = {
  	currentSong: {
		playback: {},
		soundObj: {},
		detail: {
			id: 1,
			title: 'O sangue de Jesus tem poder',
			author: 'Igreja Cristã Maranata',
			img: 'https://coletanea.s3.us-east-2.amazonaws.com/93039_20200921080256_0b3cb34b14.jpg',
			uri: 'https://coletanea.s3.us-east-2.amazonaws.com/001_O_Sangue_de_Jesus_Tem_Poder_65fb4db8ac.mp3',
			durationMillis: 187800,
		},
		playbackStatus: {},
	},
	songs: [],
  loading: false,
  error: '',
};

export const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case playerTypes.PLAYER_REQUEST:
      return { ...state, loading: true };
    case playerTypes.PLAYER_SUCCESS:
      return { ...state, loading: false, songs: action.payload.songs };
    case playerTypes.PLAYER_ERROR:
      return { ...state, loading: false, error: null };
    case playerTypes.SET_CURRENT_SONG:
			const config = {
				playback: 'current',
				soundObj: 'current',
				detail: 'current',
				playbackStatus: 'current',
				...action.payload,
			};

			return {
				...state,
				currentSong: {
					playback: config?.playback === 'current' ? state?.currentSong?.playback : action.payload?.playback,
					soundObj: config?.soundObj === 'current' ? state?.currentSong?.soundObj : action.payload?.soundObj,
					detail: config?.detail === 'current' ? state?.currentSong?.detail : action.payload?.detail,
					playbackStatus: config?.playbackStatus === 'current' ? state?.currentSong?.playbackStatus : action.payload?.playbackStatus,
				},
			};

    default:
      return state;
  }
};
