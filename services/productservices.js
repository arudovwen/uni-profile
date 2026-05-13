import urls from "../helpers/url_helpers";
import { mattaPost } from "../helpers/api_helpers";

export async function getProducts(payload = {}) {
  const body = cleanObject({
    search: payload.search,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? 100,
    withZoho: payload.withZoho ?? true,
    producers: payload.producers,
    applications: payload.applications,
    marketId: payload.marketId,
    technologyId: payload.technologyId,
    technologyApplications: payload.technologyApplications,
    sortOrder: payload.sortOrder,
    sortBy: payload.sortBy,
    storeLug: payload.storeLug,
  });

  return await mattaPost(urls.GET_PRODUCTS("2"), body);
}
