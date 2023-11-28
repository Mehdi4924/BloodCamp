import * as ActionTypes from '../actions/ActionTypes';
// Create Reducer :- Reducer is responsible for taking actions, making state modifications

let initialState = {
  cities: [],
  groups: [],
  campData: [],
  questions: [],
  authUser: {},
};
const ConstantData = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_CITIES:
      return {
        ...state,
        cities: action.payload.data,
      };
    case ActionTypes.ADD_GROUPS:
      return {
        ...state,
        groups: action.payload.data,
      };
    case ActionTypes.ADD_CAMPS:
      return {
        ...state,
        campData: action.payload,
      };
    case ActionTypes.ADD_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };
    case ActionTypes.AUTH_USER:
      return {
        ...state,
        authUser: action.payload.data,
      };
    case ActionTypes.CLEAR_AUTH:
      return {
        ...state,
        authUser: {},
      };
    default:
      return state;
  }
};

export default ConstantData;
