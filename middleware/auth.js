export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()

  await authStore.initAuth()

  if (!authStore.user) {
    return navigateTo(
      `${localePath('/login')}?redirect=${encodeURIComponent(to.fullPath)}`
    )
  }
})