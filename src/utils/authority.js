// use localStorage to store the authority info, which might be sent from server in actual project.
// import Cookies from 'js-cookie';
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || '';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

export function setAuthoritySession(authority) {
  return sessionStorage.setItem('Authority-set', authority);
}
export function getAuthoritySession() {
  return sessionStorage.getItem('Authority-set');
}
// export function getAuthority() {
//   console.log('cookie',Cookies)
//   return Cookies.get('antd-pro-authority') || '';
// }
//
// export function setAuthority(authority) {
//   return Cookies.set('antd-pro-authority', authority);
// }
