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
        <h2 class="text-2xl max-w-sm font-semibold text-center mb-2">What main theme of the story would you like to choose for {{ name }}?</h2>
        <textarea
            v-model="text"
            rows="4"
            placeholder="e.g., Family love..."
            class="w-full px-5 py-4 rounded-xl border border-orange-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-base mb-3"
        ></textarea>

        <!-- Buttons row -->
        <div class="flex justify-between w-full">
          <button
              :disabled="!text"
              @click="onContinue"
              class="w-full ml-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-lg shadow disabled:opacity-50 transition"
          >
            Continue with Theme
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
  const target = available_stories > 0 ? '/story/message' : '/pricing'

  if(available_stories > 0){
    localStorage.setItem("theme", text.value);
    await submitStoryDetail( { job_id: jobId.value ?? -1, field_name: "story_theme", value: text.value });
  }

  await router.push({ path: target, query: { job_id: String(jobId.value) }})
}
</script>

<style scoped></style>