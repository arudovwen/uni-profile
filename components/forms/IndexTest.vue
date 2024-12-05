<template>
  <div class="p-20 h-screen">
    <div><SearchComponent @onGetData="onGetData" :options="options" /></div>
    <br />
    <div><SelectComponent @onGetData="onGetData" :options="options" /></div>
  </div>
</template>
<script setup>
import SearchComponent from "./SearchComponent";
import SelectComponent from "./SelectComponent";

// eslint-disable-next-line no-unused-vars
function onGetData(value) {}
const options = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];
</script>
