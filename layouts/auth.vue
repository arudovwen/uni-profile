<template>
  <div class="relative">
    <div
      class="bg-[#FFFFFF] min-h-screen w-screen bg-contain bg-center max-w-[1980px] mx-auto lg:flex justify-center items-center relative p-4"
    >
      <div class="lg:absolute top-6 left-6 mb-6">
        <NuxtLink to="/"> <AuthLogo /></NuxtLink>
      </div>
      <div class="border rounded-xl shadow-hero border-[#E4E7EC] py-11 px-9">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>


</script>

<style scoped lang="scss">
.shadow-hero {
  box-shadow: 0px 32px 64px -12px rgba(16, 24, 40, 0.14);
}
</style>
