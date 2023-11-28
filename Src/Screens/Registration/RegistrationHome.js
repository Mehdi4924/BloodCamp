import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Constants/Colors';
import {hp, wp} from '../../Constants/Responsive';
import {Icon} from '@rneui/themed';
import Images from '../../Constants/Images';
import ListEmptyComponent from '../../Constants/ListEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../Components/CustomButton';
import * as SimpleToast from 'react-native-simple-toast';
import {
  addCampsData,
  clearAuthData,
  clearRegistrationData,
  registerUser,
} from '../../Redux/actions/Action';
import axios from 'axios';
import {RegisterApis} from '../../Api/ApiCalls';
import GetDonorService from '../../Components/GetDonorService';
import InputComponent from '../../Components/InputComponent';
import {store} from '../../Redux/Store';

export default function RegistrationHome(props) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const allUsers = useSelector(store => store.userData);
  const storeData = useSelector(store => store.ConstantData);
  console.log(storeData);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [campStatus, setCampStatus] = useState(
    storeData?.campData?.fromDate && storeData?.campData?.toDate
      ? false
      : storeData?.campData?.fromDate
      ? true
      : false,
  );
  async function postData() {
    const formData = new FormData();
    const userDataArray = [];
    allUsers.registeredUsers.map((userData, index) => {
      if (userData.isPosted == false) {
        console.log('data check every user', userData);
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
          maritalStatus: userData?.MaritalStatus == 'married' ? 2 : 1,
          bloodGroupId: userData?.BloodGroup?.id,
          key: userData?.Image ? `file[${index}]` : '',
          campId: 1030,
        };
        userData?.Image
          ? formData.append(`file[${index}]`, {
              name: userData?.Image?.fileName,
              type: userData?.Image?.type,
              uri: userData?.Image?.uri,
            })
          : null;
        userDataArray.push(dataToSend);
      }
    });
    if (userDataArray.length > 0) {
      setLoader(true);
      formData.append('data', JSON.stringify(userDataArray));
      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
      console.log('form data after formation', userDataArray);
      await RegisterApis.registerDonor(formData)
        .then(res => {
          console.log('success posting data to server', res);
          allUsers.registeredUsers.map(userData => {
            dispatch(registerUser({...userData, isPosted: true}));
          });
        })
        .catch(err => {
          console.log('success posting data to server', err);
          SimpleToast.default.show(
            'Data Was Not Posted, Please SyncUp Again',
            SimpleToast.default.LONG,
          );
        })
        .finally(function () {
          axios.defaults.headers.post['Content-Type'] = 'application/json';
          setLoader(false);
          GetDonorService();
        });
    } else {
      SimpleToast.default.show(
        'Please Add Data First',
        SimpleToast.default.LONG,
      );
    }
  }
  async function StartCamp() {
    const campId = storeData?.campData?.id;
    const userId = storeData?.authUser?.employeeId;
    const startDate = new Date().toISOString();
    setCampStatus(true);
    await RegisterApis.startCamp(userId, startDate, campId)
      .then(res => {
        console.log('response starting the camp', res);
        dispatch(addCampsData({...storeData?.campData, fromDate: startDate}));
        SimpleToast.default.show(
          'Camp Started Successfully',
          SimpleToast.default.SHORT,
        );
      })
      .catch(err => {
        setCampStatus(false);
        SimpleToast.default.show(
          'Error Starting Camp',
          SimpleToast.default.LONG,
        );
        console.log('error starting the camp', err);
      })
      .finally(function () {});
  }
  async function endCamp() {
    const campId = storeData?.campData?.id;
    const userId = storeData?.authUser?.employeeId;
    const endDate = new Date().toISOString();
    setCampStatus(false);
    await RegisterApis.endCamp(userId, endDate, campId)
      .then(res => {
        console.log('response ending the camp', res);
        dispatch(addCampsData({...storeData?.campData, toDate: endDate}));
        SimpleToast.default.show(
          'Camp Ended Successfully',
          SimpleToast.default.SHORT,
        );
      })
      .catch(err => {
        setCampStatus(true);
        console.log('error ending the camp', err);
        SimpleToast.default.show('Error Ending Camp', SimpleToast.default.LONG);
      })
      .finally(function () {});
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={[styles.headerStyles]}>
          <View style={styles.registerTextStyles}>
            <Text style={styles.headerText}>Register Donors</Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(clearAuthData()),
                  props.navigation.replace('AuthStack', {screen: 'Login'});
              }}>
              <Icon
                type="material-community"
                name="logout"
                size={hp(3)}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.campNameText}>
            <Text style={{color: Colors.black}}>Camp Name:</Text>{' '}
            {storeData?.campData?.title || ''}
          </Text>
        </View>
      </View>
      <CustomButton
        title="Sync Up"
        onPress={() => postData()}
        isLoading={loader}
        btnContainer={{position: 'absolute', bottom: hp(2), zIndex: 1000}}
      />
      <FlatList
        data={search.length > 0 ? filteredUsers : allUsers.registeredUsers}
        contentContainerStyle={{paddingBottom: hp(12)}}
        ListHeaderComponent={
          <>
            {storeData?.authUser?.roleName == 'CampIncharge' ? (
              <TouchableOpacity style={styles.topBtn}>
                <Text style={styles.topBtnText}>
                  {campStatus == false ? 'Start Camp' : 'End Camp'}
                </Text>
                <Switch
                  trackColor={{false: Colors.black, true: Colors.grey}}
                  thumbColor={Colors.primary}
                  onValueChange={() =>
                    campStatus == false && !storeData?.campData?.toDate
                      ? StartCamp()
                      : storeData?.campData?.toDate
                      ? SimpleToast.default.show(
                          'Camp Has Already Ended, You Cannot Start Ended Camp',
                          SimpleToast.default.LONG,
                        )
                      : endCamp()
                  }
                  value={campStatus}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() =>
                storeData?.campData?.fromDate
                  ? props.navigation.navigate('DonorRegistration')
                  : SimpleToast.default.show(
                      'Camp Has Not Started,Please Wait For Camp To Start',
                      SimpleToast.default.LONG,
                    )
              }>
              <Text style={styles.topBtnText}>Add New Donor</Text>
              <Icon
                type="ionicon"
                name="add-circle"
                size={hp(2)}
                reverse
                color={Colors.black}
              />
            </TouchableOpacity>
            {storeData?.authUser?.roleName == 'CampIncharge' ? (
              <View style={styles.topButtonContainer}>
                <TouchableOpacity
                  style={styles.topBtn}
                  onPress={() => props.navigation.navigate('VitalsStack')}>
                  <Text style={styles.topBtnText}>Add Vitals</Text>
                  <Icon
                    type="material-community"
                    name="blood-bag"
                    size={hp(2)}
                    reverse
                    color={Colors.black}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topBtn}
                  onPress={() =>
                    props.navigation.navigate('QuestionaireStack')
                  }>
                  <Text style={styles.topBtnText}>Add Questionaire</Text>
                  <Icon
                    type="material-community"
                    name="comment-question"
                    size={hp(2)}
                    reverse
                    color={Colors.black}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topBtn}
                  onPress={() => props.navigation.navigate('PrickStack')}>
                  <Text style={styles.topBtnText}>Add Barcode</Text>
                  <Icon
                    name="barcode"
                    type="material-community"
                    size={hp(2)}
                    reverse
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            <InputComponent
              placeholder={'Search Donor'}
              value={search}
              onChangeText={t => {
                if (t.length > 0) {
                  const newSet = [...allUsers.registeredUsers];
                  const newdata = newSet.length
                    ? newSet.filter(
                        item =>
                          item?.FirstName?.toLowerCase().includes(
                            t.toLowerCase(),
                          ) ||
                          item?.BloodGroup?.value
                            ?.toLowerCase()
                            ?.includes(t?.toLowerCase()) ||
                          item?.DonorNum?.toLowerCase()?.includes(
                            t?.toLowerCase(),
                          ) ||
                          item?.mobileToken
                            ?.toLowerCase()
                            ?.includes(t?.toLowerCase()),
                      )
                    : [];
                  setFilteredUsers(newdata);
                }
                setSearch(t);
              }}
              leftIconType={'font-awesome'}
              leftIcon={'search'}
              container={{borderWidth: 1, width: wp(95)}}
              rightIcon={'close'}
              rightType={'font-awesome'}
              onRightPress={() => setSearch('')}
            />
            <View style={styles.TopView}>
              <Text style={styles.donorText}>Donors</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <ListEmptyComponent containerStyles={{height: hp(70)}} />
        }
        onRefresh={() => GetDonorService()}
        refreshing={false}
        // ListFooterComponent={
        //   <CustomButton
        //     title="Sync Up"
        //     onPress={() => postData()}
        //     isLoading={loader}
        //     btnContainer={{position: 'absolute', marginBottom: hp(2)}}
        //   />
        // }
        renderItem={({item, index}) => {
          const even = index % 2;
          return (
            <TouchableOpacity
              style={[
                styles.listContainer,
                {
                  backgroundColor: even == 0 ? Colors.lightGrey : Colors.white,
                },
              ]}
              onPress={() =>
                navigation.navigate('DonorRegistration', {donor: item})
              }
              disabled={item.isPosted}>
              <View style={styles.listImageContainer}>
                <View style={styles.imageParentView}>
                  <Text style={styles.bloodGroupText}>
                    {item?.BloodGroup?.value}
                  </Text>
                  <Image
                    source={
                      item?.Image?.uri != ''
                        ? {uri: item.Image.uri}
                        : Images.userImage
                    }
                    style={styles.listImage}
                  />
                </View>
                <View style={styles.listContentContainer}>
                  <Text style={styles.nameText}>
                    {item.FirstName} {item.LastName}
                  </Text>
                  <View style={styles.bottomTextView}>
                    <Text style={styles.phoneText}>{item.DonorNum}</Text>
                    <Text style={styles.genderText}>{item.Gender}</Text>
                  </View>
                </View>
                <Icon
                  name={item.isPosted ? 'check-circle' : 'account-edit'}
                  type="material-community"
                  color={item.isPosted ? Colors.grey : Colors.primary}
                  size={hp(3)}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  headerStyles: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: hp(5),
    borderBottomRightRadius: hp(5),
    borderColor: Colors.grey,
    paddingHorizontal: wp(5),
  },
  registerTextStyles: {
    width: wp(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: Colors.white,
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  switchButtonContainer: {
    height: hp(6),
    width: wp(95),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingHorizontal: wp(2),
    marginVertical: hp(1),
  },
  switchBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: hp(2.2),
  },
  campNameText: {
    color: Colors.white,
    height: hp(6),
    width: wp(90),
    fontSize: hp(1.6),
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  topButtonContainer: {
    width: wp(100),
    paddingHorizontal: wp(5),
    marginBottom: hp(1),
  },
  topBtn: {
    height: hp(6),
    width: wp(90),
    backgroundColor: Colors.lightGrey,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingHorizontal: wp(2),
    marginVertical: hp(1),
  },
  topBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: hp(2.2),
  },
  TopView: {
    width: wp(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  donorText: {
    color: Colors.primary,
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginVertical: hp(0.5),
  },
  addIconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp(1),
  },
  addDonorText: {
    color: Colors.grey,
    fontSize: hp(1.8),
    marginHorizontal: hp(0.5),
  },
  listContainer: {
    flex: 1,
    marginHorizontal: hp(1),
    borderRadius: hp(1),
    paddingVertical: hp(1),
    paddingHorizontal: wp(1.5),
  },
  listImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageParentView: {
    height: hp(7),
    width: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginRight: wp(4),
  },
  listImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: hp(10),
    alignSelf: 'center',
    marginHorizontal: wp(2),
  },
  listContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: Colors.primary,
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  phoneText: {
    color: Colors.grey,
    fontSize: hp(1.7),
    marginVertical: hp(0.2),
  },
  bottomTextView: {flexDirection: 'row', marginVertical: hp(0.5)},
  genderText: {
    backgroundColor: Colors.primaryLight,
    color: Colors.black,
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: wp(2),
    fontSize: hp(1.7),
  },
  bloodGroupText: {
    position: 'absolute',
    color: Colors.white,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    padding: hp(0.8),
    borderRadius: hp(2),
    top: hp(-0.5),
    left: wp(-2),
    fontSize: hp(1),
    fontWeight: 'bold',
  },
});
