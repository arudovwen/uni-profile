<template>
  <Listbox v-model="selectedOption">
    <div :class="`relative w-full`">
      <span v-show="label !== null" :class="labelClass">
        {{ label }}
      </span>
      <ListboxButton
        :class="`${className} ${
          error
            ? 'border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1'
            : ''
        }`"
        data-testid="listbtn"
        class="relative w-full border border-[#D0D5DD] cursor-default min-h-[40px] min-w-[100px] bg-white text-left shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:text-[14px] flex items-center rounded-lg"
      >
        <span class="block text-sm" v-if="selectedOption">
          <div class="text-[#3A3745] flex items-center gap-x-1 px-3 capitalize">
            <span
              class="block text-[#101828] text-[14px] whitespace-nowrap w-[150px] truncate ..."
              v-if="selectedOption"
              >{{ selectedOption.name }}</span
            >
          </div></span
        >
        <span
          class="block text-[#8F8C9A] text-[14px] whitespace-nowrap w-[150px] truncate .. px-3"
          v-else
          >{{ placeholder }}</span
        >
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
          class="absolute w-full mt-[.5rem] min-w-[16rem] z-[999] rounded-lg bg-white text-sm shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),_0px_4px_6px_-2px_rgba(16,24,40,0.03)] border-b-2 outline-0 sm:text-sm"
        >
          <div class="px-4 py-4">
            <input
              class="text-xs rounded-lg px-3 py-1 h-10 w-full border bg-[#F1F3F5] placeholder:text-[#B6B7B9] focus:outline-matta-black/20 text-matta-black"
              v-model="query"
              placeholder="Search customer name"
              type="text"
              autofocus
            />
          </div>
          <div v-if="filteredOptions.length" class="max-h-60 overflow-auto">
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in filteredOptions"
              :key="option.id"
              :value="option"
              as="ul"
            >
              <li
                :class="[
                  active ? 'bg-gray-100' : '',
                  'relative select-none py-[6px] px-4 rounded text-loft-black hover:bg-gray-100 cursor-pointer text-matta-black',
                ]"
              >
                <span
                  :class="[selected ? 'font-medium' : 'font-normal', 'block']"
                  class="sm:text-[13px] leading-normal capitalize"
                  >{{ option.name }}</span
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
              </li>
            </ListboxOption>
          </div>
          <div
            v-if="!filteredOptions.length"
            class="relative cursor-pointer select-none px-[13px] text-loft-black text-center text-sm text-[#667085] py-4"
          >
            {{ isLoading ? "Searching..." : "Not found" }}
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
  <span
    v-if="error"
    class=""
    :class="
      msgTooltip
        ? ' inline-block placeholder-[#f9bb64] bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
        : ' text-danger-500 block placeholder-[#f9bb64] text-sm'
    "
    >{{ error }}</span
  >
  <span @click="isOpen = true" class="text-[#021242]"
    >+ Create a new customer</span
  >
  <Center>
    <CreateForm
      @refresh="
        () => {
          isOpen = false;
          getData()
        }
      "
    />
  </Center>
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
import debounce from "lodash/debounce";
import { CheckIcon } from "@heroicons/vue/24/solid";
import { getContacts } from "~/services/shippingservice";
import { getCustomers } from "~/services/userservices";
import Center from "../Modal/Center.vue";
import CreateForm from "../Pages/Customers/CreateForm.vue";

const isOpen = ref(false);
provide("isOpen", isOpen);

const props = defineProps([
  "label",
  "modelValue",
  "labelClass",
  "placeholder",
  "role",
  "className",
  "BusinessUserType",
  "error",
]);
onMounted(() => {
  getData();
});
const isLoading = ref(false);
const options = ref([]);
const emits = defineEmits(["update:modelValue", "selectUser"]);
const selectedOption = ref(null);
const query = reactive({
  Search: query.value,
  PageNumber: 1,
  PageSize: 100,
  Role: props.role,
  BusinessUserType: props.BusinessUserType,
});
function getData() {
  isLoading.value = true;
  getCustomers(query)
    .then((res) => {
      if (res.status == 200) {
        console.log(res.data.data);

        options.value = [
          { id: "", name: "All" },
          ...res.data.data.map((i) => ({
            ...i,

            id: i.id,
            name: `${i.firstName} ${i.lastName}`,
          })),
        ];
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

const filteredOptions = computed(() => {
  if (!query.value) return options.value;
  return options.value.filter((i) =>
    i.name.toLowerCase().includes(query.value.toLowerCase())
  );
});

watch(query, () => {
  debounceSearch();
});

watch(
  () => props.modelValue,
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

watch(selectedOption, () => {
  if (selectedOption.value == null) return;
  emits("update:modelValue", selectedOption.value.id);
  console.log("op", options);

  const usr = options.value.find((i) => i.id === selectedOption.value.id);
  emits("selectUser", usr);
});
</script>
