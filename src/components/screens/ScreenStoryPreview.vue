<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-md card">
        <h2 class="text-3xl font-semibold text-center mb-4">
          🎉<span class="text-3xl font-semibold text-orange-500">{{ name }}</span> is Ready for Adventure!🎉
        </h2>
        <div class="w-full mb-2 rounded-2xl shadow-lg border-4 border-white overflow-hidden relative" style="padding-top:56.25%">
          <transition name="fade">
            <div v-if="!photoBlobUrl"  class="loading-banner absolute top-0 left-0 w-full h-full flex items-center justify-center">
            </div>
          </transition>
          <transition name="fade">
            <img
                v-if="photoBlobUrl"
                :src="photoBlobUrl"
                alt="Generated Character"
                class="absolute top-0 left-0 w-full h-full object-cover"
            />
          </transition>
        </div>

        <p class="text-lg text-gray-400 text-center mb-4">
          Here's how their magical story begins...
        </p>
        <button
            @click="continueStory"
            class="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg shadow disabled:opacity-50 transition"
        >
          Continue the Story!
        </button>
        <p class="text-sm text-gray-600 text-center mt-4">
          🎯 Choose your adventure package to unlock the full magical tale!
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {canContinueStories, getAvailableStories, getGeneratedPhoto} from '@/services/api'
import {cachePhotoUrl, getCachedPhotoUrl} from '@/services/photoCacheService'

const router = useRouter()
const route = useRoute()
const name = ref<string | null>(null)
const jobId = ref<number>()
const photoBlobUrl = ref<string>('')
let intervalId: number
const photoLink = ref<string | null>(null)

async function fetchPhoto() {
  const id = jobId.value ?? -1

  // 1) проверяем кэш
  const cached = await getCachedPhotoUrl(id)
  if (cached) {
    clearInterval(intervalId)
    photoBlobUrl.value = cached
    return
  }

  // 2) иначе — запрашиваем у бэка, кэшируем и показываем
  try {

    if(!photoLink.value) {
      const {photo_link} = await getGeneratedPhoto(id)
      if (!photo_link) throw new Error('not ready')

      photoLink.value = photo_link
    }
    // кладём в кэш и получаем blob-URL
    photoBlobUrl.value = await cachePhotoUrl(id, photoLink.value)

    clearInterval(intervalId)
  } catch {

    if(!photoLink.value) {
      console.log("Wait for image link...")
    } else {
      console.log(`Download image from '${photoLink.value}' error, try again...`)
    }
    // сюда попадём, пока фото ещё не готово;
    // просто ждём следующего вызова через setInterval
  }
}

onMounted(() => {
  name.value = localStorage.getItem("name")

  // получаем job_id из query
  const raw = route.query.job_id
  jobId.value = Array.isArray(raw)
      ? Number(raw[0])
      : Number(raw)

  if (!jobId.value) {
    router.push('/story/setup')
    return
  }

  // сразу пробуем и запускаем интервал повторных попыток
  fetchPhoto()
  intervalId = window.setInterval(fetchPhoto, 5000)
})

async function continueStory(): Promise<void> {
  const { available_stories } = await canContinueStories()
  const target = available_stories > 0 ? '/story/interests' : '/pricing'
  await router.push({ path: target, query: { job_id: String(jobId.value) } })
}

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.loading-banner {
  background: linear-gradient(45deg, #6b21a8, #3b82f6, #ec4899, #fcd34d);
  background-size: 400% 400%;
  animation: gradientAnimation 8s ease infinite;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
