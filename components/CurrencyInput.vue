<template>
  <input data-testid="currency-input" ref="inputRef" type="text"  :class="classInput"/>
</template>

<script>
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";
export default {
  name: "CurrencyInput",
  props: {
    modelValue: Number, // Vue 2: value
    options: Object,
    classInput: String
  },
  setup(props) {
    const { inputRef, setValue } = useCurrencyInput(props.options);
    watch(
      () => props.modelValue, // Vue 2: props.value
      (value) => {
        setValue(value);
      }
    );
    // watch(
    //   () => props.options,
    //   (options) => {
    //     setOptions(options);
    //   }
    // );
    return { inputRef };
  },
};
</script>
