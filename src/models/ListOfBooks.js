import {
  queryRule,
  removeRule,
  addRule,
  queryListOfBooks,
  getUnitName,
  getShortName,
} from '../services/api';
import Cookies from 'js-cookie';

export default {
  namespace: 'ListOfBooks',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    getUnitName: [],
    getShortName: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let cookie = Cookies.get('user_id');
      let org_id = { org_id: cookie };
      let payloads = { ...payload, ...org_id };
      const response = yield call(queryListOfBooks, payloads);
      let data = response && response.data;
      yield put({
        type: 'save',
        payload: data,
      });
    },
    // *queryChengban({ payload }, { call, put }) {
    //   const response = yield call(getUnitName, payload);
    //   console.log('responese', response);
    //   yield put({
    //     type: 'getUnitName',
    //     payload: response.data,
    //   });
    // },
    *queryChengban({ payload }, { call, put }) {
      const response = yield call(getShortName, payload);
      let data = response && response.data;
      yield put({
        type: 'getShortNameSave',
        payload: data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getUnitNameSave(state, action) {
      return {
        ...state,
        getUnitName: action.payload,
      };
    },
    getShortNameSave(state, action) {
      return {
        ...state,
        getShortName: action.payload,
      };
    },
  },
};
