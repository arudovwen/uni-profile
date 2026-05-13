export const buildAuthUrl = (
  baseUrl: string,
  appCode: string,
  encryptedToken: string,
  encryptedRefreshToken: string,
  allowTokenPass: Set<string>,
  isAdmin: boolean = false,
) => {
  const activeUrl = mapBaseUrl(baseUrl, appCode, isAdmin);
  if (!allowTokenPass.has(appCode)) {
    return `${activeUrl}/auth/validate`;
  }

  return `${activeUrl}/auth/validate?token=${encodeURIComponent(
    encryptedToken,
  )}&code=${encodeURIComponent(
    encryptedRefreshToken,
  )}&refreshToken=${encodeURIComponent(encryptedRefreshToken)}`;
};
