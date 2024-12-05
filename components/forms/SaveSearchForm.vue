<template>
  <div
    class="bg-white p-6 lg:p-8 sm:p-6 sm:pb-4 min-w-[250px] w-full lg:w-[400px] rounded-lg"
  >
    <div class="flex justify-between mb-5 items-center">
      <h4 class="font-medium text-matta-black text-xl">Save Search</h4>
      <i
        class="uil uil-times cursor-pointer text-lg"
        @click="emits('cancel')"
      ></i>
    </div>

    <form>
      <div class="mb-6">
        <input
          class="rounded-lg px-[14px] py-[10px] h-11 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
          placeholder="Enter search name..."
        />
      </div>
      <div class="flex justify-between gap-x-2 items-center mt-8">
        <button
          type="button"
          @click="emits('cancel')"
          class="appearance-none border w-1/2 leading-none px-8 py-4 rounded-lg text-matta-black hover:bg-gray-100 text-[13px] uppercase"
        >
          cancel
        </button>

        <button
          type="button"
          @click="emits('cancel')"
          class="appearance-none border w-1/2 border-primary- leading-none px-8 py-4 rounded-lg text-white bg-primary-500 hover:opacity-70 text-[13px] uppercase"
        >
          save
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { defineEmits } from "vue";

const emits = defineEmits("cancel");
</script>
