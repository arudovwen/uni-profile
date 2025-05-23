<template>
  <div class="loader-container w-full">
    <div
      class="loader border-t-4 border-blue-500 border-solid rounded-full h-8 w-8 animate-spin"
			data-testid="table-loader"
    ></div>
  </div>
</template>

<style scoped>
.loader-container {
  @apply flex items-center justify-center h-[300px];
}

.loader {
  @apply border-t-4 border-[#021242] border-solid rounded-full h-8 w-8 animate-spin;
}
</style>
