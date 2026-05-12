<script setup>
definePageMeta({
  middleware: "auth",
});

await navigateTo("/referral-management/leaderboard", { replace: true });
</script>
