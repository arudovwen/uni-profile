<template>
  <div class="h-full bg-white rounded-lg p-6 lg:p-8 w-[50vw] flex flex-col">
    <h4 class="text-xl flex items-center gap-x-1 mb-4 font-medium">
      <span class="text-matta-black">All Filters</span>
      <span class="text-[#B6B7B9]">/</span>
      <span class="text-primary">8</span>
    </h4>
    <hr class="text-[#E7EBEE] my-1" />
    <div class="flex">
      <div class="flex gap-x-2 flex-1 max-w-full overflow-x-auto">
        <button
          class="flex gap-x-2 items-center uppercase whitespace-nowrap hover:text-white hover:bg-matta-black py-2 px-3 md:py-3 md:px-6 border rounded-full border-[#ddd] md:leading-5 text-[10px] sm:text-[13px] shadow-sm h-10"
          :class="'text-white bg-matta-black'"
        >
          <span>Area of application</span>
          <span
            class="bg-white w-4 h-4 text-[10px] rounded-full text-matta-black hover:text-matta-black flex items-center justify-center"
            >5</span
          >
          <span class=""><i class="uil uil-times text-sm"></i></span>
        </button>
        <button
          class="flex gap-x-2 items-center uppercase whitespace-nowrap hover:text-white hover:bg-matta-black py-2 px-3 md:py-3 md:px-6 border rounded-full border-[#ddd] md:leading-5 text-[10px] sm:text-[13px] shadow-sm h-10"
          :class="'text-white bg-matta-black'"
        >
          <span>Producer</span>
          <span
            class="bg-white w-4 h-4 text-[10px] rounded-full text-matta-black hover:text-matta-black flex items-center justify-center"
            >5</span
          >
          <span class=""><i class="uil uil-times text-sm"></i></span>
        </button>
        <button
          class="flex gap-x-2 items-center h-10 uppercase whitespace-nowrap hover:text-white hover:bg-matta-black py-2 px-3 md:py-3 md:px-6 border rounded-full border-[#ddd] md:leading-5 text-[10px] sm:text-[13px] shadow-sm"
          :class="'text-white bg-matta-black'"
        >
          <span>Price</span>
          <span
            class="bg-white w-4 h-4 text-[10px] rounded-full text-matta-black hover:text-matta-black flex items-center justify-center"
            >5</span
          >
          <span class=""><i class="uil uil-times text-sm"></i></span>
        </button>
      </div>
      <div class="flex gap-x-3 ml-2">
        <button
          @click="emits('toggleClear')"
          class="h-10 w-10 rounded-full flex items-center justify-center border border-[#E7EBEE]"
        >
          x
        </button>
        <button
          @click="emits('toggleSave')"
          class="h-10 rounded-full flex items-center justify-center border border-[#E7EBEE] text-[13px] px-5"
        >
          Save
        </button>
      </div>
    </div>
    <hr class="text-[#E7EBEE] my-1" />
    <div class="flex-1 max-h-full overflow-y-auto grid grid-cols-2 gap-x-6">
      <div
        class="bg-gray-100 h-full overflow-y-auto max-h-full px-6 py-8 rounded-lg"
      >
        <h5 class="text-lg flex items-center gap-x-1 mb-4 font-medium">
          Filter Group
        </h5>
        <div class="h-full max-h-full overflow-y-auto">
          <ul>
            <li v-for="(n, i) in menu" :key="i" class="mb-6">
              <div class="grid grid-cols-3 justify-between items-start">
                <div
                  class="col-span-2 text-matta-black font-medium text-base cursor-pointer capitalize flex gap-x-1 items-center"
                >
                  <div class="whitespace-nowrap truncate ... max-w-[150px]">
                    {{ n.title.toLowerCase() }}
                  </div>
                  <div
                    class="bg-matta-black w-5 h-5 text-[10px] rounded-full text-white flex items-center justify-center"
                  >
                    5
                  </div>
                </div>
                <span
                  class="text-right text-lg"
                  @click="handleIndex(i)"
                  v-if="openIndex !== i"
                  ><i class="uil uil-plus"></i
                ></span>
                <span
                  class="text-right text-lg"
                  @click="dropIndex(i)"
                  v-if="openIndex === i"
                  ><i class="uil uil-minus"></i
                ></span>
              </div>
              <hr class="border-[#DDDDDD] my-4" />
              <!-- subs  -->
              <ul v-if="openIndex === i">
                <li
                  v-for="(subs, id) in n.subCategory"
                  :key="id"
                  class="mb-1"
                  @click="handleSelect(subs.title.toLowerCase())"
                >
                  <i
                    class="uil uil-corner-down-right mr-2"
                    v-if="active == subs.title.toLowerCase()"
                  ></i>
                  <span
                    class="text-sm text-matta-black font-medium pr-2 capitalize"
                    >{{ subs.title.toLowerCase() }}</span
                  >
                  <span class="text-sm text-[#B6B7B9] font-normal capitalize"
                    >0</span
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="bg-white h-full overflow-y-auto max-h-full rounded-lg pt-8">
        <h4 class="text-lg flex items-center gap-x-1 mb-4 font-medium">
          <span class="text-matta-black">Quality Standards</span>
          <span class="text-[#B6B7B9]">/</span>
          <span class="text-primary">8</span>
        </h4>
        <div class="flex justify-between items-center">
          <span class="text-[#ABABAB] text-sm"
            >{{ selectedoption.length }} selected</span
          >
          <button class="text-primary text-sm" @click="selectedoption = []">
            Clear all
          </button>
        </div>
        <hr class="my-4 border-[#E7EBEE]" />
        <div class="relative flex items-center mb-2">
          <div class="flex items-center w-full">
            <input
              v-model="query"
              placeholder="Type property name..."
              class="text-xs rounded-lg px-3 py-1 h-10 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
            />
            <i class="uil uil-search absolute right-2"></i>
          </div>
        </div>
        <div class="max-h-60 overflow-y-auto py-2">
          <ul
            v-for="option in filteredOption"
            :key="option.name"
            :value="option.name"
          >
            <li
              :class="[
                'relative cursor-default select-none py-2 text-loft-black hover:bg-gray-50',
              ]"
            >
              <label for="checkbox" class="flex items-center gap-x-2">
                <input
                id="checkbox"
                  type="checkbox"
                  v-model="selectedoption"
                  :value="option.name"
                  class="accent-matta-black"
                />
                <span class="sm:text-[13px]">{{ option.name }}</span></label
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-x-3 border-t border-[[#E7EBEE]] pt-4">
      <button
        @click="emits('cancel')"
        class="border text-[13px] border-[#E7EBEE] rounded-lg px-6 py-4 min-w-[150px] hover:opacity-60 uppercase"
      >
        Cancel
      </button>
      <button
        class="border text-[13px] border-primary- text-white bg-primary-500 rounded-lg px-6 py-4 min-w-[150px] uppercase hover:opacity-60"
      >
        Apply filters
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps, computed } from "vue";

const emits = defineEmits(["cancel", "toggleClear", "toggleSave"]);
const props = defineProps({
  filter: {
    default: 0,
  },
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
const active = ref("");
const menu = [
  {
    title: "Producer",
    subCategory: [
      {
        title: "Pharmzel",
      },
    ],
  },
  {
    title: "Features & Benefits",
    subCategory: [
      {
        title: "Glycyell",
      },
    ],
  },
  {
    title: "Regulatory & Compliance",
    subCategory: [
      {
        title: "Quality Standards",
      },
    ],
  },
  {
    title: "Properties",
    subCategory: [
      {
        title: "Helium",
      },
    ],
  },
  {
    title: "Packaging & Availability",
    subCategory: [
      {
        title: "Standards",
      },
    ],
  },
  {
    title: "Area of application",
    subCategory: [
      {
        title: "Steel",
      },
    ],
  },
  {
    title: "Technical Details",
    subCategory: [
      {
        title: "Compliance",
      },
    ],
  },
];
function handleSelect(val) {
  active.value = val;
}
const openIndex = ref("");

function handleIndex(val) {
  openIndex.value = val;
}
function dropIndex() {
  openIndex.value = "";
}

const selectedoption = ref([]);
const query = ref("");
const filteredOption = computed(() => {
  if (!query.value) return props.options;

  return props.options.filter((item) => {
    return item.name.toLowerCase().includes(query.value.toLowerCase());
  });
});
</script>
