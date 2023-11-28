// Create Actions :- Actions describe what you are going to do, what do you want to do. It's just a simple function that returns a object
import * as ActionTypes from './ActionTypes';
export function registerUser(data) {
  return {
    type: ActionTypes.REGISTERDONOR,
    payload: {
      data,
    },
  };
}
export function clearRegistrationData(data) {
  return {
    type: ActionTypes.CLEAR_REGISTRATION_DATA,
  };
}
export function addVitals(data) {
  return {
    type: ActionTypes.ADD_VITALS,
    payload: {
      data,
    },
  };
}
export function addCampsData(data) {
  return {
    type: ActionTypes.ADD_CAMPS,
    payload: data,
  };
}
export function addQuestionaire(data) {
  return {
    type: ActionTypes.ADD_QUESTIONAIRE,
    payload: {
      data,
    },
  };
}
export function AddCities(data) {
  return {
    type: ActionTypes.ADD_CITIES,
    payload: {data: data},
  };
}
export function addBloodGroups(data) {
  return {
    type: ActionTypes.ADD_GROUPS,
    payload: {data: data},
  };
}
export function addQuestions(data) {
  return {
    type: ActionTypes.ADD_QUESTIONS,
    payload: {data: data},
  };
}
export function authData(data) {
  return {
    type: ActionTypes.AUTH_USER,
    payload: {data: data},
  };
}
export function clearAuthData() {
  return {
    type: ActionTypes.CLEAR_AUTH,
  };
}
export function postPrickData(data) {
  return {
    type: ActionTypes.POST_PRICK,
    payload: {data: data},
  };
}
