<template>
  <div class="px-[15px] pt-[15px] pb-[36px]">
    <div class="flex justify-between items-center mb-[15px]">
      <span class="font-bold text-base">{{ title }}</span>
      <span class="cursor-pointer" @click="active = !active"
        ><AppIcon :icon="active ? 'charm:minus' : 'charm:plus'"
      /></span>
    </div>
    <div v-if="active">
      <ul class="grid gap-y-[10px] max-h-[300px] overflow-y-auto">
        <li
          class="flex items-center capitalize"
          v-for="list in lists"
          :key="list.title"
        >
          <CheckboxMulti
            v-model="selected"
            :label="list.title.toLowerCase()"
            labelClass="text-xs md:text-sm"
            :value="list.value"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
const active = ref(true);
const { emit } = getCurrentInstance();
const props = defineProps(["lists", "title", "modelValue"]);

const selected = ref([]);

watch(selected, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    selected.value = newValue;
  }
);
</script>
