<template>
  <div class="min-w-[400px] p-6">
    <h3 class="font-medium text-2xl mb-6">Remove {{ data }}</h3>
    <p class="mb-12">Are you sure you want to remove this {{ data }}?</p>

    <div class="flex items-center gap-x-4">
      <button
        @click="emit('cancel')"
        type="button"
        class="text-[13px] uppercase text-matta-black px-2 py-2 hover:text-primary/80 w-full"
      >
        cancel
      </button>
      <button
        type="button"
        @click="emit('remove')"
        class="border text-[13px] border-primary- uppercase w-full text-white bg-primary-500 rounded-lg px-2 py-3 hover:bg-primary/80"
      >
        remove
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps(["data"]);
const emit = defineEmits(["remove", "cancel"]);
</script>
