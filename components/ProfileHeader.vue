<template>
  <div class="bg-white border-t border-b border-[#E4E7EC]">
    <ul class="flex gap-x-1 items-center justify-start py-3 container overflow-auto">
      <li v-for="n in Navigation" :key="n.name">
        <NuxtLink :to="n.url">
          <button
            :class="
              route.path === n.url
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-transparent'
            "
            class="border py-2 px-4 font-medium text-sm text-[#344054] rounded-[6px] whitespace-nowrap"
          >
            {{ n.name }}
          </button>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { Navigation } from "@/utils/constants";

const route = useRoute();
</script>
