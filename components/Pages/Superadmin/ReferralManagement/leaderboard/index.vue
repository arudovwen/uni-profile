<template>
  <div v-if=" [0, 3, 4].includes(authStore.userInfo?.userCategory)" class="px-6">
    <AppTab
      :tabs="tabs"
      :active="activeTab"
      @set-active="(value) => (activeTab = value)"
    />
  </div>
  <div class="w-full" :class="customClass">
    <div
      class="flex flex-col bg-white w-full border-1px rounded-[10px] border-[#F4F7FE]"
    >
      <div
        v-if="!hideHeader"
        class="flex flex-row justify-between px-6 py-5 border-b border-[#EAECF0]"
      >
        <div class="flex flex-col gap-1">
          <span
            class="font-semibold text-[18px] leading-[28px] tracking-[0%] text-[#101828]"
          >
            Referral Leaderboard
          </span>
          <span
            class="font-normal text-[14px] leading-[20px] tracking-[0%] text-[#475467]"
            >Track top performers and see who leads the referral rankings.
          </span>
        </div>
      </div>
      <div class="flex gap-3 px-6" :class="customClass ? 'pb-4 pt-4' : ''">
        <div
          class="!flex items-center gap-x-2.5 px-4 input-control !max-w-[320px]"
        >
          <span class="text-[#667085]">
            <AppIcon icon="uil-search" icon-class="text-xl" />
          </span>
          <input
            type="search"
            placeholder="Search "
            v-model="queryParams.search"
            @input="debounceSearch"
            class="flex-1 text-sm font-medium outline-none focus:outline-none"
          />
        </div>
        <div class="min-w-[240px]">
          <ClientOnly>
            <VueDatePicker
              auto-apply
              v-model="date"
              range
              multi-calendars
              placeholder="Select dates"
              :time-picker="false"
              input-class-name=""
              no-today
              :enable-time-picker="false"
            />
          </ClientOnly>
        </div>
        <button
          @click="exportToCSVHandler"
          :disabled="isExporting || rows.length === 0"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0066CC] text-white font-medium text-sm hover:bg-[#0052A3] disabled:bg-[#D0D5DD] disabled:text-[#98A2B3] disabled:cursor-not-allowed transition-colors"
        >
          <span>{{ isExporting ? "Exporting..." : "Export to CSV" }}</span>
        </button>
      </div>
      <div class="w-full mb-6 bg-white">
        <CustomTable
          :columns="columns"
          :rows="rows"
          emptyTitle="No leaderboard data available"
          :isLoading="loading"
          emptyType="referral"
          className="!rounded-0 !border-0 !shadow-none"
          :query="queryParams"
          @onPageChange="(value) => (queryParams.PageNumber = value)"
        >
          <template #table-row-status="{ row }">
            <AppStatusButton stattype="referral" :status="row.status" />
          </template>
          <template #table-row-assignedUser="{ row }">
            <span>{{ row.assignedUser }}</span>
          </template>
          <template #table-row-assignedUserEmail="{ row }">
            <span>{{ row.assignedUserEmail }}</span>
          </template>
          <template #table-row-assignedDepartment="{ row }">
            <span>{{ row.assignedDepartment }}</span>
          </template>
          <template #table-row-assignedApps="{ row }">
            <div class="flex flex-wrap gap-1">
              {{ row.assignedApps }}
            </div>
          </template>
        </CustomTable>
      </div>
    </div>
  </div>
</template>
<script setup>
import CustomTable from "~/components/CustomTable/index.vue";
import AppStatusButton from "~/components/AppStatusButton.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getReferralLeaderboard } from "~/services/userservices";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import moment from "moment";
import { exportToCSV } from "~/utils/exportToCSV";

defineProps({
  customClass: {
    type: String,
    default: "py-10",
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
});
const authStore = useAuthStore()
const activeTab = ref("user");
const tabs = [
  {
    title: "Users",
    key: "user",
  },
  {
    title: "Departments",
    key: "department",
  },
  {
    title: "Campaigns",
    key: "campaign",
  },
];
const date = ref(null);
const queryParams = reactive({
  search: "",
  PageNumber: 1,
  PageSize: 10,
  status: "",
  total: 0,
  from: null,
  to: null,
  referalTypes: [0],
});
const RefTypes = {
  user: [0],
  department: [1],
  campaign: [2],
};
const rows = ref([]);
const loading = ref(false);
const isExporting = ref(false);
const columns = [
  {
    header: "Rank",
    key: "rank",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Name",
    key: "userName",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Total referrals",
    key: "totalReferrals",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Matta",
    key: "matta",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Orbital",
    key: "orbital",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Oxide",
    key: "oxide",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Flux",
    key: "flux",
    isHtml: false,
    isStatus: false,
  },
];

onMounted(() => {
  fetchReferrals();
});

async function fetchReferrals() {
  loading.value = true;
  try {
    const res = await getReferralLeaderboard({
      ...queryParams,
      referalTypes: RefTypes[activeTab.value],
    });
    rows.value = res.data?.data;
    queryParams.total = res.data.totalCount || 0;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.Message ||
        "Failed to fetch referrals"
    );
  } finally {
    loading.value = false;
  }
}
watch(date, () => {
  if (date.value) {
    queryParams.from = moment(date.value[0]).format("yyyy-MM-DD");
    queryParams.to = moment(date.value[1]).format("yyyy-MM-DD");
  } else {
    queryParams.from = null;
    queryParams.to = null;
  }
});
const debounceSearch = debounce(() => {
  queryParams.PageNumber = 1;
  fetchReferrals();
}, 800);

const exportToCSVHandler = async () => {
  if (rows.value.length === 0) {
    toast.error("No data to export");
    return;
  }

  isExporting.value = true;
  try {
    // Define the CSV column mapping with proper header names
    const csvColumns = [
      { header: "Rank", key: "rank" },
      { header: "User Name", key: "userName" },
      { header: "Orbital Onboards", key: "orbital" },
      { header: "Flux Onboards", key: "flux" },
      { header: "Matta Onboards", key: "matta" },
      { header: "Oxide Onboards", key: "oxide" },
      { header: "Total Onboarded Customers", key: "totalReferrals" },
    ];

    // Generate filename with current date
    const today = moment().format("YYYY-MM-DD");
    const fileName = `Referral_Leaderboard_${today}`;

    // Export the data
    exportToCSV(rows.value, csvColumns, fileName);
    toast.success("Leaderboard data exported successfully");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    toast.error("Failed to export leaderboard data");
  } finally {
    isExporting.value = false;
  }
};

// Watch for pagination changes
watch(
  () => [queryParams.PageNumber, queryParams.from, queryParams.to, activeTab.value],
  () => {
    fetchReferrals();
  }
);
</script>
