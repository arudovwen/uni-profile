<template>
  <div
    class="hidden"
    v-click-outside="
      () => {
        isOpen = false;
      }
    "
  >
    <div>
      <div class="relative w-full">
        <div @click="isOpen = !isOpen">
          <slot name="content"> </slot>
        </div>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-show="isOpen">
            <div
              class="absolute mt-1 w-full min-w-[160px] right-0 z-40 rounded-lg bg-white py-4 px-6 text-xs shadow-lg ring-1 ring-black ring-opacity-5 outline-0 sm:text-[13px]"
            >
              <div class="max-h-60 overflow-y-auto">
                <ul
                  v-for="option in options"
                  :key="option.name"
                  :value="option.name"
                >
                  <li
                    :class="[
                      'relative cursor-default select-none py-2 text-loft-black hover:bg-gray-50',
                    ]"
                  >
                    <label :for="option.name" class="flex items-center gap-x-2">
                      <input
                      :id="option.name"
                        type="radio"
                        v-model="selectedoption"
                        :value="option.name"
                        class="accent-matta-black"
                      />
                      <span class="text-sm capitalize">{{
                        option.name
                      }}</span></label
                    >
                  </li>
                </ul>
              </div>
              <div class="mt-3">
                <button
                  @click="handleSave"
                  class="py-3 rounded-lg bg-primary-500 w-full text-white uppercase"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const isOpen = ref(false);
const emits = defineEmits(["onGetData"]);
const options = [
  {
    name: "newest",
  },
  {
    name: "price",
  },
  {
    name: "title",
  },
];
const selectedoption = ref("");

function handleSave() {
  isOpen.value = false;
  emits("onGetData", selectedoption.value);
}
</script>
