import {
  getUserApps,
  signUpWithMattaMarketplace,
} from "~/services/authservices";
import { useOnboarding } from "~/composables/useOnboarding";
import { APP_CODES } from "~/utils/app-config";
import { getBusinessProfile } from "~/services/settingservices";

const isKYCValid = (data) => {
  const companyDocuments = data?.companyDocuments || [];
  if (
    !data?.dateOfIncorporation ||
    !data?.category ||
    companyDocuments.length === 0
  )
    return false;
  return true;
};

export default async (router, setLoading, newCheck) => {
  const authStore = useAuthStore();
  if (!authStore.kycStatus && !newCheck) {
    if (window.location.pathname !== "/dashboard/kyc") {
      router.push("/dashboard/kyc");
      setLoading(false);
    }
    return;
  }
  const userApps = await getUserApps("1", { PageNumber: 1, PageSize: 50 });
  const customerType = userApps?.data?.data?.data?.find(
    (i) => i?.code === APP_CODES.MATTA.code,
  )?.customerType;

  if (customerType.toLowerCase() === "supplier") {
    const businessData = await getBusinessProfile();
    if (!isKYCValid(businessData?.data?.data)) {
      console.warn(
        "KYC validation failed for supplier. Redirecting to KYC page.",
      );
      authStore.setKyCStatus(false);
      if (window.location.pathname !== "/dashboard/kyc") {
        router.push("/dashboard/kyc");
        setLoading(false);
      }
    } else {
      authStore.setKyCStatus(true);
      setLoading(false);
    }
  } else {
    authStore.setKyCStatus(true);
    setLoading(false);
  }
};
