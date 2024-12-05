import VueClipboard from "vue3-clipboard";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  });
});
