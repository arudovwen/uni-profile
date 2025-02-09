<template>
  <div class="flex flex-col gap-y-4 bg-[#F9FAFB] h-screen max-w-screen">
    <div class="flex-1 flex h-full flex-col w-full">
      <div class="flex flex-1 h-full w-full relative">
        <div class="h-[100vh] w-auto hidden lg:block">
          <LayoutSideComponent />
        </div>
        <LayoutMobileSideComponent />

        <div class="flex-1 h-full w-full lg:min-h-[80vh] overflow-auto">
          <AppHeader :hideLogo="true" />
          <MobileHeader />
          <!-- <LayoutMainComponent /> -->
          <div class="py-8 px-4 lg:px-8 mt-12 lg:mt-0">
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
