<template>
  <div class="w-full">
    <!-- Top bar   -->

    <div
      class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-1 lg:gap-y-0"
    >
      <div class="relative flex items-center">
        <span class="absolute left-4 text-[#667085]"
          ><i class="uil uil-search"></i
        ></span>
        <input
          type="search"
          placeholder="Search user"
          v-model="queryParams.Search"
          class="border border-[#DFE5EC] text-sm rounded-lg w-full lg:w-[320px] h-11 pl-10 py-2 outline-none focus:outline-none"
        />
      </div>
      <div v-if="authStore?.userInfo?.userCategory === 3">
        <SelectVueSelect
          v-model="queryParams.userCatText"
          :options="Options"
          :reduce="(option) => option.value"
          placeholder="Select role"
          :classInput="`min-w-[180px] !bg-white  !rounded-lg !text-[#475467] !h-11 cursor-pointer  'border-[#D0D5DD]'`"
          :clearable="false"
        />
      </div>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="">
          <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
            <CustomTable
              :columns="columns"
              :rows="rows"
              emptyTitle="No user available"
              :isLoading="loading"
              emptyType="user"
              statType="driver"
              :query="queryParams"
              @onPageChange="(value) => (queryParams.PageNumber = value)"
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
                      <MenuItem>
                        <button
                          type="button"
                          @click="
                            navigateTo(
                              `/user${
                                authStore?.userInfo?.userCategory === 3
                                  ? ''
                                  : 's'
                              }-management/user-detail/${row.id}?name=${
                                row.name
                              }`
                            )
                          "
                          class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                        >
                          <AppIcon icon="iconamoon:edit-light" /> View Details
                        </button></MenuItem
                      >

                      <MenuItem v-if="authStore?.userInfo?.userCategory === 3">
                        <button
                          type="button"
                          @click="
                            detail = row;
                            id = detail.contactEmail;
                            open = true;
                          "
                          class="py-2 px-5 hover:bg-gray-50 text-base whitespace-nowrap cursor-pointer w-full text-left flex gap-x-2 items-center"
                        >
                          <AppIcon icon="la:user-minus" />
                          {{ !row.isActive ? "Enable" : "Deactivate" }} access
                        </button></MenuItem
                      >
                    </MenuItems>
                  </Float>
                </Menu>
              </template></CustomTable
            >
          </div>
        </div>
      </div>
      <ActionModal
        @actionItem="handleDelete"
        @close="open = false"
        :title="detail?.isActive ? 'Deactivate Access' : 'Enable access'"
        :text="`Are you sure you want to ${
          !detail?.isActive ? 'deactivate access' : 'enable access'
        } for this user?`"
        :open="open"
        :btnText="`Yes, ${!detail?.isActive ? 'Enable' : 'Deactivate'}`"
        :imgUrl="
          !detail?.isActive
            ? '/images/enable-user.svg'
            : '/images/revoke-user.svg'
        "
        type="approve"
        :loading="toggleStatus"
      />
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "dashboard",
});
import debounce from "lodash/debounce";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import { Float } from "@headlessui-float/vue";
import {
  getAllUsers,
  toggleUserStatus,
  getCentralAdminUsers,
} from "~/services/userservices";
import { toast } from "vue3-toastify";
import moment from "moment";

const id = ref(null);
const open = ref(false);
const isOpen = ref(false);
const detail = ref(null);
const GetUsersMapper = {
  0: getCentralAdminUsers,
  3: getAllUsers,
};
const authStore = useAuthStore();
const Options = [
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Superadmins",
    value: "superadmins",
  },
  {
    label: "Admins",
    value: "admins",
  },
  {
    label: "Others",
    value: "others",
  },
];
const RoleMapper = {
  superadmins: [3],
  admins: [0],
  others: [1, 2],
  default: [0, 1, 2, 3],
};
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
    key: "category",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Email",
    key: "contactEmail",
    isHtml: false,
    isStatus: false,
  },
  {
    header: "Phone",
    key: "phone",
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
    key: "lastLoginTime",
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

onMounted(() => {
  getInvites();
});

const queryParams = reactive({
  Search: "",
  SortOrder: "",
  PageNumber: 1,
  PageSize: 15,
  userCatText: "",
  userCategories: authStore?.userInfo?.userCategory === 3 ? [0, 1, 2, 3] : null,
  total: 0,
});

function getInvites() {
  loading.value = true;
  GetUsersMapper[authStore?.userInfo?.userCategory](queryParams)
    .then((res) => {
      rows.value = res.data.data.map((i) => ({
        ...i,
        // roleName: RoleMap[i.role],
        name: `${i.firstName} ${i.lastName}`,
        lastLoginTime: i.lastLoginTime
          ? moment(i.lastLoginTime).format("lll")
          : null,
        status: i.isActive ? 1 : 2,
      }));
      queryParams.total = res.data.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
}
const toggleStatus = ref(false)
const debounceSearch = debounce(() => {
  getInvites();
}, 800);
const handleDelete = () => {
  toggleStatus.value = true
  toggleUserStatus(id.value)
    .then((res) => {
      if (res.status === 200) {
        open.value = false;
        getInvites();
        toast.success("User Access updated");
  toggleStatus.value = false

      }
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "User Deactivation failed"
      );
      isErrorOpen.value = true;
      isLoading.value = false;
  toggleStatus.value = false

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
  () => [
    queryParams.PageNumber,
    queryParams.SortOrder,
    queryParams.userCategories,
  ],
  () => {
    getInvites();
  }
);
watch(
  () => [queryParams.userCatText],
  () => {
    queryParams.userCategories = RoleMapper[queryParams.userCatText];
  }
);

provide("handleSuccess", handleSuccess);
provide("isOpen", isOpen);
</script>
