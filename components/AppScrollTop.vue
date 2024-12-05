<template>
  <span
    v-if="!view.atTopOfPage"
    @click="scroll"
    class="cursor-pointer h-10 w-10 rounded-full bg-[#182230333] opacity-50 hover:opacity-100 flex items-center justify-center fixed bottom-10 right-4 z-[999]"
    ><AppIcon icon="icon-park-outline:to-top" class="text-xl text-white"
  /></span>
</template>

<script setup>
const view = ref({
  atTopOfPage: true,
});
onBeforeMount(() => {
  window.addEventListener("scroll", handleScroll);
});
function handleScroll() {
  // when the user scrolls, check the pageYOffset
  if (window?.pageYOffset > 600) {
    // user is scrolled
    if (view.value.atTopOfPage) view.value.atTopOfPage = false;
  } else {
    if (!view.value.atTopOfPage) view.value.atTopOfPage = true;
  }
}
function scroll() {
  window.scrollTo(0, 0);
}
</script>
