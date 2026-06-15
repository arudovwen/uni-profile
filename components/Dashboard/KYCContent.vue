<template>
  <div
    class="max-w-[1120px] mx-auto sm:py-8 sm:px-6 lg:px-8 font-Avenir overflow-hidden"
  >
    <!-- Page Header -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-base sm:text-lg font-semibold text-[#101828] leading-7">
        KYC Verification
      </h1>
      <p class="text-xs sm:text-sm text-[#475467] leading-5 mt-1">
        Complete your business verification details
      </p>
    </div>

    <!-- KYC Layout -->
    <SidebarLayout v-model="activeTab" :tabs="tabs">
      <template #tab-business-details>
        <DashboardKYCBusinessDetails
          v-show="activeTab === 'business-details'"
        />
      </template>
      <template #tab-documents>
        <DashboardKYCDocuments v-show="activeTab === 'documents'" />
      </template>
    </SidebarLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from "vue";
import BuildingIcon from "@/assets/images/icon/BuildingIcon.vue";
import DocumentIcon from "@/assets/images/icon/DocumentIcon.vue";

type TabId = "business-details" | "documents";

interface Tab {
  id: TabId;
  label: string;
  icon: any;
}

const activeTab = ref<TabId>("business-details");

const tabs: Tab[] = [
  {
    id: "business-details",
    label: "Business Details",
    icon: markRaw(BuildingIcon),
  },
  { id: "documents", label: "Documents", icon: markRaw(DocumentIcon) },
];
</script>
