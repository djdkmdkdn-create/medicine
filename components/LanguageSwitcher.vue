<script setup>
import { onClickOutside } from '@vueuse/core'

const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)
const dropdownRef = ref(null)

// Locale data with flags
const localeData = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' }
]

const currentLocale = computed(() => {
  return localeData.find(l => l.code === locale.value) || localeData[0]
})

// Select locale and persist via i18n's built-in cookie handling
const selectLocale = (code) => {
  setLocale(code)
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 hover:bg-white border border-slate-200/50 transition-all duration-200 hover:shadow-md"
      :aria-label="$t('language.select')"
    >
      <span class="text-lg">{{ currentLocale.flag }}</span>
      <span class="text-sm font-semibold text-slate-600 hidden sm:inline">{{ currentLocale.name }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 overflow-hidden"
      >
        <button
          v-for="loc in localeData"
          :key="loc.code"
          @click="selectLocale(loc.code)"
          class="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
          :class="locale === loc.code
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700'
            : 'text-slate-600 hover:bg-slate-50'"
        >
          <span class="text-xl">{{ loc.flag }}</span>
          <span class="font-medium">{{ loc.name }}</span>
          <svg v-if="locale === loc.code" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-auto text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>
