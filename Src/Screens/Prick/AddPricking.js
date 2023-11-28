import {
  ActivityIndicator,
  Button,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import InputComponent from '../../Components/InputComponent';
import {hp, wp} from '../../Constants/Responsive';
import {Icon} from '@rneui/themed';
import CustomButton from '../../Components/CustomButton';
import Toast from 'react-native-toast-message';
import {postPrickData} from '../../Redux/actions/Action';
import {useDispatch, useSelector} from 'react-redux';
import GetNetInfo from '../../Api/GetNetInfo';
import {PrickApis, vitalApis} from '../../Api/ApiCalls';
import GetDonorService from '../../Components/GetDonorService';
import * as SimpleToast from 'react-native-simple-toast';
import BarCodeComponent from '../../Components/BarCodeComponent';

export default function AddPricking(props) {
  const netStatus = GetNetInfo();
  const dispatch = useDispatch();
  const {navigation} = props;
  const {donor, prevBarCode} = props.route.params;
  const authUser = useSelector(store => store?.ConstantData?.authUser);
  const campData = useSelector(store => store?.ConstantData?.campData);
  const [loader, setLoader] = useState(false);
  const [prickingData, setPrickingData] = useState(prevBarCode || '');
  async function postPricking() {
    setLoader(true);
    const data = {barCode: prickingData, id: donor?.id, barCodePosted: false};
    const arr = [
      {
        donorId: donor?.donorId,
        barCode: prickingData,
        userId: `${authUser?.employeeId}`,
        donationId: donor?.bloodDonationId,
      },
    ];
    const dataToSend = {barCodeList: arr};
    (await netStatus)
      ? await PrickApis.postAllPricks(dataToSend)
          .then(res => {
            console.log('response posting prick data', res);
            if (res?.data?.message == 'Camp is Ended') {
              SimpleToast.default.show(
                res.data.message,
                SimpleToast.default.SHORT,
              );
            } else {
              console.log('posting prick data', res);
              SimpleToast.default.show(
                'Bar-Code Data Posted Successfully',
                SimpleToast.default.SHORT,
              );
              dispatch(postPrickData({...data, barCodePosted: true}));
            }
          })
          .catch(err => {
            console.log('error posting prick data', err);
            SimpleToast.default.show(
              'Bar-Code Data Was Not Posted',
              SimpleToast.default.SHORT,
            );
            dispatch(postPrickData(data));
          })
          .finally(function () {
            null;
          })
      : dispatch(postPrickData(data));
    navigation.goBack();
    setLoader(false);
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
          <Text style={styles.headerText}>Barcode Details</Text>
          <View></View>
        </View>
      </View>
      <View style={styles.userDetailsView}>
        <Image
          resizeMode="contain"
          source={
            donor?.Image?.uri != '' ? {uri: donor?.Image.uri} : Images.userImage
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
      <BarCodeComponent
        onScan={data => setPrickingData(data)}
        prevBarCode={prevBarCode}
      />
      <CustomButton
        title="Submit BarCode Data"
        onPress={() =>
          prickingData != ''
            ? postPricking()
            : SimpleToast.default.show(
                'Please Scan Bar Code First',
                SimpleToast.default.SHORT,
              )
        }
        isLoading={loader}
        btnContainer={{position: 'absolute', bottom: hp(2), zIndex: 1000}}
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
