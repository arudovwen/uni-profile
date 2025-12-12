<template>
  <div class="relative bg-[#1570EF01]">
    <div
      class="bg-[#FFFFFF] min-h-screen w-screen bg-contain bg-center max-w-[1980px] mx-auto lg:flex justify-center items-center relative p-4"
    >
      <div class="mb-6 lg:absolute top-6 left-6">
        <NuxtLink to="/"> <AuthLogo /></NuxtLink>
      </div>
      <div class="lg:border rounded-xl shadow-hero lg:border-[#E4E7EC] bg-white px-2 py-11 lg:px-9">
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
  @media screen and (max-width: 768px) {
    box-shadow: none;
  }
}
</style>
