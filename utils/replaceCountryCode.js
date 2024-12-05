export function replaceCountryCode(phoneNumber, countryCode) {
  // Check if arguments are passed
  if (!phoneNumber || !countryCode) {
    return "Phone number and country code are required";
  }

  // Check if phone number includes country code
  if (!phoneNumber.includes(countryCode)) {
    return phoneNumber;
  }

  // Replace country code with 0
  let newNumber = phoneNumber.replace(countryCode, "0");

  // Check if number starts with 0 after replacing code
  if (!newNumber.startsWith("0")) {
    return "Replacement failed";
  }

  return newNumber;
}
