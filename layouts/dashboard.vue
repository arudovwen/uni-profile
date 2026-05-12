<template>
  <div class="min-h-screen bg-[#F9FAFB] font-Avenir">
    <!-- Header -->
    <app-header :showlang="false" />
    <!-- Main Content -->
    <main class="px-4 sm:px-6 lg:px-0">
      <slot />
    </main>
  </div>
</template>
