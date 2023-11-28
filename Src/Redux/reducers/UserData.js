import * as ActionTypes from '../actions/ActionTypes';
// Create Reducer :- Reducer is responsible for taking actions, making state modifications

let initialState = {
  registeredUsers: [],
};
const userData = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REGISTERDONOR:
      const indexFinding = state?.registeredUsers?.length
        ? state?.registeredUsers?.findIndex(
            item => item?.id == action?.payload?.data?.id,
          )
        : -1;
      var newData;
      if (indexFinding == -1) {
        newData = [...state?.registeredUsers, action?.payload?.data];
      } else {
        const copyData = state?.registeredUsers;
        copyData[indexFinding] = action?.payload?.data;
        newData = state?.registeredUsers;
      }
      // console.log('==>>', indexFinding, newData);
      return {
        ...state,
        registeredUsers: newData,
      };
    case ActionTypes.CLEAR_REGISTRATION_DATA:
      return {
        registeredUsers: [],
      };
    case ActionTypes.ADD_VITALS:
      return {
        ...state,
        registeredUsers: state?.registeredUsers.map(item => {
          if (item.id == action?.payload?.data?.id) {
            return {
              ...item,
              vitalData: action?.payload?.data,
              vitalPosted: action?.payload?.data?.vitalPosted,
            };
          } else {
            return item;
          }
        }),
      };
    case ActionTypes.ADD_QUESTIONAIRE:
      return {
        ...state,
        registeredUsers: state?.registeredUsers.map(item => {
          if (item.id == action?.payload?.data?.userId) {
            return {
              ...item,
              questionData: action?.payload?.data?.survey,
              questionPosted: action?.payload?.data?.questionPosted,
            };
          } else {
            return item;
          }
        }),
      };
    case ActionTypes.POST_PRICK:
      return {
        ...state,
        registeredUsers: state?.registeredUsers.map(item => {
          if (item.id == action?.payload?.data?.id) {
            return {
              ...item,
              prevBarCode: action?.payload?.data?.barCode,
              barCodePosted: action?.payload?.data?.barCodePosted,
            };
          } else {
            return item;
          }
        }),
      };

    default:
      return state;
  }
};

export default userData;
