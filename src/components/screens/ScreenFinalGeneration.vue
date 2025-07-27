<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-lg card flex flex-col items-center">
        <!-- Аватар + заголовок -->
        <div class="w-20 h-20 mb-6 rounded-full border-4 flex items-center justify-center" style="border-color: #DDD6FE;">
          <img
              :src="photoBlobUrl"
              alt="avatar"
              class="w-full h-full object-cover rounded-full"
          />
        </div>
        <h2 class="text-2xl font-semibold text-center mb-3">
          {{ name }}'s Epic Adventure is Being Created! ✨
        </h2>

        <!-- Прогресс-строки -->
        <div class="w-full my-6">
          <div
              v-for="(st, idx) in computedStages"
              :key="idx"
              class="flex items-center gap-3 text-base"
          >
            <span>{{ st.icon }}</span>
            <span v-html="st.text"></span>
            <span class="ml-auto flex gap-0.5">
              <span
                  v-for="i in dotCount"
                  :key="i"
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: i <= st.filled ? color : '#E5E7EB' }"
              />
            </span>
          </div>

          <!-- сам бар -->
          <div class="h-3 mt-6 bg-gray-200 rounded-full overflow-hidden">
            <div
                class="h-full transition-all duration-500 rounded-full"
                :style="{ width: progress + '%', backgroundColor: color }"
            ></div>
          </div>
        </div>

        <p class="text-center text-lg text-gray-800 mt-3">
          ✨ Creating something truly special for <b>{{ name }}</b>!
        </p>
        <p class="text-center text-gray-500 text-xs mt-3">
          🔔 We'll email when ready — usually 3–5 minutes. Feel free to close this window!
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {getCachedPhotoUrl} from "@/services/photoCacheService.ts";
import {useRoute, useRouter} from "vue-router";
import {
  canContinueStories,
  getInformation,
  launchStoryGeneration,
  requestStory,
  submitStoryDetail
} from "@/services/api.ts";

const name = ref<string | null>(null)
const genre = ref<string | null>(null)
const progress = ref(0)
const photoBlobUrl = ref<string>()
const jobId = ref<number>()
const route = useRoute()
const router = useRouter()
const iv = ref<number>()

onMounted(async () => {
  genre.value = localStorage.getItem('genre')

  const raw = route.query.job_id
  jobId.value = Array.isArray(raw)
      ? Number(raw[0])
      : Number(raw)

  if (!jobId.value) {
    await router.push('/story/setup')
    return
  }

  name.value = (await getInformation(jobId.value)).name

  const cached = await getCachedPhotoUrl(jobId.value)
  if (cached) {
    photoBlobUrl.value = cached
  }

  const { available_stories } = await canContinueStories()
  if(available_stories == 0) {
    await router.push('/pricing')
    return
  }

  await launchStoryGeneration({ job_id: jobId.value ?? -1} )

  iv.value = setInterval(async () => {
    try {
      const result = await requestStory(jobId.value ?? -1)
      progress.value = result.progress;
      if (result.progress === 100) {
        clearInterval(iv.value)

        await router.push('/story/complete?job_id=' + jobId.value)
        // onStoryReady(result)
      }
    } catch (e) {
      console.error("Error polling story:", e)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(iv.value)
})

// конфиг этапов
const stages = [
  { icon: '🎨', tpl: () => `Perfecting illustrations for <b>${name.value}</b>…` },
  { icon: '✍️', tpl: () => `Crafting a unique adventure…` },
  { icon: '🌟', tpl: () => 'Blending in a hint of magic…' },
  { icon: '📚', tpl: () => 'Polishing the final masterpiece…' },
]

const dotCount = 5
const color    = '#FC7B00'

// считаем, сколько точек заполнить на каждом этапе
const computedStages = computed(() =>
    stages.map((st, idx) => {
      const start   = idx * (100 / stages.length)
      const ratio   = (progress.value - start) / (100 / stages.length)
      const filled  = Math.round(Math.min(Math.max(ratio, 0), 1) * dotCount)
      return {
        icon:   st.icon,
        text:   st.tpl(),
        filled,
      }
    })
)
</script>
