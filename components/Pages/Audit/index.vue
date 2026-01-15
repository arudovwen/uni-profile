<template>
  <div class="w-full">
    <!-- Top bar   -->

    <div
      class="flex flex-col mb-6 lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <HeaderComponent title="Audit Logs" subtext="Manage your logs here." />
      <div></div>
    </div>
    <div>
      <div
        class="max-w-[250px] mb-6"
        v-if="authStore?.userInfo?.userCategory === 3"
      >
        <CustomSearchSelect v-model="queryParams.userId" />
      </div>
    </div>
    <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
      <CustomTable
        :columns="columns"
        :rows="auditData"
        emptyTitle="No Logs available"
        :isLoading="docLoading"
        emptyType="user"
        :query="queryParams"
        @onPageChange="(value) => (queryParams.PageNumber = value)"
      />
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "dashboard",
});
import debounce from "lodash/debounce";
import { getAllUsers, getCentralAdminUsers } from "~/services/userservices";
import { getOwnerAudit, getAdminAudit } from "~/services/auditservice";
import moment from "moment";

const authStore = useAuthStore();
const loading = ref(false);
const columns = [
  {
    header: "Name",
    key: "userName",
    isHtml: false,
    isStatus: false,
  },

  {
    header: "Role",
    key: "role",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Last active",
    key: "lastActive",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "App",
    key: "app",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "activity",
    key: "activity",
    isHtml: false,
    isStatus: false,
  },
];
const auditData = ref([]);
const GetAudit = {
  0: getAdminAudit,
  1: getOwnerAudit,
  3: getAdminAudit,
  4: getAdminAudit,
};

const GetUsersMapper = {
  0: getAllUsers,
  3: getAllUsers,
  4: getAllUsers,
};
onMounted(() => {
  getAuditData();
  if (authStore?.userInfo?.userCategory === 3) {
    getUsers();
  }
});

const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  BusinessId: "",
  userId: "",
  total: 0,
});
const userParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 1500000,
  userCategories: authStore?.userInfo?.userCategory === 3 ? [0, 1, 2, 3] : null,
  total: 0,
});
const docLoading = ref(false);
const users = ref([]);
function getAuditData() {
  docLoading.value = true;
  GetAudit[authStore?.userInfo?.userCategory](queryParams).then((res) => {
    auditData.value = res.data.data.map((i) => ({
      ...i,
      lastActive: moment(i.created).format("lll"),
      app: authStore.appList.find((j) => j.code === i.appCode)?.name,
    }));
  
    queryParams.total = res.data.totalCount;
    docLoading.value = false;
  });
}
function getUsers() {
  loading.value = true;
  GetUsersMapper[authStore?.userInfo?.userCategory](userParams)
    .then((res) => {
      users.value = res.data.data.map((i) => ({
        label: `${i.firstName} ${i.lastName}`,
        value: i.id,
      }));
    })
    .finally(() => {
      loading.value = false;
    });
}
const debounceSearch = debounce(() => {
  getAuditData();
}, 800);

watch(
  () => [queryParams.Search],
  () => {
    debounceSearch();
  }
);
watch(
  () => [queryParams.PageNumber, queryParams.BusinessId, queryParams.userId],
  () => {
    getAuditData();
  }
);
</script>
