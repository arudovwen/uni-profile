<template>
  <div
    class="formGroup relative w-full"
    :class="{
      [containerClass]: true,
      'has-error': error,
      'flex': horizontal,
      'is-valid': validate
    }"
  >
    <label
      v-if="label"
      :class="`${classLabel} inline-block input-label !mb-0`"
      :for="id || name"
    >
      {{ label }} <RedDot v-if="isRequired" />
    </label>
    <div class="relative">
      <div v-if="!$slots.default" class="text-sm" :class="{ 'opacity-60': disabled }">
        <vSelect
          :id="id || name"
          :name="name"
          :readonly="isReadonly"
          :disabled="disabled"
          :multiple="multiple"
          :options="options"
          :placeholder="placeholder"
          :clearable="clearable"
          :class="classInput"
          v-model="selectedValue"
          :reduce="reduce"
          taggable
        />
      </div>
      <slot></slot>
      <div class="flex text-xl absolute right-[14px] top-1/2 -translate-y-1/2">
        <AppIcon v-if="error" icon="heroicons-outline:information-circle" class="text-danger-500" />
        <AppIcon v-if="validate" icon="bi:check-lg" class="text-success-500" />
      </div>
    </div>

    <span
      v-if="error"
      class="mt-2"
      :class="msgTooltip 
        ? 'inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded' 
        : 'text-danger-500 block text-sm'"
    >
      {{ error }}
    </span>
    
    <span
      v-if="validate"
      class="mt-2"
      :class="msgTooltip 
        ? 'inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded' 
        : 'text-success-500 block text-sm'"
    >
      {{ validate }}
    </span>
    
    <span
      v-if="description"
      class="block text-secondary-500 font-light leading-4 text-xs mt-2"
    >
      {{ description }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Define component name
const componentName = 'FormSelect';

// Define props
const props = defineProps({
  id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: ""
  },
  modelValue: {
    type: [String, Array, Object, Number],
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: "Select Option"
  },
  options: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ""
  },
  validate: {
    type: String,
    default: ""
  },
  classLabel: {
    type: String,
    default: ""
  },
  classInput: {
    type: String,
    default: "classinput"
  },
  containerClass: {
    type: String,
    default: ""
  },
  isReadonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  horizontal: {
    type: Boolean,
    default: false
  },
  msgTooltip: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ""
  },
  multiple: {
    type: Boolean,
    default: false
  },
  reduce: {
    type: Function,
    default: (val) => val
  },
  clearable: {
    type: Boolean,
    default: true
  }
});

// Define emits
const emit = defineEmits(['update:modelValue']);

// Create reactive state
const selectedValue = ref(props.modelValue);

// Watch for changes in selectedValue and emit update events
watch(selectedValue, (newValue) => {
  console.log('Model value changed:', newValue);
  emit('update:modelValue', newValue);
});

// Watch for changes in modelValue from parent and update local state
watch(() => props.modelValue, (newValue) => {
  console.log('Model value changed:', newValue);
  selectedValue.value = newValue;
});
</script>

<style lang="scss">
.formGroup {
  .vs__dropdown-toggle {
    @apply bg-transparent border border-[#D0D5DD] rounded-lg min-h-[42px] text-[#475467] text-sm;
    
    &::placeholder {
      @apply text-[#CDD2DA] text-sm;
    }
  }
  
  &.has-error .vs__dropdown-toggle {
    @apply border-danger-500;
  }
  
  .vs__dropdown-option--highlight {
    @apply bg-slate-900 py-2 text-sm;
  }
  
  .vs__dropdown-menu {
    @apply shadow-dropdown bg-white text-sm border-0;
    
    li {
      @apply capitalize;
    }
  }
  
  .vs__search::placeholder {
    @apply text-secondary-500;
  }
  
  .vs__actions svg {
    @apply fill-secondary-500 w-[15px] h-[15px] mt-[6px] scale-75;
  }

  .vs--multiple {
    .vs__selected {
      @apply text-xs text-slate-900 font-light bg-white border-slate-200 border rounded-[3px] h-fit;
      padding: 4px 8px !important;
    }
    
    .vs__selected-options {
      @apply items-center capitalize;
      
      svg {
        @apply scale-75;
      }
    }
  }
  
  .vs__dropdown-option--disabled {
    @apply bg-slate-50;
  }
}
</style>