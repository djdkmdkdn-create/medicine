<script setup>
const { t } = useI18n()
const appointmentsStore = useAppointmentsStore()
const authStore = useAuthStore()

const emit = defineEmits(['cancel'])

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

const handleCancel = (appointment) => {
  emit('cancel', appointment)
}

const specialtyGradients = {
  cardiologist: 'from-rose-400 to-pink-500',
  pediatrician: 'from-amber-400 to-orange-500',
  dermatologist: 'from-violet-400 to-purple-500',
  neurologist: 'from-blue-400 to-indigo-500',
  orthopedist: 'from-emerald-400 to-teal-500',
  psychiatrist: 'from-cyan-400 to-blue-500',
  ophthalmologist: 'from-fuchsia-400 to-pink-500'
}

const getGradient = (type) => {
  return specialtyGradients[type?.toLowerCase()] || 'from-emerald-400 to-teal-500'
}
</script>

<template>
  <div class="card h-full relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

    <div class="relative">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800">{{ t('appointments.title') }}</h2>
              <p class="text-xs text-slate-400" v-if="appointmentsStore.appointments.length">
                {{ appointmentsStore.appointments.length }} upcoming
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="appointmentsStore.loading" class="p-5 space-y-4">
        <div class="skeleton h-28 w-full"></div>
        <div class="skeleton h-28 w-full"></div>
        <div class="skeleton h-28 w-full"></div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!authStore.isAuthenticated || appointmentsStore.appointments.length === 0"
        class="p-10 text-center"
      >
        <div class="relative mb-6">
          <div class="w-28 h-28 mx-auto bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="absolute top-0 right-1/2 translate-x-12 w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <p class="text-slate-600 font-semibold mb-2">{{ t('appointments.empty') }}</p>
        <p class="text-sm text-slate-400 leading-relaxed">{{ t('appointments.emptyDesc') }}</p>
      </div>

      <!-- Appointments list -->
      <div v-else class="p-4 max-h-[500px] overflow-y-auto">
        <TransitionGroup
          name="list"
          tag="div"
          class="space-y-3"
        >
          <div
            v-for="(appointment, index) in appointmentsStore.appointments"
            :key="appointment.id"
            class="relative group p-4 bg-gradient-to-r from-white to-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300"
          >
            <!-- Left accent bar -->
            <div class="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b" :class="getGradient(appointment.doctorType)"></div>

            <div class="flex items-start justify-between mb-3 pl-3">
              <div>
                <h3 class="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{{ appointment.doctorName }}</h3>
                <p class="text-sm font-medium mt-0.5" :class="`bg-gradient-to-r ${getGradient(appointment.doctorType)} bg-clip-text text-transparent`">
                  {{ t(`filter.${appointment.doctorType.toLowerCase()}`) }}
                </p>
              </div>
              <button
                @click="handleCancel(appointment)"
                class="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-3 pl-3">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-semibold text-emerald-700">{{ formatDate(appointment.date) }}</span>
              </div>
              <div class="flex items-center gap-2 px-3 py-1.5 bg-teal-50/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs font-semibold text-teal-700">{{ appointment.time }}</span>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.list-leave-active {
  position: absolute;
}
</style>
