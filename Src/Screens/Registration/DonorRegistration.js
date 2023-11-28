import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon} from '@rneui/themed';
import {hp, wp} from '../../Constants/Responsive';
import InputComponent from '../../Components/InputComponent';
import DatePicker from 'react-native-date-picker';
import Colors from '../../Constants/Colors';
import CustomDropdown from '../../Components/CustomDropdown';
import Images from '../../Constants/Images';
import CustomButton from '../../Components/CustomButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import * as SimpleToast from 'react-native-simple-toast';
import {clearRegistrationData, registerUser} from '../../Redux/actions/Action';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import {RegisterApis} from '../../Api/ApiCalls';
import axios from 'axios';
import GetNetInfo from '../../Api/GetNetInfo';
import {offlineCities, offlineGroups} from '../../Constants/Cities';
import GetDonorService from '../../Components/GetDonorService';

const donationType = [
  {label: 'Transfusion', value: 2},
  {label: 'Thalassemia', value: 1},
  {label: 'Regular', value: 3},
];
export default function DonorRegistration(props) {
  const netStatus = GetNetInfo();
  const dispatch = useDispatch();
  const citiesAndGroups = useSelector(store => store.ConstantData);
  const campData = useSelector(state => state.ConstantData.campData);
  const {navigation} = props;
  const donor = props?.route?.params?.donor || undefined;
  const [image, onChangeImage] = useState(donor?.Image || {uri: ''});
  const [FirstName, onChangeFirstName] = useState(donor?.FirstName || '');
  const [LastName, onChangeLastName] = useState(donor?.LastName || '');
  const [DonorNum, onChangeDonorNum] = useState(donor?.DonorNum || '');
  const [Whatsapp, onChangeWhatsapp] = useState(donor?.Whatsapp || '');
  const [PreCount, onChangePreCount] = useState(donor?.PreCount || '');
  const [Age, onChangeage] = useState(donor?.Age || '');
  const [Address, onChangeAddress] = useState(donor?.Address || '');
  const [Email, onChangeEmail] = useState(donor?.Email || '');
  const [HomeNumber, onChangeHomeNumber] = useState(donor?.HomeNumber || '');
  const [EmergencyContact, onChangeEmergencyContact] = useState(
    donor?.EmergencyContact || '',
  );
  const [LastPreDate, onChangeLastPreDate] = useState(donor?.LastPreDate || '');
  const [prevDonationOpen, setPrevDonationOpen] = useState(false);
  const [DOB, onChangeDOB] = useState(donor?.DOB || '');
  const [DOBOpen, setDOBOpen] = useState(false);
  const [Gender, onChangeGender] = useState(donor?.Gender || '');
  const [Occupation, onChangeOccupation] = useState(donor?.Occupation || '');
  const [BloodGroup, onChangeBloodGroup] = useState(donor?.BloodGroup || '');
  const [mobileToken, setMobileToken] = useState(donor?.mobileToken || '');
  const [MaritalStatus, onChangeMaritalStatus] = useState(
    donor?.MaritalStatus || '',
  );
  const [City, onChangeCity] = useState(donor?.City || '');
  const [userDonationtype, onChangeDonationtype] = useState(
    donor?.userDonationtype || '',
  );
  const [cities, setCities] = useState(citiesAndGroups.cities || offlineCities);
  const [bloodGroups, setBloodGroups] = useState(
    citiesAndGroups.groups || offlineGroups,
  );
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  async function selectImage(type) {
    if (type == 'gallery') {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
          selectionLimit: 1,
          quality: 1,
        },
        async res => {
          console.log('response selecting image', res);
          if (res?.didCancel) {
            console.log('cancelled');
          } else {
            onChangeImage(res.assets[0]);
          }
        },
      );
    } else {
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: false,
          selectionLimit: 1,
          quality: 1,
        },
        async res => {
          console.log('response selecting image', res);
          if (res?.didCancel) {
            console.log('cancelled');
          } else {
            onChangeImage(res.assets[0]);
          }
        },
      );
    }
    setModalVisible(false);
  }
  const validateEmail = email => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };
  async function uploadData() {
    const dateCheck = new Date().getFullYear();
    if (FirstName == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Full Name Before Submitting',
      });
    } else if (DonorNum == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Phone Number Before Submitting',
      });
    } else if (DonorNum.length != 11 || DonorNum.includes('-')) {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Valid Phone Number',
      });
    } else if (Age == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Age Before Submitting',
      });
    } else if (parseInt(Age) > 60 || parseInt(Age) < 17) {
      Toast.show({
        type: 'info',
        text1: 'Donor Age Must Be Between 17 and 60',
      });
    } else if (EmergencyContact != '' && EmergencyContact.includes('-')) {
      Toast.show({
        type: 'info',
        text1: 'Emergency Contact Cannot Contain - Sign',
      });
    } else if (EmergencyContact != '' && EmergencyContact.length != 11) {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Valid Emergency Contact',
      });
    } else if (PreCount != '' && PreCount.includes('-')) {
      Toast.show({
        type: 'info',
        text1: 'Donation Count Cannot Be Negative',
      });
    } else if (Address == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Add Donor Address',
      });
    } else if (Email != '' && !validateEmail(Email)) {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Corerct Email Address',
      });
    } else if (DOB == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Add Date Of Birth Before Submitting',
      });
    } else if (
      dateCheck - parseInt(DOB.split('-')[0]) < 17 ||
      dateCheck - parseInt(DOB.split('-')[0]) > 60
    ) {
      Toast.show({
        type: 'info',
        text1: `Date Of Birth Must Be Between ${dateCheck - 17} and ${
          dateCheck - 60
        }`,
      });
    } else if (image.uri == '') {
      Toast.show({
        type: 'info',
        text1: 'Add Image For Donor First',
      });
    } else if (Gender == '') {
      Toast.show({
        type: 'info',
        text1: 'Select Gender First',
      });
    } else if (!BloodGroup.id) {
      Toast.show({
        type: 'info',
        text1: 'Select Blood Group First',
      });
    } else if (MaritalStatus == '') {
      Toast.show({
        type: 'info',
        text1: 'Select Marital Status First',
      });
    } else if (City?.id == undefined) {
      Toast.show({
        type: 'info',
        text1: 'Please Select City',
      });
    } else if (userDonationtype?.value == undefined) {
      Toast.show({
        type: 'info',
        text1: 'Please Select Donation Type',
      });
    } else if (mobileToken == '') {
      Toast.show({
        type: 'info',
        text1: 'Please Enter Token',
      });
    } else {
      const id = uuid.v4();
      const userData = {
        Image: image.uri != '' ? image : undefined,
        registrationDate: new Date().toISOString(),
        id: donor ? donor?.id : id,
        donorId: donor?.id || Math.random().toFixed(3),
        FirstName,
        LastName,
        DonorNum,
        Whatsapp,
        PreCount,
        Age,
        HomeNumber,
        EmergencyContact,
        Address,
        Email,
        LastPreDate,
        DOB,
        Occupation,
        City,
        userDonationtype,
        Gender,
        MaritalStatus,
        BloodGroup,
        mobileToken,
      };
      // dispatch(registerUser({...userData, isPosted: false}));
      (await netStatus)
        ? postData(userData)
        : [
            dispatch(registerUser({...userData, isPosted: false})),
            navigation.goBack(),
            SimpleToast.default.show(
              'Donor Added Successfully',
              SimpleToast.default.SHORT,
            ),
          ];
    }
  }
  async function postData(userData) {
    setLoader(true);
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    const formData = new FormData();
    const dataToSend = {
      fullName: `${userData?.FirstName} ${userData?.LastName}`,
      donorNum: userData?.DonorNum,
      whatsapp: userData?.Whatsapp,
      preCount: parseInt(userData?.PreCount),
      age: parseInt(userData?.Age),
      homeNumber: userData?.HomeNumber,
      emergencyContact: userData?.EmergencyContact,
      address: userData?.Address,
      email: userData?.Email,
      lastPreDate: userData?.LastPreDate,
      dOB: userData?.DOB,
      occupation: userData?.Occupation,
      cityId: userData?.City?.id,
      userDonationtype: userData?.userDonationtype?.value,
      genderId: userData?.Gender == 'male' ? 1 : 2,
      maritalStatus: userData?.MaritalStatus == 'married' ? 1 : 2,
      bloodGroupId: userData?.BloodGroup?.id,
      key: userData?.Image ? 'file[1]' : '',
      campId: campData?.id || 0,
      campMobileId: userData?.id,
      mobileToken: userData?.mobileToken,
    };
    formData.append('data', JSON.stringify([dataToSend]));
    userData?.Image
      ? formData.append('file[1]', {
          name: userData?.Image?.fileName,
          type: userData?.Image?.type,
          uri: userData?.Image?.uri,
        })
      : null;
    formData.append('CampId', campData?.id || 0);
    await RegisterApis.registerDonor(formData)
      .then(res => {
        console.log('success posting data to server', res);
        dispatch(registerUser({...userData, isPosted: true}));
        SimpleToast.default.show(
          'Donor Added Successfully',
          SimpleToast.default.SHORT,
        );
      })
      .catch(err => {
        console.log('success posting data to server', err);
        SimpleToast.default.show(
          'Data Was Not Posted, Please SyncUp Again',
          SimpleToast.default.LONG,
        );
        dispatch(registerUser({...userData, isPosted: false}));
      })
      .finally(function () {
        GetDonorService();
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        navigation.goBack();
        setLoader(false);
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.headerStyles}>
          <TouchableOpacity
            // onPress={() => dispatch(clearRegistrationData())}>
            onPress={() => navigation.goBack()}>
            <Icon
              type="ionicon"
              name="arrow-back-circle"
              color={Colors.white}
              size={hp(4)}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Register Donor</Text>
          <View></View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={{flex: 1, marginBottom: hp(3)}}>
          <TouchableOpacity
            style={{marginVertical: hp(2)}}
            onPress={() => selectImage('camera')}>
            <View style={styles.cameraIcon}>
              <Icon
                type="ionicon"
                name="ios-camera"
                color={Colors.primary}
                size={hp(2.5)}
              />
            </View>
            <View style={styles.staricIcon}>
              <Icon
                type="ionicon"
                name="star"
                color={Colors.grey}
                size={hp(1)}
              />
            </View>
            <Image
              source={image.uri != '' ? {uri: image.uri} : Images.dummyImage}
              style={styles.listImage}
            />
          </TouchableOpacity>

          <View style={styles.textViewComponent}>
            <InputComponent
              placeholder={'Donor Name *'}
              value={FirstName}
              onChangeText={t => {
                onChangeFirstName(t);
              }}
              leftIcon={'user-circle-o'}
              leftIconType={'font-awesome'}
              container={{width: wp(42)}}
            />
            {/* <InputComponent
              placeholder={'Last Name'}
              value={LastName}
              onChangeText={t => {
                onChangeLastName(t);
              }}
              leftIcon={'user-circle'}
              leftIconType={'font-awesome'}
              container={{width: wp(42)}}
            /> */}
            <InputComponent
              placeholder={'Phone No. *'}
              value={DonorNum}
              onChangeText={t => {
                if (t.length < 12) {
                  onChangeDonorNum(t);
                }
              }}
              leftIcon={'phone'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Occupation'}
              value={Occupation}
              onChangeText={t => {
                if (t.length < 15) {
                  onChangeOccupation(t);
                }
              }}
              leftIcon={'work-outline'}
              leftIconType={'material'}
              container={{width: wp(42)}}
            />
            {/* <InputComponent
              placeholder={'Whatsapp No.'}
              value={Whatsapp}
              onChangeText={t => {
                onChangeWhatsapp(t);
              }}
              leftIcon={'whatsapp'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              keyboardType={'number-pad'}
            /> */}
            <InputComponent
              placeholder={'Prev Donations'}
              value={PreCount}
              onChangeText={t => {
                if (t.length < 3) {
                  onChangePreCount(t);
                }
              }}
              leftIcon={'blood-bag'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Donor Age *'}
              value={Age}
              onChangeText={t => {
                onChangeage(t);
              }}
              leftIcon={'clock-time-five'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              keyboardType={'number-pad'}
            />
            {/* <InputComponent
              placeholder={'Home Number'}
              value={HomeNumber}
              onChangeText={t => {
                onChangeHomeNumber(t);
              }}
              leftIcon={'phone'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              keyboardType={'number-pad'}
            /> */}
            <InputComponent
              placeholder={'Emergency No.'}
              value={EmergencyContact}
              onChangeText={t => {
                if (t.length < 12) {
                  onChangeEmergencyContact(t);
                }
              }}
              leftIcon={'phone'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              keyboardType={'number-pad'}
            />
            <InputComponent
              placeholder={'Enter Address *'}
              value={Address}
              onChangeText={t => {
                onChangeAddress(t);
              }}
              leftIcon={'location-history'}
              leftIconType={'material'}
              container={{width: wp(42)}}
            />
            <InputComponent
              placeholder={'Enter Token*'}
              value={mobileToken}
              onChangeText={t => {
                setMobileToken(t);
              }}
              leftIcon={'receipt'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
            />
            <InputComponent
              placeholder={'Enter Email'}
              value={Email}
              onChangeText={t => {
                onChangeEmail(t);
              }}
              leftIcon={'email-alert'}
              leftIconType={'material-community'}
              container={{width: wp(90)}}
            />
            <InputComponent
              placeholder={'P-Donation Date'}
              value={LastPreDate}
              onChangeText={t => setPrevDonationOpen(true)}
              leftIcon={'timeline-clock-outline'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              onFocus={() => setPrevDonationOpen(true)}
            />
            <InputComponent
              placeholder={'Date Of Birth *'}
              value={DOB}
              onChangeText={t => setDOBOpen(true)}
              leftIcon={'timer-sand'}
              leftIconType={'material-community'}
              container={{width: wp(42)}}
              onFocus={() => setDOBOpen(true)}
            />

            <CustomDropdown
              data={cities}
              labelField={'name'}
              placeholder={'Select City *'}
              valueField={'id'}
              iconName={'city-variant-outline'}
              iconType={'material-community'}
              onChange={item => onChangeCity(item)}
              value={City}
            />
            <CustomDropdown
              data={donationType}
              labelField={'label'}
              placeholder={'Donation Type *'}
              valueField={'value'}
              iconName={'blood'}
              iconType={'fontisto'}
              onChange={item => onChangeDonationtype(item)}
              value={userDonationtype}
              // container={{width: wp(90)}}
            />
          </View>
          <View style={styles.radioButtonsView}>
            <View style={styles.iconAndTextView}>
              <Icon
                name="gender-transgender"
                type="material-community"
                color={Colors.primary}
                size={hp(3.5)}
              />
              <Text style={styles.genderText}>Select Gender *</Text>
            </View>
            <View style={styles.iconAndTextView}>
              <TouchableOpacity
                style={styles.iconAndTextView}
                onPress={() => onChangeGender('male')}>
                <Icon
                  type="material-community"
                  name={Gender == 'male' ? 'radiobox-marked' : 'radiobox-blank'}
                  color={Colors.primary}
                  size={hp(2.5)}
                />
                <Text style={styles.genderText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onChangeGender('female')}
                style={[styles.iconAndTextView, {marginLeft: wp(2)}]}>
                <Icon
                  type="material-community"
                  name={
                    Gender == 'female' ? 'radiobox-marked' : 'radiobox-blank'
                  }
                  color={Colors.primary}
                  size={hp(2.5)}
                />
                <Text style={styles.genderText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.radioButtonsView, {marginVertical: 0}]}>
            <View style={styles.iconAndTextView}>
              <Icon
                name="ring"
                type="material-community"
                color={Colors.primary}
                size={hp(3.5)}
              />
              <Text style={styles.genderText}>Marital Status *</Text>
            </View>
            <View style={styles.iconAndTextView}>
              <TouchableOpacity
                style={styles.iconAndTextView}
                onPress={() => onChangeMaritalStatus('married')}>
                <Icon
                  type="material-community"
                  name={
                    MaritalStatus == 'married'
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  color={Colors.primary}
                  size={hp(2.5)}
                />
                <Text style={styles.maritalStatusText}>Married</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onChangeMaritalStatus('unmarried')}
                style={[styles.iconAndTextView, {marginLeft: wp(2)}]}>
                <Icon
                  type="material-community"
                  name={
                    MaritalStatus == 'unmarried'
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  color={Colors.primary}
                  size={hp(2.5)}
                />
                <Text style={styles.maritalStatusText}>Un Married</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.selectGroupText}>Select Blood Group *</Text>
          <View style={styles.bloodGroupParentView}>
            {bloodGroups.map(item => {
              return (
                <TouchableOpacity
                  style={[
                    styles.bloodGroupView,
                    {
                      backgroundColor:
                        item.id == BloodGroup.id ? Colors.primary : Colors.grey,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onChangeBloodGroup(item)}
                  key={item.id}>
                  <Text style={styles.bloodGroupText}>{item.value}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <CustomButton
            title={donor ? 'Edit Details' : 'Submit Details'}
            onPress={() => uploadData()}
            isLoading={loader}
          />
          <DatePicker
            modal
            open={prevDonationOpen}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              onChangeLastPreDate(date.toISOString().split('T')[0]);
              setPrevDonationOpen(false);
            }}
            onCancel={() => setPrevDonationOpen(false)}
            maximumDate={new Date()}
          />
          <DatePicker
            modal
            open={DOBOpen}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              setDOBOpen(false);
              onChangeDOB(date.toISOString().split('T')[0]);
            }}
            onCancel={() => setDOBOpen(false)}
            maximumDate={new Date()}
          />
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <>
              <Pressable
                style={styles.backDrop}
                onPress={() => setModalVisible(false)}
              />
              <View style={styles.modalBackground}>
                <TouchableOpacity onPress={() => selectImage('camera')}>
                  <Icon
                    name="camera"
                    type="material-community"
                    color={Colors.white}
                    size={hp(3.5)}
                  />
                  <Text style={styles.modalText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectImage('gallery')}>
                  <Icon
                    name="picture-o"
                    type="font-awesome"
                    color={Colors.white}
                    size={hp(3.5)}
                  />
                  <Text style={styles.modalText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white, alignItems: 'center'},
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
  cameraIcon: {
    position: 'absolute',
    zIndex: 1000,
    right: wp(40),
  },
  staricIcon: {
    position: 'absolute',
    zIndex: 1000,
    right: wp(37),
    bottom: 0,
  },
  textViewComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: wp(5),
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  listImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 10,
    alignSelf: 'center',
  },
  radioButtonsView: {
    flex: 1,
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconAndTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderText: {color: Colors.grey, marginLeft: wp(2), fontSize: hp(1.7)},
  maritalStatusText: {color: Colors.grey, marginLeft: wp(2), fontSize: hp(1.7)},
  selectGroupText: {
    flex: 1,
    color: Colors.primary,
    paddingHorizontal: wp(5),
    marginVertical: hp(1),
    fontWeight: 'bold',
  },
  bloodGroupParentView: {
    flex: 1,
    marginHorizontal: wp(5),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: hp(1),
    flexWrap: 'wrap',
  },
  bloodGroupView: {
    width: hp(5),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
    marginLeft: wp(2),
    marginBottom: hp(1),
  },
  bloodGroupText: {color: Colors.white, fontSize: hp(2)},
  backDrop: {
    height: hp(100),
    width: wp(100),
    position: 'absolute',
  },
  modalBackground: {
    width: wp(100),
    height: hp(15),
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#767676',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 5,
  },
  modalText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: hp(2),
    marginVertical: hp(0.5),
  },
});
