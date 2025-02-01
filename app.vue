<template>
  <!-- <NuxtLayout> -->
  <NuxtPwaManifest />
  <NuxtPage />
  <!-- </NuxtLayout> -->
</template>
<script setup>
useHead(
  {
    script: [
      {
        src: "https://sdk.monnify.com/plugin/monnify.js",

        defer: true,
      },
      {
        src: "https://kit.fontawesome.com/c1a534ffdb.js",
        crossorigin: "anonymous",
        defer: true,
      },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://unicons.iconscout.com/release/v4.0.0/css/line.css",
      },
    ],
  },
  {
    mode: "client", // Load the script 'strict-dynamically' on client-side only
  }
);

onMounted(() => {
const authStore =  useAuthStore();
const dt = {"id":"5e7d60e2-36f3-407f-9d86-9d44ddfed6de","businessId":"eb48a616-bccd-413c-b0bf-bd659da1606e","email":"successahon+test1@yopmail.com","roles":null,"fullName":"Jet Pers","firstName":"Jet","lastName":"Pers","phoneNumber":"+234-8160713774","jwToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdWNjZXNzYWhvbit0ZXN0MUB5b3BtYWlsLmNvbSIsImp0aSI6IjljYzkwZTJjLWY0ZTYtNGFlNC1iNjZlLTcwNGM3MDM1MzllYiIsImVtYWlsIjoic3VjY2Vzc2Fob24rdGVzdDFAeW9wbWFpbC5jb20iLCJ1c2VyQ2F0ZWdvcnkiOiIiLCJ1aWQiOiI1ZTdkNjBlMi0zNmYzLTQwN2YtOWQ4Ni05ZDQ0ZGRmZWQ2ZGUiLCJpcCI6IjE3Mi4zMS4yMC4xNzgiLCJyb2xlIjoiIiwiU1NPQnVzaW5lc3NJZCI6ImViNDhhNjE2LWJjY2QtNDEzYy1iMGJmLWJkNjU5ZGExNjA2ZSIsIkxvZ2luVGltZSI6IjIvMS8yMDI1IDM6NTg6MjIgUE0iLCJleHAiOjE3Mzg0NDcxMDIsImlzcyI6IkNvcmVJZGVudGl0eSIsImF1ZCI6IkNvcmVJZGVudGl0eVVzZXIifQ.c6cR_9IIKfVPjMISPuUUX-RsYon_KHfv1DyAzQpX16E","companyName":"RayBan Tefchr","refreshToken":"0A492F22619BE4E1E351709B28FB14453B53E26DBB56A9F5B115061A26849777AF1AF27B06C86D8B","onboardingPageStatus":0,"userCategory":null,"isVerified":true,"is2FA":true,"hasCompleteBusinessProfile":false,"subApps":[1,3],"lastLogin":"2025-02-01T15:58:22.8371648Z","access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdWNjZXNzYWhvbit0ZXN0MUB5b3BtYWlsLmNvbSIsImp0aSI6IjljYzkwZTJjLWY0ZTYtNGFlNC1iNjZlLTcwNGM3MDM1MzllYiIsImVtYWlsIjoic3VjY2Vzc2Fob24rdGVzdDFAeW9wbWFpbC5jb20iLCJ1c2VyQ2F0ZWdvcnkiOiIiLCJ1aWQiOiI1ZTdkNjBlMi0zNmYzLTQwN2YtOWQ4Ni05ZDQ0ZGRmZWQ2ZGUiLCJpcCI6IjE3Mi4zMS4yMC4xNzgiLCJyb2xlIjoiIiwiU1NPQnVzaW5lc3NJZCI6ImViNDhhNjE2LWJjY2QtNDEzYy1iMGJmLWJkNjU5ZGExNjA2ZSIsIkxvZ2luVGltZSI6IjIvMS8yMDI1IDM6NTg6MjIgUE0iLCJleHAiOjE3Mzg0NDcxMDIsImlzcyI6IkNvcmVJZGVudGl0eSIsImF1ZCI6IkNvcmVJZGVudGl0eVVzZXIifQ.c6cR_9IIKfVPjMISPuUUX-RsYon_KHfv1DyAzQpX16E"}
authStore.saveAuthUser(dt)
});
</script>

<style>
html {
  scroll-behavior: smooth;
  box-sizing: border-box;
}
body {
  font-family: "Rubik", sans-serif;
  color: #475467;
}

.dark-mode {
  @apply text-white bg-gray-800;
}

.light-mode {
  @apply text-[#475467] bg-white;
}

.recommended .carousel__viewport .carousel__track {
  column-gap: 24px;
  @media (max-width: 768px) {
    column-gap: 16px;
  }
  @media (max-width: 465px) {
    column-gap: 10px;
  }
  .carousel__prev {
    left: -26px !important;
  }
  .carousel__next {
    right: -26px !important;
  }
}
.carousel__viewport .carousel__track {
  column-gap: 34px;
  @media (max-width: 768px) {
    column-gap: 16px;
  }
  @media (max-width: 465px) {
    column-gap: 10px;
  }
}
.carousel__prev {
  left: -26px !important;
}
.carousel__next {
  right: -26px !important;
}
body::-webkit-scrollbar,
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffff;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ececec;
  border-radius: 8px;
  height: 100px;
}

::-webkit-scrollbar:horizontal {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track:horizontal {
  background: #ffffff;
}

/* Handle */
::-webkit-scrollbar-thumb:horizontal {
  background: #ececec;
  width: 50px;
  border-radius: 8px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  opacity: 0.9;
}
label,
.input-label {
  color: #344054 !important;
  font-size: 14px;
}
</style>
