<template>
  <Transition name="toast">
    <div
      v-if="show"
      :class="[
        'fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md',
        'flex items-center gap-3 min-w-[280px]',
        type === 'success' ? 'bg-emerald-500/90 text-white' : '',
        type === 'error' ? 'bg-red-500/90 text-white' : ''
      ]"
    >
      <span v-if="type === 'success'" class="text-xl">&#10003;</span>
      <span v-if="type === 'error'" class="text-xl">&#10007;</span>
      <span class="flex-1 font-medium">{{ message }}</span>
      <button
        @click="$emit('close')"
        class="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <span class="text-lg leading-none">&times;</span>
      </button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'success'
  }
})

defineEmits(['close'])
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
