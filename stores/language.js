export const useLanguageStore = defineStore('language', () => {
  const currentLocale = ref('en')

  const setLocale = (locale) => {
    currentLocale.value = locale
    if (process.client) {
      localStorage.setItem('app_locale', locale)
    }
  }

  const initLocale = () => {
    if (process.client) {
      const savedLocale = localStorage.getItem('app_locale')
      if (savedLocale) {
        currentLocale.value = savedLocale
      }
    }
  }

  return {
    currentLocale,
    setLocale,
    initLocale
  }
})
