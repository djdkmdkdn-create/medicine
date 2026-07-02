import { doctors, doctorTypes } from '~/data/doctors'

export const useDoctorsStore = defineStore('doctors', () => {
  const allDoctors = ref(doctors)
  const types = ref(doctorTypes)
  const selectedType = ref(null)

  const filteredDoctors = computed(() => {
    if (!selectedType.value) {
      return allDoctors.value
    }
    return allDoctors.value.filter(doctor => doctor.type === selectedType.value)
  })

  const setFilter = (type) => {
    selectedType.value = type
  }

  const clearFilter = () => {
    selectedType.value = null
  }

  const getDoctorById = (id) => {
    return allDoctors.value.find(doctor => doctor.id === id)
  }

  return {
    allDoctors,
    types,
    selectedType,
    filteredDoctors,
    setFilter,
    clearFilter,
    getDoctorById
  }
})
