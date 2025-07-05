<template>
  <div class="flex items-center justify-center">
    <div :data-sitekey="siteKey" ref="turnstile"></div>
    <span v-if="error" class="text-red-500">{{ error }}</span>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const turnstile = ref(null)
const props = defineProps({
  siteKey: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const token = ref('')
const error = ref('')

const renderTurnstile = () => {
  if (!window.turnstile) {
    error.value = 'Turnstile script not loaded'
    emit('update:modelValue', null)
    return
  }

  try {
    window.turnstile.render(turnstile.value, {
      sitekey: props.siteKey,
      callback: (response) => {
        token.value = response
        error.value = null
        emit('update:modelValue', token.value)
      },
      'error-callback': (error) => {
        error.value = error
        emit('update:modelValue', null)
      },
      'expired-callback': () => {
        error.value = 'Turnstile expired'
        emit('update:modelValue', null)
      },
    })
  } catch (error) {
    error.value = error.message || 'Failed to render Turnstile'
    emit('update:modelValue', null)
  }
}

onMounted(() => {
  renderTurnstile()
})

onUnmounted(() => {
  window.turnstile.remove(turnstile.value)
})
</script>
