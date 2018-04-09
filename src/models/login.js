import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    submittingLogin: false,
  },

  effects: {
    // *login({ payload }, { call, put }) {
    //   const response = yield call(fakeAccountLogin, payload);
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: response,
    //   });
    //   // Login successfully
    //   if (response.status === 'ok') {
    //     reloadAuthorized();
    //     yield put(routerRedux.push('/'));
    //   }
    // },
    *login({ payload }, { call, put }) {
      yield put({
        type: 'submittingStatus',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      yield put({
        type: 'submittingStatus',
        payload: false,
      });
      if (response && response.code && response.code == 1) {
        reloadAuthorized();
        yield put(routerRedux.push('/operator/listOfBooks'));
      } else if (response && response.code && response.code == -1) {
        yield put({
          type: 'statusIf',
          payload: 'error',
        });
        return;
      }
      yield put({
        type: 'statusIf',
        payload: '',
      });
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            data: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    submittingStatus(state, { payload }) {
      return {
        ...state,
        submittingLogin: payload,
      };
    },
    statusIf(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
  },
};
