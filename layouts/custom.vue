<template>
  <div class="bg-[#F9FAFB] h-screen w-screen flex items-center justify-center">
    <div>
      <span class="mb-3 block mx-auto" v-if="!route.name.includes('process-payment')">
        <!-- <NuxtLink to="/">
          <img
            src="/logo-matta-black.png"
            class="w-[132px] mx-auto "
            alt="Matta"
            width="132"
            height="auto"
          />
        </NuxtLink> -->
      </span>
      <slot />
    </div>
  </div>
</template>
<script setup>
const route = useRoute()
</script>