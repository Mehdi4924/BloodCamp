import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import {hp, wp} from '../../Constants/Responsive';
import CustomButton from '../../Components/CustomButton';
import ListEmptyComponent from '../../Constants/ListEmptyComponent';
import {QuestionaireApis} from '../../Api/ApiCalls';
import {ScrollView} from 'react-native-gesture-handler';
import {addQuestionaire, clearAuthData} from '../../Redux/actions/Action';
import * as SimpleToast from 'react-native-simple-toast';
import InputComponent from '../../Components/InputComponent';
import GetDonorService from '../../Components/GetDonorService';

export default function QuestionaireHome(props) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const allUsers = useSelector(store => store.userData);
  const questionsData = useSelector(store => store.ConstantData);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  async function syncUpQuestions() {
    const arr = [];
    allUsers?.registeredUsers?.map(item => {
      if (
        !item?.questionPosted &&
        item?.questionData?.length &&
        item.vitalPosted == true
      ) {
        const listArr = [];
        item.questionData.map(surItem => {
          const data = {
            donationId: item?.bloodDonationId,
            questId: surItem?.questionId,
            answer:
              surItem.options[surItem.questionSettings.defaultSelection].value,
            donorId: item.donorId,
            campId: questionsData?.campData?.id,
          };
          listArr.push(data);
        });
        arr.push({
          donrId: item?.bloodDonationId,
          listAnswer: listArr,
          campId: questionsData?.campData?.id,
        });
      }
    });

    console.log('final formulated array is', arr);
    setLoader(true);
    await QuestionaireApis.postQuestions(arr)
      .then(res => {
        console.log('success posting questions data', res);
        if (res?.data?.message) {
          SimpleToast.default.show(res.data.message, SimpleToast.default.SHORT);
        } else {
          allUsers.registeredUsers.map(item => {
            if (item.vitalPosted == true) {
              dispatch(
                addQuestionaire({
                  survey: item.questionData,
                  userId: item.id,
                  questionPosted: true,
                }),
              );
            }
          });
          SimpleToast.default.show(
            'Questions Posted Successfully',
            SimpleToast.default.SHORT,
          );
        }
      })
      .catch(err => {
        console.log('error posting questions data', err);
        allUsers.registeredUsers.map(item => {
          dispatch(
            addQuestionaire({
              survey: item?.questionData,
              userId: item.id,
              questionPosted: false,
            }),
          );
        });
      })
      .finally(function () {
        setLoader(false);
        GetDonorService();
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.headerStyles}>
          <View style={styles.registerTextStyles}>
            <Text style={styles.headerText}>Registered Users</Text>
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
            {questionsData?.campData?.title || ''}
          </Text>
        </View>
      </View>
      <InputComponent
        placeholder={'Search Donor'}
        value={search}
        onChangeText={t => {
          if (t.length > 0) {
            const newSet = [...allUsers.registeredUsers];
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
        onPress={() => syncUpQuestions()}
        isLoading={loader}
        btnContainer={{position: 'absolute', bottom: hp(2), zIndex: 1000}}
      />
      <ScrollView>
        <FlatList
          data={search != '' ? filteredUsers : allUsers.registeredUsers}
          ListEmptyComponent={<ListEmptyComponent />}
          contentContainerStyle={{paddingBottom: hp(12)}}
          onRefresh={() => GetDonorService()}
          refreshing={false}
          renderItem={({item, index}) => {
            const even = index % 2;
            return (
              <TouchableOpacity
                onPress={() => {
                  questionsData?.campData?.fromDate
                    ? !item?.vitalPosted || item?.vitalPosted == false
                      ? SimpleToast.default.show(
                          'Please Add Vitals First',
                          SimpleToast.default.SHORT,
                        )
                      : navigation.navigate('AddQuestionaire', {
                          donor: item,
                          surveyItem:
                            item?.questionData?.length == 0
                              ? undefined
                              : item.questionData,
                        })
                    : SimpleToast.default.show(
                        'Camp Has Not Started,Please Wait For Camp To Start',
                        SimpleToast.default.SHORT,
                      );
                }}
                disabled={item.questionPosted}
                style={[
                  styles.listContainer,
                  {
                    backgroundColor:
                      even == 0 ? Colors.lightGrey : Colors.white,
                  },
                ]}>
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
                    name={
                      item?.questionPosted
                        ? 'check-circle'
                        : item?.questionData?.length
                        ? 'book-edit-outline'
                        : 'new-box'
                    }
                    type="material-community"
                    color={
                      item?.questionPosted
                        ? Colors.green
                        : item?.questionData?.length
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
      </ScrollView>
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
