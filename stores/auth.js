export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  const getAuth = () => {
    const {
      $auth
    } = useNuxtApp()
    return $auth
  }

  const getFirestore = () => {
    const {
      $firestore
    } = useNuxtApp()
    return $firestore
  }

  const initAuth = async () => {
    if (initialized.value) {
      return true
    }

    const auth = getAuth()
    const {
      onAuthStateChanged
    } = await import('firebase/auth')

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email
          }
        } else {
          user.value = null
        }

        initialized.value = true
        unsubscribe()
        resolve(true)
      })
    })
}
  const register = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const auth = getAuth()
      const firestore = getFirestore()

      const {
        createUserWithEmailAndPassword
      } = await import('firebase/auth')
      const {
        doc,
        setDoc
      } = await import('firebase/firestore')

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date().toISOString()
      })

      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      }

      return {
        success: true
      }
    } catch (e) {
      error.value = e.message
      return {
        success: false,
        error: e.message
      }
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const auth = getAuth()
      const {
        signInWithEmailAndPassword
      } = await import('firebase/auth')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      }

      return {
        success: true
      }
    } catch (e) {
      error.value = e.message
      return {
        success: false,
        error: e.message
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      const auth = getAuth()
      const {
        signOut
      } = await import('firebase/auth')
      await signOut(auth)
      user.value = null
      return {
        success: true
      }
    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    initAuth,
    register,
    login,
    logout
  }
})