<template>
  <div class="w-full h-full grid items-center">
    <div>
      <h1
        class="font-semibold text-3xl md:text-[36px] text-matta-black text-left mb-10"
      >
        Create your account!
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-x-4">
          <div class="mb-6">
            <label for="firstName" class="mb-2 font-normal text-xs block">First name</label>
            <input
            id="firstName"
            name="firstName"
              v-model="v$.firstName.$model"
              :class="{ 'border-red-500': v$.firstName.$error }"
              class="rounded-lg px-[14px] py-[10px] h-11 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
            />
            <div
              class="text-red-500 mt-1"
              v-for="error of v$.firstName.$errors"
              :key="error.$uid"
            >
              <div class="error-msg text-error text-xs font-semibold">
                {{ error.$message }}
              </div>
            </div>
          </div>
          <div class="mb-6">
            <label for="lastName" class="mb-2 font-normal text-xs block">Last name</label>
            <input
            name="lastName"
            id="lastName"
              v-model="v$.lastName.$model"
              :class="{ 'border-red-500': v$.lastName.$error }"
              class="rounded-lg px-[14px] py-[10px] h-11 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
            />
            <div
              class="text-red-500 mt-1"
              v-for="error of v$.lastName.$errors"
              :key="error.$uid"
            >
              <div class="error-msg text-error text-xs font-semibold">
                {{ error.$message }}
              </div>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="password" class="mb-2 font-normal text-xs block text-matta-black"
            >Password</label
          >
          <div class="relative flex items-center">
            <input
              v-model="v$.password.$model"
              :class="{ 'border-red-500 ': v$.password.$error }"
              class="rounded-lg px-[14px] py-[10px] h-11 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
              placeholder="Password"
              autocomplete="off"
              name="password"
              :type="!isShowingPasword ? 'password' : 'text'"
            />
            <EyeIcon
              v-if="!isShowingPasword"
              @click="isShowingPasword = !isShowingPasword"
              class="w-4 h-4 absolute cursor-pointer right-6"
            />
            <EyeSlashIcon
              @click="isShowingPasword = !isShowingPasword"
              v-else
              class="w-4 h-4 absolute cursor-pointer right-6"
            />
          </div>
          <div
            class="text-red-500 mt-1"
            v-for="error of v$.password.$errors"
            :key="error.$uid"
          >
            <div class="error-msg text-error text-xs font-semibold">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <div class="mb-12">
          <label for="" class="mb-2 font-normal text-xs block text-matta-black"
            >Confirm Password</label
          >
          <div class="relative flex items-center">
            <input
              v-model="v$.confirmPassword.$model"
              :class="{ 'border-red-500 ': v$.confirmPassword.$error }"
              class="rounded-lg px-[14px] py-[10px] h-11 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
              placeholder="Password"
              autocomplete="off"
              :type="!isShowingPasword ? 'password' : 'text'"
            />
            <EyeIcon
              v-if="!isShowingPasword"
              @click="isShowingPasword = !isShowingPasword"
              class="w-4 h-4 absolute cursor-pointer right-6"
            />
            <EyeSlashIcon
              @click="isShowingPasword = !isShowingPasword"
              v-else
              class="w-4 h-4 absolute cursor-pointer right-6"
            />
          </div>
          <div
            class="text-red-500 mt-1"
            v-for="error of v$.confirmPassword.$errors"
            :key="error.$uid"
          >
            <div class="error-msg text-error text-xs font-semibold">
              {{ error.$message }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-col lg:flex-row justify-between items-center gap-x-4 gap-y-4 lg-gap-y-0"
        >
          <button
            :disabled="v$.$silentErrors.length || isLoading"
            :class="{
              'opacity-70 cursor-not-allowed':
                v$.$silentErrors.length || isLoading,
            }"
            class="border text-base border-primary-500 uppercase text-white w-full bg-primary-500 text-center rounded-lg px-6 py-2 hover:bg-primary-500/80 h-11 leading-[normal]"
          >
            <span v-if="isLoading"
              >Signing up
              <i
                v-if="isLoading"
                class="fa fa-spinner fa-spin text-white"
                aria-hidden="true"
              ></i
            ></span>
            <span v-else> Sign up</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  middleware: "auth",
});

import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
import { registerInvitedUser } from "~/services/authservices";

const route = useRoute();

const form = reactive({
  firstName: "",
  password: "",
  lastName: "",
  confirmPassword: "",
  invitationId: Number(route.params.id),
});
const isLoading = ref(false);
const validPassword = (value) => {
  let res = /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value);
  return res;
};
const specialPassword = (value) => {
  let res = /[@&!%#$%]/.test(value);
  return res;
};
const samePassword = (value) => value === form.password;
const rules = {
  firstName: {
    required,
    maxLength: maxLength(50),
  },
  lastName: {
    required,
    maxLength: maxLength(50),
  },

  password: {
    required: helpers.withMessage("Password field cannot be empty", required),
    minLength: minLength(8),
    maxLength: maxLength(24),
    validPassword: helpers.withMessage(
      "Password must include UPPER/lowercase characters and number",
      validPassword
    ),
    specialPassword: helpers.withMessage(
      "Password must contain at least 1 of the special  characters @&!-%#$%",
      specialPassword
    ),
  },
  confirmPassword: {
    required: helpers.withMessage(
      "Confirm Password field cannot be empty",
      required
    ),
    minLength: minLength(8),
    maxLength: maxLength(24),
    validPassword: helpers.withMessage(
      "Confirm Password is invalid",
      validPassword
    ),
    samePassword: helpers.withMessage("Passwords do not match!", samePassword),
  },
};

const invalidCredentials = ref(false);
const v$ = useVuelidate(rules, form);
const isShowingPasword = ref(false);

async function handleSubmit() {
  const validity = await v$.value.$validate();
  if (!validity) return;
  isLoading.value = true;

  registerInvitedUser(form)
    .then((res) => {
      if (res.status === 200) {
        toast.info("Registration successful");

        window.location.href = `/auth/login`;
      }
    })

    .catch((err) => {
      invalidCredentials.value = true;
      isLoading.value = false;

      toast.error(err?.response?.data?.Message);
    });
}
</script>
