export const API_ENDPOINTS = {
  // AUTH SERVICE
  SIGN_OUT: `${process.env.REACT_APP_AUTH_ENDPOINT}/signout`,
  REFRESH: `${process.env.REACT_APP_AUTH_ENDPOINT}/refresh-token`,
  ADMIN_SIGN_IN: `${process.env.REACT_APP_AUTH_ENDPOINT}/admin/login`,
  //USER SERVICE
  USER_PROFILE: `${process.env.REACT_APP_ADMIN_ENDPOINT}/me`
 
};

