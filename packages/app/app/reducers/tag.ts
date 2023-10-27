import {
  LOAD_TAG_INFO_START,
  LOAD_TAG_INFO_SUCCESS,
  LOAD_TAG_INFO_ERROR
} from '../actions/tag';

const initialState = {
  
};

export default function TagReducer(state=initialState, action) {
  switch (action.type) {
  case LOAD_TAG_INFO_START:
    return Object.assign({}, state, {
      [`${action.payload}`]: { loading: true }
    });
  case LOAD_TAG_INFO_ERROR:
    return Object.assign({}, state, {
      [`${action.payload}`]: { error: true }
    });
  case LOAD_TAG_INFO_SUCCESS:
    return Object.assign({}, state, {
      [`${action.payload.tag}`]: action.payload.data
    });
  default:
    return state;
  }
}
