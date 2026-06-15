<script setup>
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const authStore = useAuthStore();

const basePath = computed(() =>
  [0, 3, 4].includes(authStore.userInfo?.userCategory)
    ? "/users-management/user-detail"
    : "/users-management/user-detail",
);

await navigateTo(
  {
    path: `${basePath.value}/${route.params.id}/profile`,
    query: route.query,
  },
  { replace: true },
);
</script>
  