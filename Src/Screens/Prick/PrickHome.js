import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Constants/Colors';
import {hp, wp} from '../../Constants/Responsive';
import {Icon} from '@rneui/themed';
import Images, {imageURL} from '../../Constants/Images';
import ListEmptyComponent from '../../Constants/ListEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../Components/CustomButton';
import {PrickApis, RegisterApis, vitalApis} from '../../Api/ApiCalls';
import {
  addVitals,
  clearAuthData,
  postPrickData,
  registerUser,
} from '../../Redux/actions/Action';
import * as SimpleToast from 'react-native-simple-toast';
import GetDonorService from '../../Components/GetDonorService';
import InputComponent from '../../Components/InputComponent';
export default function PrickHome(props) {
  const {navigation} = props;
  const registeredUsers = useSelector(store => store.userData.registeredUsers);
  const authUser = useSelector(store => store?.ConstantData?.authUser);
  const campData = useSelector(store => store?.ConstantData?.campData);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  async function postPricking() {
    setLoader(true);
    const sendArr = [];
    registeredUsers.map(item => {
      if (item?.prevBarCode && item.prevBarCode != '') {
        const obj = {
          donorId: item.donorId,
          barCode: item?.prevBarCode,
          bloodDonationId: item?.bloodDonationId,
          userId: `${authUser?.employeeId}`,
        };
        sendArr.push(obj);
      }
    });
    console.log(sendArr);
    if (sendArr.length > 0) {
      const dataToSend = {barCodeList: sendArr};
      await PrickApis.postAllPricks(dataToSend)
        .then(res => {
          console.log('posting prick data', res);
          if (res?.data?.message) {
            SimpleToast.default.show(
              res.data.message,
              SimpleToast.default.SHORT,
            );
          } else {
            SimpleToast.default.show(
              'Bar-Code Data Posted Successfully',
              SimpleToast.default.SHORT,
            );
            registeredUsers.map(item => {
              if (item?.prevBarCode && item.prevBarCode != '') {
                dispatch(
                  postPrickData({
                    barCode: item?.prevBarCode,
                    id: item?.id,
                    barCodePosted: true,
                  }),
                );
              }
            });
          }
        })
        .catch(err => {
          console.log('error posting prick data', err);
          SimpleToast.default.show(
            'Bar-Code Data Was Not Posted',
            SimpleToast.default.SHORT,
          );
        })
        .finally(function () {
          setLoader(false);
        });
    } else {
      SimpleToast.default.show(
        'No Donor With Bar Code Data Found',
        SimpleToast.default.SHORT,
      );
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.headerStyles}>
          <View style={styles.registerTextStyles}>
            <Text style={styles.headerText}>Add Bar Code</Text>
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
            {campData?.title || ''}
          </Text>
        </View>
      </View>
      <InputComponent
        placeholder={'Search Donor'}
        value={search}
        onChangeText={t => {
          if (t.length > 0) {
            const newSet = [...registeredUsers];
            const newdata = newSet.length
              ? newSet.filter(
                  item =>
                    item?.FirstName?.toLowerCase().includes(t.toLowerCase()) ||
                    item?.BloodGroup?.value
                      ?.toLowerCase()
                      ?.includes(t?.toLowerCase()) ||
                    item?.DonorNum?.toLowerCase()?.includes(t?.toLowerCase()) ||
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
      <CustomButton
        title="Sync Up"
        onPress={() => postPricking()}
        isLoading={loader}
        btnContainer={{position: 'absolute', bottom: hp(2), zIndex: 1000}}
      />
      <FlatList
        data={search != '' ? filteredUsers : registeredUsers}
        contentContainerStyle={{paddingBottom: hp(12)}}
        ListEmptyComponent={<ListEmptyComponent />}
        onRefresh={() => GetDonorService()}
        refreshing={false}
        renderItem={({item, key}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                campData?.fromDate
                  ? item?.questionPosted == true
                    ? navigation.navigate('AddPricking', {
                        donor: item,
                        prevBarCode: item.prevBarCode,
                      })
                    : SimpleToast.default.show(
                        'Please Fill Questionaire For This User First',
                        SimpleToast.default.SHORT,
                      )
                  : SimpleToast.default.show(
                      'Camp Has Not Started,Please Wait For Camp To Start',
                      SimpleToast.default.SHORT,
                    )
              }
              disabled={item?.barCodePosted}
              style={styles.listContainer}>
              <View style={styles.listImageContainer}>
                <Image
                  source={
                    item?.Image?.uri != ''
                      ? {uri: item.Image.uri}
                      : Images.userImage
                  }
                  style={styles.listImage}
                />
                <View style={styles.listContentContainer}>
                  <Text style={styles.nameText}>
                    {item.FirstName} {item.LastName}
                  </Text>
                  <Text style={styles.phoneText}>{item.DonorNum}</Text>
                  <View style={styles.bottomTextView}>
                    <Text style={styles.genderText}>{item.Gender}</Text>
                    <Text style={styles.bloodGroupText}>
                      {item.BloodGroup.value}
                    </Text>
                  </View>
                </View>
                <Icon
                  name={
                    item?.barCodePosted
                      ? 'check-circle'
                      : item?.prevBarCode
                      ? 'qrcode-edit'
                      : 'new-box'
                  }
                  type="material-community"
                  color={
                    item?.barCodePosted
                      ? Colors.green
                      : item?.prevBarCode
                      ? Colors.grey
                      : Colors.primary
                  }
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
  listContainer: {
    flex: 1,
    marginHorizontal: hp(1),
    borderRadius: hp(2),
    backgroundColor: Colors.lightGrey,
    marginVertical: hp(0.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  listImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: hp(10),
    alignSelf: 'center',
    marginRight: wp(6),
  },
  listContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: Colors.primary,
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  phoneText: {
    color: Colors.grey,
    fontSize: hp(1.8),
    marginVertical: hp(0.2),
  },
  bottomTextView: {flexDirection: 'row', marginVertical: hp(0.5)},
  genderText: {
    backgroundColor: Colors.primaryLight,
    color: Colors.black,
    borderRadius: 20,
    paddingHorizontal: wp(2),
    fontSize: hp(1.8),
  },
  bloodGroupText: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    borderRadius: 20,
    paddingHorizontal: wp(2),
    marginHorizontal: 5,
    fontSize: 15,
  },
});
