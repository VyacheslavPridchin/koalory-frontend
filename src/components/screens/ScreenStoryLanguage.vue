<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-md card">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-2">
          Choose your language
        </h2>

        <p class="text-base sm:text-lg text-center mb-8 text-gray-400">
          Select the language of the generated story.
        </p>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-4 mb-6">
          <div
              role="radiogroup"
              aria-label="Language"
              class="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <label
                v-for="lang in languages"
                :key="lang.code"
                class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors"
            >
              <input
                  type="radio"
                  class="mt-1 w-5 h-5 accent-orange-600"
                  v-model="selected"
                  :value="lang.code"
                  :aria-label="lang.label"
                  required
              />
              <div class="flex flex-col">
                <span class="text-base font-semibold text-gray-800">{{ lang.label }}</span>
                <span class="text-xs text-gray-400 uppercase tracking-wider">{{ lang.code }}</span>
              </div>
            </label>
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            Save language
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {canContinueStories, submitStoryDetail} from "@/services/api.ts";

type Lang = { code: 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt'; label: string }

const router = useRouter()
const route = useRoute()
const jobId = ref<number>()

const languages: Lang[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
]

const selected = ref<Lang['code']>('en')
const loading = ref(false)
const saved = ref(false)

function getLangLabel(code: Lang['code']): string {
  return languages.find(l => l.code === code)?.label ?? code
}

async function onSubmit() {
  loading.value = true
  saved.value = false
  try {
    localStorage.setItem('story_lang', selected.value)
    saved.value = true

    const { available_stories } = await canContinueStories()
    const target = available_stories > 0 ? '/story/interests' : '/pricing'

    if(available_stories > 0){
      await submitStoryDetail( { job_id: jobId.value ?? -1, field_name: "story_language", value: getLangLabel(selected.value), });
    }

    await router.push({ path: target, query: { job_id: String(jobId.value) }})
  } catch (e: any) {
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const raw = route.query.job_id
  jobId.value = Array.isArray(raw)
      ? Number(raw[0])
      : Number(raw)

  if (!jobId.value) {
    await router.push('/story/setup')
    return
  }

  const queryLang = (route.query.lang as string | undefined)?.toLowerCase()
  const stored = (localStorage.getItem('story_lang') || '').toLowerCase()
  const prefer = (queryLang || stored) as Lang['code'] | ''
  if (prefer && languages.some(l => l.code === prefer)) {
    selected.value = prefer as Lang['code']
  }
})
</script>

<style scoped>
/* additional styles if needed */
</style>
