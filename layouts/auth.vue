<template>
  <div class="">
    <div
      class="bg-[#FFFFFF] grid items-center h-screen w-screen bg-contain bg-center max-w-[1980px] mx-auto"
    >
      <!-- <div
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
              class="h-full max-h-[70%] 2:max-h-[70%] 4xl:max-h-[65%] bg-black-500 rounded-[20px] heroimg bg-cover bg-no-repeat bg-center mb-[50px]"
            ></div>

            <div class="flex items-center text-gray-900 text-left">
              <div>
                <div class="max-w-[660px] 2xl:max-w-[700px] 3xl:max-w-[800px]">
                  <h1 class="text-2xl xl:text-3xl 2xl:text-4xl font-[500] mb-6">
                    Payments, Financing, and Cross-border Payments
                  </h1>
                  <p class="text-base 2xl:text-lg 3xl:text-xl text-[#4A5578]">
                    Seamless payments and financing for Africa's
                    Manufacturing Industry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div
        class="bg-white px-6"
      >
        <div class="pt-6 pb-2 z-10 ">
        
        </div>
        <div
          class="flex justify-center flex-col  max-w-[450px] mx-auto"
        >
       <div class="mb-12">
        <AppLogo />
       </div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.heroimg {
  background-image: url("/assets/images/oxide.png");
}
</style>
