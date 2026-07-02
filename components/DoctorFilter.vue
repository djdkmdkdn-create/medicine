<script setup>
const { t } = useI18n()
const doctorsStore = useDoctorsStore()

const selectFilter = (type) => {
  if (type === null) {
    doctorsStore.clearFilter()
  } else {
    doctorsStore.setFilter(type)
  }
}

// Icons for each specialty - prevents text wrapping issues
const specialtyIcons = {
  Cardiologist: { icon: '❤️', gradient: 'from-rose-400 to-pink-500' },
  Pediatrician: { icon: '👶', gradient: 'from-amber-400 to-orange-500' },
  Dermatologist: { icon: '🧴', gradient: 'from-violet-400 to-purple-500' },
  Neurologist: { icon: '🧠', gradient: 'from-blue-400 to-indigo-500' },
  Orthopedist: { icon: '🦴', gradient: 'from-emerald-400 to-teal-500' },
  Psychiatrist: { icon: '🧘', gradient: 'from-cyan-400 to-blue-500' },
  Ophthalmologist: { icon: '👁️', gradient: 'from-fuchsia-400 to-pink-500' }
}

const getSpecialtyStyle = (type) => {
  return specialtyIcons[type] || { icon: '⚕️', gradient: 'from-emerald-400 to-teal-500' }
}
</script>

<template>
  <!-- Fixed layout filter buttons using grid with min-width to prevent jumping -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
    <!-- "All" button -->
    <button
      @click="selectFilter(null)"
      class="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 min-w-[120px]"
      :class="doctorsStore.selectedType === null
        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50'
        : 'bg-white/70 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md border border-slate-200/50'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      <span class="truncate">{{ t('filter.all') }}</span>
    </button>

    <!-- Specialty buttons with fixed layout -->
    <button
      v-for="type in doctorsStore.types"
      :key="type"
      @click="selectFilter(type)"
      class="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 min-w-[120px]"
      :class="doctorsStore.selectedType === type
        ? `bg-gradient-to-r ${getSpecialtyStyle(type).gradient} text-white shadow-lg`
        : 'bg-white/70 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md border border-slate-200/50'"
    >
      <span class="text-base flex-shrink-0">{{ getSpecialtyStyle(type).icon }}</span>
      <span class="truncate">{{ t(`filter.${type.toLowerCase()}`) }}</span>
    </button>
  </div>
</template>
