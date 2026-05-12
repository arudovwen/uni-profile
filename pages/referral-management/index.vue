<script setup>
definePageMeta({
  layout: "superadmin",
  middleware: "auth",
});

await navigateTo("/referral-management/management", { replace: true });
</script>
