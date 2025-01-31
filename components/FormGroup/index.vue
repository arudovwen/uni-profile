<template>
  <div
    class="formGroup relative w-full md:w-auto"
    :class="`${error ? 'has-error' : ''}  ${horizontal ? 'flex gap-x-3' : ''}  ${
      validate ? 'is-valid' : ''
    } ${formClass}`"
  >
    <label
      v-if="label"
      :class="`${classLabel}  input-label flex gap-x-1 items-center`"
      :for="name"
    >
      {{ label }} <RedDot v-if="isCumpulsory" /> <span v-if="isOptional" class=" font-medium text-gray-400">(Optional)</span>
      <span
        v-if="info"
        data-toggle="tooltip"
        data-placement="top"
        :title="infoTitle"
        class="cursor-pointer h-4 w-4 flex items-center justify-center"
      >
        <AppIcon icon="quill:info" iconClass="text-gray-600" />
      </span>
    </label>
    <div class="relative">
      <slot></slot>
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
export default {
  components: {},
  props: {
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

    error: {
      type: String,
    },
    isOptional:{
      default:false
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
    isCumpulsory: {
      type: Boolean,
      default: false,
    },
    infoTitle: {
      type: String,
    },
    info: {
      type: Boolean,
    },
    formClass: {
      type: String,
    },
  },
};
</script>
<style lang="scss"></style>
