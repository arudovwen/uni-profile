<template>
  <div
    @click="$emit('click')"
    :class="[
      'box-border lg:w-[272px] h-[109px] bg-white border-2 shadow-md rounded-lg relative',
      active && 'border-[#80B0FF]',
      'flex-none w-full order-0 flex-grow-0'
    ]"
  >
    <div class="absolute w-7 h-7 left-[13px] top-[14px]">
      <!-- Dynamically render the correct icon component based on the 'active' state -->
      <component :is="active ? iconActiveComponent : iconInactiveComponent" :active="active" />
    </div>

    <div class="absolute left-[13px] top-[51px] w-12 h-5 font-medium text-sm leading-5 text-[#344054]">
      {{ title }}
    </div>

    <div class="absolute left-[13px] top-[74px] w-[251px] h-4 font-normal text-xs leading-[18px] text-[#667085]">
      {{ description }}
    </div>
  </div>
</template>

  <script>
  import AuthClientIconActive from './ClientIconActive.vue';  // Import active icon
  import AuthClientIcon from './ClientIcon.vue';  // Import inactive icon
  import AuthVendorIconActive from './VendorIconActive.vue';  // Import active vendor icon
  import AuthVendorIcon from './VendorIcon.vue';  // Import inactive vendor icon
  
  export default {
    props: {
      active: Boolean,
      title: String,
      description: String,
      iconActive: String,
      iconInactive: String
    },
    computed: {
      iconActiveComponent() {
        return this.iconActive === 'AuthClientIconActive'
          ? AuthClientIconActive
          : AuthVendorIconActive;
      },
      iconInactiveComponent() {
        return this.iconInactive === 'AuthClientIcon'
          ? AuthClientIcon
          : AuthVendorIcon;
      }
    }
  };
  </script>
  