import { toast } from "vue3-toastify";

export function errorResponse(err, message) {
  toast.error(
    err?.response?.data.message ||
      err?.response?.data.Message ||
      message ||
      "Request failed"
  );
}
