import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {obj} from './Instance';
const instance = obj.apiInstance;
export const configureAxiosHeaders = async () => {
  let tok = await AsyncStorage.getItem('AuthToken');
  axios.defaults.headers['Authorization'] = 'Bearer ' + tok;
  axios.defaults.headers['Expires'] = '250';
  axios.defaults.headers['Pragma'] = 'no-cache';
  axios.defaults.headers['Cache-Control'] = 'no-cache';
};
const requests = {
  postWithConfig: (url, body, config) =>
    axios.post(`${instance}${url}`, body, config),
  post: (url, body) => axios.post(`${instance}${url}`, body),
  put: (url, body) => axios.put(`${instance}${url}`, body),
  get: url => axios.get(`${instance}${url}`),
  delete: url => axios.delete(`${instance}${url}`),
};
const headers = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
export const RegisterApis = {
  getAllCities: () => requests.get('BloodCamp/GetAllCities'),
  getAllGroups: () => requests.get('BloodCamp/GetAllBloodGroups'),
  getAllCamps: () => requests.get('BloodCamp/GetAllCamp'),
  userLogin: data => requests.post('Account/CampLogin', data),
  registerDonor: data =>
    requests.postWithConfig('BloodCamp/RegisterDonor', data, headers),
  getDonorsAgainstCamps: id => requests.get(`BloodCamp/GetDonor/${id}`),
  startCamp: (userId, startDate, campId) =>
    requests.post(
      `BloodCamp/StartCamp?inchargeId=${userId}&startDate=${startDate}&campId=${campId}`,
    ),
  endCamp: (userId, endDate, campId) =>
    requests.post(
      `BloodCamp/StartCamp?inchargeId=${userId}&endDate=${endDate}&campId=${campId}`,
    ),
};

export const vitalApis = {
  postAllVitals: data => requests.post('BloodCamp/AddVitals', data),
};
export const QuestionaireApis = {
  getAllQuestions: () => requests.get('BloodCamp/GetQuestion'),
  postQuestions: data => requests.post('BloodCamp/QuestionAnswer', data),
};
export const PrickApis = {
  postAllPricks: data => requests.put('BloodCamp/AssignBarCode', data),
};
