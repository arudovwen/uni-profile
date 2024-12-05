<template>
  <div class=" bg-white">
    <div class="flex justify-between items-center mb-6">
      <span
        class="h-11 w-11 rounded-full flex items-center justify-center bg-[#FEE4E2] text-[#D92D20]"
      >
        <AppIcon icon="fa6-solid:trash-can" />
      </span>
      <span @click="emits('close')"
        class="text-[#8C8C8C] bg-gray-100 rounded-full flex items-center justify-center h-6 w-6 text-sm"
      >
        <AppIcon icon="bi:x-lg" />
      </span>
    </div>
    <h3 class="text-lg text-[#101828] font-semibold">Delete Director</h3>
    <p class="text-sm text-[#475467] mb-6">
      Are you sure you want to delete this director? This action cannot be
      undone.
    </p>
    <div class="grid grid-cols-1 gap-y-2">
      <AppButton text="Delete" btnClass="bg-[#D92D20] text-white w-full border border-[#D92D20]" @click="emits('delete')" />
      <AppButton text="Cancel" btnClass="border text-[#344054] w-full border-[#D0D5DD]"  @click="emits('close')"/>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["delete", "close"])
</script>