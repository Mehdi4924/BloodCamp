import {combineReducers} from 'redux';
import userData from './UserData';
import ConstantData from './ConstantData';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userData', 'QuestionaireData', 'VitalData', 'ConstantData'],
  timeout: null,
};

const combinedReducers = combineReducers({
  userData,
  ConstantData,
});
const persistedReducer = persistReducer(persistConfig, combinedReducers);

export default persistedReducer;
