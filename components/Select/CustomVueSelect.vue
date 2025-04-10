<template>
  <div
    class="formGroup relative"
    :class="`${error ? 'has-error' : ''}  ${horizontal ? 'flex' : ''}  ${
      validate ? 'is-valid' : ''
    } `"
  >
    <label
      v-if="label"
      :class="`${classLabel} inline-block input-label `"
      :for="name"
    >
      {{ label }}  <RedDot v-if="isRequired"
    />
      <span
        class="ml-4 text-blue-400"
        @click="$store.dispatch(`${request.toggle}`, true)"
        v-if="request && canRequest"
        >{{ request.name }}</span
      >
    </label>

    <div v-if="menuLoading">Loading...</div>
    <div v-else class="relative">
      <div v-if="!$slots.default">
        <vSelect
          :name="name"
          :error="error"
          :id="name"
          :readonly="isReadonly"
          :disabled="disabled"
          :validate="validate"
          :multiple="multiple"
          :options="options"
          :modelValue="modelValue"
					data-testid="input"
          @update:modelValue="$emit('update:modelValue', $event)"
        >
        </vSelect>
      </div>
      <slot></slot>
      <div class="flex text-xl absolute right-[14px] top-1/2 -translate-y-1/2">
        <span v-if="error" class="text-danger-500">
          <AppIcon icon="heroicons-outline:information-circle" />
        </span>

        <span v-if="validate" class="text-success-500">
          <AppIcon icon="bi:check-lg" />
        </span>
      </div>
    </div>

    <span
      v-if="error"
      class="mt-2"
      :class="
        msgTooltip
          ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
          : ' text-danger-500 block text-sm'
      "
      >{{ error }}</span
    >
    <span
      v-if="validate"
      class="mt-2"
      :class="
        msgTooltip
          ? ' inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded'
          : ' text-success-500 block text-sm'
      "
      >{{ validate }}</span
    >
    <span
      class="block text-secondary-500 font-light leading-4 text-xs mt-2"
      v-if="description"
      >{{ description }}</span
    >
  </div>
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    vSelect,
  },
  props: {
    canRequest: {
      type: Boolean,
      default: false,
    },
    request: {
      type: Object,
      default: null,
    },
    placeholder: {
      type: String,
      default: "Select Option",
    },
    label: {
      type: String,
    },
    classLabel: {
      type: String,
      default: " ",
    },
    classInput: {
      type: String,
      default: "classinput",
    },

    name: {
      type: String,
    },
    modelValue: {
      // type: String || Array,
      default: "",
    },
    error: {
      type: String,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isReadonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    menuLoading: {
      type: Boolean,
      default: false,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: String,
    },
    msgTooltip: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
    },

    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
    },
  },
};
</script>
<style lang="scss">
.formGroup {
  .vs__dropdown-toggle {
    @apply bg-transparent   border-slate-200   min-h-[36px] text-slate-900 text-sm;
  }

  &.has-error {
    .vs__dropdown-toggle {
      @apply border-danger-500;
    }
  }

  .vs__dropdown-option--highlight {
    @apply bg-slate-900   py-2 text-sm;
  }
  .vs__dropdown-menu {
    li {
      @apply capitalize;
    }
  }
  .vs__dropdown-menu {
    @apply shadow-dropdown bg-white text-sm  border-[0px] ;
  }
  .vs__search::placeholder {
    @apply text-secondary-500;
  }
  .vs__actions svg {
    @apply fill-secondary-500 w-[15px] h-[15px] mt-[6px] scale-[.8];
  }

  .vs--multiple {
    .vs__selected {
      @apply text-xs text-slate-900 font-light bg-white  border-slate-200 border rounded-[3px] h-fit;
      padding: 4px 8px !important;
    }

    .vs__selected-options {
      @apply items-center capitalize;
      svg {
        @apply scale-[0.8];
      }
    }
  }
  .vs__dropdown-option--disabled {
    @apply bg-slate-50;
  }

  // .vs__dropdown-toggle {
  //   height: 40px;
  // }
}
</style>
