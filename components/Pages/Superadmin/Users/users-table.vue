<template>
  <div class="w-full">
    <div class="">
      <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
        <CustomTable
          :columns="columns"
          :rows="rows"
          emptyTitle="No user available"
          :isLoading="loading"
          emptyType="user"
          stattype="driver"
        >
          <template #table-row-action="{ row }">
            <Menu class="" as="div">
              <Float placement="bottom-end" :offset="4">
                <MenuButton class="outline-none ml-auto block">
                  <AppIcon icon="heroicons:ellipsis-vertical-solid" />
                </MenuButton>
                <MenuItems
                  class="z-[999] bg-white shadow-[5px_12px_35px_rgba(44,44,44,0.12)] py-1 min-w-[150px] rounded-xl overflow-hidden flex flex-col items-start gap-y-[2px] justify-start"
                >
                  <MenuItem v-if="row.status !==0">>
                    <button
                      type="button"
                      @click="navigateTo(`/user-management/user-detail/1`)"
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="iconamoon:edit-light" /> View Details
                    </button></MenuItem
                  >
                  <MenuItem v-if="row.status===0">
                    <button
                      type="button"
                      @click="
                        detail = row;
                        id = detail.id;
                        open = true;
                      "
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="ic:outline-cancel" /> Cancel Invite
                    </button></MenuItem
                  >
                  <MenuItem v-if="row.status===1">>
                    <button
                      type="button"
                      @click="
                        detail = row;
                        id = detail.id;
                        isOpen = true;
                      "
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="la:user-minus" /> Deactivate access
                    </button></MenuItem
                  >
                  <!-- <MenuItem>
                    <button
                      type="button"
                      @click="
                        detail = row;
                        id = detail.id;
                        isOpen = true;
                      "
                      class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                    >
                      <AppIcon icon="tabler:trash" /> Delete user
                    </button></MenuItem
                  > -->
                </MenuItems>
              </Float>
            </Menu>
          </template></CustomTable
        >
      </div>
    </div>
  </div>
  <DeleteModal
    @deleteItem="handleDelete"
    @close="open = false"
    title="Cancel invite"
    text="Are you sure you want to cancel this invitation? This action cannot be undone."
    :open="open"
    btnText="Yes, Delete"
  />

</template>
<script setup>
definePageMeta({
  layout: "dashboard",
});
import debounce from "lodash/debounce";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import { Float } from "@headlessui-float/vue";
import { getAllinvites, delSingleInvite } from "~/services/userservices";

const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const setLoader = ref(false);
const detail = ref(null);
const authStore = useAuthStore();

const rows = ref([]);
const loading = ref(false);
const columns = [
  {
    header: "Name",
    key: "name",
    isHtml: false,
    isStatus: false,
  },

  {
    header: "Role",
    key: "roleName",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Email",
    key: "email",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Status",
    key: "status",
    isHtml: false,
    isStatus: true,
  },
  {
    header: "Last active",
    key: "lastActive",
    isHtml: false,
    isStatus: false,
  },

  {
    header: "",
    key: "action",
    isHtml: false,
    isStatus: false,
  },
];
const active = ref("users");
const tabs = [
  {
    title: "Users",
    key: "users",
  },
  {
    title: "Roles",
    key: "roles",
  },
];

onMounted(() => {
  getInvites();
});

const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 10,
  Type: "",
});

function getInvites() {
  try {
    loading.value = true;
    getAllinvites(queryParams).then((res) => {
      rows.value = res.data.data.map((i) => ({
        ...i,
        roleName: RoleMap[i.role],
      }));
      queryParams.totalCount = res.data.data.totalCount;
      loading.value = false;
    });
  } finally {
    loading.value = false;
  }
}

const debounceSearch = debounce(() => {
  getInvites();
}, 800);
const handleDelete = () => {
  delSingleInvite(id.value)
    .then((res) => {
      if (res.status === 200) {
        getInvites();
        toast.success('Invitation cancelled')
        open.value = true;
      }
    })
    .catch((err) => {
      errorText.value =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "Invite deletion failed";
      isErrorOpen.value = true;
      isLoading.value = false;
    });
};
function handleSuccess() {
  getInvites();
}
watch(
  () => [queryParams.Search],
  () => {
    debounceSearch();
  }
);
watch(
  () => [queryParams.PageNumber, queryParams.SortOrder],
  () => {
    getInvites();
  }
);

provide("handleSuccess", handleSuccess);
provide("isOpen", isOpen);
</script>
