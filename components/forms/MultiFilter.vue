<template>
  <div
    class="relative w-full"
    v-click-outside="
      () => {
        isOpen = false;
      }
    "
  >
    <div class="relative w-full">
      <div
        @click="isOpen = !isOpen"
        :class="classStyles"
        class="relative w-full cursor-default rounded-lg min-h-[40px] border border-[#D0D5DD] bg-white p-6 text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-[13px] flex items-center"
      >
        <span
          class="block text-[#8F8C9A] text-[13px] whitespace-nowrap truncate w-[150px]"
          >{{ selectedoption ? selectedoption.value : placeholder }}</span
        >
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <i class="uil uil-angle-down absolute right-2 appearance-none"></i>
        </span>
      </div>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="isOpen">
          <div
            class="absolute mt-1 w-full z-40 rounded-lg bg-white py-6 px-4 min-w-[250px] text-xs shadow-lg ring-1 ring-black ring-opacity-5 outline-0 sm:text-[13px]"
          >
            <!-- <div class="flex justify-between items-center">
                <span class="text-[#ABABAB] text-sm"
                  >{{ selectedoption.length }} selected</span
                >
                <button
                  class="text-primary text-sm"
                  @click="selectedoption = []"
                >
                  Clear all
                </button>
              </div> -->
            <!-- <hr class="my-4 border-[#E7EBEE]" /> -->
            <div class="relative flex items-center mb-2" v-if="showSearch">
              <div class="flex items-center w-full">
                <input
                  v-model="query"
                  placeholder="Search name..."
                  class="text-xs rounded-lg px-3 py-1 h-10 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
                />
                <i class="uil uil-search absolute right-2"></i>
              </div>
            </div>
            <div class="max-h-60 overflow-y-auto py-2">
              <ul>
                <li
                  :class="[
                    'relative select-none py-2 rounded text-matta-black hover:bg-gray-100 px-2',
                  ]"
                >
                  <label for="All" class="flex items-center gap-x-2 cursor-pointer">
                    <input
                    id="All"
                      type="radio"
                      v-model="selectedoption"
                      value=""
                      class="accent-matta-black"
                    />
                    <span class="sm:text-[13px]">All</span></label
                  >
                </li>
                <li
                  v-for="option in filteredOption"
                  :key="option.name"
                  :class="[
                    'relative select-none py-2 rounded text-matta-black hover:bg-gray-100 px-2',
                  ]"
                >
                  <label :for="option.name" class="flex items-center gap-x-2 cursor-pointer">
                    <input
                    :id="option.name"
                      type="radio"
                      v-model="selectedoption"
                      :value="option"
                      class="accent-matta-black"
                    />
                    <span class="sm:text-[13px] leading-normal capitalize">{{
                      option.name
                    }}</span></label
                  >
                </li>
              </ul>
            </div>
            <div class="mt-3">
              <button
                @click="handleSave"
                class="py-4 rounded-lg bg-primary-500 w-full text-white uppercase"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed } from "vue";

const isOpen = ref(false);
const emits = defineEmits(["onGetData"]);
const props = defineProps({
  options: {
    type: Array,
  },
  placeholder: {
    default: "Select",
  },
  classStyles: {
    type: String,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
});
const selectedoption = ref(null);
const query = ref("");
const filteredOption = computed(() => {
  if (!query.value) return props.options;

  return props.options.filter((item) => {
    return item.name.toLowerCase().includes(query.value.toLowerCase());
  });
});

function handleSave() {
  isOpen.value = false;
  emits("onGetData", selectedoption.value);
}
</script>
