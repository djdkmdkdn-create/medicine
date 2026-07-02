<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const isMobileMenuOpen = ref(false)

const navLinks = computed(() => [
  {
    name: t('nav.home'),
    path: localePath('/'),
    icon: 'home'
  },
  {
    name: t('nav.appointments'),
    path: localePath('/appointments'),
    icon: 'calendar'
  }
])

const isActive = (path) => {
  return route.path === path
}

const handleLogout = async () => {
  await authStore.logout()
  isMobileMenuOpen.value = false
  router.push(localePath('/'))
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-50 glass border-b border-white/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-18 py-3">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200/50 group-hover:shadow-xl group-hover:shadow-teal-300/50 transition-all duration-300 group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-extrabold gradient-text tracking-tight">MyDoctor</span>
            <span class="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Healthcare Platform</span>
          </div>
        </NuxtLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="flex items-center gap-2 text-sm font-semibold transition-all duration-300 px-4 py-2.5 rounded-xl"
            :class="isActive(link.path)
              ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 shadow-inner'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'"
          >
            <svg v-if="link.icon === 'home'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-if="link.icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- Desktop Right Section -->
        <div class="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          <div class="w-px h-8 bg-slate-200/50"></div>

          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white rounded-2xl px-3 py-1.5 border border-slate-100">
              <div class="w-9 h-9 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-200/30">
                {{ authStore.user?.email?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm text-slate-600 font-medium max-w-[120px] truncate">{{ authStore.user?.email?.split('@')[0] }}</span>
              <button
                @click="handleLogout"
                class="p-2 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink :to="localePath('/login')" class="btn-primary text-sm px-5 py-2.5">
              {{ t('nav.login') }}
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2.5 rounded-xl bg-white/50 hover:bg-white text-slate-600 hover:text-emerald-600 transition-all duration-200"
          aria-label="Toggle menu"
        >
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden glass border-t border-white/20">
        <div class="px-4 py-5 space-y-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200"
            :class="isActive(link.path)
              ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'"
          >
            <svg v-if="link.icon === 'home'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-if="link.icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ link.name }}
          </NuxtLink>

          <div class="pt-4 pb-2 border-t border-slate-200/30 mt-4">
            <div class="px-4 py-2 mb-3">
              <LanguageSwitcher />
            </div>

            <template v-if="authStore.isAuthenticated">
              <div class="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-white rounded-2xl mx-1">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-200/30">
                  {{ authStore.user?.email?.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm text-slate-600 font-medium truncate max-w-[180px]">{{ authStore.user?.email }}</span>
              </div>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-5 py-3.5 mt-2 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-200 font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {{ t('nav.logout') }}
              </button>
            </template>
            <template v-else>
              <NuxtLink
  :to="localePath('/login')"
  @click="closeMobileMenu"
  class="block w-full text-center btn-primary mt-3 py-3.5"
>
                {{ t('nav.login') }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>
