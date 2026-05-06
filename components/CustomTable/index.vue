<template>
  <div
    :class="[
      'border-[#EAECF0] border rounded-lg w-full bg-white shadow-custom-table',
      className
    ]"
  >
    <!-- Table Header (with Search and Filter) -->
    <div
      class="border-box flex w-full border-b border-[#EAECF0] py-6"
      v-if="hasSearch || hasFilter"
    >
      <div
        class="flex flex-col justify-between w-full px-6 gap-x-4 lg:flex-row gap-y-4"
      >
        <div v-if="title" class="flex items-center gap-x-2">
          <p
            class="w-fit font-Onest font-semibold text-[18px] leading-[28px] text-[#101828]"
          >
            {{ title }}
          </p>
          <span
            v-if="count"
            class="box-border flex justify-center items-center p-0.5 px-1.5 w-[27px] h-[22px] bg-white border border-[#D0D5DD] shadow-sm rounded-lg"
          >
            <span class="text-center text-[#344054] font-medium text-[12px]">{{
              count
            }}</span>
          </span>
        </div>

        <div class="relative flex items-center" v-if="hasSearch">
          <span class="absolute left-4 text-[#667085]"
            ><i class="uil uil-search"></i
          ></span>
          <input
            type="search"
            :placeholder="placeholder"
            v-model="query.Search"
            class="border border-[#DFE5EC] text-sm rounded-lg w-full lg:w-[320px] h-11 pl-10 py-2 outline-none focus:outline-none"
            @change="emits('onSearch', $event.target.value)"
          />
        </div>

        <div class="flex items-center gap-x-4" v-if="hasFilter">
          <FilterButton
            v-model="filter"
            :options="filterOptions"
            :title="filterTitle"
          />
        </div>
      </div>
    </div>
    <div
      v-if="$slots.extra"
      class="border-box flex w-full border-b border-[#EAECF0]"
    >
      <slot name="extra"></slot>
    </div>

    <!-- Table Content -->
    <div class="w-full overflow-x-auto rounded-lg" v-if="!isLoading">
      <table aria-describedby="true" class="table-auto w-full z-[10]">
        <thead >
          <tr class="border-b border-[#EAECF0]">
            <th
              v-for="column in columns"
              :key="column.key"
              class="bg-[#F9FAFB] py-3 px-6 text-xs font-medium text-[#475467] capitalize text-left"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="rows?.length">
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="border-b hover:bg-gray-100"
            @click="emits('onRowClick', row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="text-sm text-[#454745] p-6"
            >
              <slot
                :name="`table-row-${column.key}`"
                :row="row"
                :column="column"
                :stat-type="statType"
              >
                <!-- Fallback Content Based on Column Key -->
                <component
                  :is="getColumnComponent(column)"
                  :row="row"
                  :column="column"
                  :stat-type="statType"
                />
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty Data Component -->
      <EmptyData
        v-if="!rows?.length && !isLoading"
        :title="emptyTitle"
        :subtext="emptySubtext"
        :url="emptyUrl"
        :btnText="emptyBtnText"
        :type="emptyType"
        :titleClass="emptyTitleClass"
      />
    </div>

    <!-- Loader Component -->
    <TableLoader v-if="isLoading" />
    <PaginationSimple
      :total="query?.total"
      :current="query?.PageNumber"
      :per-page="query?.PageSize"
      :pageRange="5"
      @page-changed="emits('onPageChange', $event)"
    />
  </div>
</template>

<script setup>
import CustomerCell from "./CustomerCell.vue";
import HtmlCell from "./HtmlCell.vue";
import DefaultCell from "./DefaultCell.vue";
import StatusCell from "./StatusCell.vue";
import { Float } from "@headlessui-float/vue";

// Local state for components
const filter = ref("");
const date = ref(null);

const emits = defineEmits([
  "onSearch",
  "onFilter",
  "onDateChange",
  "onPageChange",
  "edit",
  "delete",
  "onRowClick"
]);

// Define Props
const props = defineProps({
  title: {
    default: null,
  },
  count: {
    default: null,
  },
  isLoading: {
    default: false,
  },
  emptyTitle: {
    default: "No data available",
  },
  emptySubtext: {
    default: "",
  },
  emptyUrl: {
    default: "",
  },
  emptyBtnText: {
    default: "",
  },
  emptyType: {
    default: "",
  },
  columns: {
    default: [
      {
        header: "id",
        key: "id",
        isHtml: false,
        isStatus: false,
      },
      {
        header: "name",
        key: "name",
        isHtml: false,
        isStatus: false,
      },
    ],
  },
  rows: {
    default: [],
  },
  hasDate: {
    default: false,
  },
  hasAction: {
    default: true,
  },
  hasSearch: {
    default: false,
  },
  hasFilter: {
    default: false,
  },
  filterTitle: {
    default: "Filters",
  },
  filterOptions: {
    default: [
      {
        label: "All",
        key: "all",
        value: "all",
      },
    ],
  },
  placeholder: {
    default: "Search by name",
  },
  isBalance: {
    default: false,
  },
  emptyTitleClass: {
    default: "©=",
  },
  statType: {
    default: "",
  },
  actions: {
    default: [],
  },

  title: String,
  count: Number | String,
  isLoading: Boolean,
  emptyTitle: { type: String, default: "No data available" },
  emptySubtext: String,
  emptyUrl: String,
  emptyBtnText: String,
  emptyType: String,
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  statType: String,
  hasDate: Boolean,
  hasAction: Boolean,
  hasSearch: Boolean,
  hasFilter: Boolean,
  filterTitle: String,
  filterOptions: Array,
  placeholder: String,
  isBalance: Boolean,
  emptyTitleClass: String,
  className: String,
  query: Object,
});

const search = ref(null);

// Watch for Filter and Date Changes
watch(filter, () => emits("onFilter", filter.value));
watch(date, () => emits("onDateChange", date.value));

const componentMap = {
  customer: CustomerCell,
  html: HtmlCell,
  default: DefaultCell,
  status: StatusCell,
};

const getColumnComponent = (column) => {
  if (column.key === "customer") return componentMap.customer;
  if (column.isHtml) return componentMap.html;
  if (column.isStatus) return componentMap.status;
  return componentMap.default;
};
</script>
