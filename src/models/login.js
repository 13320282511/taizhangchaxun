import { routerRedux } from 'dva/router';
import { fakeAccountLogin, editePassword } from '../services/api';
import { setAuthority, setAuthoritySession } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import cookies from 'js-cookie';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    submittingLogin: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'submittingStatus',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      if (response && response.code && response.code == 1) {
        let user_type = cookies.get('user_type');
        yield put({
          type: 'changeLoginStatus',
          payload: { ...response, user_type },
        });
      }
      // Login successfully
      yield put({
        type: 'submittingStatus',
        payload: false,
      });
      // if (response && response.code && response.code == 1) {
      //   reloadAuthorized();
      //   yield put(routerRedux.push('/operator/listOfBooks'));
      // } else if (response && response.code && response.code == -1) {
      //   yield put({
      //     type: 'statusIf',
      //     payload: 'error',
      //   });
      //   return;
      // }
      if (response && response.code && response.code == 1) {
        reloadAuthorized();
        yield put(routerRedux.push('/operator/listOfBooks'));
      } else {
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
        // const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        // urlParams.searchParams.set('redirect', pathname);
        // window.history.replaceState(null, 'login', urlParams.href);
        localStorage.clear();
        let cookieData = cookies.get();
        for (let i in cookieData) {
          cookies.set(i, '');
        }
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            data: '',
            type: '',
          },
        });
        setAuthority('');
        setAuthoritySession('');
        yield put(routerRedux.push('/user/login'));
      }
    },
    *edite({ payload }, { call, put }) {
      let res = yield call(editePassword, payload);
      try {
        if (res && res.code == 1) {
          // console.log('res.code',res.code)
          const urlParams = new URL(window.location.href);
          // const pathname = yield select(state => state.routing.location.pathname);
          // // add the parameters in the url
          // urlParams.searchParams.set('redirect', pathname);
          // window.history.replaceState(null, 'login', urlParams.href);
          localStorage.clear();
          let cookieData = cookies.get();
          for (let i in cookieData) {
            cookies.set(i, '');
          }
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: false,
              data: '',
              type: '',
            },
          });
          setAuthority('');
          setAuthoritySession('');
          yield put(routerRedux.push('/user/login'));
          return res;
        }
      } catch {
      } finally {
        return res;
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.user_type);
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
