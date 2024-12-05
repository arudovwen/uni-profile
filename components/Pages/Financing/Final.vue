<template>
  <div class="p-10 mt-20 flex flex-col justify-center items-center">
    <img alt="Final" src="/images/sent.png" class="mx-auto mb-2" />
    <h1 class="mb-3 font-semibold text-2xl text-[#333]">
      Request {{ !financeId ? "Sent" : "Updated" }}
    </h1>
    <p class="text-sm text-[#444] mb-4 max-w-[363px] mx-auto text-center">
      Your request has been sent and will be reviewed. You will be contacted via
      mail or phone call on the next steps
    </p>
    <AppButton
      link="/financing"
      btnClass="bg-primary-500 text-white !px-16  !text-sm !py-[10px] disabled:cursor-not-allowed border  !rounded-lg border-primary-500"
      type="button"
      text="Return to Financing"
    />
  </div>
</template>
<script setup>
const route = useRoute();
const { financeId } = route.params;
</script>
