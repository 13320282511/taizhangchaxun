/**
 * Created by zj on 2018/4/7.
 */
import { postStandingDetai, DetailapplyList,standingApproval,postSendResult } from '../services/api';

export default {
  namespace: 'detailListOfBooks',

  state: {
    basicstandingDetail: {},
    standingDetailQuery: [],
    imgSrcPiwen:[],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(postStandingDetai, payload);
      let data = response && response.data;
      yield put({
        type: 'show',
        payload: data,
      });
    },
    *fetchAdvanced(_, { call, put }) {
      // const response = yield call(queryAdvancedProfile);
      // yield put({
      //   type: 'show',
      //   payload: response,
      // });
    },
    *fetchDetailPiwen({ payload }, { call, put }) {
      const response = yield call(DetailapplyList, payload);
      let data = response && response.data && response.data.list;
      yield put({
        type: 'queryDetail',
        payload: data,
      });
    },
    *piwenDetail({payload},{call,put}){
      const res = yield call(standingApproval,payload);
      if(res && res.code == 1 && res.data) {
        if(res.data.approval){
          yield put({
            type:'imgPiwen',
            payload:res.data.approval,
          })
        }else{
          yield put({
            type:'imgPiwen',
            payload:'',
          })
        }

      }
    },
    *detailSendResult({payload},{call,put}) {
      let res = yield call(postSendResult,payload);
      return res;
    }
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        basicstandingDetail: { ...payload },
      };
    },
    queryDetail(state, { payload }) {
      return {
        ...state,
        standingDetailQuery: [...payload],
      };
    },
    imgPiwen(state,{payload}) {
      return {
        ...state,
        imgSrcPiwen:[...payload],
      }
    }
  },
};
