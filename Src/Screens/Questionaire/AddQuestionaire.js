import {color} from '@rneui/base';
import {Icon} from '@rneui/themed';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {SimpleSurvey} from 'react-native-simple-survey';
import {useDispatch, useSelector} from 'react-redux';
import {QuestionaireApis} from '../../Api/ApiCalls';
import Colors from '../../Constants/Colors';
import Images from '../../Constants/Images';
import {hp, wp} from '../../Constants/Responsive';
import {
  addQuestionaire,
  clearQuestionaire,
  editQuestionaire,
} from '../../Redux/actions/Action';
import * as SimpleToast from 'react-native-simple-toast';
import GetNetInfo from '../../Api/GetNetInfo';
import GetDonorService from '../../Components/GetDonorService';
const questions = [
  {
    questionType: 'Info',
    questionText: 'Welcome! Lets get started, Tap next to continue',
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Have you visited a dentist in the past three months?',
    questionId: 'VistedDentist',
    options: [
      {
        optionText: 'Yes',
        value: 'Yes',
      },
      {
        optionText: 'No',
        value: 'No',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText:
      'In the last three months did you have tattoo made on your body ?',
    questionId: 'Tattoo',
    options: [
      {
        optionText: 'Yes',
        value: 'Yes',
      },
      {
        optionText: 'No',
        value: 'No',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText:
      'In the last three months have you received any injection or a needle stick injury ?',
    questionId: 'Injected',
    options: [
      {
        optionText: 'Yes',
        value: 'Yes',
      },
      {
        optionText: 'No',
        value: 'No',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Have you been vaccinated in the past three months?',
    questionId: 'Vaccinated',
    options: [
      {
        optionText: 'Yes',
        value: 'Yes',
      },
      {
        optionText: 'No',
        value: 'No',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Have you donated blood in the last three months?',
    questionId: 'DonatedBlood',
    options: [
      {
        optionText: 'Yes',
        value: 'Yes',
      },
      {
        optionText: 'No',
        value: 'No',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText:
      'Have your condition ever deteriorated while donation blood in the past?',
    questionId: 'condition',
    options: [
      {
        optionText: 'Yes',
        value: 'Yes',
      },
      {
        optionText: 'No',
        value: 'No',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'SMALL POX VACCINE Less than 8 weeks ago',
    questionId: 'vaccine8weeks',
    options: [
      {
        optionText: 'Defer Temporarily',
        value: 'Defer',
      },
      {
        optionText: 'Do not Defer temporarily',
        value: 'Not Defer',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'SMALL POX VACCINE Less than 10 weeks ago',
    questionId: 'vaccine10weeks',
    options: [
      {
        optionText: 'Accept',
        value: 'Accept',
      },
      {
        optionText: 'Do not Accept',
        value: 'Not Accept',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Cough with Sputum with or without fever',
    questionId: 'coughwithsputum',
    options: [
      {
        optionText: 'Defer Temporarily',
        value: 'Defer',
      },
      {
        optionText: 'Do not Defer temporarily',
        value: 'Not Defer',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Dry Cough without fever',
    questionId: 'DryCoughWithoutFever',
    options: [
      {
        optionText: 'Accept',
        value: 'Accept',
      },
      {
        optionText: 'Do not Accept',
        value: 'Not Accept',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Dry Cough with fever',
    questionId: 'DryCoughWithFever',
    options: [
      {
        optionText: 'Defer Temporarily',
        value: 'Defer',
      },
      {
        optionText: 'Do not Defer temporarily',
        value: 'Not Defer',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'Flu and Cold without Fever',
    questionId: 'fluAndcold',
    options: [
      {
        optionText: 'Accept',
        value: 'Accept',
      },
      {
        optionText: 'Do not Accept',
        value: 'Not Accept',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'SALBUTAMOL',
    questionId: 'SALBUTAMOL',
    options: [
      {
        optionText: 'Accept',
        value: 'Accept',
      },
      {
        optionText: 'Do not Accept',
        value: 'Not Accept',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'SOFTEN',
    questionId: 'SOFTEN',
    options: [
      {
        optionText: 'Accept',
        value: 'Accept',
      },
      {
        optionText: 'Do not Accept',
        value: 'Not Accept',
      },
    ],
  },
  {
    questionType: 'SelectionGroup',
    questionText: 'SORIATANE',
    questionId: 'SORIATANE',
    options: [
      {
        optionText: 'Differ temporarily till three years from last dose',
        value: 'Differ',
      },
      {
        optionText: 'Not Differ temporarily',
        value: 'Not Differ',
      },
    ],
  },
  {
    questionType: 'Info',
    questionText: 'THANK YOU!',
  },
];
export default function AddQuestionaire(props) {
  const netStatus = GetNetInfo();
  const {navigation} = props;
  const questionsData = useSelector(store => store.ConstantData);
  const {donor, surveyItem} = props.route.params;
  const [survey, setsurvey] = useState(
    surveyItem || questionsData?.questions?.data,
  );
  const dispatch = useDispatch();
  const renderPreviousButton = (onPress, enabled) => {
    return (
      <View style={styles.prevButton}>
        <Button
          color={Colors.primary}
          onPress={onPress}
          disabled={!enabled}
          title={'Previous'}
        />
      </View>
    );
  };
  const renderNextButton = (onPress, enabled) => {
    return (
      <View style={styles.prevButton}>
        <Button
          color={Colors.primary}
          onPress={onPress}
          disabled={!enabled}
          backgroundColor={'rgba(141,196,63,1)'}
          style={{borderRadius: 30}}
          title={'Next'}
        />
      </View>
    );
  };
  const renderFinishedButton = (onPress, enabled) => {
    return (
      <View style={styles.prevButton}>
        <Button
          title={'Finished'}
          onPress={onPress}
          disabled={!enabled}
          color={Colors.primary}
        />
      </View>
    );
  };
  const renderButton = (data, index, isSelected, onPress) => {
    return (
      <View
        key={`selection_button_view_${index}`}
        style={{marginVertical: hp(0.5), justifyContent: 'flex-start'}}>
        <TouchableOpacity
          key={`button_${index}`}
          onPress={onPress}
          style={{flexDirection: 'row'}}>
          <Icon
            name={!isSelected ? 'radiobox-blank' : 'radiobox-marked'}
            type={'material-community'}
            color={!isSelected ? Colors.black : Colors.primary}
            style={{paddingHorizontal: wp(2)}}
          />
          <Text style={{color: Colors.black, fontSize: hp(1.5)}}>
            {data.optionText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderQuestionText = questionText => {
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <Text numLines={1} style={styles.questionText}>
          {questionText}
        </Text>
      </View>
    );
  };
  const renderTextBox = (onChange, value, placeholder, onBlur) => {
    return (
      <View>
        <TextInput
          style={styles.textBox}
          onChangeText={text => onChange(text)}
          numberOfLines={1}
          placeholder={placeholder}
          placeholderTextColor={'rgba(184,184,184,1)'}
          value={value}
          multiline
          onBlur={onBlur}
          blurOnSubmit
          returnKeyType="done"
        />
      </View>
    );
  };
  const renderNumericInput = (onChange, value, placeholder, onBlur) => {
    return (
      <TextInput
        style={styles.numericInput}
        onChangeText={text => {
          onChange(text);
        }}
        placeholderTextColor={'#fff'}
        value={String(value)}
        placeholder={placeholder}
        keyboardType={'numeric'}
        onBlur={onBlur}
        maxLength={3}
      />
    );
  };
  const renderInfoText = infoText => {
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <Text style={styles.infoText}>{infoText}</Text>
      </View>
    );
  };
  async function submitAnswers(answer) {
    const newAnsArr = [];
    console.log('answers', answer);
    answer.map((ans, answerIndex) => {
      survey.map((surv, surIndex) => {
        if (ans.questionId == surv.questionId) {
          const ansFindedIndex = surv.options.findIndex(
            item => item.value == ans.value.value,
          );
          newAnsArr.push({
            ...surv,
            questionSettings: {
              defaultSelection: ansFindedIndex,
            },
          });
        }
      });
    });
    if (await netStatus) {
      postQuestions(newAnsArr);
    } else {
      dispatch(
        addQuestionaire({
          survey: newAnsArr,
          userId: donor.id,
          questionPosted: false,
        }),
      );
      navigation.goBack();
    }
  }
  async function postQuestions(data) {
    const listAnswers = [];
    data.map(item => {
      const data = {
        donationId: donor?.bloodDonationId,
        questId: parseInt(item?.questionId),
        answer: item?.options[item?.questionSettings?.defaultSelection]?.value,
        campId: questionsData?.campData?.id,
        donorId: donor?.donorId,
      };
      listAnswers.push(data);
    });
    const postingData = [
      {
        donId: donor?.bloodDonationId,
        listAnswer: [...listAnswers],
        campId: questionsData?.campData?.id,
      },
    ];
    console.log('post data', postingData);
    await QuestionaireApis.postQuestions(postingData)
      .then(res => {
        console.log('questions posted successfully', res);
        if (res?.data == 'Camp is Ended') {
          SimpleToast.default.show(res.data, SimpleToast.default.SHORT);
        } else {
          dispatch(
            addQuestionaire({
              survey: data,
              userId: donor.id,
              questionPosted: true,
            }),
          );

          SimpleToast.default.show(
            'Questions Posted Successfully',
            SimpleToast.default.SHORT,
          );
        }
      })
      .catch(err => {
        console.log('questions posting error', err);
        dispatch(
          addQuestionaire({
            survey: data,
            userId: donor.id,
            questionPosted: false,
          }),
        );
      })
      .finally(function () {
        props.navigation.goBack();
        GetDonorService();
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.headerStyles}>
          <TouchableOpacity
            onPress={() =>
              //  dispatch(clearQuestionaire())
              navigation.goBack()
            }>
            <Icon
              type="ionicon"
              name="arrow-back-circle"
              color={Colors.white}
              size={hp(4)}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Questionaire</Text>
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
              source={{uri: donor?.Image?.uri} || Images.userImage}
              style={styles.userImageStyles}
            />
            <Text style={styles.nameText}>
              {donor.FirstName} {donor.LastName}
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
          {survey.length ? (
            <SimpleSurvey
              // ref={(s) => { this.surveyRef = s; }}
              survey={survey}
              renderSelector={renderButton}
              containerStyle={styles.surveyContainer}
              selectionGroupContainerStyle={styles.selectionGroupContainer}
              navButtonContainerStyle={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
              renderPrevious={renderPreviousButton}
              renderNext={renderNextButton}
              renderFinished={renderFinishedButton}
              renderQuestionText={renderQuestionText}
              onSurveyFinished={answers =>
                donor?.vitalPosted == false
                  ? SimpleToast.default.show(
                      'Please Add Vitals First',
                      SimpleToast.default.SHORT,
                    )
                  : submitAnswers(answers)
              }
              onAnswerSubmitted={answer => null}
              renderTextInput={renderTextBox}
              renderNumericInput={renderNumericInput}
              renderInfo={renderInfoText}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
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
  prevButton: {
    flexGrow: 1,
    marginHorizontal: hp(2),
    marginVertical: hp(4),
  },
  infoText: {
    color: Colors.primary,
    fontSize: hp(2),
    width: wp(90),
    alignSelf: 'center',
    textAlign: 'center',
  },
  questionText: {
    color: Colors.black,
    fontSize: hp(2),
    width: wp(95),
    alignSelf: 'center',
    marginVertical: hp(1),
  },
});
