/**
 * Created by zj on 2018/4/7.
 */
import { queryBasicListOfBooks} from '../services/api';

export default {
  namespace: 'detailListOfBooks',

  state: {
    basicstandingDetail: {},
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
  },

  effects: {
    *fetchBasic({payload}, { call, put }) {
      const response = yield call(queryBasicListOfBooks,payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchAdvanced(_, { call, put }) {
      // const response = yield call(queryAdvancedProfile);
      // yield put({
      //   type: 'show',
      //   payload: response,
      // });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
