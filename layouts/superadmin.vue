<template>
  <div class="flex flex-col gap-y-4 bg-[#F9FAFB] h-screen max-w-screen">
    <div class="flex flex-col flex-1 w-full h-full">
      <div class="relative flex flex-1 w-full h-full">
        <div class="h-[100vh] w-auto hidden">
          <LayoutSideComponent />
        </div>
        <LayoutMobileSideComponent />

        <div class="flex-1 h-full w-full lg:min-h-[80vh] overflow-auto">
          <div class="hidden lg:block">
            <AppHeader :hideLogo="true" />
          </div>
          <MobileHeader />
          <!-- <LayoutMainComponent /> -->
          <div class="px-4 py-4 mt-12 lg:px-4 lg:mt-0 max-w-[1120px] mx-auto">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const showSideBar = ref(false);

provide("showSideBar", showSideBar);
provide("toggleSideBar", (val) => {
  showSideBar.value = val;
});
</script>
