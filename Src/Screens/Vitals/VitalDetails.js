import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import InputComponent from '../../Components/InputComponent';
import {hp, wp} from '../../Constants/Responsive';
import {Icon} from '@rneui/themed';
import CustomButton from '../../Components/CustomButton';
import Toast from 'react-native-toast-message';
import {addVitals, editVitals} from '../../Redux/actions/Action';
import {useDispatch, useSelector} from 'react-redux';
import GetNetInfo from '../../Api/GetNetInfo';
import {vitalApis} from '../../Api/ApiCalls';
import GetDonorService from '../../Components/GetDonorService';
import * as SimpleToast from 'react-native-simple-toast';
export default function VitalDetails(props) {
  const netStatus = GetNetInfo();
  const campData = useSelector(store => store?.ConstantData?.campData);
  const {navigation} = props;
  const {donor, prevVitals} = props.route.params;
  const dispatch = useDispatch();
  const [Height, onChangeHeight] = useState(prevVitals?.Height || '');
  const [Pulse, onChangePulse] = useState(prevVitals?.Pulse || '');
  const [Hemoglobin, onChangeHemoglobin] = useState(
    prevVitals?.Hemoglobin || '',
  );
  const [Screening, onChangeScreening] = useState(prevVitals?.Screening || '');
  const [Weight, onChangeWeight] = useState(prevVitals?.Weight || '');
  const [BloodPressure, onChangeBloodPressure] = useState(
    prevVitals?.BloodPressure || '',
  );
  const [Temperature, onChangeTemperature] = useState(
    prevVitals?.Temperature || '',
  );
  const [loader, setLoader] = useState(false);

  async function SendVitals() {
    if (Height == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Height 120 and 200 cm',
      });
    } else if (parseFloat(Height) < 120 || parseFloat(Height) > 200) {
      Toast.show({
        type: 'info',
        text1: 'Height Must Be Between 120 and 200 cm',
      });
    } else if (Pulse == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Pulse Rate Between 50 And 100',
      });
    } else if (parseFloat(Pulse) < 50 || parseFloat(Pulse) > 100) {
      Toast.show({
        type: 'info',
        text1: 'Pulse Rate Must Be Between 50 And 100',
      });
    } else if (Hemoglobin == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Hemoglobin Greater Than 12.5 g/dl',
      });
    } else if (parseFloat(Hemoglobin) < 11 || parseFloat(Hemoglobin) > 17) {
      Toast.show({
        type: 'info',
        text1: 'Hemoglobin must be between 12.5 g/dl and 17 g/dl',
      });
    } else if (Screening == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Add Screening Details',
      });
    } else if (Weight == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Add Weight Between 45 and 150',
      });
    } else if (parseFloat(Weight) < 45 || parseFloat(Weight) > 150) {
      Toast.show({
        type: 'info',
        text1: 'Weight Must Be Between 45 and 150',
      });
    } else if (BloodPressure == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Blood Pressure Between 80-120',
      });
    } else if (!BloodPressure.includes('-')) {
      Toast.show({
        type: 'info',
        text1: 'Blood Pressure Must Be In 80-120 Format',
      });
    } else if (
      BloodPressure.split('-')[0] < '75' ||
      BloodPressure.split('-')[0] > '85'
    ) {
      Toast.show({
        type: 'info',
        text1: 'Blood Pressure Must Be In 80-120 To Donate Blood',
      });
    } else if (
      BloodPressure.split('-')[1] < '115' ||
      BloodPressure.split('-')[1] > '125'
    ) {
      Toast.show({
        type: 'info',
        text1: 'Blood Pressure Must Be In 80-120 To Donate Blood',
      });
    } else if (Temperature == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Temprature Between 99.5 To 93.5',
      });
    } else if (
      parseFloat(Temperature) > 99.5 ||
      parseFloat(Temperature) < 93.5
    ) {
      Toast.show({
        type: 'info',
        text1: 'Temprature Must Be In 99.5 To 93.5 To Donate Blood',
      });
    } else {
      const data = {
        id: donor?.id,
        Height,
        Pulse,
        Hemoglobin,
        Screening,
        Weight,
        BloodPressure,
        Temperature,
      };
      if (await netStatus) {
        postVitals(data);
      } else {
        dispatch(addVitals({...data, vitalPosted: false})), navigation.goBack();
      }
    }
  }
  async function postVitals(data) {
    setLoader(true);
    const newData = {...data, DonorId: donor?.donorId, CampId: campData?.id};
    delete newData.id;
    delete newData.vitalPosted;
    vitalApis
      .postAllVitals({data: [newData]})
      .then(res => {
        console.log('success response posting vitals', res);
        if (res?.data?.message) {
          SimpleToast.default.show(res.data.message, SimpleToast.default.SHORT);
        } else {
          dispatch(addVitals({...data, vitalPosted: true}));
          SimpleToast.default.show(
            'Vitals Added Successfully',
            SimpleToast.default.SHORT,
          );
        }
      })
      .catch(err => {
        console.log('err response posting vitals', err);
        dispatch(addVitals({...data, vitalPosted: false}));
      })
      .finally(function () {
        setLoader(false);
        GetDonorService();
        navigation.goBack();
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.headerStyles}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              type="ionicon"
              name="arrow-back-circle"
              color={Colors.white}
              size={hp(4)}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Vital Details</Text>
          <View></View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.userDetailsView}>
            <Image
              resizeMode="contain"
              source={
                donor?.Image?.uri != ''
                  ? {uri: donor?.Image.uri}
                  : Images.userImage
              }
              style={styles.userImageStyles}
            />
            <Text style={styles.nameText}>
              {donor?.FirstName} {donor?.LastName}
            </Text>
            <View style={styles.phoneNumberView}>
              <Icon
                name={'phone-square'}
                type={'font-awesome'}
                color={Colors.black}
                style={{paddingHorizontal: wp(2)}}
              />
              <Text style={styles.subTextPhone}>{donor?.DonorNum}</Text>
            </View>
            <Text style={styles.subTextPhone}>{donor?.Address}</Text>
          </View>
          <View>
            <InputComponent
              placeholder={'Enter Height * (120-200 cm)'}
              value={Height}
              onChangeText={t => {
                onChangeHeight(t);
              }}
              leftIcon={'human-male-height'}
              leftIconType={'material-community'}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Enter Pulse Rate * (50-100 bpm)'}
              value={Pulse}
              onChangeText={t => {
                onChangePulse(t);
              }}
              leftIcon={'pulse'}
              leftIconType={'ionicon'}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Enter Hemoglobin * (12.5 g/dl to 17 g/dl)'}
              value={Hemoglobin}
              onChangeText={t => {
                onChangeHemoglobin(t);
              }}
              leftIcon={'blood-bag'}
              leftIconType={'material-community'}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Enter Screening Details *'}
              value={Screening}
              onChangeText={t => {
                onChangeScreening(t);
              }}
              leftIcon={'blood-test'}
              leftIconType={'fontisto'}
            />
            <InputComponent
              placeholder={'Enter Weight * (45-150 Kg)'}
              value={Weight}
              onChangeText={t => {
                onChangeWeight(t);
              }}
              leftIcon={'weight'}
              leftIconType={'material-community'}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Enter BloodPressure * (80-120 mmHg)'}
              value={BloodPressure}
              onChangeText={t => {
                onChangeBloodPressure(t);
              }}
              leftIcon={'blood-drop'}
              leftIconType={'fontisto'}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Enter Temperature * (93.5-99.5 F)'}
              value={Temperature}
              onChangeText={t => {
                onChangeTemperature(t);
              }}
              leftIcon={'temperature-celsius'}
              leftIconType={'material-community'}
              keyboardType={'number-pad'}
            />
            <CustomButton
              title="Submit Details"
              onPress={() => SendVitals()}
              isLoading={loader}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  headerStyles: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: hp(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: hp(5),
    borderBottomRightRadius: hp(5),
    borderColor: Colors.grey,
    paddingHorizontal: wp(5),
  },
  headerText: {
    color: Colors.white,
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  userDetailsView: {
    flex: 0.4,
    marginHorizontal: wp(5),
    borderRadius: 10,
    backgroundColor: Colors.lightGrey,
    marginVertical: hp(2),
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImageStyles: {
    borderRadius: hp(8),
    width: hp(15),
    height: hp(15),
  },
  nameText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: hp(2.5),
    alignSelf: 'center',
  },
  phoneNumberView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp(0.5),
  },
  subTextPhone: {
    color: Colors.grey,
    fontSize: hp(1.8),
    alignSelf: 'center',
  },
});
