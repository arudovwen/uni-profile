// tooltip.ts
import { defineNuxtPlugin } from "#app";
import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    VueTippy,
    // optional
    {
      directive: "tippy", // => v-tippy
      component: "tippy", // => <tippy/>
      componentSingleton: "tippy-singleton", // => <tippy-singleton/>,
      defaultProps: {
        // placement: 'auto-end',
        allowHTML: true,
        theme: "light-border",
      }, // => Global default options * see all props
    }
  );
});
