import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  fakeSubmitForm,
  getProposer,
  getDocName,
  addStanding,
  getShortName,
  getUnitName,
  operationApply,
  getApplyType,
  addApply,
  submitmakeEffect,
  uploadImg,
  getAccountName,
} from '../services/api';
import Cookies from 'js-cookie';

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
    selectShortName: [],
    selectProposer: [],
    seletType: [],
  },

  effects: {
    * submitRegularForm({payload}, {call, put}) {
      let cookie = Cookies.get('user_id');
      cookie = cookie ? cookie : '';
      let dataId = {user_id: cookie};
      let payloads = {...payload, ...dataId};
      let response = yield call(addStanding, payloads);
      if (response.code == 1) {
        yield put(routerRedux.push('/addLedger/step-form/confirm'));
        localStorage.setItem('dataId', response.data);
      } else if (response.code == -1) {
        message.success('提交失败');
      } else if (response.code == -1) {
        message.success('序号已被占用');
      }
      //message.success('提交成功');
    },
    * querySelectUnit({payload}, {call, put}) {
      // let response = yield call(getProposer, payload);
      let response = yield call(getUnitName, payload);
      let data = response && response.data;
      yield put({
        type: 'saveSelect',
        payload: data,
      });
    },
    * queryProposer({payload}, {call, put}) {
      let response = yield call(getProposer, payload);
      let data = response && response.data;
      yield put({
        type: 'saveSelectProposer',
        payload: data,
      });
    },
    * querySelectName({payload}, {call, put}) {
      let response = yield call(getDocName, payload);
      let data = response && response.data && response.data.doc_name;
      let params = {doc_name: data};
      yield put({
        type: 'saveDocName',
        payload: params,
      });
    },
    * selectShortName({payload}, {call, put}) {
      let res = yield call(getShortName, payload);
      let data = res.code == 1 ? res.data : '';
      yield put({
        type: 'saveSelectShortName',
        payload: data,
      });
    },
    * submitStepForm({payload}, {call, put}) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    * submitAdvancedForm({payload}, {call}) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    * saveOperationApply({payload}, {call}) {
      let res = yield call(operationApply, payload);
      return res;
    },
    * getApplyTypePost({payload}, {call, put}) {
      let res = yield call(getApplyType, payload);
      let data = res && res.data && res.data.list;
      yield put({
        type: 'saveSelectType',
        payload: data,
      });
    },
    * getAddApply({payload}, {call, put}) {
      let res = yield call(addApply, payload);
      return res;
    },
    * postMakeEffect({payload}, {call, put}) {
      let res = yield call(submitmakeEffect, payload);
      yield put(routerRedux.push('/addLedger/step-form/result'));
    },
    * uploadImg({payload}, {call, put}) {
      let res = yield call(uploadImg, payload);
      return res;
    },
    * getAccountNameTo({payload}, {call, put}) {
      let res = yield call(getAccountName, payload);
      return res;
    },
  },

  reducers: {
    saveStepFormData(state, {payload}) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveSelect(state, {payload}) {
      return {
        ...state,
        select: [...payload],
      };
    },
    saveDocName(state, {payload}) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveSelectProposer(state, {payload}) {
      return {
        ...state,
        selectProposer: [...payload],
      };
    },
    saveSelectShortName(state, {payload}) {
      return {
        ...state,
        selectShortName: [...payload],
      };
    },
    saveSelectType(state, {payload}) {
      return {
        ...state,
        seletType: [...payload],
      };
    },
  },
};
