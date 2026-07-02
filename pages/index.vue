<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const appointmentsStore = useAppointmentsStore()
const doctorsStore = useDoctorsStore()

const modalOpen = ref(false)
const selectedDoctor = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })

const openBookingModal = async (doctor) => {
  if (!authStore.isAuthenticated) {
    showToast(t('validation.required'), 'error')
    navigateTo('/login')
    return
  }
  selectedDoctor.value = doctor
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedDoctor.value = null
}

const handleBooked = () => {
  showToast(t('appointments.bookedSuccess'), 'success')
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
  if (authStore.isAuthenticated) {
    await appointmentsStore.fetchAppointments()
  }
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="closeToast"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Doctors Section -->
      <div class="lg:col-span-2 space-y-6">
        <div class="text-center lg:text-left mb-8">
          <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ t('home.welcome') }}</h1>
          <p class="text-slate-600">{{ t('home.subtitle') }}</p>
        </div>

        <!-- Filter -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <DoctorFilter />
        </div>

        <!-- Doctors Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DoctorCard
            v-for="doctor in doctorsStore.filteredDoctors"
            :key="doctor.id"
            :doctor="doctor"
            @book="openBookingModal"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="doctorsStore.filteredDoctors.length === 0"
          class="text-center py-12"
        >
          <p class="text-slate-600">{{ t('home.findDoctor') }}</p>
        </div>
      </div>

      <!-- Appointments Sidebar -->
      <div class="lg:col-span-1">
        <AppointmentSidebar @cancel="handleCancel" />
      </div>
    </div>

    <!-- Booking Modal -->
    <AppointmentModal
      v-if="selectedDoctor"
      :doctor="selectedDoctor"
      :is-open="modalOpen"
      @close="closeModal"
      @booked="handleBooked"
    />
  </main>
</template>
