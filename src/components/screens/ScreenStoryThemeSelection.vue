<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-2xl card flex flex-col items-center">
        <h2 class="text-3xl font-semibold text-center mb-4">
          Perfect! Now what kind of adventure should {{ name }} have?
        </h2>

        <div class="grid options-grid grid-cols-4 gap-4 w-full mb-6">
          <div
              v-for="opt in options"
              :key="opt.value"
              @click="select(opt)"
              :class="[
              'w-full p-6 rounded-xl bg-gray-100 cursor-pointer text-center transition transform',
              selectedGenre.value == opt.value
                ? 'border-orange-500 border-2 scale-105 shadow'
                : 'hover:-translate-y-1'
            ]"
          >
            <span class="text-6xl mb-2 block text-center">{{ opt.icon }}</span>
            <div class="font-base text-gray-500 text-sm">{{ opt.label }}</div>
          </div>
        </div>

        <input
            v-if="selectedGenre.value === 'custom'"
            v-model="customTheme"
            type="text"
            placeholder="Enter your custom theme"
            class="w-full mb-4 p-3 rounded-lg border"
        />

        <button
            :disabled="isDisabled"
            @click="saveGenre"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg shadow disabled:opacity-50 transition"
        >
          Continue
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { canContinueStories, getInformation, submitStoryDetail } from '@/services/api.ts'

const selectedGenre = ref<{ value: string; label: string }>({ value: '', label: '' })
const customTheme = ref('')
const name = ref<string | null>(null)
const router = useRouter()
const jobId = ref<number>()
const route = useRoute()

onMounted(async () => {
  const raw = route.query.job_id
  jobId.value = Array.isArray(raw) ? Number(raw[0]) : Number(raw)

  if (!jobId.value) {
    await router.push('/story/setup')
    return
  }

  name.value = (await getInformation(jobId.value)).name

  const { available_stories } = await canContinueStories()
  if (available_stories == 0) await router.push('/pricing')
})

const options = [
  { value: 'fantasy', label: 'Fantasy & Magic', icon: '🦄' },
  { value: 'epic', label: 'Epic Adventure', icon: '🌄' },
  { value: 'mystery', label: 'Mystery & Detective', icon: '🕵️‍♂️' },
  { value: 'fun', label: 'Comedy & Fun', icon: '😜' },
  { value: 'cozy', label: 'Cozy & Heartwarming', icon: '🏡' },
  { value: 'bedtime', label: 'Peaceful Bedtime', icon: '😴' },
  { value: 'growth', label: 'Inspiring & Growth', icon: '🧠' },
  { value: 'custom', label: 'Custom Theme', icon: '🎨' },
]

function select(value: { value: string; label: string }) {
  selectedGenre.value.value = value.value
  selectedGenre.value.label = value.label
}

const isDisabled = computed(() => {
  if (selectedGenre.value.value === '') return true
  if (selectedGenre.value.value === 'custom') return customTheme.value.trim() === ''
  return false
})

async function saveGenre() {
  const { available_stories } = await canContinueStories()

  if (available_stories == 0) {
    await router.push({ path: '/pricing', query: { job_id: String(jobId.value) } })
    return
  }

  const label =
      selectedGenre.value.value === 'custom' ? customTheme.value.trim() : selectedGenre.value.label

  localStorage.setItem('genre', label)
  await submitStoryDetail({
    job_id: jobId.value ?? -1,
    field_name: 'story_theme',
    value: label,
  })

  await router.push({ path: '/story/message', query: { job_id: String(jobId.value) } })
}
</script>

<style scoped>
@media (max-aspect-ratio: 1/1) {
  .options-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
