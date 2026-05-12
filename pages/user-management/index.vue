<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});

await navigateTo("/user-management/users", { replace: true });
</script>
