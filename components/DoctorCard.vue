<script setup>
const { t } = useI18n()

const props = defineProps({
  doctor: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['book'])

const specialtyColors = {
  cardiologist: 'from-rose-400 to-pink-500',
  pediatrician: 'from-amber-400 to-orange-500',
  dermatologist: 'from-violet-400 to-purple-500',
  neurologist: 'from-blue-400 to-indigo-500',
  orthopedist: 'from-emerald-400 to-teal-500',
  psychiatrist: 'from-cyan-400 to-blue-500',
  ophthalmologist: 'from-fuchsia-400 to-pink-500'
}

const specialtyBg = computed(() => {
  return specialtyColors[props.doctor.type.toLowerCase()] || 'from-emerald-400 to-teal-500'
})
</script>

<template>
  <div class="card-hover group relative overflow-visible">
    
    <div class="absolute -top-3 -right-3 z-10">
      <div class="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-200/50 rotate-12 group-hover:rotate-0 transition-transform duration-500">
        <span class="text-white font-bold text-sm">${{ doctor.price }}</span>
      </div>
    </div>

    <div class="relative pb-4">
      <div class="absolute inset-0 bg-gradient-to-br" :class="specialtyBg" style="opacity: 0.1;"></div>
      <div class="relative overflow-hidden rounded-t-3xl">
        <img
          :src="doctor.image"
          :alt="doctor.name"
          class="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 pb-5 -mt-8 relative">
      <!-- Specialty tag -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 shadow-sm"
           :class="`bg-gradient-to-r ${specialtyBg} text-white`">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        {{ t(`filter.${doctor.type.toLowerCase()}`) }}
      </div>

      <h3 class="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
        {{ doctor.name }}
      </h3>

      <div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <div class="flex items-center gap-1.5 bg-gradient-to-r from-slate-50 to-white px-3 py-1.5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">{{ doctor.experience }} {{ t('doctors.experience', { years: '' }).trim() }}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-gradient-to-r from-slate-50 to-white px-3 py-1.5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="font-medium">{{ doctor.age }} yrs</span>
        </div>
      </div>

      <div class="mb-5">
        <p class="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">{{ t('doctors.available') }}</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="time in doctor.availableTimes.slice(0, 4)"
            :key="time"
            class="px-2.5 py-1 bg-gradient-to-r from-slate-50 to-white text-slate-600 text-xs font-medium rounded-lg border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50/50 transition-all duration-300"
          >
            {{ time }}
          </span>
          <span
            v-if="doctor.availableTimes.length > 4"
            class="px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 text-xs font-semibold rounded-lg border border-emerald-100"
          >
            +{{ doctor.availableTimes.length - 4 }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('book', doctor)"
        class="w-full btn-primary text-sm py-3 group-hover:shadow-xl group-hover:shadow-emerald-200/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ t('doctors.book') }}
      </button>
    </div>
  </div>
</template>
