<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-useless-escape -->
<template>
  <div class="w-full">
    <div
      class="flex gap-x-[76px] px-6 justify-start flex-col lg:flex-row gap-y-7 w-full mb-6"
    >
      <!-- Top bar   -->
      <div class="flex-1">
        <div class="">
          <div v-if="!companyInfo.approvalStatus && authStore?.userInfo?.userCategory === 1">
            <button
              type="button"
              @click="
                () => {
                  open = true;
                  action = 'add';
                }
              "
              class="appearance-none leading-none px-[14px] py-[10px] grid-cols-1 lg:grid-cols-2 gap-4 rounded-lg text-white bg-primary-500 hover:opacity-70 text-xs mb-6"
            >
              <span class=""> + Add director</span>
            </button>
          </div>
          <div class="overflow-x-auto">
            <DirectorsView
              :directors="form.directors"
              :companyInfo="companyInfo"
              @handleDelete="handleDelete"
              @handleEdit="handleEdit"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!companyInfo.approvalStatus && authStore?.userInfo?.userCategory === 1"
      class="flex justify-end pt-6 border-t px-6 border-[#EAECF0] gap-x-4 items-center w-full"
    >
      <AppButton
        @click="active--"
        :disabled="isLoading"
        btnClass="bg-transparent border border-[#E7EBEE]
      !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed 
      !rounded-lg "
        type="button"
        text="Back"
      />

      <AppButton
        @click="handleSubmit"
        :disabled="!form.directors.length || isLoading"
        :isLoading="isLoading"
        btnClass="bg-primary-500
      text-white !px-8 !text-sm !py-[10px] disabled:cursor-not-allowed border
      !rounded-lg border-primary-500"
        type="button"
        text="Save"
      />
    </div>
  </div>

  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-[999]" @close="">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>
        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div
            class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
                :class="
                  action == 'add' ? 'sm:max-w-[600px]' : 'sm:max-w-[343px]'
                "
              >
                <div class="p-6">
                  <PagesBusinessCompanyDirectorForm
                    v-if="action !== 'delete'"
                    :type="action"
                    :director="director"
                    :id="id"
                  />
                  <PagesBusinessCompanyDeleteModal
                    v-if="action === 'delete'"
                    @delete="onDelete"
                    @close="open = false"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import "vue-advanced-cropper/dist/style.css";
import { ref, reactive, provide } from "vue";
import { toast } from "vue3-toastify";
import { updateBusinessProfile, updateCompanyProfile } from "~/services/settingservices";

const companyInfo = inject("companyInfo");
const form = inject("form");
const id = ref(null);
const director = ref(null);
const action = ref("");
const authStore = useAuthStore();
const route = useRoute();
const open = ref(false);
const active = inject("active");

const isLoading = ref(false);
function handleDelete(val) {
  id.value = val;
  action.value = "delete";
  open.value = true;
}
function handleEdit(val, option) {
  id.value = val;
  director.value = option;
  action.value = "edit";
  open.value = true;
}

function onDelete() {
  form.directors.splice(id.value, 1);
  open.value = false;
}

async function handleSubmit() {
  if (!form.directors.length) return;
  isLoading.value = true;
  const data = {
    ...form,
    companyDocuments: form.companyDocuments.map((i) => ({
      ...i,
      urls: i.urls.map((j) => j.url),
    })),
  };
  updateCompanyProfile(data)
    .then((res) => {
      if (res.status === 200) {
        // Object.keys(data).forEach((key) => {
        //   form[key] = data[key];
        // });
        toast.success("Information saved");
        isLoading.value = false;
      }
    })

    .catch((err) => {
      isLoading.value = false;

      toast.error(err?.response?.data?.message || err?.response?.data?.Message);
    });
}

provide("open", open);
provide("form", form);
</script>
