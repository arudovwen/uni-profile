import urls from "../helpers/url_helpers";
import {
  post,
  get,
  put,
  ssoPost,
  ssoGet,
  ssoPut,
  ssoDelete,
} from "../services/api_services";
import store from "../store";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};
//Authentication

export async function getAdminAudit(payload) {
  return await ssoGet(
    `${urls.ADMINS_GET_AUDIT_LOGS}?${new URLSearchParams(cleanObject(payload))}`,
    {}
  );
}

export async function getOwnerAudit(payload) {
  return await ssoGet(
    `${urls.OWNER_GET_AUDIT_LOGS}?${new URLSearchParams(cleanObject(payload))}`,
    {}
  );
}
