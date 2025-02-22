<template>
  <Menu as="div" class="relative">
    <MenuButton class="outline-none">
      <span
        class="h-[36px] w-[36px] flex justify-center items-center bg-gray-100 rounded-[50%]"
      >
        <DotsGrid class="h-[20px] w-[20px]"
      /></span>
    </MenuButton>
    <MenuItems
      class="absolute z-[999] bg-white shadow right-0 min-w-[150px] w-[200px] rounded-lg overflow-hidden mt-2 p-4 grid grid-cols-2 gap-4 justify-center"
    >
      <MenuItem v-for="item in rows" :key="item.name"
        ><a target="_blank" :href="item?.url">
          <button
            class="p-2 rounded-lg bg-primary-50/40 text-sm flex flex-col items-center gap-y-1 font-medium w-full"
          >
            <span>
              <img
                :src="item?.iconUrl"
                :alt="item.name"
                width="80"
                height="26"
                class="w-auto h-[28px] mx-auto block"
            /></span>
            <span class="text-xs"> {{ item.name }} </span>
          </button>
        </a></MenuItem
      >
    </MenuItems>
  </Menu>
</template>

<script setup>
import DotsGrid from "@/assets/images/svgs/dots-grid.svg";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { getSubApps } from "~/services/userservices";

const { encrypt } = useEncryption();
const authStore = useAuthStore();
const rows = ref([]);
function getData() {
  getSubApps()
    .then((res) => {
      if (res.status === 200) {
        rows.value = res.data.data?.map((i) => {
          // Extract the URL and apply category-based changes
          const baseUrl = i.url?.replace(
            "https://",
            [0, 3].includes(authStore.userInfo.userCategory)
              ? "https://admin."
              : "https://"
          );
          // Add the token query to the URL
          const fullUrl = `${baseUrl}/auth/validate?token=${encodeURIComponent(encrypt(authStore.jwToken))}&code=${encodeURIComponent(encrypt(authStore.refreshToken))}`;

          // Return the modified object
          return {
            ...i,
            url: fullUrl,
          };
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching sub-apps:", error);
      // Optionally, you could update `rows.value` to show an error state
    });
}

onMounted(() => {
  getData();
});
</script>
