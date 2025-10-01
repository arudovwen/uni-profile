import urls from "../helpers/url_helpers";
import { notificationGet, notificationPost } from "../helpers/api_helpers";
import store from "../store";

const config = {
  headers: { Authorization: `Bearer ${store.getters.accessToken}` },
};

export async function getnotifications(payload) {
  return await notificationGet(
    `${urls.GET_NOTIFICATION}?${new URLSearchParams(cleanObject(payload))}`,
    config
  );
}

export async function marknotification(data) {
  return await notificationPost(`${urls.MARK_NOTIFICATION}`, data, config);
}

export async function markallnotification(data) {
  return await notificationPost(`${urls.MARK_ALL_NOTIFICATION}`, data, config);
}
export async function getnotificationsettings(payload) {
  return await notificationGet(
    `${urls.GET_NOTIFICATION_SETTINGS}?${new URLSearchParams(
      cleanObject(payload)
    )}`,
    config
  );
}
export async function updatesettings(data) {
  return await notificationPost(`${urls.UPDATE_NOTIFICATION_SETTINGS}`, data, config);
}
