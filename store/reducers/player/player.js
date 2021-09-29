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
			title: 'O MEU VIVER É CRISTO',
			author: 'Igreja Cristã Maranata',
			img: 'https://coletanea.s3.us-east-2.amazonaws.com/musicdot_362668c1a5.jpg',
			uri: 'https://coletanea.s3.us-east-2.amazonaws.com/O_meu_viver_e_Cristo_681a7970c8.mp3',
			durationMillis: 260000,
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
