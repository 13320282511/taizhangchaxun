import { queryRule, removeRule, addRule, queryListOfBooks, getUnitName } from '../services/api';

export default {
  namespace: 'ListOfBooks',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    getUnitName: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryListOfBooks, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *queryChengban({ payload }, { call, put }) {
      const response = yield call(getUnitName, payload);
      console.log('responese', response);
      yield put({
        type: 'getUnitName',
        payload: response.data,
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
    getUnitName(state, action) {
      return {
        ...state,
        getUnitName: action.payload,
      };
    },
  },
};
