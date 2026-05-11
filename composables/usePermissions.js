/**
 * usePermissions Composable
 *
 * Provides permission checking utilities based on user category.
 * User categories:
 * - 0 = Platform Admin
 * - 1 = Owner (Business Owner)
 * - 2 = Member (Regular User)
 * - 3 = Superadmin
 * - 4 = Platform Admin (alternative)
 */

export const usePermissions = () => {
  const authStore = useAuthStore();

  /**
   * Check if user's category matches the allowed categories
   * @param {number | number[]} categories - Single category or array of allowed categories
   * @returns {boolean} - True if user's category matches, false otherwise
   */
  const hasCategory = (categories) => {
    const userCategory = authStore.userInfo?.userCategory;

    // Return false if userCategory is undefined or null
    if (userCategory === undefined || userCategory === null) {
      return false;
    }

    // Check if categories is an array
    if (Array.isArray(categories)) {
      return categories.includes(userCategory);
    }

    // Check if categories is a single number
    return categories === userCategory;
  };

  // Convenience computed properties for common checks
  const isSuperadmin = computed(() => authStore.userInfo?.userCategory === 3);

  const isOwner = computed(() => authStore.userInfo?.userCategory === 1);

  const isMember = computed(() => authStore.userInfo?.userCategory === 2);

  const isAdmin = computed(() =>
    [0, 3, 4].includes(authStore.userInfo?.userCategory),
  );

  const userCategory = computed(() => authStore.userInfo?.userCategory);

  return {
    hasCategory,
    isSuperadmin,
    isOwner,
    isMember,
    isAdmin,
    userCategory,
  };
};
