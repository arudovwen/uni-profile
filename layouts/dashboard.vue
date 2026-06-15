<template>
  <div class="min-h-screen bg-[#F9FAFB] font-Avenir">
    <!-- Header -->
    <app-header :showlang="false" />
    <!-- Main Content -->
    <main class="px-4 sm:px-6 lg:px-0">
      <slot />
    </main>
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-black/20 backdrop-blur-sm"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-[#e5e7eb] border-t-[#1570EF]"
      />
      <p class="text-sm font-semibold text-[#475467]">
        Running checks, please wait...
      </p>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import handleVendorCheck from "~/utils/handleVendorCheck";
const router = useRouter();
const isLoading = ref(false);
const setLoading = (value) => {
  isLoading.value = value;
};
onMounted(async () => {
  await handleVendorCheck(router, setLoading, true);
});
</script>
