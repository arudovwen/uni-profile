<template>
  <div>
    <ul class="flex gap-x-2">
      <li
        v-for="(link, idx) in links"
        :key="idx"
        :class="`text-[#475467] ${className} ${link.title && `after:content-['>']`}  font-normal last:font-semibold text-[10px] sm:text-xs lg:text-sm capitalize  last:after:content-[''] flex gap-x-2 items-center`"
      >
        <NuxtLink :to="link.url" class="">
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup>
defineProps({
  className: {
    type: String,
    default:"text-matta-black/80 last:text-primary-500"
  },
  links: {
    type: Array,
    default: [
      {
        title: "home",
        url: "/",
      },
    ],
  },
});
</script>
