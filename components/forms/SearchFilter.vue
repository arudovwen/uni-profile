<template>
  <div
    v-click-outside="
      () => {
        isOpen = false;
      }
    "
  >
    <div class="relative w-full">
      <div @click="isOpen = true">
        <slot name="content"> </slot>
      </div>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="isOpen">
          <div
            class="absolute mt-1 w-full min-w-[250px] right-0 z-40 rounded-lg bg-white py-4 px-6 text-xs shadow-lg ring-1 ring-black ring-opacity-5 outline-0 sm:text-[13px]"
          >
            <div v-if="!options.length">
              <p class="text-[#ABABAB] text-sm py-2 text-center">
                No saved search
              </p>
            </div>
            <div class="max-h-60 overflow-y-auto" v-if="options.length">
              <ul
                v-for="option in options"
                :key="option.name"
                :value="option.name"
              >
                <li
                  :class="[
                    'relative cursor-default select-none py-2 text-loft-black hover:bg-gray-50 mb-1',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div @click="handleSave">
                      <p class="text-sm font-medium">
                        {{ option.name }}
                      </p>
                      <p class="text-[#ABABAB] text-xs">
                        {{ option.created }}
                      </p>
                    </div>

                    <button
                      class="flex items-center justify-center bg-[#F1F3F5] rounded-full h-8 w-8"
                    >
                      <i class="uil uil-times text-lg"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const isOpen = ref(false);
const emits = defineEmits(["onGetData"]);
const options = [
  // {
  //   name: "Ethanol",
  //   created: "Created on Mar 15, 11:05 PM",
  // },
  // {
  //   name: "Chemicals for Kate",
  //   created: "Created on Mar 15, 11:05 PM",
  // },
  // {
  //   name: "Ethyl Acetate",
  //   created: "Created on Mar 15, 11:05 PM",
  // },
];
const selectedoption = ref("");

function handleSave() {
  isOpen.value = false;
  emits("onGetData", selectedoption.value);
}
</script>
