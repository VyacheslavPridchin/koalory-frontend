<template>
  <section class=" justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-lg card flex flex-col items-center">
        <div class="w-20 h-20 mb-6 rounded-full border-4 flex items-center justify-center" style="border-color: #DDD6FE;">
          <img
              :src="photoBlobUrl"
              alt="avatar"
              class="w-full h-full object-cover rounded-full"
          />
        </div>
        <h2 class="text-2xl max-w-sm font-semibold text-center mb-2">Almost ready! Is there a special message for {{ name }}'s story? ✨</h2>
        <textarea
            v-model="text"
            rows="4"
            placeholder="e.g., Believing in yourself..."
            class="w-full px-5 py-4 rounded-xl border border-orange-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-base mb-3"
        ></textarea>
        <div class="text-sm mb-4 p-4 text-left w-full rounded-lg" style="background-color: #FFF2E6">
          <p class="font-semibold">Popular messages:</p>
          <ul class="text-gray-700 text-s">
            <li class="flex items-center"><span class="mr-1 text-sm text-black">★</span>Friendship & teamwork</li>
            <li class="flex items-center"><span class="mr-1 text-sm text-black">★</span>Kindness & helping others, Overcoming fears</li>
            <li class="flex items-center"><span class="mr-1 text-sm text-black">★</span>Family love, Being unique & special, Never giving up</li>
            <li class="flex items-center text-xs mt-2" style="color: #FC7B00">Or write your own idea - just a few words is perfect!</li>
          </ul>
        </div>
        <!-- Buttons row -->
        <div class="flex justify-between w-full">
          <button
              @click="onSkip"
              class="w-1/2 mr-2 bg-white hover:bg-gray-100 text-gray-400 font-semibold py-3 rounded-lg text-lg border border-gray-300 shadow transition"
          >
            Skip
          </button>
          <button
              :disabled="!text"
              @click="onContinue"
              class="w-1/2 ml-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-lg shadow disabled:opacity-50 transition"
          >
            Continue with Message
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {getCachedPhotoUrl} from "@/services/photoCacheService.ts";
import {useRoute, useRouter} from "vue-router";
import {canContinueStories, getInformation, submitStoryDetail} from "@/services/api.ts";

const text = ref('')
const name = ref<string | null>(null)
const photoBlobUrl = ref<string>()
const jobId = ref<number>()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
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
    return
  }

  const { available_stories } = await canContinueStories()
  if(available_stories == 0) await router.push('/pricing')
});

async function onContinue() {
  const { available_stories } = await canContinueStories()
  const target = available_stories > 0 ? '/story/generate' : '/pricing'

  if(available_stories > 0){
    localStorage.setItem("message", text.value);
    await submitStoryDetail( { job_id: jobId.value ?? -1, field_name: "story_message", value: text.value });
  }

  await router.push({ path: target, query: { job_id: String(jobId.value) }})
}

async function onSkip() {
  const { available_stories } = await canContinueStories()
  const target = available_stories > 0 ? '/story/language' : '/pricing'

  await router.push({ path: target, query: { job_id: String(jobId.value) }})
}
</script>

<style scoped></style>