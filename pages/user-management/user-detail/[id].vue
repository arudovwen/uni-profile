<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});

const route = useRoute();

await navigateTo(
  {
    path: `/user-management/user-detail/${route.params.id}/profile`,
    query: route.query,
  },
  { replace: true },
);
</script>
  