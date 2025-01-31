const urls = {
  //Auth urls
  LOGIN_USER: "v1/account/login",
  LOGIN_OUT: "v1/account/logout",
  LOGIN_USER_2FA: "v1/account/login2fa",
  CONFIRM_2FA: "v1/account/confirm",
  REGISTER: "/v1/onboarding/sign-up",
  RESEND_VERIFICATION: "/v1/register/resendverification",
  REGISTER_INVITED_USER: "/v1/account/registerbusinessuser",
  FORGOT_PASSWORD: "v1/account/forgot-password",
  RESET_PASSWORD: "v1/account/reset-password",
  CONFIRM_EMAIL: "v1/onboarding/confirm-email",
  SET_ACCOUNT_TYPE: "v1/onboarding/setaccounttype",
  SOCIAL_REGISTER: "v1/register/social",
  SOCIAL_LOGIN: "v1/account/sociallogin",
  RESEND_2FA_OTP: "v1/account/resend-2fa-code",

  OXIDE_FLUX_REGISTER: "/v1/onboarding/sign-up",
  OXIDE_CONFIRM_EMAIL: "v1/onboarding/confirm-email",
  OXIDE_ONBOARDING_SIGNUP: "v1/onboarding/sign-up-with-matta-account",

  FLUX_CONFIRM_EMAIL: "v1/account/confirm-email",

  ORBITAL_REGISTER: "/v1/register",
  ORBITAL_CONFIRM_EMAIL: "v1/register/confirm-email",

  //Customers
  CUSTOMERS: "v1/customers",

  //Upload
  UPLOAD_FILE: "/v1/fileservice/uploadsinglephoto",
  UPLOAD_DOCUMENT: "/v1/fileservice/uploadsingledocument",

  //settings
  GET_PROFILE: "v1/settings/getprofile",
  GET_COMPANY_PROFILE: "v1/business-profile",
  UPDATE_BUSINESS_PROFILE: "v1/register/business-profile",

  BUSINESS_PROFILE: "v1/register/business-profile",
  USER_PROFILE: "v1/register/user-profile",
  //Static values
  GET_COUNTRIES: "/v1/staticvalues/countries",
  CHANGE_PASSWORD: "v1/account/password-change",

  ADD_SETTLEMENT: "v1/settlement/add-settlement-account",
  AUTO_SETTLEMENT: "v1/settlement/autosettlement",
  AUTO_SETTLEMENT_VALUE: "v1/settlement/autosettlement-value",
  VIEW_SETTLEMENT: "v1/settlement/view-settlement-account",
  UPDATE_SETTLEMENT: "v1/settlement/update-settlement-account",
  DELETE_SETTLEMENT: "v1/settlement/delete-settlement-account",
  GET_BANKS: "v1/wallet/get-bank",
  GET_LEDGER_TRANSACTIONS: "v1/ledger/get-all",

  VALIDATE_ACCOUNT: "v1/wallet/validate-account",

  //Sub apps
  GET_SUBAPPS: "admin/v1/subapplication/apps",
  GET_SUBAPP: (id) => `adminv1/subapplication/apps/${id}`,
  ADD_SUBAPP: "admin/v1/subapplication",
  UPDATE_SUBAPP: "admin/v1/subapplication",
};
export default urls;
