<template>
  <div class="min-h-screen flex flex-col auth-grid-bg">
    <!-- Header -->
    <header
      class="h-16 px-0 md:px-6 flex items-center justify-between border-b border-[#E4E7EC] bg-white"
    >
      <div
        class="h-16 px-6 flex flex-row items-center justify-between w-full max-w-[1120px] mx-auto"
      >
        <NuxtLink to="/">
          <AuthLogo />
        </NuxtLink>
        <slot name="header-right" />
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-start flex-col pt-[100px] px-4 py-8"
    >
      <div class="w-full max-w-[1120px]">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center">
      <p class="text-sm text-[#475467]">
        &copy;Matta {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import AuthLogo from "~/components/AuthLogo.vue";
</script>

<style scoped>
.auth-grid-bg {
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 30%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(to right, #e4e7ec 1px, transparent 1px),
    linear-gradient(to bottom, #e4e7ec 1px, transparent 1px);
  background-size: 100% 100%, 48px 48px, 48px 48px;
}
</style>
