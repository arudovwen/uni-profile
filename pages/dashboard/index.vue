<script setup>
definePageMeta({ middleware: "auth" });

await navigateTo("/dashboard/apps", { replace: true });
</script>
