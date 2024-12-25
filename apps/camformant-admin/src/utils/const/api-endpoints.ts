export const API_ENDPOINTS = {
  // AUTH SERVICE
  SIGN_OUT: `${process.env.REACT_APP_AUTH_ENDPOINT}/signout`,
  REFRESH: `${process.env.REACT_APP_AUTH_ENDPOINT}/refresh-token`,
  ADMIN_SIGN_IN: `${process.env.REACT_APP_AUTH_ENDPOINT}/admin/login`,
  GET_TOKEN: `${process.env.REACT_APP_AUTH_ENDPOINT}/getToken`,
  ADMIN_VERIFY_USER: `${process.env.REACT_APP_AUTH_ENDPOINT}/admin/verifyAccount`,
  ADMIN_DELETE_USER: `${process.env.REACT_APP_AUTH_ENDPOINT}/admin/deleteAccount`,

  //USER SERVICE
  USER_PROFILE: `${process.env.REACT_APP_ADMIN_ENDPOINT}/me`,
  CORPORTOR_ACCOUNT: `${process.env.REACT_APP_CORPORATOR_ENDPOINT}/profile`,
};
