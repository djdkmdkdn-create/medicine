<script setup>
const { t } = useI18n();
const appointmentsStore = useAppointmentsStore();
const authStore = useAuthStore();

const props = defineProps({
  doctor: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "booked"]);

const selectedDate = ref("");
const selectedTime = ref("");
const error = ref("");
const submitting = ref(false);

const availableDates = computed(() => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const closeModal = () => {
  selectedDate.value = "";
  selectedTime.value = "";
  error.value = "";
  emit("close");
};

const handleSubmit = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    error.value = t("validation.required");
    return;
  }

  submitting.value = true;
  error.value = "";

  const result = await appointmentsStore.createAppointment({
    doctorId: props.doctor.id,
    doctorName: props.doctor.name,
    doctorType: props.doctor.type,
    date: selectedDate.value,
    time: selectedTime.value,
  });

  submitting.value = false;

  if (result.success) {
    emit("booked", result.appointment);
    closeModal();
  } else if (result.error === "already_booked") {
    error.value = t("appointments.alreadyBooked");
  } else {
    error.value = result.error;
  }
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      selectedDate.value = "";
      selectedTime.value = "";
      error.value = "";
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          @click="closeModal"
        ></div>

        <!-- Modal -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95 -translate-y-10"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-10"
        >
          <div
            v-if="isOpen"
            class="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <!-- Header -->
            <div
              class="relative p-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
            >
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"
              ></div>

              <button
                @click="closeModal"
                class="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div class="flex items-center gap-4">
                <div class="relative">
                  <img
                    :src="doctor.image"
                    :alt="doctor.name"
                    class="w-20 h-20 rounded-2xl object-cover border-3 border-white/30 shadow-xl"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div class="text-white">
                  <h2 class="text-lg font-bold mb-0.5">{{ doctor.name }}</h2>
                  <p class="text-sm text-white/80 font-medium">
                    {{ t(`filter.${doctor.type.toLowerCase()}`) }}
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <div
                      class="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ doctor.experience }} yrs
                    </div>
                    <div
                      class="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      ${{ doctor.price }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">
              <!-- Date selection -->
              <div>
                <label
                  class="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"
                >
                  <div
                    class="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {{ t("appointments.selectDate") }}
                </label>
                <input
                  v-model="selectedDate"
                  type="date"
                  class="input font-medium"
                  :disabled="submitting"
                  :min="new Date().toISOString().split('T')[0]"
                  max="1/1/2027"
                />
              </div>

              <!-- Time selection -->
              <div>
                <label
                  class="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"
                >
                  <div
                    class="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  {{ t("appointments.selectTime") }}
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="time in doctor.availableTimes"
                    :key="time"
                    type="button"
                    @click="selectedTime = time"
                    :disabled="submitting"
                    class="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    :class="
                      selectedTime === time
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-teal-200/50'
                        : 'bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    "
                  >
                    {{ time }}
                  </button>
                </div>
              </div>

              <!-- Error -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div
                  v-if="error"
                  class="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl text-rose-600 text-sm flex items-center gap-3 border border-rose-100"
                >
                  <div
                    class="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  {{ error }}
                </div>
              </Transition>
            </div>

            <!-- Footer -->
            <div
              class="p-6 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100 flex gap-3"
            >
              <button
                @click="closeModal"
                :disabled="submitting"
                class="flex-1 btn-secondary py-3.5"
              >
                {{ t("modal.close") }}
              </button>
              <button
                @click="handleSubmit"
                :disabled="submitting || !selectedDate || !selectedTime"
                class="flex-1 btn-primary py-3.5"
              >
                <span
                  v-if="submitting"
                  class="flex items-center justify-center gap-2"
                >
                  <svg
                    class="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 017 12H3c0 2.042.712 3.982 2 5.291z"
                    ></path>
                  </svg>
                  {{ t("loading.booking") }}
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ t("appointments.confirm") }}
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
