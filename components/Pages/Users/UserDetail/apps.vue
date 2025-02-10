<template>
  <div class="w-full">
    <!-- Table -->
    <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
      <CustomTable
        :columns="filteredColumns"
        :rows="rows"
        emptyTitle="No application available"
        emptyType="user"
        :isLoading="setLoader"
      >
        <template #table-row-action="{ row }">
          <div class="max-w-[280px]">
            <SwitchGroup>
              <div class="flex items-center justify-start gap-x-1">
                <Switch
                  v-model="row.isActive"
                  :class="row.isActive ? 'bg-[#067647]' : 'bg-gray-200'"
                  class="relative inline-flex h-4 w-[34px] items-center rounded-full transition-colors focus:outline-none"
                  @click="toggleAccess(row)"
                >
                  <span
                    :class="
                      row.isActive ? 'translate-x-5' : 'translate-x-[2px]'
                    "
                    class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>
            </SwitchGroup>
          </div>
        </template>
        <!-- Name Column -->
        <template #table-row-name="{ row }">
          <span class="capitalize flex gap-x-2 items-center">
            <span
              class="h-9 w-9 flex items-center justify-center bg-gray-50 rounded-full"
            >
              <img class="h-6" :src="row.iconUrl" />
            </span>
            <span class="capitalize block font-medium">{{ row.name }}</span>
          </span>
        </template>

        <!-- Status Column -->
        <template #table-row-isDisabled="{ row }">
          <AppStatusButton stattype="driver" :status="row.isDisabled ? 2 : 1" />
        </template>
      </CustomTable>
    </div>
  </div>

  <!-- Delete Modal -->
  <DeleteModal
    @deleteItem="handleDelete"
    @close="open = false"
    title="Revoke Access"
    text="Are you sure you want to revoke this user’s access"
    :open="open"
    btnText="Yes, Revoke"
    imgUrl="/images/revoke-user.svg"
  />
  <ActionModal
    @actionItem="handleDelete"
    @close="isOpen = false"
    title="Enable Access"
    text="Are you sure you want to re-activate this user’s access"
    :open="isOpen"
    btnText="Yes, Enable"
    imgUrl="/images/enable-user.svg"
    type="approve"
  />

  <IndexModal
    :isOpen="isUpdateOpen"
    @togglePopup="isUpdateOpen = false"
    v-if="isUpdateOpen"
  >
    <template #content>
      <div class="h-full w-full bg-white rounded-lg p-6">
        <UpdateForm @refresh="getSubApps()" @close="isUpdateOpen = false" />
      </div>
    </template>
  </IndexModal>
</template>

<script setup>
import UpdateForm from "./UpdateForm";
import { Switch, SwitchGroup } from "@headlessui/vue";
import { getSubApps, ownerRevokeAccess } from "~/services/userservices";
import { getUserDetail } from "~/services/settingservices";
import debounce from "lodash/debounce";

const authStore = useAuthStore();
const { id: userId } = useRoute().params;
const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const isUpdateOpen = ref(false);
const setLoader = ref(false);
const detail = ref(null);
const rows = ref([]);
const columns = [
  { header: "Application", key: "name", isHtml: false, isStatus: false },
  // { header: "Role", key: "role", isHtml: false, isStatus: false },
  { header: "Last active", key: "lastActive", isHtml: false, isStatus: false },

  { header: "Status", key: "isActive", isHtml: false, isStatus: false },
  { header: "", key: "action", isHtml: false, isStatus: false },
];

const filteredColumns = computed(() =>
  [0, 3, 1].includes(authStore?.userInfo?.userCategory)
    ? columns
    : columns.filter((i) => i.key !== "action")
);
onMounted(() => {
  getData();
});

const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  Type: "",
});

function getData() {
  setLoader.value = true;
  getUserDetail(userId).then((res) => {
    if (res.status === 200) {
      const tempData = res.data.data;
      detail.value = tempData;
    }
  });

  getSubApps()
    .then((res) => {
      if (res.status === 200) {
        setLoader.value = false;
        const tempData = res.data.data.map((i) => ({
          ...i,
          isActive: detail.value?.appCodes?.includes(i.code),
        }));
        console.log("🚀 ~ tempData ~ tempData:", tempData);
        rows.value = tempData;
      }
    })
    .catch(() => {
      setLoader.value = false;
    });
}
function toggleAccess(data) {
  ownerRevokeAccess({ email: detail.value?.contactEmail, appCode: data?.code })
    .then((res) => {
      if (res.status === 200) {
        toast.info("Updated successfully");
      }
    })
    .catch((err) => {
      console.error("Failed to update 2FA status:", err);
    });
}
const handleDelete = () => {
  // Handle delete logic here
};

watch(
  () => [queryParams.Search],
  debounce(() => getData(), 800)
);

watch(
  () => [queryParams.PageNumber, queryParams.SortOrder],
  () => getData()
);
</script>
