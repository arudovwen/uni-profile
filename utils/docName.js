export default function (id, type = null) {
  if (type && type === "kyb") {
    switch (id) {
      case 0:
        return "Certificate of Incorporation";
      case 1:
        return "Memorandum and Articles of Association";
      case 2:
        return "CAC Status Report";
      case 3:
        return "Utility Bill";
      case 4:
        return "Company Profile";
      default:
        return "";
    }
  } else {
    switch (id) {
      case 0:
        return "Bank statement";
      case 1:
        return "Proforma Invoice";
      case 2:
        return "Evidence of previously successful supply contracts (PO and Paid Invoices)";
      case 3:
        return "Others";

      default:
        return "";
    }
  }
}
