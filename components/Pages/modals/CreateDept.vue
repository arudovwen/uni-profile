<template>
  <ModalCenterProp :is-modal-open="isOpen" @close="emit('close')">
    <template #default>
      <div class="min-w-[450px] max-w-[450px] py-6 px-6">
        <h2 class="block text-lg font-semibold text-[#101828] text-left mb-1">
          {{ detail ? "Edit Department" : "Create Department" }}
        </h2>

        <form @submit.prevent="onSubmit">
          <div class="mb-6">
            <Textinput
              placeholder=""
              label="Department name"
              name="name"
              v-model="name"
              v-bind="nameAtt"
              :error="errors.name"
            />
          </div>

          <div class="flex gap-x-3">
            <button
              type="button"
              @click="emit('close')"
              class="h-11 appearance-none leading-none px-4 py-[10px] rounded-lg text-matta-black hover:bg-gray-100 text-sm w-full border border-[#D0D5DD] font-medium justify-center flex items-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="border text-sm mb-4 border-primary-500 text-white lg:min-w-[120px] w-full bg-primary-500 rounded-lg px-6 py-2 hover:bg-primary/80 h-11"
            >
              <span>
                <span
                  class="flex items-center justify-center gap-x-4"
                  v-if="isLoading"
                  ><span> Processing...</span>
                  <i
                    v-if="isLoading"
                    class="text-white fa fa-spinner fa-spin"
                    aria-hidden="true"
                  ></i
                ></span>
                <span v-else>Submit</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </template>
  </ModalCenterProp>
</template>
<script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { addDepartment, updateDepartment } from "~/services/userservices";
import { toast } from "vue3-toastify";

const props = defineProps({
  isOpen: {
    default: false,
  },
  buttonText: {
    default: "Submit",
  },
  detail: {
    default: null,
  },
});
const emit = defineEmits(["close"]);

const form = reactive({
  name: props.detail?.name,
  id: props.detail?.id,
});
const schema = yup.object({
  name: yup
    .string()

    .required(),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
  initialValues: form,
});

const [name, nameAtt] = defineField("name");

const isLoading = ref(false);
const onSubmit = handleSubmit((values) => {
  isLoading.value = true;

  (props.detail ? updateDepartment : addDepartment)(values)
    .then((res) => {
      if (res.status === 200) {
        emit("close");
        isLoading.value = false;
        toast.success("Departments updated successfully`");
      }
    })
    .catch((err) => {
      toast.error(err.response.data.Message || err.res.data.message);

      isLoading.value = false;
    });
});
</script>
