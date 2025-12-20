<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-16 px-6 flex items-center border-b border-[#E4E7EC] bg-white">
      <NuxtLink to="/">
        <AuthLogo />
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <main class="flex-1 auth-grid-bg flex items-center justify-start flex-col pt-[121px] px-4 py-8">
      <div class="w-full max-w-[440px]">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="auth-grid-bg py-4 text-center">
      <p class="text-sm text-[#475467]">
        &copy;Oxide Pro {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.auth-grid-bg {
  background-image:
    linear-gradient(to bottom, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 0) 100%),
    linear-gradient(to right, #E4E7EC 1px, transparent 1px),
    linear-gradient(to bottom, #E4E7EC 1px, transparent 1px);
  background-size: 100% 100%, 48px 48px, 48px 48px;
}
</style>
