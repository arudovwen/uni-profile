export function getQueryParam(route, paramName, defaultValue = null) {
  return route.query[paramName] || defaultValue;
}

export function setquery(router, path, query) {
  router.push({ path, query: query });
}
