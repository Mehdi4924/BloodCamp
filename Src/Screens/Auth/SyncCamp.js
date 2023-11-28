import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images, {imageURL} from '../../Constants/Images';
import Colors from '../../Constants/Colors';
import Lottie from 'lottie-react-native';
import {Anims} from '../../Constants/Anims';
import {hp, wp} from '../../Constants/Responsive';
import {QuestionaireApis, RegisterApis, vitalApis} from '../../Api/ApiCalls';
import {useDispatch, useSelector} from 'react-redux';
import {
  addBloodGroups,
  addCampsData,
  AddCities,
  addQuestions,
  clearRegistrationData,
  registerUser,
} from '../../Redux/actions/Action';
import * as SimpleToast from 'react-native-simple-toast';
import GetNetInfo from '../../Api/GetNetInfo';
import {Icon} from '@rneui/base';

export default function SyncCamp(props) {
  const {navigation} = props;
  const netStatus = GetNetInfo();
  const dispatch = useDispatch();
  const prevCampData = useSelector(state => state.ConstantData.campData);
  const authUserData = useSelector(state => state.ConstantData.authUser);
  const [allCamps, setAllCamps] = useState([]);
  const [modalShown, setModalShown] = useState(false);
  useEffect(() => {
    LoadData();
  }, []);
  async function LoadData() {
    if (await netStatus) {
      Promise.all([
        getCities(),
        GetBloodGroups(),
        getCampsData(),
        getQuestions(),
      ]);
    } else {
      if (prevCampData?.id) {
        if (authUserData?.employeeId) {
          navigation.replace('RegistrationStack');
        } else {
          navigation.replace('Login');
        }
      } else {
        SimpleToast.default.show(
          'No Camps Were Found, Please Connect To Internet To Sync Down Data',
          SimpleToast.default.LONG,
        );
      }
    }
  }
  async function getCities() {
    await RegisterApis.getAllCities()
      .then(res => {
        console.log('success getting cities', res);
        dispatch(AddCities(res?.data));
      })
      .catch(err => {
        console.log('error getting cities', err);
      })
      .finally(function () {
        // console.log('finally getting cities');
      });
  }
  async function GetBloodGroups() {
    await RegisterApis.getAllGroups()
      .then(res => {
        console.log('success getting blood groups', res);
        dispatch(addBloodGroups(res?.data));
      })
      .catch(err => {
        console.log('error getting blood groups', err);
      })
      .finally(function () {
        // console.log('finally getting camps');
      });
  }
  async function getCampsData() {
    await RegisterApis.getAllCamps()
      .then(res => {
        console.log('success getting camp data', res);
        if (authUserData?.employeeId) {
          if (prevCampData?.id) {
            if (res?.data?.data?.length < 1) {
              if (authUserData?.roleName == 'CampIncharge') {
                navigation.replace('RegistrationStack');
              } else if (authUserData?.roleName == 'Vitals') {
                navigation.replace('VitalsStack');
              } else if (authUserData?.roleName == 'Questionnaire') {
                navigation.replace('QuestionaireStack');
              } else if (authUserData?.roleName == 'Barcode and Prick') {
                navigation.replace('PrickStack');
              } else {
                navigation.replace('RegistrationStack');
              }
            } else if (
              res?.data?.data?.length == 1 &&
              prevCampData?.id != res?.data?.data[0]?.id
            ) {
              dispatch(clearRegistrationData());
              dispatch(addCampsData(res?.data?.data[0]));
              getUsersOfCamp(res?.data?.data[0]);
            } else if (res?.data?.data?.length > 1) {
              setAllCamps(res.data.data);
              setModalShown(true);
            } else {
              if (authUserData?.roleName == 'CampIncharge') {
                navigation.replace('RegistrationStack');
              } else if (authUserData?.roleName == 'Vitals') {
                navigation.replace('VitalsStack');
              } else if (authUserData?.roleName == 'Questionnaire') {
                navigation.replace('QuestionaireStack');
              } else if (authUserData?.roleName == 'Barcode and Prick') {
                navigation.replace('PrickStack');
              } else {
                navigation.replace('RegistrationStack');
              }
            }
          } else {
            if (res?.data?.data?.length < 1) {
              SimpleToast.default.show(
                'No Camp Found',
                SimpleToast.default.LONG,
              );
            } else {
              dispatch(clearRegistrationData());
              dispatch(addCampsData(res?.data?.data[0]));
              getUsersOfCamp(res?.data?.data[0]);
            }
          }
        } else {
          dispatch(clearRegistrationData());
          dispatch(addCampsData(res?.data?.data[0]));
          getUsersOfCamp(res?.data?.data[0]);
        }
      })
      .catch(err => {
        console.log('error getting camp data', err);
      })
      .finally(function () {
        // console.log('finally getting camps');
      });
  }
  async function getUsersOfCamp(data) {
    await RegisterApis.getDonorsAgainstCamps(data?.id || 1030)
      .then(res => {
        console.log('success getting users of camp', res);
        if (res?.data?.data?.length) {
          res?.data?.data.map(item => {
            const obj = {
              id: item?.campMobileId || item.donorId,
              bloodDonationId: item.bloodDonationId,
              donorId: item.donorId,
              campId: item.campId,
              Image:
                item.image == 'N/A' ? {uri: ''} : {uri: imageURL + item.image},
              FirstName: item?.fullName,
              LastName: '',
              DonorNum:
                item?.phoneNumber && item?.phoneNumber != 'N/A'
                  ? item.phoneNumber
                  : 0,
              Whatsapp: item?.whatsapp == 'N/A' ? '' : item.whatsapp,
              PreCount: item?.preCount || 0,
              Age: item?.age || 0,
              HomeNumber: '',
              EmergencyContact:
                item?.emergencyContact == 'N/A' ? '' : item.emergencyContact,
              Address: item?.address == 'N/A' ? '' : item.address,
              Email: item.email == 'N/A' ? '' : item.email,
              LastPreDate: item?.lastPreDate || '',
              DOB: item?.dob ? item?.dob?.split('T')[0] : '',
              Occupation: item?.occupation || '',
              City: item?.cityDto.length ? item.cityDto[0] : undefined,
              mobileToken: item?.mobileToken,
              userDonationtype:
                item.userDonationtype == 1
                  ? {label: 'Thalassemia', value: 1}
                  : item.userDonationtype == 2
                  ? {label: 'Transfusion', value: 2}
                  : {label: 'Regular', value: 3},
              Gender: item?.genderId == 1 ? 'male' : 'female',
              MaritalStatus: item.maritalStatus == 1 ? 'unmarried' : 'married',
              BloodGroup: item?.bloodGroupDto.length
                ? {
                    id: item.bloodGroupDto[0].bloodGroupId,
                    value: item.bloodGroupDto[0].bloodGroup,
                  }
                : undefined,
              registrationDate: new Date().toISOString(),
              vitalPosted: item?.donorVitals?.length ? true : false,
              vitalData: [...item.donorVitals],
              questionPosted: item?.donorQuestion?.length ? true : false,
              questionData: [...item.donorQuestion],
              prevBarCode: item?.donorVitals?.length
                ? item?.donorVitals[0]?.barCode &&
                  item?.donorVitals[0]?.barCode != 'Not Genrated'
                  ? item?.donorVitals[0]?.barCode
                  : null
                : null,
              barCodePosted: item?.donorVitals?.length
                ? item?.donorVitals[0]?.barCode &&
                  item?.donorVitals[0]?.barCode != 'Not Genrated'
                  ? true
                  : false
                : false,
            };
            dispatch(registerUser({...obj, isPosted: true}));
          });
        }
        navigation.replace('Login');
      })
      .catch(err => {
        console.log('error getting users of camp', err);
      })
      .finally(function () {
        // console.log('finally getting camps');
      });
  }
  async function getQuestions() {
    QuestionaireApis.getAllQuestions()
      .then(res => {
        console.log('Success getting questions', res);
        const newArrayOfQuestions = [
          {
            questionType: 'Info',
            questionText: 'Welcome! Lets get started, Tap next to continue',
          },
        ];
        const qaTypeOptions = [
          {
            optionText: 'Yes',
            value: 1,
          },
          {
            optionText: 'No',
            value: 0,
          },
        ];
        const vaccineTypeQuestions = [
          {
            optionText: 'Defer Temporarily',
            value: 1,
          },
          {
            optionText: 'Do Not Defer Temporarily',
            value: 0,
          },
        ];
        const drugTypeOptions = [
          {
            optionText: 'Accept',
            value: 1,
          },
          {
            optionText: 'Reject',
            value: 0,
          },
        ];
        res?.data?.length
          ? res.data.map(item => {
              const data = {
                questionType: 'SelectionGroup',
                questionText: item?.question,
                questionId: item?.questionId?.toString(),
                options:
                  item.questionTypeName == 'QA'
                    ? qaTypeOptions
                    : item.questionTypeName == 'VACCINE'
                    ? vaccineTypeQuestions
                    : drugTypeOptions,
              };
              newArrayOfQuestions.push(data);
            })
          : SimpleToast.default.show(
              'No Questions Were Found, Please Try Again Later',
              SimpleToast.default.LONG,
            );
        dispatch(addQuestions(newArrayOfQuestions));
      })
      .catch(err => {
        console.log('Error getting questions', err);
      })
      .finally(function () {});
  }
  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={modalShown} animationType="slide" transparent={true}>
        <View style={styles.modalParentView}>
          {allCamps.map((item, index) => {
            return (
              <TouchableOpacity
                style={{alignItems: 'center', marginVertical: hp(0.5)}}
                key={index}
                onPress={() => {
                  dispatch(clearRegistrationData());
                  dispatch(addCampsData(item));
                  getUsersOfCamp(item);
                }}>
                <Icon
                  name="campground"
                  type="font-awesome-5"
                  color={Colors.primary}
                  size={hp(4)}
                  reverse
                />
                <Text style={styles.modalTextView}>{item?.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
      <ImageBackground style={{flex: 1}} source={Images.homeScreen}>
        <Image
          source={Images.sundasLogo}
          resizeMode="contain"
          style={styles.sundasLogo}
        />
        <View style={styles.lottieView}>
          <Lottie source={Anims.syncAnim} autoPlay loop />
        </View>
        <ActivityIndicator
          color={Colors.primary}
          size="large"
          style={styles.indicator}
        />
        <Text style={styles.bottomText}>Data Sync In Progress</Text>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  sundasLogo: {
    width: hp(25),
    height: hp(25),
    alignSelf: 'center',
    marginTop: hp(8),
  },
  modalParentView: {
    backgroundColor: Colors.white,
    height: hp(50),
    width: wp(100),
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
    elevation: 5,
    borderTopRightRadius: hp(3),
    borderTopLeftRadius: hp(3),
  },
  modalTextView: {
    color: Colors.black,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(2),
    width: wp(40),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  lottieView: {
    width: wp(100),
    height: hp(30),
    alignItems: 'center',
    top: hp(2),
  },
  indicator: {
    bottom: hp(6),
    position: 'absolute',
    alignSelf: 'center',
  },
  bottomText: {
    fontWeight: 'bold',
    color: Colors.black,
    alignSelf: 'center',
    bottom: hp(2),
    position: 'absolute',
  },
});
