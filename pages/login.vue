<script setup>
const { t } = useI18n();
const authStore = useAuthStore();
const route = useRoute();

const form = ref({
  email: "",
  password: "",
});

const errors = ref({});
const loading = ref(false);
const errorMessage = ref("");
const localePath = useLocalePath();

const validateForm = () => {
  errors.value = {};

  if (!form.value.email) {
    errors.value.email = t("validation.required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = t("validation.invalidEmail");
  }

  if (!form.value.password) {
    errors.value.password = t("validation.required");
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await authStore.login(form.value.email, form.value.password);

    if (result.success) {
      console.log("Login successful, redirecting...");
      const redirect = route.query.redirect || "/";
      // Use window.location for a clean page reload to sync auth state
      window.location.href = redirect;
    } else {
      errorMessage.value = t("auth.loginError");
      loading.value = false;
    }
  } catch (e) {
    console.error("Login error:", e);
    errorMessage.value = t("auth.loginError");
    loading.value = false;
  }
};
</script>

<template>
  <main
    class="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12"
  >
    <!-- Background decorations -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute w-96 h-96 bg-gradient-to-br from-emerald-300/40 to-teal-300/40 rounded-full blur-3xl top-1/4 -left-48"
      ></div>
      <div
        class="absolute w-80 h-80 bg-gradient-to-br from-cyan-300/30 to-blue-300/30 rounded-full blur-3xl bottom-1/4 -right-40"
      ></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="card p-8 md:p-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="relative inline-flex mb-5">
            <div
              class="w-20 h-20 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-300/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <h1
            class="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2"
          >
            {{ t("auth.loginTitle") }}
          </h1>
          <p class="text-slate-500 text-sm">Welcome back to MyDoctor</p>
        </div>

        <!-- Error Message -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="errorMessage"
            class="mb-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/50 rounded-2xl text-rose-600 text-sm flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {{ errorMessage }}
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              {{ t("auth.email") }}
            </label>
            <div class="relative">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                :placeholder="t('auth.email')"
                class="w-full px-4 py-3.5 pl-12 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 focus:bg-white transition-all duration-200"
                :class="{ 'border-rose-300 focus:ring-rose-400': errors.email }"
              />
            </div>
            <p
              v-if="errors.email"
              class="mt-2 text-sm text-rose-500 font-medium"
            >
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              {{ t("auth.password") }}
            </label>
            <div class="relative">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                v-model="form.password"
                type="password"
                :placeholder="t('auth.password')"
                class="w-full px-4 py-3.5 pl-12 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 focus:bg-white transition-all duration-200"
                :class="{
                  'border-rose-300 focus:ring-rose-400': errors.password,
                }"
              />
            </div>
            <p
              v-if="errors.password"
              class="mt-2 text-sm text-rose-500 font-medium"
            >
              {{ errors.password }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full inline-flex items-center justify-center px-5 py-3.5 font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-3">
              <svg
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 017 12H3c0 2.042.712 3.982 2 5.291z"
                ></path>
              </svg>
              {{ t("loading.loading") }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              {{ t("auth.loginBtn") }}
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-slate-500">
            {{ t("auth.noAccount") }}
            <NuxtLink
              :to="localePath('/register')"
              class="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-500 hover:to-teal-500 transition-all ml-1"
            >
              {{ t("auth.registerBtn") }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
