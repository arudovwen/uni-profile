<template>
  <div class="w-full">
    <!-- Table -->
    <div class="mb-6 bg-white w-full rounded-lg border border-[#E9EAEB]">
      <CustomTable
        :columns="columns"
        :rows="rows"
        emptyTitle="No application available"
        emptyType="user"
        :isLoading="setLoader"
      >
        <!-- Row Actions -->
        <template #table-row-action="{ row }">
          <Menu class="" as="div">
            <Float placement="bottom-end" :offset="4">
              <MenuButton class="outline-none">
                <AppIcon icon="heroicons:ellipsis-vertical-solid" />
              </MenuButton>
              <MenuItems
                class="z-[999] bg-white shadow-[5px_12px_35px_rgba(44,44,44,0.12)] py-2 min-w-[150px] rounded-xl overflow-hidden flex flex-col items-start gap-y-[2px] justify-start"
              >
                <MenuItem>
                  <button
                    type="button"
                    @click="
                      detail = row;
                      id = detail.id;
                      isUpdateOpen = true;
                    "
                    class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap cursor-pointer w-full text-left"
                  >
                    Update Role
                  </button></MenuItem
                >
                <MenuItem>
                  <button
                    type="button"
                    @click="
                      detail = row;
                      id = detail.id;
                      open = true;
                    "
                    class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap cursor-pointer w-full text-left"
                  >
                    Revoke access
                  </button></MenuItem
                >
                <MenuItem>
                  <button
                    type="button"
                    @click="
                      detail = row;
                      id = detail.id;
                      isOpen = true;
                    "
                    class="py-2 px-5 hover:bg-gray-50 text-sm whitespace-nowrap cursor-pointer w-full text-left"
                  >
                    Enable access
                  </button></MenuItem
                >
              </MenuItems>
            </Float>
          </Menu>
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
import { Float } from "@headlessui-float/vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { getSubApps } from "~/services/userservices";

import debounce from "lodash/debounce";

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

  { header: "Status", key: "isDisabled", isHtml: false, isStatus: false },
  { header: "", key: "action", isHtml: false, isStatus: false },
];

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
  getSubApps()
    .then((res) => {
      if (res.status === 200) {
        setLoader.value = false;
        rows.value = res.data.data;
      }
    })
    .catch(() => {
      setLoader.value = false;
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
