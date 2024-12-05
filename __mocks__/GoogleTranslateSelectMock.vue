<!-- components/GoogleTranslateSelectMock.vue -->
<template>
  <div>
    <select v-model="selectedLanguage" @change="handleLanguageChange">
      <option v-for="lang in languages" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: ["languages"],
  data() {
    return {
      selectedLanguage: "",
    };
  },
  methods: {
    handleLanguageChange(event) {
      this.$emit("select", event.target.value);
    },
  },
};
</script>
