import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request('/zj/currentUser');
// }
export async function queryCurrent(params) {
  return request('/api/service/pseron/getPerson', {
    method: 'POST',
    body: params,
  });
}
