<template>
  <div class="">
    <div
      class="bg-[#FFFFFF] grid grid-cols-1 xl:grid-cols-12 h-screen w-screen bg-contain bg-center max-w-[1980px] mx-auto"
    >
      <div
        class="relative hidden xl:flex items-center xl:col-span-6 flex-row justify-center px-6 py-10 w-full"
      >
        <div
          class="hidden xl:flex justify-center items-center xl:col-span-6 bg-[#EAECF5] rounded-[20px] w-full h-full"
        >
          <div
            class="flex flex-col px-[30px] py-[50px] h-full max-h-max w-full"
          >
            <div class="mb-[30px]">
              <AppLogo className="w-[130px] xl:w-[140px]" />
            </div>
            <div
              class="h-full max-h-[70%] 2:max-h-[70%] 4xl:max-h-[65%] bg-black-500 rounded-[20px] bg-cover bg-no-repeat bg-center mb-[50px]"
              :style="{ backgroundImage: `url(${AppsObject[app]?.authBgUrl || '/images/oxide.png'})` }"
            ></div>

            <div class="flex items-center text-gray-900 text-left">
              <div>
                <div class="max-w-[660px] 2xl:max-w-[700px] 3xl:max-w-[800px]">
                  <h1 class="text-2xl xl:text-3xl 2xl:text-4xl font-[500] mb-6">
                    {{ AppsObject[app]?.authText }}
                  </h1>
                  <p class="text-base 2xl:text-lg 3xl:text-xl text-[#4A5578]">
                    {{ AppsObject[app]?.authSubText }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-white px-6 xl:px-10 flex flex-col xl:col-span-6 xl:justify-center h-full overflow-y-auto"
      >
        <div class="pt-6 pb-2 z-10 xl:hidden">
          <AppLogo />
        </div>
        <div
          class="flex-1 flex flex-col justify-start mt-12 xl:mt-auto xl:justify-center"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { app } = useRoute().query;
</script>

<style scoped lang="scss">
.heroimg {
  background-image: url("/assets/images/oxide.png");
}
</style>
