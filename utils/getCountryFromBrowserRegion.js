import moment from "moment-timezone";
import { timezoneToCountry } from "./timezones"; 

export function getCountryFromBrowserRegion() {
  const timezone = moment.tz.guess(); 
  console.log("Detected timezone:", timezone);
  return timezoneToCountry[timezone] || "Nigeria";
}

const country = getCountryFromBrowserRegion();
console.log(`Your country appears to be: ${country}`);
