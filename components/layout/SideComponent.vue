<template>
  <aside
    class="box-border flex flex-col items-start w-[282px] h-full bg-white border-r border-gray-200"
  >
    <div class="w-full pt-[32px] grid gap-y-12">
      <div
        class="flex flex-col items-start p-0 pl-[24px] pr-[20px] w-full h-[30px] z-20"
      >
        <AppLogo />
      </div>
      <nav class="flex flex-col items-start px-[16px] gap-[8px] w-full z-0">
        <ul class="grid gap-y-2 w-full">
          <li
            v-for="item in mappedNavigation"
            :key="item.name"
            class="block w-full"
          >
            <router-link
              :to="item.url"
              :class="`flex flex-row items-center p-2 gap-2 w-full h-[40px] bg-blue rounded-[6px] ${
                isActive(item) && 'bg-[#1570EF] !text-[#ffffff]'
              }`"
            >
              <div class="flex flex-row items-center p-2 gap-x-3">
                <span class="">
                  <SvgsHomeSvg
                    v-if="item.key === 'home'"
                    :active="isActive(item)"
                  />
                  <SvgsFinanceSvg
                    v-if="item.key === 'financing'"
                    :active="isActive(item)"
                  />
                  <SvgsOrdersSvg
                    v-if="item.key === 'credit'"
                    :active="isActive(item)"
                  />

                  <SvgsProfileSvg
                    v-if="item.key === 'profile'"
                    :active="isActive(item)"
                  />
                </span>

                <span
                  class="block h-[24px] font-onest font-normal text-[16px] leading-[24px] text"
                >
                  <!-- Text content here -->
                  {{ item.name }}
                </span>
              </div>
            </router-link>
          </li>
          <li class="block w-full">
            <span
              :class="`flex flex-row items-center p-2 gap-2 w-full  bg-blue rounded-[6px]`"
            >
              <button
                class="outline-none flex flex-row items-center px-2 gap-x-3 justify-between w-full"
              >
                <span
                  class="font-onest font-normal text-[16px] leading-[24px] flex gap-x-3 items-center"
                >
                  <SvgsProfileSvg />
                  <span>Profile Settings</span>
                </span>
                <SvgsLinkSvg />
              </button>
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
<script setup>
const route = useRoute();
const mappedNavigation = computed(() => Navigation);

const isActive = (item) => {
  return (
    item.url === route.path ||
    item?.childRoutes?.some((child) => child === route.path)
  );
};
</script>
<style scoped lang="scss"></style>
