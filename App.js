import React, {useEffect} from 'react';
import Routes from './Src/Navigation/Routes';
import {store, persistor} from './Src/Redux/Store/index';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import {configureAxiosHeaders} from "./Src/Api/ApiCalls";

export default function App() {
  useEffect(() => {
    configureAxiosHeaders();
  }, []);

  return (
    <Provider style={{flex: 1}} store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes />
        <Toast />
      </PersistGate>
    </Provider>
  );
}
