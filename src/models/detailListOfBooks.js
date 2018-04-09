/**
 * Created by zj on 2018/4/7.
 */
import { postStandingDetai, DetailapplyList } from '../services/api';

export default {
  namespace: 'detailListOfBooks',

  state: {
    basicstandingDetail: {},
    standingDetailQuery: [],
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
  },
};
