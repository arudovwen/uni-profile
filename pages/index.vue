<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const tab = (route.query.tab as string) || "apps";
const allowedTabs = ["apps", "users", "logs", "settings", "kyc"];
const resolvedTab = allowedTabs.includes(tab) ? tab : "apps";

await navigateTo(`/dashboard/${resolvedTab}`, { replace: true });
</script>
