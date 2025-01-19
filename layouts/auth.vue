<template>
  <div class="">
    <div
      class="bg-[#FFFFFF] grid grid-cols-1 xl:grid-cols-12 h-screen w-screen bg-contain bg-center max-w-[1980px] mx-auto"
      :style="{
        backgroundImage:
          app == 0 || !app
            ? `url('https://res.cloudinary.com/arudovwen-me/image/upload/f_auto,q_auto/cuu0iqo5yhh8rzgqev13')`
            : '',
      }"
    >
      <div
        v-if="!app || app == 0"
        class="relative hidden xl:flex items-center xl:col-span-6 flex-row justify-center px-6 py-10 w-full"
      >
        <div class="top-8 left-10 logo absolute z-10">
          <NuxtLink to="/">
            <img
              src="/logo-matta-white.png"
              alt="Matta"
              class="w-[120px] h-auto"
          /></NuxtLink>
        </div>

        <div class="flex items-center text-white text-left container">
          <div class="px-10">
            <div class="max-w-[660px] 2xl:max-w-[700px] mb-10">
              <h1
                class="text-4xl leading-10 xl:text-5xl 2xl:text-[56px] font-bold mb-6 xl:leading-[1.2]"
              >
                Sell your chemicals, raw materials and finished goods easily on
                Matta
              </h1>
              <p class="text-base xl:text-xl 2xl:text-2xl">
                Discover and buy chemicals, raw materials, ingredients, and
                commodities all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
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
              :style="{
                backgroundImage: `url(${
                  AppsObject[app]?.authBgUrl || '/images/oxide.png'
                })`,
              }"
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
const { app } = useRoute().params;
</script>

<style scoped lang="scss">
.heroimg {
  background-image: url("/assets/images/oxide.png");
}
</style>
