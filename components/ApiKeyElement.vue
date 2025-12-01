<template>
  <div class="flex flex-col items-start gap-6 w-full max-w-[478px] my-4">
    <div class="flex-col items-start gap-6 w-full h-full">
      <div class="flex flex-row items-start mb-2 h-[20px]">
        <span class="font-onest font-medium text-sm text-gray-700 mb-6">{{
          label
        }}</span>
      </div>
      <div
        class="flex flex-row items-start w-full h-[42px] bg-white border border-gray-300 rounded-lg shadow-sm"
      >
        <div
          class="flex flex-row items-center flex-grow px-3.5 py-3 gap-2 bg-gray-50 border-y border-l border-gray-300 rounded-l-lg"
        >
          <input
            type="text"
            disabled
            :value="loading ? 'Loading...' : value"
            class="font-onest w-full font-normal text-sm text-gray-500 bg-transparent outline-none"
          />
          <span class="hidden w-4 h-4"></span>
        </div>
        <button
          class="flex flex-row justify-center items-center px-4 py-3 gap-1.5 w-[97px] bg-white border-y border-r rounded-r-lg border-l-[1px] border-[#D0D5DD]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1863_11942)">
              <path
                d="M4.16669 12.5001C3.39012 12.5001 3.00183 12.5001 2.69555 12.3732C2.28717 12.2041 1.96271 11.8796 1.79355 11.4712C1.66669 11.1649 1.66669 10.7767 1.66669 10.0001V4.33341C1.66669 3.39999 1.66669 2.93328 1.84834 2.57676C2.00813 2.26316 2.2631 2.00819 2.5767 1.8484C2.93322 1.66675 3.39993 1.66675 4.33335 1.66675H10C10.7766 1.66675 11.1649 1.66675 11.4712 1.79362C11.8795 1.96277 12.204 2.28723 12.3732 2.69561C12.5 3.00189 12.5 3.39018 12.5 4.16675M10.1667 18.3334H15.6667C16.6001 18.3334 17.0668 18.3334 17.4233 18.1518C17.7369 17.992 17.9919 17.737 18.1517 17.4234C18.3334 17.0669 18.3334 16.6002 18.3334 15.6667V10.1667C18.3334 9.23333 18.3334 8.76662 18.1517 8.4101C17.9919 8.09649 17.7369 7.84153 17.4233 7.68174C17.0668 7.50008 16.6001 7.50008 15.6667 7.50008H10.1667C9.23327 7.50008 8.76656 7.50008 8.41004 7.68174C8.09643 7.84153 7.84147 8.09649 7.68168 8.4101C7.50002 8.76662 7.50002 9.23333 7.50002 10.1667V15.6667C7.50002 16.6002 7.50002 17.0669 7.68168 17.4234C7.84147 17.737 8.09643 17.992 8.41004 18.1518C8.76656 18.3334 9.23327 18.3334 10.1667 18.3334Z"
                stroke="#344054"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1863_11942">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <span
            @click="copyText"
            class="font-onest font-medium text-sm text-gray-700"
            >Copy</span
          >
          <span class="hidden w-5 h-5"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";

const props = defineProps(["label", "value", "loading"]);

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    toast.success("Copied");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
</script>

<style lang="scss" scoped></style>
