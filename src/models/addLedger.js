import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, getProposer, getDocName, addStanding,getShortName } from '../services/api';

export default {
  namespace: 'addLedger',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
      doc_name: '',
    },
    select: [],
    selectShortName:[],
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      let response = yield call(addStanding, payload);
      if (response.code == 1) {
        console.log('okoklok');
      }
      //message.success('提交成功');
    },
    *querySelectUnit({ payload }, { call, put }) {
      let response = yield call(getProposer, payload);
      yield put({
        type: 'saveSelect',
        payload: response.data,
      });
    },
    *querySelectName({ payload }, { call, put }) {
      let response = yield call(getDocName, payload);
      let params = { doc_name: response.data[0].doc_name };
      yield put({
        type: 'saveDocName',
        payload: params,
      });
    },
    *selectShortName({payload},{call,put}){
      let res = yield call(getShortName,payload);
      let data = res.code == 1 ? res.data : '';
      yield put({
        type:'saveSelectShortName',
        payload:data,
      })
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveSelect(state, { payload }) {
      return {
        ...state,
        select: [...payload],
      };
    },
    saveDocName(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveSelectShortName(state,{payload}) {
      return {
        ...state,
        selectShortName:[
          ...payload
        ],
      }
    },
  },
};
