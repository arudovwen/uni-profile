<template>
  <div class="px-6">
    <!-- Top bar   -->
    <div class="flex gap-x-10 py-10 flex-col lg:flex-row gap-y-6 md:gap-y-0">
      <div class="">
        <ul
          class="custom-shadow bg-white rounded-lg overflow-hidden w-[200px] grid gap-y-1"
        >
          <li
            class="text-sm font-semibold py-2 px-3 border-l-2"
            @click="
              active = tab.value;
              title = tab.name;
              subtext = tab.subtext;
            "
            :class="
              active === tab.value
                ? 'bg-[#F5FAFF]  border-primary-500 text-primary-500'
                : 'border-transparent text-[#667085]'
            "
            v-for="tab in tabs"
            :key="tab.name"
          >
            {{ tab.name }}
          </li>
        </ul>
      </div>
      <div v-if="!isLoading" class="flex-1">
        <div class="max-w-[640px] w-full mx-auto">
          <div class="mb-6">
            <HeaderComponent :title="title" :subtext="subtext" />
          </div>
          <div class="bg-white rounded-lg py-6 border border-[#E9EAEB]">
            <div v-if="active === 1" class="w-full">
              <PagesBusinessCompanyInformation />
            </div>
            <div v-if="active === 2" class="w-full">
              <div class="w-full"><PagesBusinessCompanyDocuments /></div>
            </div>
            <div v-if="active === 3" class="w-full">
              <div class="w-full"><PagesBusinessCompanyDirectors /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppLoader v-if="isLoading" />
  </div>
</template>

<script setup>
import { getBusinessProfile } from "~/services/settingservices";

const authStore = useAuthStore();
const companyInfo = ref(null);
const title = ref("Business Information");
const subtext = ref("Information about your company");
const form = reactive({
  companyName: "",
  category: "",
  phone: "",
  email: "",
  website: "",
  fax: "",
  description: "",
  country: "Nigeria",
  city: "",
  state: "",
  address: "",
  logo: "",
  code: "+234",
  registrationNo: "",
  tin: "",
  sector: "",
  dateofIncorporation: "",
  dateOfIncorporation: "",
});
const isLoading = ref(true);
function getData() {
  getBusinessProfile()
    .then((res) => {
      isLoading.value = false;

      const { companyDocuments = [], ...companyProfile } = res.data.data;

      const formatDocuments = (documents) => {
        return documents.map((doc) => ({
          ...doc,
          urls:
            doc.urls.length > 0
              ? doc.urls.map((urlItem) => ({
                  url: urlItem?.url || urlItem || "",
                }))
              : [{ url: doc.url || "" }],
        }));
      };

      const tempData = {
        ...companyProfile,
        companyDocuments:
          companyDocuments.length > 0
            ? formatDocuments(companyDocuments)
            : KybDocumentDefault,
      };

      companyInfo.value = tempData;
      Object.keys(tempData).forEach((key) => {
        form[key] = tempData[key];
      });
      form.dateofIncorporation = res.data.data.dateOfIncorporation;
      if (companyDocuments.length > 0) {
        const formattedDocData = formatDocuments(companyDocuments);
        formData.kyb.companyDocuments =
          res.data.data.country.toLowerCase() === "nigeria"
            ? formattedDocData
            : formattedDocData.filter((doc) =>
                [0, 4].includes(doc.documentType)
              );
      }
    })

    .catch((err) => {
      isLoading.value = false;
    });
}
onBeforeMount(() => {
  getData();
});
const active = ref(1);
const tabs = [
  {
    name: "Business Information",
    subtext: "Information about your company",
    value: 1,
  },
  {
    name: "Company Documents",
    subtext: "Upload company documents",
    value: 2,
  },
  {
    name: " Directors",
    subtext: "Information about your directors",
    value: 3,
  },
];
watch(active,()=>{
  const current = tabs.find(i=>i.value === active.value)
  title.value = current.name
  subtext.value = current.subtext
})
provide("active", active);
provide("companyInfo", companyInfo);
provide("getData", getData);
provide("form", form);
</script>
<style>
.custom-shadow {
  box-shadow: 0px 2px 4px -2px #1018280f;
  box-shadow: 0px 4px 8px -2px #1018281a;
}
</style>
