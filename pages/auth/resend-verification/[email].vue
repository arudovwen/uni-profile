<template>
   <NuxtLayout name="empty">
  <div class="max-w-[500px] mx-auto">
    <div>
      <h1
        v-if="!isSent"
        class="text-[#182230] darks:text-white mb-[10px] text-[28px] font-bold text-left"
      >
        Resend verification
      </h1>
      <div>
        <h1
          class="text-[#182230] darks:text-white mb-[10px] text-[28px] font-bold text-left"
          v-if="isSent"
        >
          Verification email sent!
        </h1>
        <p
          class="font-normal mb-8 pb-3 rounded-lg text-sm lg:text-base"
          v-if="isSent"
        >
          You’ll receive an email if you are registered on our system.
        </p>
        <div class="grid gap-y-[22px] mb-9" v-if="isSent">
          <NuxtLink to="/auth/login">
            <AppButton
              text="Back to login"
              btnClass="btn-primary !py-3 w-full"
            />
          </NuxtLink>
        </div>
      </div>

      <p
        class="mb-[28px] text-sm text-[#666] darks:text-white/80 text-left"
        v-if="!isSent"
      >
        It appears your email hasn't been verified yet, resend a new
        verification link below.
      </p>
      <form @submit.prevent="handleSubmit" v-if="!isSent">
        <div class="mb-10" v-if="!isSent">
          <label
            for=""
            class="mb-2 font-medium text-sm text-[#475467] block text-left"
            >E-mail</label
          >
          <input
            :value="route.params.email"
            class="rounded-lg px-[14px] py-[10px] h-11 w-full border border-[#DCDEE6] placeholder:text-[#B6B7B9] focus:outline-matta-black/20"
            placeholder="E-mail"
            autocomplete="off"
            autofocus="on"
            disabled
            readonly
          />
        </div>

        <div class="grid gap-y-[22px] mb-9" v-if="!isSent">
          <AppButton
            type="submit"
            :isLoading="isLoading"
            :isDisabled="isLoading"
            text="Resend link"
            btnClass="btn-primary !py-3"
          />
        </div>
        <span
          class="flex items-center text-center text-sm text-[#182230] darks:text-white/80 gap-x-1 justify-center"
        >
          Have an account?
          <NuxtLink to="/auth/login" class="font-semibold text-[#2176FF]"
            >Sign in</NuxtLink
          >
        </span>
      </form>
    </div>
  </div>
</NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  middleware: "auth"
});

import useVuelidate from "@vuelidate/core";
import { required, email, helpers, maxLength } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
import { resendVerification } from "~/services/authservices";

const route = useRoute();
const isSent = ref(false);
const form = reactive({
  email: route.params.email,
});
const isLoading = ref(false);

const rules = {
  email: {
    required: helpers.withMessage("Email field cannot be empty", required),
    email: helpers.withMessage("Email is invalid", email),
    maxLength: maxLength(50),
  },
};

const invalidCredentials = ref(false);
const v$ = useVuelidate(rules, form);

async function handleSubmit() {
  const validity = await v$.value.$validate();
  if (!validity) return;
  isLoading.value = true;

  resendVerification(form)
    .then((res) => {
      if (res.status === 200) {
        isSent.value = true;
      }
    })

    .catch((err) => {
      invalidCredentials.value = true;
      isLoading.value = false;

      toast.error(err?.response?.data?.Message, {
        position: "bottom",
      });
    });
}
</script>
