<template>
  <div class="">
    <ul
      class="custom-shadow bg-white rounded-lg overflow-hidden w-[200px] grid gap-y-1 border border-gray-50"
    >
      <li v-for="tab in tabs" :key="tab.label">
        <component
          :is="tab.to ? 'NuxtLink' : 'button'"
          :to="tab.to"
          :type="tab.to ? undefined : 'button'"
          class="text-sm font-semibold py-2 px-3 border-l-2 w-full text-left"
          @click="!tab.to && emits('setActive', tab.value)"
          :class="
            active === tab.value
              ? 'bg-[#F5FAFF]  border-primary-500 text-primary-500'
              : 'border-transparent text-[#667085]'
          "
        >
          {{ tab.label }}
        </component>
      </li>
    </ul>
  </div>
</template>

<script setup>
const emits = defineEmits(["setActive"]);

const props = defineProps(["tabs", "active"]);
</script>
<style>
.custom-shadow {
  box-shadow: 0px 2px 4px -2px #1018280f;
  box-shadow: 0px 4px 8px -2px #1018281a;
}
</style>
