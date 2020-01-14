import {
  GITHUB_CONTRIB_START,
  GITHUB_CONTRIB_SUCCESS,
  GITHUB_CONTRIB_ERROR
} from '../actions/githubContrib';
  
const initialState = {
  contributors: [],
  loading: false,
  error: false
};
  
export default function GithubContribReducer(state=initialState, action) {
  switch (action.type) {
  case GITHUB_CONTRIB_START:
    return {
      ...initialState,
      loading: true
    };
  case GITHUB_CONTRIB_SUCCESS:
    return {
      ...initialState,
      loading: false,
      contributors: [...action.payload]
    };
  case GITHUB_CONTRIB_ERROR:
    return {
      ...initialState,
      loading: false,
      error: action.payload
    };
  default:
    return state;
  }
}
