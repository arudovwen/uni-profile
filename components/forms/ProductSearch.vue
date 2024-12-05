<template>
  <Listbox v-model="selectedOption">
    <div class="relative w-full">
      <ListboxButton
        class="relative w-full border border-[#D0D5DD] cursor-default min-h-[40px] min-w-[100px] bg-white text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-[14px] flex items-center rounded-lg"
      >
        <span class="block text-sm" v-if="selectedOption">
          <div class="text-[#3A3745] flex items-center gap-x-1 px-3 capitalize">
            <span
              class="block text-[#101828] text-[14px] whitespace-nowrap w-[150px] truncate ..."
              v-if="selectedOption"
              >{{ selectedOption.title }}</span
            >
          </div></span
        >
        <span
          class="block text-[#8F8C9A] text-[14px] whitespace-nowrap w-[150px] truncate .. px-3"
          v-else
        >
          {{ isLoading ? "Loading products..." : placeholder }}
        </span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronDownIcon class="h-4 w-4 text-[#3A3745]" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute w-full mt-[.5rem] min-w-[16rem] z-[999] rounded-lg bg-white text-sm shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),_0px_4px_6px_-2px_rgba(16,24,40,0.03)] ring-1 ring-black ring-opacity-5 border-b-2 outline-0 sm:text-sm pb-8"
        >
          <div class="px-4 py-4">
            <input
              class="text-xs rounded-lg px-3 py-1 h-10 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20 text-matta-black"
              v-model="query"
              placeholder="Search customer name"
              type="text"
            />
          </div>
          <div v-if="filteredOptions.length" class="max-h-60 overflow-auto">
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in filteredOptions"
              :key="option.id"
              :value="option"
              as="template"
            >
              <span 
                :class="[
                  active ? 'bg-gray-100' : '',
                  'relative select-none py-2 px-3 rounded text-loft-black hover:bg-gray-100 cursor-pointer text-matta-black',
                ]"
              >
                <span
                  :class="[selected ? 'font-medium' : 'font-normal', 'block']"
                  class="sm:text-[13px] leading-normal"
                  >{{ option.title }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-matta-black"
                >
                  <CheckIcon
                    class="h-5 w-5 text-matta-black"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </ListboxOption>
          </div>
          <div
            v-if="!filteredOptions.length"
            class="relative cursor-pointer select-none px-[13px] text-loft-black text-center text-sm text-[#667085]"
          >
            {{ isLoading ? "Searching..." : "Not found" }}
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
<script setup>
import {
  Listbox,
  // ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import {
  ref,
  defineProps,
  defineEmits,
  watch,
  computed,
  onMounted,
  reactive,
} from "vue";
import { getProducts } from "~/services/productservices";
import debounce from "lodash/debounce";
import { CheckIcon } from "@heroicons/vue/24/solid";

const props = defineProps(["label", "modelValue", "placeholder", "id"]);
onMounted(() => {
  getData();
});
const productParams = reactive({
  MarketApplication: "",
  MarketId: props.id,
  MarketSubApplication: "",
  Search: "",
  PageSize: 30,
  PageNumber: 1,
  ShowSubMenu: false,
});
const isLoading = ref(false);
function getData() {
  if (!props.id) return;
  isLoading.value = true;
  productParams.MarketId = props.id;
  productParams.Search = query.value;
  getProducts(productParams)
    .then((res) => {
      if (res.status == 200) {
        options.value = res?.data?.data?.data;
        isLoading.value = false;
        if (props.modelValue) {
          selectedOption.value = filteredOptions.value.find(
            (i) => i.id == props.modelValue
          );
        } else {
          selectedOption.value = null;
        }
      }
    })
    .catch(() => {
      isLoading.value = false;
    });
}
const debounceSearch = debounce(() => {
  getData();
}, 800);

const options = ref([]);
const emits = defineEmits(["update:modelValue"]);
const selectedOption = ref(null);
const query = ref("");
const filteredOptions = computed(() => {
  if (!query.value) return options.value;

  return options.value.filter((i) =>
    i.title.toLowerCase().includes(query.value.toLowerCase())
  );
});

watch(query, () => {
  debounceSearch();
});

watch(
  () => [props.modelValue],
  () => {
    if (props.modelValue) {
      selectedOption.value = filteredOptions.value.find(
        (i) => i.id == props.modelValue
      );
    } else {
      selectedOption.value = null;
    }
  }
);
watch(
  () => [props.id],
  () => {
    getData();
  }
);

watch(selectedOption, () => {
  if (selectedOption.value == null) return;
  emits("update:modelValue", selectedOption.value.id);
});
</script>
