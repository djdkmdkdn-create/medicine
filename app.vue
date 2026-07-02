<script setup>
const { locale } = useI18n()
const authStore = useAuthStore()

useHead({
  title: 'MyDoctor - Medical Appointments',
  meta: [
    { name: 'description', content: 'Book appointments with the best doctors in your area' }
  ],
  htmlAttrs: {
    lang: locale
  }
})


onMounted(async () => {
  await authStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
    <Navbar />
    <NuxtPage />
  </div>
</template>
