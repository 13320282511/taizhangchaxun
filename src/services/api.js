import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}
export async function queryListOfBooks(params) {
  // return request(`/api/listOfBooks?${stringify(params)}`);
  // return request(`/api/service/Standing/standingList?${stringify(params)}`);
  return request('/api/service/Standing/standingList', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
//获取申请单位类型
export async function getProposer(params) {
  return request(`/api/service/Standing/getProposer`);
}
//获取申请文件
export async function getDocName(params) {
  // return request(`/api/service/Standing/getDocName?${stringify(params)}`);
  return request('/api/service/Standing/getDocName', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// export async function getShortName(params) {
//   return request(`/api/service/Standing/getShortName?${stringify(params)}`);
// }
//获取承办单位
export async function getShortName(params) {
  return request(`/api/service/Standing/getShortName?${stringify(params)}`);
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function addStanding(params) {
  return request('/api/service/Standing/addStanding', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   body: params,
  // });
  return request('/api/login', {
    method: 'POST',
    body: params,
  });
}
export async function getUnitName(params) {
  return request('/api/service/Standing/getUnitName', {
    method: 'POST',
    body: params,
  });
}
export async function getApplyType(params) {
  return request('/api/service/Standing/getApplyType', {
    method: 'POST',
    body: params,
  });
}
export async function addApply(params) {
  return request('/api/service/Standing/addApply', {
    method: 'POST',
    body: params,
  });
}
export async function operationApply(params) {
  return request('/api/service/Standing/operationApply', {
    method: 'POST',
    body: params,
  });
}
export async function queryBasicListOfBooks(params) {
  return request('/api/service/Standing/operationApply', {
    method: 'POST',
    body: params,
  });
}
export async function submitmakeEffect(params) {
  return request('/api/service/Standing/makeEffect', {
    method: 'POST',
    body: params,
  });
}

export async function postStandingDetai(params) {
  return request('/api/service/Standing/standingDetai', {
    method: 'POST',
    body: params,
  });
}
export async function DetailapplyList(params) {
  return request('/api/service/Standing/applyList', {
    method: 'POST',
    body: params,
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}
