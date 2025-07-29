<!-- src/components/GlobalNotice.vue -->
<template>
  <transition name="notice-fade">
    <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center px-4"
    >
      <div class="absolute inset-0 bg-black/60" />

      <div class="relative w-full max-w-md card bg-white rounded-2xl shadow-xl p-6 sm:p-8 z-[10000]">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-3">
          {{ current.title || 'Attention' }}
        </h2>

        <p class="text-base sm:text-lg text-center mb-8 text-gray-600 whitespace-pre-line">
          {{ current.message }}
        </p>

        <button
            @click="go"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
        >
          Try again
        </button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type NoticeDetail = {
  title?: string
  message: string
  target: string
}

const router = useRouter()
const route = useRoute()

const visible = ref(false)
const current = reactive<NoticeDetail>({
  title: '',
  message: '',
  target: 'first_screen',
})

function go() {
  const raw = route.query.job_id
  const jobId = Array.isArray(raw) ? raw[0] : raw

  if (!jobId) {
    visible.value = false
    router.push('/account')
    return
  }

  switch (current.target) {
    case 'first_screen':
      router.push('/story/setup?job_id=' + jobId);
      break;
    case 'preview':
      router.push('/story/preview?job_id=' + jobId);
      break;
    case 'in_progress':
      router.push('/story/generate?job_id=' + jobId);
      break;
    case 'finished':
      router.push('/story/complete?job_id=' + jobId);
      break;
  }

  visible.value = false
}

function onNotify(e: Event) {
  const ce = e as CustomEvent<NoticeDetail>
  const detail = ce.detail
  if (!detail || !detail.message || !detail.target) return
  current.title = detail.title || ''
  current.message = detail.message
  current.target = detail.target
  visible.value = true
}

onMounted(() => {
  window.addEventListener('koalory:notify', onNotify as EventListener, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('koalory:notify', onNotify as EventListener)
})

/**
 * Dispatch example:
 * window.dispatchEvent(new CustomEvent('koalory:notify', {
 *   detail: {
 *     title: 'Heads up!',
 *     message: 'Your story needs additional input.',
 *     target: 'story_message'
 *   }
 * }))
 */
</script>

<style scoped>
.notice-fade-enter-active,
.notice-fade-leave-active {
  transition: opacity 0.25s ease;
}
.notice-fade-enter-from,
.notice-fade-leave-to {
  opacity: 0;
}
</style>
