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
      {{ label }} <RedDot v-if="isRequired"
    /></label>
    <div class="relative">
      <div class="text-sm">
        <span
          v-show="hasIcon"
          class="absolute left-0 h-[42px] w-[44px] flex justify-center items-center"
          ><TextinputLocationIcon
        /></span>
        <input
          :class="`input-control w-full block focus:outline-none h-[42px] ${
            hasIcon ? '!pl-[44px]' : ''
          }`"
          :name="name"
          :id="name"
          :readonly="isReadonly"
          :disabled="disabled"
          :placeholder="placeholder"
          v-model="selectedValue"
          @focus="isOpen = true"
          type="search"
          autoComplete="off"
        />
      </div>
      <div
        v-if="isOpen"
        class="absolute right-0 origin-top-right rounded bg-white shadow-dropdown z-[999] max-h-[450px] overflow-y-auto w-full py-3 border border-gray-50"
      >
        <ul class="grid gap-y-1">
          <li
            class="py-2 px-4 hover:bg-gray-100 cursor-pointer text-sm"
            v-for="option in options"
            :key="option.label"
            @click="handleChange(option.value)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <span
    v-if="error"
    class=""
    :class="
      msgTooltip
        ? ' inline-block placeholder-[#f9bb64] bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
        : ' text-danger-500 block placeholder-[#f9bb64] text-sm'
    "
    >{{ error }}</span
  >
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  components: {
    vSelect,
  },
  data() {
    return {
      selectedValue: "",
      isOpen: false,
    };
  },
  props: {
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

    isReadonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
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
    isRequired: {
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
    reduce: {
      default: [],
    },
    clearable: {
      default: true,
    },
    hasIcon: {
      default: false,
    },
  },
  mounted() {
    this.selectedValue = this.modelValue;
  },
  watch: {
    selectedValue(newValue) {
      this.$emit("update:modelValue", newValue);
      console.log("New", newValue);
    },

    modelValue(newValue) {
      this.selectedValue = newValue;
    },
  },
  methods: {
    handleChange(value) {
      this.selectedValue = value;
      this.isOpen = false;
    },
  },
};
</script>
<style lang="scss">
.formGroup {
  .vs__dropdown-toggle {
    @apply bg-transparent placeholder:text-[#CDD2DA]  border border-[#D0D5DD] rounded-lg min-h-[42px] text-[#475467] text-sm placeholder:text-sm;
  }
  // .v-select {
  //   @apply darks:text-slate-300;
  // }
  &.has-error {
    .vs__dropdown-toggle {
      @apply border-danger-500;
    }
  }
  // .vs__dropdown-option {
  //   @apply darks:text-slate-100;
  // }
  .vs__dropdown-option--highlight {
    @apply bg-slate-900  py-2 text-sm;
  }
  .vs__dropdown-menu {
    li {
      @apply capitalize;
    }
  }
  .vs__dropdown-menu {
    @apply shadow-dropdown bg-white  text-sm  border-[0px];
  }
  .vs__search::placeholder {
    @apply text-secondary-500;
  }
  .vs__actions svg {
    @apply fill-secondary-500 w-[15px] h-[15px] mt-[6px] scale-[.8];
  }

  .vs--multiple {
    .vs__selected {
      @apply text-xs text-slate-900 font-light bg-white border-slate-200  border rounded-[3px] h-fit;
      padding: 4px 8px !important;
    }
    // .vs__deselect {
    //   @apply darks:fill-slate-300;
    // }

    .vs__selected-options {
      @apply items-center capitalize;
      svg {
        @apply scale-[0.8];
      }
    }
  }
  // .vs--single .vs__selected {
  //   @apply darks:text-slate-300;
  // }
  .vs__dropdown-option--disabled {
    @apply bg-slate-50;
  }
}
</style>
