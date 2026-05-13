import { APP_CODES } from "./app-config";

const isProduction = process.env.NODE_ENV === "production";
const cookieDomain = isProduction ? ".matta.trade" : "localhost";

export const defaultOptions = {
  domain: cookieDomain,
  path: "/",
  secure: isProduction,
  sameSite: "Strict",
  maxAge: 60 * 60 * 24 * 7, // 7 days default
  httpOnly: false, // false by default to allow JS access
};
export const AUTH_COOKIE_NAME = "mattaAuth_Dev";
export const PROFILE_COOKIE_NAME = "mattaProfiles_Dev";

export const localAppUrls = {
  [APP_CODES.OXIDE_PRO.code]: "https://dev.oxidepro.matta.trade",
  [APP_CODES.ORBITAL.code]: "https://dev.orbital.matta.trade",
  [APP_CODES.OXIDE.code]: "https://dev.oxide.matta.trade",
  [APP_CODES.FLUX.code]: "https://dev.deltalog.co",
  [APP_CODES.MATTA.code]: "https://dev.matta.trade",
  [APP_CODES.MATTAPEDIA.code]: "https://dev.mattapedia.matta.trade",
};

export const appCodeColorMap = {
  [APP_CODES.OXIDE_PRO.code]: "#1570EF",
  [APP_CODES.ORBITAL.code]: "#1570EF",
  [APP_CODES.OXIDE.code]: "#1570EF",
  [APP_CODES.FLUX.code]: "#021242",
  [APP_CODES.MATTA.code]: "#1570EF",
  [APP_CODES.MATTAPEDIA.code]: "#1570EF",
};

export const countryCodes = {
  "+1": "United States (+1)",
  "+44": "United Kingdom (+44)",
  "+91": "India (+91)",
  "+61": "Australia (+61)",

  // African Countries
  "+20": "Egypt (+20)",
  "+213": "Algeria (+213)",
  "+225": "Ivory Coast (+225)",
  "+233": "Ghana (+233)",
  "+234": "Nigeria (+234)",
  "+254": "Kenya (+254)",
  "+256": "Uganda (+256)",
  "+27": "South Africa (+27)",
  "+233": "Ghana (+233)",
  "+256": "Uganda (+256)",
  "+251": "Ethiopia (+251)",
  "+254": "Kenya (+254)",
  "+255": "Tanzania (+255)",
  "+257": "Burundi (+257)",
  "+251": "Ethiopia (+251)",
  "+212": "Morocco (+212)",
  "+213": "Algeria (+213)",
  "+260": "Zambia (+260)",
  "+263": "Zimbabwe (+263)",
  "+254": "Kenya (+254)",
  "+251": "Ethiopia (+251)",
  "+243": "Democratic Republic of the Congo (+243)",
  "+233": "Ghana (+233)",
  "+243": "Congo (+243)",
  "+220": "Gambia (+220)",
  "+234": "Nigeria (+234)",
  "+253": "Djibouti (+253)",
  "+251": "Ethiopia (+251)",
  "+227": "Niger (+227)",
  "+228": "Togo (+228)",
  "+241": "Gabon (+241)",
  "+245": "Guinea-Bissau (+245)",
  "+269": "Comoros (+269)",
  "+220": "Gambia (+220)",
  "+253": "Djibouti (+253)",

  // European Countries
  "+33": "France (+33)",
  "+34": "Spain (+34)",
  "+49": "Germany (+49)",
  "+39": "Italy (+39)",
  "+34": "Spain (+34)",
  "+44": "United Kingdom (+44)",
  "+32": "Belgium (+32)",
  "+31": "Netherlands (+31)",
  "+41": "Switzerland (+41)",
  "+43": "Austria (+43)",
  "+46": "Sweden (+46)",
  "+48": "Poland (+48)",
  "+36": "Hungary (+36)",
  "+353": "Ireland (+353)",
  "+358": "Finland (+358)",
  "+420": "Czech Republic (+420)",
  "+421": "Slovakia (+421)",
  "+378": "San Marino (+378)",
  "+356": "Malta (+356)",
  "+359": "Bulgaria (+359)",
  "+372": "Estonia (+372)",
  "+370": "Lithuania (+370)",
  "+371": "Latvia (+371)",
  "+380": "Ukraine (+380)",
  "+381": "Serbia (+381)",
  "+382": "Montenegro (+382)",
  "+386": "Slovenia (+386)",
  "+387": "Bosnia and Herzegovina (+387)",
  "+389": "North Macedonia (+389)",
  "+420": "Czech Republic (+420)",
  "+421": "Slovakia (+421)",
  "+372": "Estonia (+372)",

  // Asian Countries
  "+86": "China (+86)",
  "+81": "Japan (+81)",
  "+82": "South Korea (+82)",
  "+60": "Malaysia (+60)",
  "+63": "Philippines (+63)",
  "+66": "Thailand (+66)",
  "+65": "Singapore (+65)",
  "+88": "Bangladesh (+88)",
  "+974": "Qatar (+974)",
  "+971": "United Arab Emirates (+971)",
  "+92": "Pakistan (+92)",
  "+975": "Bhutan (+975)",
  "+977": "Nepal (+977)",
  "+977": "Nepal (+977)",
  "+62": "Indonesia (+62)",
  "+94": "Sri Lanka (+94)",
  "+996": "Kyrgyzstan (+996)",
  "+995": "Georgia (+995)",
  "+974": "Qatar (+974)",
  "+63": "Philippines (+63)",
  "+972": "Israel (+972)",
  "+971": "United Arab Emirates (+971)",
  "+996": "Kyrgyzstan (+996)",
  "+60": "Malaysia (+60)",
  "+62": "Indonesia (+62)",
  "+63": "Philippines (+63)",
  "+81": "Japan (+81)",
  "+852": "Hong Kong (+852)",
  "+886": "Taiwan (+886)",
};

export const languagesOptions = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "fr",
    name: "French",
  },

  {
    code: "ja",
    name: "Japanese",
  },
  {
    code: "de",
    name: "German",
  },
  {
    code: "zh-CN",
    name: "Chinese",
  },
  {
    code: "es",
    name: "Spanish",
  },
];

export const languagesOptionsMini = [
  {
    code: "en",
    name: "En",
  },
  {
    code: "fr",
    name: "Fr",
  },
  {
    code: "zh-CN",
    name: "Cn",
  },
  {
    code: "de",
    name: "De",
  },
  {
    code: "es",
    name: "Es",
  },

  {
    code: "ja",
    name: "Ja",
  },
];
export const KybDocumentDefault = [
  {
    urls: [
      {
        url: "",
      },
    ],
    url: "",
    documentType: 0,
  },
  {
    urls: [
      {
        url: "",
      },
    ],
    url: "",
    documentType: 1,
  },
  {
    urls: [
      {
        url: "",
      },
    ],
    url: "",
    documentType: 2,
  },
  {
    urls: [
      {
        url: "",
      },
    ],
    url: "",
    documentType: 3,
  },
  {
    urls: [
      {
        url: "",
      },
    ],
    url: "",
    documentType: 4,
  },
];
export const documentsOptions = {
  1: {
    title: "Memorandum and Articles of Association",
    short: "Mermat",
    isNigeria: true,
    isNonNigeria: false,
  },
  0: {
    title: "Certificate of incorporation",
    short: "Certificate of incorporation",
    isNigeria: true,
    isNonNigeria: true,
  },
  2: {
    title: "CAC  Status report",
    short: "CAC  Status report",
    isNigeria: true,
    isNonNigeria: false,
  },
  3: {
    title: "Utility Bill",
    short: "Utility Bill",
    isNigeria: true,
    isNonNigeria: false,
  },
  4: {
    title: "Company profile",
    short: "Company profile",
    value: 4,
    isNigeria: true,
    isNonNigeria: true,
  },
};
export const Navigation = [
  {
    name: "Applications",
    url: "/my-applications",
    key: "my-applications",
  },

  {
    name: "Users Management",
    url: "/users-management",
    key: "users-management",
  },

  {
    name: "Audit Logs",
    url: "/audit-logs",
    key: "audit-logs",
  },
  // {
  //   name: "Settings",
  //   url: "/",
  //   key: "index",
  // },
  {
    name: "Profile",
    url: "/profile",
    key: "profile",
  },
  {
    name: "Notifications",
    url: "/notifications",
    key: "notifications",
  },
];
export const PlatformAdminNavigation = [
  {
    name: "Applications",
    url: "/my-applications",
    key: "my-applications",
  },

  {
    name: "Users Management",
    url: "/users-management",
    key: "users-management",
  },


  // {
  //   name: "Settings",
  //   url: "/",
  //   key: "index",
  // },
  {
    name: "Profile",
    url: "/profile",
    key: "profile",
  },
  {
    name: "Notifications",
    url: "/notifications",
    key: "notifications",
  },
];
export const SuperNavigation = [
  {
    name: "Dashboard",
    url: "/",
    key: "dashboard",
  },
  {
    name: "User Management",
    url: "/user-management",
    key: "user-management",
  },
  {
    name: "App Management",
    url: "/application-management",
    key: "application-management",
  },

  {
    name: "Audit Logs",
    url: "/audit-logs",
    key: "audit-logs",
  },
  {
    name: "Profile",
    url: "/profile",
    key: "profile",
  },
];

export const superadminRoutes = [
  "user-management",
  "user-management-users",
  "user-management-invites",
  "user-management-user-detail-id",
  "user-management-user-detail-id-profile",
  "user-management-user-detail-id-apps",
  "application-management",
  "application-management-action",
  "application-management-action-id",
];

export const adminRoutes = [
  "user-management",
  "settlements",
  "business-information",
];
export const userRoutes = [
  "security",
  "settlements",
  "notifications",
];
export const univeralRoutes = [
  "",
  "audit-logs",
  "user-management-user-detail-id",
  "referral-management",
  "referral-management-management",
  "referral-management-leaderboard",
  "referral-management-create",
  "referral-management-edit-id",
  "referral-management-user-detail-id",
  "account-login-app",
  "account-forgot-password",
  "account-reset-password",
  "account-type-app",
  "profile"
];
export const RoleMap = {
  0: "Platform Admin",
  1: "Superadmin",
  2: "Member",
};
export const UserNavigation = [
  {
    name: "Settings",
    url: "/",
    key: "index",
  },

  // {
  //   name: "Business Information",
  //   url: "/business-information",
  //   key: "business",
  // },
  // {
  //   name: "Settlement Accounts",
  //   url: "/settlements",
  //   key: "settlement",
  // },
  // {
  //   name: "Applications",
  //   url: "/my-applications",
  //   key: "my-applications",
  // },
  {
    name: "Notifications",
    url: "/notifications",
    key: "notifications",
  },
];
export const OwnerNavigation = [
  {
    name: "Settings",
    url: "/",
    key: "index",
  },
  {
    name: "Business Information",
    url: "/business-information",
    key: "business",
  },
  {
    name: "User Management",
    url: "/users-management",
    key: "users-management",
  },

  {
    name: "Settlement Accounts",
    url: "/settlements",
    key: "settlement",
  },
  // {
  //   name: "Applications",
  //   url: "/my-applications",
  //   key: "my-applications",
  // },
  {
    name: "Audit Logs",
    url: "/audit-logs",
    key: "audit-logs",
  },
  {
    name: "Notifications",
    url: "/notifications",
    key: "notifications",
  },
];

export const nigeriaTypes = [0, 1, 2, 3, 4];
export const nonNigeriaTypes = [0, 4];

export const intialRoute = {
  0: "/",
  1: "/",
  2: "/",
  3: "/",
  4: "/",
};
