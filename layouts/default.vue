<template>
  <div
    class="bg-[#F9FAFB] darks:bg-gray-800 relative w-screen flex flex-col h-screen overflow-y-auto"
  >
    <AppHeader :showlang="true" />
    <ProfileHeader />
    <div class="flex-1">
      <slot />
    </div>
    <!-- <AppFooter />
    <a
      data-testid="whatsapp link"
      href="https://wa.me/+2349169982190"
      target="_blank"
      class="z-[99999]"
    >
      <button
        class="fixed bottom-10 transition duration-300 right-4 opacity-80 hover:opacity-100 hover:scale-[1.1]"
      >
        <img
          src=""
          width="60"
          height="60"
          alt="whatsapp link"
          class="drop-shadow-lg"
        />
      </button>
    </a> -->
  </div>
</template>
<script setup>
// const cartStore = useCartStore();

// onMounted(() => {
//   cartStore.getMyCart();
// });
</script>
