<template>
  <div class="w-full">
    <!-- Table Container -->
    <div class="bg-white rounded-lg border border-[#E4E7EC] overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1570EF]"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!data || data.length === 0"
        class="flex justify-center items-center py-12"
      >
        <p class="text-sm text-[#475467]">{{ emptyMessage }}</p>
      </div>

      <!-- PrimeVue DataTable -->
      <DataTable
        v-else
        :value="data"
        :paginator="paginator"
        :rows="rows"
        :rowsPerPageOptions="rowsPerPageOptions"
        :totalRecords="totalRecords"
        :lazy="lazy"
        :pt="{
          root: { class: 'font-Avenir w-full' },
          tableContainer: { class: 'w-full' },
          table: { class: 'w-full border-collapse' },
          thead: { class: 'bg-white' },
          tbody: { class: 'bg-white' },
          headerRow: { class: '' },
          bodyRow: ({ context }) => ({
            class: context.index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]',
          }),
        }"
        @page="$emit('page', $event)"
        @sort="$emit('sort', $event)"
      >
        <!-- Dynamic Columns -->
        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :pt="{
            headerCell: {
              class:
                'px-6 py-3 h-11 text-left text-xs font-medium text-[#667085] uppercase bg-white border-b border-[#F2F4F7]',
            },
            bodyCell: {
              class: 'px-6 py-2 text-sm font-medium text-[#475467]',
            },
          }"
        >
          <template #body="{ data }">
            <slot :name="`cell-${col.field}`" :data="data">
              {{ data[col.field] }}
            </slot>
          </template>
        </Column>

        <!-- Actions Column -->
        <Column
          v-if="showActions"
          header=""
          :pt="{
            headerCell: {
              class:
                'px-6 py-3 h-11 text-left text-xs font-medium text-[#667085] uppercase bg-white border-b border-[#F2F4F7] w-[60px]',
            },
            bodyCell: {
              class: 'px-6 py-3 text-sm font-medium text-[#475467] w-[60px]',
            },
          }"
        >
          <template #body="{ data, index }">
            <div class="relative">
              <button
                type="button"
                class="p-2 hover:bg-[#F2F4F7] rounded-lg transition-colors"
                @click.stop="toggleActionMenu(index)"
              >
                <svg
                  class="w-5 h-5 text-[#98A2B3]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="4" r="2" />
                  <circle cx="10" cy="10" r="2" />
                  <circle cx="10" cy="16" r="2" />
                </svg>
              </button>

              <!-- Action Menu Dropdown -->
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-if="activeActionMenu === index"
                  class="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-50 py-1"
                >
                  <button
                    v-for="action in actions"
                    :key="action.key"
                    type="button"
                    class="w-full px-4 py-2 text-sm text-left hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
                    :class="action.textColor || 'text-[#344054]'"
                    @click="handleAction(action.key, data, index)"
                  >
                    <component
                      v-if="action.icon"
                      :is="action.icon"
                      class="w-4 h-4"
                      :class="action.iconColor || 'text-[#667085]'"
                    />
                    {{ action.label }}
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
}

export interface TableAction {
  key: string;
  label: string;
  icon?: string;
  iconColor?: string;
  textColor?: string;
}

interface Props {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];
  totalRecords?: number;
  lazy?: boolean;
  showActions?: boolean;
  actions?: TableAction[];
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  paginator: false,
  rows: 10,
  rowsPerPageOptions: () => [5, 10, 25, 50],
  totalRecords: 0,
  lazy: false,
  showActions: false,
  actions: () => [],
  emptyMessage: "No data found",
});

const emit = defineEmits<{
  (e: "page", event: any): void;
  (e: "sort", event: any): void;
  (e: "action", action: string, data: any, index: number): void;
  (e: "row-click", event: any): void;
}>();

const activeActionMenu = ref<number | null>(null);

const toggleActionMenu = (index: number) => {
  activeActionMenu.value = activeActionMenu.value === index ? null : index;
};

const handleAction = (action: string, data: any, index: number) => {
  emit("action", action, data, index);
  activeActionMenu.value = null;
};

// Close action menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (activeActionMenu.value !== null) {
    activeActionMenu.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
</style>
