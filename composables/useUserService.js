// composables/useUserApi.js
import urls from "../helpers/url_helpers";
import { useApi } from "~/composables/useApi";

export const useeUserService = () => {
  const { get, post, put } = useApi();

  const getUserInfo = async () => {
    return await get(urls.GET_USER_INFO);
  };

  const changePassword = async (data) => {
    return await post(urls.CHANGE_PASSWORD, data);
  };

  const addCustomer = async (data) => {
    return await post(urls.CHANGE_PASSWORD, data);
  };

  const addSubApp = async (data) => {
    return await post(urls.ADD_SUBAPP, data);
  };

  const getSubApps = async () => {
    return await get(urls.GET_SUBAPPS);
  };

  const getSubApp = async (id) => {
    return await get(urls.GET_SUBAPP(id));
  };

  const editSubApp = async (data) => {
    return await put(urls.UPDATE_SUBAPP, data);
  };

  return {
    getUserInfo,
    changePassword,
    addCustomer,
    addSubApp,
    getSubApps,
    getSubApp,
    editSubApp,
  };
};
