export const API_ENDPOINTS = {
  // AUTH SERVICE
  SIGN_OUT: `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/signout`,
  REFRESH: `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/refresh-token`,
  SIGN_IN_WITH_GOOGLE: `${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/google`,
  CORPARATE_SIGNIN: `${process.env.NEXT_PUBLIC_CORPORATE_ENDPOINT}/login`,
  CORPARATE_SIGNUP: `${process.env.NEXT_PUBLIC_CORPORATE_ENDPOINT}/signup`,
  CORPARATE_VERIFY: `${process.env.NEXT_PUBLIC_CORPORATE_ENDPOINT}/verify`,
  // CORPORATE SERVICE
  CORPARATE_PROFILE_ME: `${process.env.NEXT_PUBLIC_COMPANY_ENDPOINT}/profile/me`,
  // USER SERVICE
  USER_PROFILE: `${process.env.NEXT_PUBLIC_USER_ENDPOINT}/me`,
  USER_PROFILE_UPDATE: `${process.env.NEXT_PUBLIC_USER_ENDPOINT}/photo`,
  USER_DETAIL: `${process.env.NEXT_PUBLIC_USER_ENDPOINT}/profile-detail`,
  // JOB SERVICE
  JOB_ENDPOINT: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}`,
  JOBS: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/corporator`,
  JOB: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/job`,

  JOB_APPLY: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/jobApply`,
  JOB_APPLY_LENGTH: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/jobApply/applyLength`,
  JOB_STATUS: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/jobApply`,
  SEARCH_HISTORY: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/search-history`,
  SEARCH_TRENDING: `${process.env.NEXT_PUBLIC_JOB_ENDPOINT}/search-trending`,
  // CHAT SERVICE
  CONVERSATIONS: `${process.env.NEXT_PUBLIC_CONVERSATION_ENDPOINT}`,
  GET_CONVERSATIONS: `${process.env.NEXT_PUBLIC_CONVERSATION_ENDPOINT}/get/conversations`,
  GET_PROFILE_COMPANY: `${process.env.NEXT_PUBLIC_COMPANY_ENDPOINT}/getMulti/Profile`,
  GET_MESSAGE: `${process.env.NEXT_PUBLIC_CONVERSATION_ENDPOINT}`,
};

export const API_ENDPOINTS_SERVER = {
  // USER SERVICE
  USER_PROFILE: `/${process.env.NEXT_PUBLIC_USER_ENDPOINT}/me`,
};
