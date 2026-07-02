export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Get Firestore instance lazily to avoid calling useNuxtApp outside setup context
  const getFirestore = () => {
    const { $firestore } = useNuxtApp()
    return $firestore
  }

  const fetchAppointments = async () => {
    const authStore = useAuthStore()
    if (!authStore.user?.uid) {
      console.log('fetchAppointments: No user, skipping')
      return
    }

    loading.value = true
    error.value = null

    try {
      const firestore = getFirestore()
      const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore')

      console.log('fetchAppointments: Fetching for user', authStore.user.uid)

      const q = query(
        collection(firestore, 'appointments'),
        where('userId', '==', authStore.user.uid),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      appointments.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('fetchAppointments: Found', appointments.value.length, 'appointments')
    } catch (e) {
      console.error('fetchAppointments error:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const createAppointment = async (appointmentData) => {
    const authStore = useAuthStore()

    if (!authStore.user?.uid) {
      console.error('createAppointment: No user logged in')
      return { success: false, error: 'not_authenticated' }
    }

    loading.value = true
    error.value = null

    try {
      const firestore = getFirestore()
      const { collection, addDoc, query, where, getDocs } = await import('firebase/firestore')

      console.log('createAppointment: Checking for duplicates...', appointmentData)

      // Check for existing appointment with same doctor, date, time
      const existingQuery = query(
        collection(firestore, 'appointments'),
        where('userId', '==', authStore.user.uid),
        where('doctorId', '==', appointmentData.doctorId),
        where('date', '==', appointmentData.date),
        where('time', '==', appointmentData.time)
      )

      const existingSnapshot = await getDocs(existingQuery)
      if (!existingSnapshot.empty) {
        console.log('createAppointment: Duplicate appointment found')
        loading.value = false
        return { success: false, error: 'already_booked' }
      }

      console.log('createAppointment: Creating new appointment...')

      // Create the appointment
      const docRef = await addDoc(collection(firestore, 'appointments'), {
        ...appointmentData,
        userId: authStore.user.uid,
        createdAt: new Date().toISOString()
      })

      console.log('createAppointment: Created with ID', docRef.id)

      const newAppointment = {
        id: docRef.id,
        ...appointmentData,
        userId: authStore.user.uid,
        createdAt: new Date().toISOString()
      }

      // Add to local state immediately for instant UI update
      appointments.value.unshift(newAppointment)

      loading.value = false
      return { success: true, appointment: newAppointment }
    } catch (e) {
      console.error('createAppointment error:', e)
      error.value = e.message
      loading.value = false
      return { success: false, error: e.message }
    }
  }

  const cancelAppointment = async (appointmentId) => {
    loading.value = true
    error.value = null

    try {
      const firestore = getFirestore()
      const { doc, deleteDoc } = await import('firebase/firestore')

      console.log('cancelAppointment: Deleting', appointmentId)

      await deleteDoc(doc(firestore, 'appointments', appointmentId))

      appointments.value = appointments.value.filter(a => a.id !== appointmentId)

      loading.value = false
      return { success: true }
    } catch (e) {
      console.error('cancelAppointment error:', e)
      error.value = e.message
      loading.value = false
      return { success: false, error: e.message }
    }
  }

  const hasAppointmentAt = (date, time) => {
    return appointments.value.some(a => a.date === date && a.time === time)
  }

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    hasAppointmentAt
  }
})
