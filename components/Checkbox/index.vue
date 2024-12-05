<template>
  <div :class="containerClass">
    <label
      class="flex items-center"
      :class="disabled ? ' cursor-not-allowed opacity-50' : 'cursor-pointer'"
    >
      <input
        type="checkbox"
        class="hidden"
        :disabled="disabled"
        :name="name"
        @change="onChange"
        :value="value"
        v-model="localValue"
        v-bind="$attrs"
        :data-testid="name"
      />

      <span
        class="h-4 w-4 border flex-none border-slate-200 rounded mr-3 relative transition-all duration-150 flex justify-center items-center"
        :class="
          ck
            ? activeClass + ' border-none '
            : 'bg-white border border-[rgba(223,223,223,1)] '
        "
      >
        <CheckIcon v-if="ck" />
      </span>
      <span
        :class="`text-[#344054] font-Onest darks:text-slate-400 text-sm leading-6 ${labelClass}`"
        v-if="label"
        :data-testid="label"
      >
        {{ label }}
      </span>
      <slot></slot>
    </label>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import CheckIcon from "~/assets/images/icon/CheckIcon.vue";

export default defineComponent({
  name: "Checkbox",
  components: {
    CheckIcon,
  },
  inheritAttrs: false,
  props: {
    label: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "checkbox",
    },
    activeClass: {
      type: String,
      default: " ring-primary-400  bg-primary-500",
    },
    labelClass: {
      type: String,
    },
    value: {
      type: null,
    },
    modelValue: {
      type: null,
    },
    containerClass: {
      default: "",
    },
  },
  emits: {
    "update:modelValue": (newValue) => ({
      modelValue: newValue,
    }),
    // use newValue
    // "update:checked": (newValue) => true,
  },

  setup(props, context) {
    const ck = ref(props.checked);

    // on change event
    const onChange = () => {
      ck.value = !ck.value;
    };

    const localValue = computed({
      get: () => props.modelValue,
      set: (newValue) => context.emit("update:modelValue", newValue),
    });

    watch(
      () => [props.checked],
      () => {
        ck.value = props.checked;
      }
    );

    return { localValue, ck, onChange };
  },
});
</script>
<style lang=""></style>
