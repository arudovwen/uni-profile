<template>
  <div
    class="flex flex-col h-screen justify-start mt-12 lg:mt-auto pt-10"
  >
    <div class="mb-20 pb-2 z-10 container">
      <AuthLogo />
    </div>
    <slot />
  </div>
</template>
<script setup>
// const cartStore = useCartStore();

// onMounted(() => {
//   cartStore.getMyCart();
// });
</script>
