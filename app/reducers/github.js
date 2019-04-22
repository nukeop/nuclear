import {
  GITHUB_OAUTH_ACCESS_TOKEN_SUCCESS,
  GITHUB_LOG_OUT,
  GITHUB_GET_USER_START,
  GITHUB_GET_USER_SUCCESS,
  GITHUB_GET_USER_ERROR
} from '../actions/github';

const initialState = {};

export default function GithubReducer(state=initialState, action) {
  switch (action.type) {
  case GITHUB_OAUTH_ACCESS_TOKEN_SUCCESS:
    return Object.assign({}, state, {
      accessToken: action.payload.accessToken
    });
  case GITHUB_LOG_OUT:
    return {};
  case GITHUB_GET_USER_START:
    return Object.assign({}, {
      accessToken: state.accessToken
    }, {
      loading: true 
    });
  case GITHUB_GET_USER_SUCCESS:
    return Object.assign({}, {
      accessToken: state.accessToken
    }, {
      loading: false 
    },
    action.payload.data
    );
  case GITHUB_GET_USER_ERROR:
    return Object.assign({}, {
      accessToken: state.accessToken
    }, {
      error: true 
    });
  default:
    return state;
  }
}
