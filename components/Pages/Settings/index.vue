<template>
  <div class="md:px-6">
    <!-- Top bar   -->
    <div class="flex flex-col xl:py-10 gap-x-10 md:flex-row gap-y-6 md:gap-y-0">
      <div class="">
        <ul
          class="custom-shadow bg-white rounded-lg overflow-hidden w-full md:w-[200px] max-w-[600px] mx-auto md:mx-0 grid grid-cols-3 md:grid-cols-1 gap-y-1"
        >
          <li v-for="tab in filteredTabs" :key="tab.name">
            <button
              type="button"
              class="w-full px-3 py-2 text-sm font-semibold text-center md:border-l-2 md:text-left"
              @click="
                active = tab.value;
                title = tab.name;
                subtext = tab.subtext;
              "
              :class="
                active === tab.value
                  ? 'bg-[#F5FAFF]  border-primary-500 text-primary-500'
                  : 'border-transparent text-[#667085]'
              "
            >
              {{ tab.name }}
            </button>
          </li>
        </ul>
      </div>
      <div class="flex-1">
        <div class="max-w-[640px] w-full mx-auto">
          <div class="">
            <div>
              <Profile v-if="active == 1" />
              <Application v-if="active == 3" />
              <Security v-if="active == 2" />
              <Pin v-if="active == 4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Profile from "./profile.vue";
import Security from "./security.vue";
import Pin from "./pin.vue";
import Application from "./application.vue";

const authStore = useAuthStore();
const active = ref(1);
const tabs = [
  {
    name: "Profile",
    subtext: "",
    value: 1,
  },
  {
    name: "Security",
    subtext: "",
    value: 2,
  },

  {
    name: " Appplications",
    subtext: "",
    value: 3,
  },
];
const filteredTabs = computed(() =>
  [0, 3].includes(authStore.userInfo.userCategory)
    ? tabs.filter((i) => i.value !== 3)
    : tabs
);
</script>
<style>
.custom-shadow {
  box-shadow: 0px 2px 4px -2px #1018280f;
  box-shadow: 0px 4px 8px -2px #1018281a;
}
</style>
