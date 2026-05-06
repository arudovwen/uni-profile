import urls from "../helpers/url_helpers";
// import { post } from "../helpers/api_helpers";
import { ssoPost, post } from "../helpers/api_helpers";

const config = {};


export async function uploadfile(data) {
  return await ssoPost(urls.UPLOAD_FILE, data, config);
}
export async function uploaddocument(data) {
  return await ssoPost(urls.UPLOAD_DOCUMENT, data, config);
}

export async function setaccountype(data) {
  return await post(urls.SET_ACCOUNT_TYPE, data, config);
}
