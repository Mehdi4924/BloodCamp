import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import Colors from '../../Constants/Colors';
import {hp, wp} from '../../Constants/Responsive';
import Images from '../../Constants/Images';
import InputComponent from '../../Components/InputComponent';
import CustomButton from '../../Components/CustomButton';
import {RegisterApis} from '../../Api/ApiCalls';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {authData} from '../../Redux/actions/Action';
const Login = props => {
  const {navigation} = props;
  const dispatch = useDispatch();
  const [Email, onChangeEmail] = useState('');
  const [Password, onChangePassword] = useState('');
  const [loader, setLoader] = useState(false);

  const onSubmit = async () => {
    if (Email == '') {
      Toast.show('Please Enter Email', Toast.SHORT);
    } else if (Password == '') {
      Toast.show('Please Enter Password', Toast.SHORT);
    } else {
      setLoader(true);
      const data = {email: Email, password: Password};
      RegisterApis.userLogin(data)
        .then(res => {
          console.log('login success', res);
          if (res?.data?.message) {
            Toast.show(res?.data?.message || 'Error Loging In', Toast.LONG);
          } else {
            const data = res?.data?.data;
            dispatch(authData(data));
            if (data?.roleName == 'CampIncharge') {
              navigation.replace('RegistrationStack');
            } else if (data?.roleName == 'Vitals') {
              navigation.replace('VitalsStack');
            } else if (data?.roleName == 'Questionnaire') {
              navigation.replace('QuestionaireStack');
            } else if (data?.roleName == 'Barcode and Prick') {
              navigation.replace('PrickStack');
            } else {
              navigation.replace('RegistrationStack');
            }
          }
        })
        .catch(err => {
          console.log('login failure', err);
          Toast.show(
            err?.response?.data?.message || 'Error Loging In',
            Toast.LONG,
          );
        })
        .finally(function () {
          setLoader(false);
        });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={{flex: 1, justifyContent: 'center'}}
        resizeMode={'cover'}
        source={Images.homeScreen}>
        <Image
          source={Images.sundasLogo}
          resizeMode="contain"
          style={styles.sundasLogo}
        />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{justifyContent: 'center'}}>
          <View style={styles.inputsContainer}>
            <View style={{justifyContent: 'center', marginVertical: '8%'}}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.welcomeText2}>
                Sundas Foundation Blood Camp
              </Text>
            </View>
            <InputComponent
              placeholder={'Enter Email'}
              value={Email}
              onChangeText={t => {
                onChangeEmail(t.trim());
              }}
              leftIcon={'email'}
              leftIconType={'material-community'}
            />
            <InputComponent
              placeholder={'Password'}
              value={Password}
              onChangeText={t => {
                onChangePassword(t);
              }}
              leftIcon={'lock'}
              leftIconType={'font-awesome'}
              secureTextEntry={true}
            />
            <CustomButton
              title="Login"
              onPress={() => onSubmit()}
              isLoading={loader}
            />
          </View>
        </KeyboardAvoidingView>
        <View style={styles.bottomTextView}>
          <Text style={styles.bottomText}>Powered by NKU Technologies</Text>
          <Text style={styles.bottomText2}>
            www.nkutechnologies.com | (042) 35958849
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  inputsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    elevation: 20,
    padding: 20,
    marginHorizontal: 20,
    paddingVertical: hp(5),
    marginVertical: hp(2),
  },
  sundasLogo: {
    width: hp(25),
    height: hp(25),
    alignSelf: 'center',
  },
  welcomeText: {
    color: Colors.primary,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  welcomeText2: {
    color: Colors.black,
    fontSize: 15,
    textAlign: 'center',
  },
  bottomTextView: {
    marginBottom: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomText: {
    color: Colors.black,
    fontSize: 13,
    textAlign: 'center',
  },
  bottomText2: {
    color: Colors.black,
    fontSize: 13,
    textAlign: 'center',
  },
});
export default Login;
