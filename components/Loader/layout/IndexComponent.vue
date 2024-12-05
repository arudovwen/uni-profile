<template>
  <div class="flex gap-x-6 h-full container pt-6">
    <div class="h-full hidden lg:inline sticky top-10">
      <SideComponent />
    </div>
    <div class="h-full flex-1 overflow-x-auto">
      <div class=""><MainComponent /></div>
    </div>
  </div>
</template>
<script setup>
import SideComponent from "./SideComponent.vue";
import MainComponent from "./MainComponent.vue";
</script>
