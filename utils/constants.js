import Matta from "@/assets/apps/mat.png";
import Oxide from "@/assets/apps/oxide.png";
import Flux from "@/assets/apps/flu.png";
import Orbital from "@/assets/apps/orbital.png";
import Mattapedia from "@/assets/apps/mattapedia.png";
import {} from "~/services/authservices";

export const AppsObject = {
  1: {
    label: "Flux",
    url:
      process.env.NODE_ENV === "production"
        ? "https://dev.deltalog.co"
        : "http://localhost:3000",
    appId: 1,
    logo: Flux,
    authBgUrl: "/images/heavy-duty.png",
    authText: "Move, Store, and Distribute with Flux",
    authSubText:
      "Seamless Fulfillment Solutions for Africa's Manufacturing Industry",
  },
  3: {
    label: "Oxide",
    url:
      process.env.NODE_ENV === "production"
        ? "https://dev.oxide.matta.trade"
        : "http://localhost:3001",
    appId: 3,
    logo: Oxide,
    authBgUrl: "/images/oxide.png",
    authText: "Payments, Financing, and Cross-border Payments",
    authSubText:
      "Seamless payments and financing for Africa's Manufacturing Industry",
  },
  0: {
    label: "Matta",
    url:
      process.env.NODE_ENV === "production"
        ? "https://dev.matta.trade"
        : "http://localhost:3002",
    appId: 0,
    logo: Matta,
    authBgUrl: "/images/heavy-duty.png",
    authText: "",
    authSubText: "",
  },
  4: {
    label: "Orbital",

    url:
      process.env.NODE_ENV === "production"
        ? "https://dev.orbital.matta.trade"
        : "http://localhost:3040",
    appId: 4,
    logo: Orbital,
    authBgUrl: "/images/orbital.png",
    authText: "Move, Store, and Distribute with Orbital",
    authSubText:
      "Seamless Fulfillment Solutions for Africa's Manufacturing Industry",
  },
  5: {
    label: "Mattapedia",
    url:
      process.env.NODE_ENV === "production"
        ? "https://dev.mattapedia.matta.trade"
        : "http://localhost:3003",
    appId: 5,
    logo: Mattapedia,
    authBgUrl: "/images/heavy-duty.png",
    authText: "",
    authSubText: "",
    registerUrl: "",
  },
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
  {
    name: "Settings",
    url: "/",
    key: "index",
  },

  {
    name: "Notifications",
    url: "/notifications",
    key: "notifications",
  },
];
export const SuperNavigation = [
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
  "user-management-user-detail-id",
  "application-management",
  "profile",
  "application-management-action-id",
];

export const adminRoutes = [
  "user-management",
  "settlements",
  "profile",
  "business-information",
];
export const userRoutes = [
  "security",
  "settlements",
  "profile",
  "notifications",
];
export const univeralRoutes = ["audit-logs", "user-management-user-detail-id"];
export const RoleMap = {
  0: "Central Admin",
  1: "Superadmin",
  2: "Member",
};
export const UserNavigation = [
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
  0: "/my-applications",
  1: "/business-information",
  2: "/business-information",
  3: "/user-management",
};
