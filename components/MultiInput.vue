<template>
  <div v-click-outside="toggleOpen">
    <div class="relative mt-1">
      <div
        @click="isOpen = !isOpen"
        class="relative w-full cursor-default bg-white text-left focus:outline-none text-sm"
      >
        <div class="w-full">
          <div
            :class="{ 'border-red-500': error }"
            class="relative px-[14px] py-[10px] min-h-[42px] rounded-lg items-center flex flex-wrap gap-x-2 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
          >
            <ul
              v-if="data.selectedmarkets.length > 0"
              class="flex w-full flex-wrap items-center gap-2"
            >
              <li
                v-for="id in data.selectedmarkets"
                :key="id"
                class="bg-white rounded-[6px] px-2 py-1 flex items-center text-xs gap-x-3 border border-[#D0D5DD]"
              >
                <span class="leading-[initial]"> {{ getMarketName(id) }}</span>
                <i class="uil uil-times" @click="removeValue(id)"></i>
              </li>
            </ul>
            <span class="right-0 pr-2 absolute"
              ><AppIcon
                icon="ph:caret-down-bold"
                iconClass="h-4 w-4 text-[#667085]"
                aria-hidden="true"
            /></span>
          </div>
        </div>
      </div>

      <div
        v-show="isOpen"
        class="flex flex-col z-40 max-h-[500px] w-[500px] rounded-lg p-[30px] bg-white text-base shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] focus:outline-none sm:text-sm border border-[#DCDEE6] mt-1"
      >
        <div class="relative flex items-center mb-6">
          <input
            class="w-full h-10 rounded-lg text-sm px-3 py-1 border border-[#DCDEE6]"
            v-model="query"
            placeholder="Type name here"
          />
          <i class="uil uil-search absolute right-3"></i>
        </div>
        <ul class="overflow-auto flex-1">
          <li v-for="(market, idx) in filteredMarkets" :key="idx" class="mb-4">
            <label class="flex items-center text-sm gap-x-2">
              <input
                type="checkbox"
                class="accent-matta-black"
                :value="market.id"
                v-model="data.selectedmarkets"
                @change="handleUpdate(market.id, 'market')"
              />
              {{ market.title }}</label
            >
            <ul
              class="ml-8 mt-3 transition duration-500 ease-in-out"
              v-if="data.selectedmarkets.includes(market.id)"
            >
              <li
                v-for="(app, id) in market.applications"
                :key="id"
                class="mb-3"
              >
                <label class="flex items-center text-sm gap-x-2">
                  <input
                    :value="app.id"
                    type="checkbox"
                    class="accent-matta-black"
                    v-model="data.applications"
                    @change="handleUpdate(app.id, 'application', market.id)"
                  />
                  {{ app.title }}</label
                >
                <ul
                  class="ml-8 mt-3 transition duration-500 ease-in-out"
                  v-if="data.applications.includes(app.id)"
                >
                  <li
                    v-for="(subapp, id) in app.subApplications"
                    :key="id"
                    class="mb-2"
                  >
                    <label class="flex items-center text-sm gap-x-2">
                      <input
                        :value="subapp.id"
                        class="accent-matta-black"
                        type="checkbox"
                        v-model="data.subapplications"
                        @change="emits('getValue', data)"
                      />
                      {{ subapp.title }}</label
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <hr class="my-4" />
        <div class="relative flex items-center justify-end gap-x-4">
          <!-- <button
            type="button"
            class="text-sm text-matta-black"
            @click="isOpen = false"
          >
            Cancel
          </button> -->
          <button
            type="button"
            @click="handleSave"
            class="px-4 py-2 hover:opacity-80 rounded-lg bg-primary-500 text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, computed, defineEmits } from "vue";

const props = defineProps([
  "markets",
  "error",
  "selectedmarkets",
  "applications",
  "subapplications",
]);
const emits = defineEmits(["getValue"]);
const data = ref({
  selectedmarkets: props.selectedmarkets,
  applications: props.applications,
  subapplications: props.subapplications,
});

const query = ref("");
const isOpen = ref(false);
const filteredMarkets = computed(() => {
  if (!props.markets.length) return 0;
  return props.markets.filter((m) =>
    m.title.toLowerCase().includes(query.value.toLowerCase())
  );
});
function getMarketName(id) {
  const result = props.markets.find((m) => m.id === id);

  return result?.title;
}
function handleSave() {
  emits("getValue", data.value);
  isOpen.value = false;
}

function toggleOpen() {
  isOpen.value = false;
}
function removeValue(id) {
  const marks = props.markets.find((i) => i.id === id);
  const Apps = marks.applications.map((i) => i.id);
  const subApps = marks.applications
    .map((i) => i.id)
    .reduce((accumulator, currentArray) => {
      return accumulator.concat(currentArray);
    }, [])
    .map((i) => i.id);

  data.value.selectedmarkets = data.value.selectedmarkets.filter(
    (i) => i != id
  );
  data.value.applications = data.value.applications.filter(
    (i) => !Apps.includes(i)
  );
  data.value.subapplications = data.value.subapplications.filter(
    (i) => !subApps.includes(i)
  );
  emits("getValue", data.value);
}
function handleUpdate(value, type, market) {
  if (type === "market") {
    if (!data.value.selectedmarkets.includes(value)) {
      removeValue(value);
    }
  }

  if (type === "application") {
    if (!data.value.applications.includes(value)) {
      const marks = props.markets.find((i) => i.id === market);
      // const Apps = marks.applications.map((i) => i.title);
      const subApps = marks.applications
        .map((i) => i.subApplications)
        .reduce((accumulator, currentArray) => {
          return accumulator.concat(currentArray);
        }, [])
        .map((i) => i.id);
      data.value.subapplications = data.value.subapplications.filter(
        (i) => !subApps.includes(i)
      );
    }
  }
  emits("getValue", data.value);
}
watch(
  () => [
    data.value.selectedmarkets,
    data.value.applications,
    data.value.subapplications,
  ],
  () => {
    // emits("getValue", data.value);
  }
);
</script>
