<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[999]" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-[#101828] transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-16 md:pr-10"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="-translate-x-full"
              enter-to="-translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="-translate-x-0"
              leave-to="-translate-x-full"
            >
              <DialogPanel
                class="pointer-events-auto relative w-screen max-w-md"
              >
                <TransitionChild
                  as="template"
                  enter="ease-in-out duration-500"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-500"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <div class="absolute top-0 right-0 -mr-11 flex pt-4">
                    <button
                      type="button"
                      class="rounded-md text-gray-300 hover:text-white outline-none"
                      @click="open = false"
                    >
                      <span class="sr-only">Close</span>
                      <AppIcon icon="ph:x" class="text-xl" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <div
                  class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl pb-8"
                >
                  <div class="relative flex-1 px-4 sm:px-6">
                    <!-- Replace with your content -->
                    <div class="absolute inset-0 pt-5">
                      <div class="px-5 pb-4" v-if="!authStore.isLoggedIn">
                        <img
                          src=""
                          width="100"
                          height="26"
                          alt="Matta"
                          class="w-[100px] h-auto"
                        />
                      </div>
                      <div
                        class="flex gap-x-2 px-5 pb-[1px]"
                        v-if="authStore.isLoggedIn"
                      >
                        <span
                          class="h-10 w-10 rounded-full flex items-center justify-center text-white bg-[#f90] font-semibold"
                        >
                          {{ authStore.userInfo?.firstName?.slice(0, 1) }}
                          {{ authStore.userInfo?.lastName?.slice(0, 1) }}</span
                        >
                        <div class="flex-1">
                          <span
                            v-if="authStore.isLoggedIn"
                            class="text-[#182230] text-sm font-semibold block capitalize"
                            >{{ authStore.userInfo?.fullName }}</span
                          >
                          <span
                            v-if="authStore.isLoggedIn"
                            class="block text-xs text-[#666] mb-3"
                            >{{ authStore.userInfo?.email }}</span
                          >
                          <span
                            v-if="authStore.isLoggedIn"
                            @click="logOut()"
                            class="flex gap-x-1 text-xs text-[#021242] font-medium"
                            ><AppIcon
                              icon="octicon:sign-out-16"
                              class="text-sm"
                            />Sign out</span
                          >
                        </div>
                      </div>
                      <div
                        class="flex gap-x-3 w-full px-5"
                        v-if="!authStore.isLoggedIn"
                      >
                        <AppButton
                          link="/auth/vendor-register"
                          text="Become a Supplier"
                          btnClass="text-white !text-[13px] !font-normal  !px-[10px] !py-[6px] !normal-case bg-[#f90] flex w-full"
                        />
                        <AppButton
                          v-if="!authStore.isLoggedIn"
                          link="/auth/login"
                          text="Sign In"
                          btnClass="bg-primary-500  text-white !px-4 !sm:px-6 !py-[6px] !text-[13px] sm:text-sm !font-normal w-full"
                        />
                      </div>
                      <hr class="my-[14px] border-b border-[#F9FAFB]" />
                      <div class="px-5 pt-5">
                        <MenuMobile />
                        <hr
                          class="border-[#F9FAFB] mb-4"
                          v-if="authStore.isLoggedIn && !activeKey"
                        />
                        <ul
                          class="grid gap-y-5 pb-8"
                          v-if="authStore.isLoggedIn && !activeKey"
                        >
                          <li
                            v-for="n in mappedNav.filter(
                              (i) => i.key !== 'sign-out'
                            )"
                            :key="n.name"
                          >
                            <NuxtLink
                              :to="n.url"
                              class="flex gap-x-3 items-center text-sm font-medium text-[#182230]"
                            >
                              <AppIcon
                                :icon="n.icon"
                                iconClass="text-xl text-[#667085]"
                              />
                              {{ n.name }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  // DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { logOut } from "~/services/authservices";

const storeOpen = ref(false);
const route = useRoute();
const activeKey = ref(null);
const authStore = useAuthStore();
const isSigniningOut = ref(false);
const mappedNav = computed(() => {
  return navigation;
});
const open = inject("open");
watch(
  () => route.path,
  () => {
    storeOpen.value = false;
  },
  { deep: true, immediate: true }
);
provide("activeKey", activeKey);
</script>
