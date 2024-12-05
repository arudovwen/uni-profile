// plugins/veeValidate.js

import { defineNuxtPlugin } from "#app";
import { configure } from "vee-validate";

export default defineNuxtPlugin(() => {
  configure({
    // validateOnChange:false,
    // validateOnModelUpdate:true,
    // validateOnBlur:true
  });
});
