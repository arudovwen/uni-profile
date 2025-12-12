<template>
  <div class="flex flex-col gap-y-4 bg-[#F9FAFB] h-screen max-w-screen">
    <div class="flex flex-col flex-1 w-full h-full">
      <div class="relative flex flex-1 w-full h-full">
        <div class="h-[100vh] w-auto hidden lg:block">
          <LayoutSideComponent />
        </div>
        <LayoutMobileSideComponent />

        <div class="flex-1 h-full w-full lg:min-h-[80vh] overflow-auto">
          <AppHeader :hideLogo="true" />
          <MobileHeader />
          <!-- <LayoutMainComponent /> -->
          <div class="px-4 py-8 mt-12 lg:px-8 lg:mt-0">
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
