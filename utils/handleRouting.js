export const handleRouting = (route,value) => {
    if (route.query) {
      return `${value}/?${new URLSearchParams(route.query)}`;
    }
    return value;
  };