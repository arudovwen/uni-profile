export const APP_CODES = Object.freeze({
  OXIDE_PRO: {
    code: "OXP975",
    url: process.env.OXIDE_PRO_APP_URL,
    adminUrl: process.env.OXIDE_PRO_ADMIN_URL,
    color: "#1570EF",
  },
  ORBITAL: {
    code: "ORB789",
    url: process.env.ORBITAL_APP_URL,
    adminUrl: process.env.ORBITAL_ADMIN_URL,
    color: "#1570EF",
  },
  OXIDE: {
    code: "OXI975",
    url: process.env.OXIDE_APP_URL,
    adminUrl: process.env.OXIDE_ADMIN_URL,
    color: "#1570EF",
  },
  FLUX: {
    code: "FLU722",
    url: process.env.FLUX_APP_URL,
    adminUrl: process.env.FLUX_ADMIN_URL,
    color: "#021242",
  },
  MATTA: {
    code: "MAT460",
    url: process.env.MARKETPLACE_APP_URL,
    adminUrl: process.env.MATTA_ADMIN_URL,
    color: "#1570EF",
  },
  MATTAPEDIA: {
    code: "MAT763",
    url: process.env.MATTAPEDIA_APP_URL,
    adminUrl: process.env.MATTAPEDIA_ADMIN_URL,
    color: "#1570EF",
  },
  POLYMER: {
    code: "POL766",
    url: process.env.POLYMER_APP_URL,
    adminUrl: process.env.POLYMER_ADMIN_URL,
    color: "#1570EF",
  },
});

export const APP_CODE_LIST = Object.values(APP_CODES);
