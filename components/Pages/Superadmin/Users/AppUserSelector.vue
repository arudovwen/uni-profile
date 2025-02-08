<template>
  <h4 class="mb-4 text-sm">Apps user can access</h4>
  <div class="border border-[#E4E7EC] rounded-lg py-2">
    <ul class="grid">
      <li
        v-for="app in apps"
        :key="app.id"
        class="py-3 px-3 flex justify-between border-b last:border-none"
      >
        <label class="flex gap-x-3 items-center">
          <input v-model="app.appCode" type="checkbox" />
          <span class="flex gap-x-[6px] items-center text-base">
            <img :src="app.iconUrl" class="h-4 w-4" width="16" height="16" />
            <span>{{ app.name }}</span>
          </span>
        </label>
        <div class="w-full max-w-[150px]">
          <SelectVueSelect
            v-model="app.role"
            :options="roles"
            placeholder="Select role"
            :reduce="(role) => role.value"
            :clearable="false"
            :disabled="!selectedApps?.map((i) => i.appCode).includes(app.code)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const apps = ref([]);
const selectedApps = ref([]); // This will store the selected apps with appCode and role
const emits = defineEmits(["getData"]);
const roles = [
  {
    label: "Superadmin",
    value: "superadmin",
  },
  // Add more roles as needed
];

// Watch for changes in the apps array
watch(
  apps,
  (newApps) => {
    selectedApps.value = newApps
      .filter((app) => app.appCode)
      .map((app) => ({
        appCode: app.code,
        role: "superadmin",
      }));
  },
  { deep: true }
);

watchEffect(() => {
    selectedApps.value.length > 0 &&  emits("getData", selectedApps.value);
});

onMounted(() => {
  // Assuming authStore.appList is populated with the list of apps
  apps.value = authStore.appList.map((app) => ({
    ...app,
    appCode: false, // Initialize appCode as false (unselected)
    role: "superadmin", // Initialize role as empty
  }));
});
</script>
