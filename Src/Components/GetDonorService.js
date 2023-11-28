import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {store} from '../Redux/Store/index';
import {RegisterApis} from '../Api/ApiCalls';
import {clearRegistrationData, registerUser} from '../Redux/actions/Action';
import {imageURL} from '../Constants/Images';
export default async function GetDonorService() {
  const data = store.getState();
  // store.dispatch(clearRegistrationData());
  await RegisterApis.getDonorsAgainstCamps(
    data?.ConstantData?.campData?.id || 1030,
  )
    .then(res => {
      console.log('success getting users of camp', res);
      if (res?.data?.data?.length) {
        res?.data?.data.map(item => {
          const obj = {
            id:
              item?.campMobileId && item?.campMobileId != 'N/A'
                ? item.campMobileId
                : item.donorId,
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
          store.dispatch(registerUser({...obj, isPosted: true}));
        });
      }
    })
    .catch(err => {
      console.log('error getting users of camp', err);
    })
    .finally(function () {});
}
