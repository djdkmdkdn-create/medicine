<script setup>
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const appointmentsStore = useAppointmentsStore()
const authStore = useAuthStore()

const toast = ref({ show: false, message: '', type: 'success' })

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

const handleCancel = async (appointment) => {
  const result = await appointmentsStore.cancelAppointment(appointment.id)
  if (result.success) {
    showToast(t('appointments.cancelledSuccess'), 'success')
  } else {
    showToast(result.error, 'error')
  }
}

const showToast = (message, type) => {
  toast.value = { show: true, message, type }
}

const closeToast = () => {
  toast.value.show = false
}

onMounted(async () => {
  await appointmentsStore.fetchAppointments()
})
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="closeToast"
    />

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-800">{{ t('appointments.title') }}</h1>
      <p class="text-slate-600 mt-1">{{ authStore.user?.email }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="appointmentsStore.loading && appointmentsStore.appointments.length === 0" class="space-y-4">
      <div class="skeleton h-32 w-full rounded-2xl"></div>
      <div class="skeleton h-32 w-full rounded-2xl"></div>
      <div class="skeleton h-32 w-full rounded-2xl"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="appointmentsStore.appointments.length === 0" class="text-center py-16">
      <div class="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 mb-2">{{ t('appointments.empty') }}</h2>
      <p class="text-slate-600 mb-6">{{ t('appointments.emptyDesc') }}</p>
      <NuxtLink to="/" class="btn-primary">
        {{ t('home.findDoctor') }}
      </NuxtLink>
    </div>

    <!-- Appointments list -->
    <div v-else class="space-y-4">
      <TransitionGroup
        name="list"
        tag="div"
        class="space-y-4"
      >
        <div
          v-for="appointment in appointmentsStore.appointments"
          :key="appointment.id"
          class="card p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-slate-800">{{ appointment.doctorName }}</h3>
                <p class="text-sm text-blue-600 mb-2">{{ t(`filter.${appointment.doctorType.toLowerCase()}`) }}</p>
                <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(appointment.date) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ appointment.time }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="handleCancel(appointment)"
              class="btn-danger text-sm"
            >
              {{ t('appointments.cancel') }}
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </main>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.list-leave-active {
  position: absolute;
}
</style>
