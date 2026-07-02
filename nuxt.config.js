export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'uz', name: 'O\'zbek', file: 'uz.json' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    // Persist language preference across sessions
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieSecure: false,
      redirectOn: 'root'
    },
    compilation: {
      strictMessage: false
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.VITE_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.VITE_FIREBASE_APP_ID || ''
    }
  }
})
