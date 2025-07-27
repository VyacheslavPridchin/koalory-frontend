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
      <h2 class="text-3xl max-w-sm font-semibold text-center mb-2">Let's make {{ name }}'s story even more magical!</h2>
      <p class="text-base text-gray-400 text-center mb-4">Tell me what {{ name }} loves most...</p>
      <textarea
          v-model="text"
          rows="4"
          placeholder="Loves dinosaurs and building with blocks..."
          class="w-full px-5 py-4 rounded-xl border border-orange-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-base mb-3"
      ></textarea>
      <div class="text-sm mb-4 text-left w-full">
        <p class="font-semibold text-center">Include:</p>
        <p class="text-center">
          🎨 Interests & passions, 🧩 Favorite hobbies, 🎮 Games they love, 📚 School subjects, 🧸 Favorite toys/characters, 🦸 Heroes they admire
        </p>
      </div>

        <p class="text-center text-sm">
          The more you tell me, the more magical the story becomes!
        </p>
      <button
          :disabled="!text"
          @click="saveInterest"
          class="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg shadow disabled:opacity-50 transition"
      >
        Continue
      </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {useRoute, useRouter} from "vue-router";
import {getCachedPhotoUrl} from "@/services/photoCacheService.ts";
import {canContinueStories, getInformation, submitStoryDetail} from "@/services/api.ts";

const text = ref('')
const name = ref<string | null>(null)
const photoBlobUrl = ref<string>()
const jobId = ref<number>()
const route = useRoute()
const router = useRouter()

async function saveInterest() {

  const { available_stories } = await canContinueStories()
  const target = available_stories > 0 ? '/story/genre' : '/pricing'

  if(available_stories > 0) {
    localStorage.setItem("interest", text.value);
    await submitStoryDetail( { job_id: jobId.value ?? -1, field_name: "story_extra", value: text.value });
  }

  await router.push({ path: target, query: { job_id: String(jobId.value) } })
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

  name.value = (await getInformation(jobId.value)).name

  const cached = await getCachedPhotoUrl(jobId.value)
  if (cached) {
    photoBlobUrl.value = cached
    return
  }

  const { available_stories } = await canContinueStories()
  if(available_stories == 0) await router.push('/pricing')
});

</script>

<style scoped></style>
