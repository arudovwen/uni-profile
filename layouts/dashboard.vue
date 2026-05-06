<template>
  <div class="min-h-screen bg-[#F9FAFB] font-Avenir">
    <!-- Header -->
    <app-header :showlang="false" />
    <!-- Main Content -->
    <main class="px-4 sm:px-6 lg:px-0">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { decrypt } = useEncryption();

const userMenuRef = ref(null);
const isUserMenuOpen = ref(false);

const userAvatar = computed(
  () => authStore.loggedUser?.photo || authStore.loggedUser?.avatar || "",
);
const userInitial = computed(() => {
  const firstName = authStore.loggedUser?.firstName || "";
  const lastName = authStore.loggedUser?.lastName || "";
  if (firstName && lastName) {
    return `${firstName.charAt(0)}`.toUpperCase();
  }
  return firstName.charAt(0).toUpperCase() || "U";
});

const userName = computed(() => {
  const firstName = authStore.loggedUser?.firstName || "";
  const lastName = authStore.loggedUser?.lastName || "";
  return `${firstName} ${lastName}`.trim() || "User";
});

const userEmail = computed(() => {
  const encryptedEmail = authStore.loggedUser?.email || "";
  if (!encryptedEmail) return "";
  try {
    return decrypt(encryptedEmail) || encryptedEmail;
  } catch {
    return encryptedEmail;
  }
});

const isActiveTab = (tab) => {
  if (tab === "apps") {
    return !route.query.tab || route.query.tab === "apps";
  }
  return route.query.tab === tab;
};

const goToSettings = () => {
  isUserMenuOpen.value = false;
  router.push("/?tab=settings");
};

const handleLogout = async () => {
  isUserMenuOpen.value = false;
  await authStore.logOut();
};

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
