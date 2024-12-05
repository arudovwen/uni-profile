<template>
  <div class="loader-container">
    <div
			data-testid="spinner"
      class="loader border-t-8 border-blue-500 border-solid rounded-full h-16 w-16 animate-spin"
    ></div>
  </div>
</template>

<style scoped>
.loader-container {
  @apply flex items-center justify-center h-[300px];
}

.loader {
  @apply border-t-8 border-[#1570EF] border-solid rounded-full h-16 w-16 animate-spin;
}
</style>
