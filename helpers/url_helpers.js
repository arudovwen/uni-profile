const urls = {
  //Auth urls
  LOGIN_USER: "v1/account/login",
  LOGIN_OUT: "v1/account/logout",
  LOGIN_USER_2FA: "v1/account/login2fa",
  CONFIRM_2FA: "v1/account/confirm",
  REGISTER: "/v1/onboarding/sign-up",
  RESEND_VERIFICATION: "/v1/register/resendverification",
  REGISTER_INVITED_USER: "/v1/register/admin",
  FORGOT_PASSWORD: "v1/account/forgot-password",
  RESET_PASSWORD: "v1/account/reset-password",
  CONFIRM_EMAIL: "v1/onboarding/confirm-email",
  SET_ACCOUNT_TYPE: "v1/onboarding/setaccounttype",
  SOCIAL_REGISTER: "v1/register/social",
  SOCIAL_LOGIN: "v1/account/sociallogin",
  RESEND_2FA_OTP: "v1/account/resend-2fa-code",
  USER_DETAIL: "v1/register/user-profile",
  GET_TOKEN_INFORMATION: "v1/account/token-login",
  REGISTER_APP_REVOKE: "admin/v1/subapplication/apps/toggle-access",
  OWNER_DISABLE_USER: "v1/account/disable-user",

  CENRTAL_ADMIN_GET_USERS: "admin/v1/user/get-users-by-admin",

  OXIDE_FLUX_REGISTER: "/v1/onboarding/sign-up",
  OXIDE_CONFIRM_EMAIL: "v1/onboarding/confirm-email",
  OXIDE_ONBOARDING_SIGNUP: "v1/onboarding/sign-up-with-matta-account",
  SIGN_UP_WITH_MATTA_ORBITAL: "v1/Register/sign-up-with-matta-account",
  SIGN_UP_WITH_MATTA_FLUX: "v1/onboarding/sign-up-with-matta-account",
  SIGN_UP_WITH_MATTA_OXIDE_PRO: "v1/Account/sign-up-with-matta",

  FLUX_CONFIRM_EMAIL: "v1/account/confirm-email",

  SSO_REGISTER: "sso/v1/Register",
  REGISTER: "v1/Register",
  MATTA_CONFIRM_EMAIL: "v1/Account/confirm-email",
  MATTA_RESEND_2FA: "v1/Account/resend-2fa-code",
  ORBITAL_CONFIRM_EMAIL: "v1/account/confirm-email",

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
  GET_SUBAPP: (id) => `admin/v1/subapplication/apps/${id}`,
  ADD_SUBAPP: "admin/v1/subapplication",
  UPDATE_SUBAPP: "admin/v1/subapplication",

  // Invitation
  INVITATION: "admin/v1/Invitation",
  GET_ALL_USERS: "admin/v1/user/get-users",
  TOGGLE_USER: `admin/v1/user/toggle-status`,

  OWNER_INVITES: "v1/register",
  OWNER_SEND_INVITE: "v1/register/send-member-invite",
  OWNER_GET_MEMBERS: "v1/register/get-members",
  OWNER_TOGGLE_STATUS: "v1/owner/toggle-status",
  OWNERS_REGISTER_MEMBER: "v1/register/member",
  OWNER_REVOKE_ACCESS: "v1/owner/apps/toggle-access",

  // Audit logs
  ADMINS_GET_AUDIT_LOGS: "admin/v1/audit/get-all",
  OWNER_GET_AUDIT_LOGS: "v1/owner/get-audit-logs",

  //notifcations
  GET_NOTIFICATION: "v1/notification",
  GET_NOTIFICATION_SETTINGS: "v1/notification/getsettings",
  UPDATE_NOTIFICATION_SETTINGS: "v1/notification/updatesettings",
  MARK_NOTIFICATION: "v1/notification/markasviewed",
  MARK_ALL_NOTIFICATION: "v1/notification/markallasviewed",
};
export default urls;
