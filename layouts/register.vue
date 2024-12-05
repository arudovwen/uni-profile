<template>
  <div
    class="bg-[#0C111D] h-screen w-screen grid grid-cols-1 lg:grid-cols-12 bg-contain bg-center relative"
    :style="backgroundStyles"
  >
    <div
      class="h-full hidden lg:flex flex-col px-10 xl:px-16 py-8 gap-y-8 lg:col-span-7"
    >
      <div class="flex justify-between">
        <NuxtLink to="/">
          <img
            src="/"
            width="100"
            height="26"
            alt="Matta"
            class="w-[100px] h-auto"
        /></NuxtLink>
      </div>
      <div class="relative flex-1 flex flex-col justify-center">
        <div class="max-w-[600px] xl:max-w-[800px] w-full">
          <h1
            class="text-3xl xl:text-4xl  text-white font-semibold mb-[27px]"
          >
            {{
              route.path === "/auth/vendor-register" ? vendorHeader : buyerHeader
            }}
          </h1>
          <p class="text-base xl:text-lg  text-white mb-10">
            {{ route.path === "/auth/vendor-register" ? vendorText : buyerText }}
          </p>
          <div class="grid gap-y-2">
            <div
              v-for="n in route.path === '/auth/vendor-register'
                ? vendorData
                : buyerData"
              :key="n"
              class="flex gap-x-[10px]"
            >
              <span class="h-[6px] w-[6px] rounded-full bg-white inline mt-[10px]"></span>

              <p class="text-base xl:text-lg text-white">
                {{ n }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-center py-8 px-8 bg-white lg:col-span-5 h-full overflow-y-auto"
    >
      <div class="w-full h-full bg-white flex flex-col">
        <div class="z-10 lg:hidden mb-14 max-h-max">
          <NuxtLink to="/">
            <img
              src=""
              width="100"
              height="26"
              alt="Matta"
              class="w-[100px] h-auto"
          /></NuxtLink>
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const img = useImage();
const backgroundStyles = computed(() => {
  const imgUrl = img(
    `https://res.cloudinary.com/arudovwen-me/image/upload/f_auto,q_auto/cuu0iqo5yhh8rzgqev13`,
    {
      sizes: {
        xl: "100vw",
        lg: "100vw",
        md: "100vw",
        sm: "100vw",
        xs: "100vw",
      },
    }
  );
  return { backgroundImage: `url('${imgUrl}')` };
});

const buyerHeader =
  "Trusted by top industrial brands for sourcing chemicals and raw materials.";
const buyerText =
  "Matta is the partner of choice for many of Nigeria's leading brands, including AirLiquide, CocaCola, Honeywell, and EmosBest";

const vendorHeader =
  "Sell chemicals & raw materials across Africa - Start your online store now! ";
const vendorText =
  "Matta is the partner of choice for the leading suppliers and manufacturers of chemicals and raw materials, including BASF, Cargill, Cormart, and NYCIL. ";

const buyerData = [
  "Optimize your procurement with Matta's digital marketplace.",
  "Discover a broad selection of industrial materials from reliable suppliers.",
  "Seamless transactions with our logistics and technical support.",
  "Smarter purchasing choices with real-time business insights.",
  "Count on quality, cost-effectiveness, and prompt delivery to boost your operations.",
];

const vendorData = [
  "Access a vast network of African buyers with Matta's platform.",
  "Maximize visibility with our digital storefronts.",
  "Benefit from tailored logistics and financing solutions.",
  "Experience a seamless journey from listing to delivery with Matta.",
  "Expand your sales and market presence through Matta's effective trade ecosystem.",
];
</script>
