import { APP_CODES } from "~/utils/app-config";

export const mapBaseUrl = (
  baseUrl: string,
  appCode: string,
  isAdmin: boolean = false,
) => {
  const noPrefixApps = [APP_CODES.POLYMER.code];
  if (process.env.NODE_ENV === "development") {
    if (appCode === APP_CODES.OXIDE.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:3005";
    }
    if (appCode === APP_CODES.ORBITAL.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:3040";
    }
    if (appCode === APP_CODES.OXIDE_PRO.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:4000";
    }
    if (appCode === APP_CODES.MATTA.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:3000";
    }
    if (appCode === APP_CODES.MATTAPEDIA.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:5173";
    }
    if (appCode === APP_CODES.FLUX.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:3001";
    }
    if (appCode === APP_CODES.POLYMER.code) {
      return isAdmin ? "http://localhost:8080" : "http://localhost:3030";
    }
  }
  return isAdmin && !noPrefixApps.includes(appCode)
    ? baseUrl.replace("https://", "https://admin.")
    : baseUrl;
};
