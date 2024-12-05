import { config } from "@vue/test-utils";
import { defineComponent } from "vue";

// Stub the NuxtLink component globally
config.global.stubs = {
  NuxtLink: defineComponent({
    name: "NuxtLink",
    props: ["to"],
    template: "<a><slot /></a>",
  }),

};
// config.global.directives = {
//   clipboard: {
//     beforeMount(el, binding) {
//       el.copyText = binding.value;
//     },
//     mounted(el) {
//       el.addEventListener('click', () => {
//         if (el.copyText) {
//           VueClipboard.copyText(el.copyText);
//         }
//       });
//     },
//   },
// };
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
