<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-2xl card flex flex-col items-center">
        <div class="w-20 h-20 mb-6 rounded-full border-4 flex items-center justify-center" style="border-color: #DDD6FE;">
          <img
              :src="photoBlobUrl"
              alt="avatar"
              class="w-full h-full object-cover rounded-full"
          />
        </div>
      <h2 class="text-3xl font-bold  text-center mb-2">{{name}} was just the beginning… 👑</h2>
      <p class="text-base text-gray-700 text-center mb-6">
        Since you loved {{ name }}'s adventure, imagine creating stories for family, friends, or for special occasions!
      </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <!-- 3-story bundle -->
          <div class="relative h-80 w-full flex flex-col justify-between rounded-2xl border-2 border-[#FC7B00] bg-white shadow-panel p-6">
          <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 flex items-center">
            <img src="../../../assets/best-value-panel.svg" alt="Best Value" style="transform: rotateZ(-2deg); scale: 1.2"/>
          </span>
          <div>
            <h3 class="font-extrabold text-2xl text-[#FC7B00]">3-Story Bundle</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Try different characters & genres</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Perfect for the whole family</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-4xl font-extrabold text-[#FC7B00]">$5.99</p>
            <button
                @click="buyBundle('three')"
                class="w-full bg-[#FC7B00] hover:bg-orange-500 text-white font-bold py-3 rounded-lg"
            >
              Create More Magic
            </button>
          </div>
        </div>

        <!-- 10-story bundle -->
          <div class="h-80 w-full flex flex-col justify-between rounded-2xl border-2 border-[#00B5FC] bg-white shadow-panel p-6">
          <div>
            <h3 class="font-extrabold text-2xl text-[#00B5FC]">Unlimited stories</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Create whenever inspiration strikes</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>All genres and themes included</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-4xl font-extrabold text-[#00B5FC]">$9.99<span class="text-sm">/mo</span></p>
            <button
                @click="buyBundle('unlimited')"
                class="w-full bg-[#00B5FC] hover:bg-blue-400 text-white font-bold py-3 rounded-lg"
            >
              Get Unlimited
            </button>
          </div>
        </div>
        </div>
      <a @click="openAccount" class="text-center text-lg text-gray-500 underline mt-3 cursor-pointer">Maybe Later — I'm Happy with One</a>
      <p class="text-xs text-gray-400 mt-2">⭐ 97% of families who try one story create at least 3 more!</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getCachedPhotoUrl} from "@/services/photoCacheService.ts";
import {useRoute, useRouter} from "vue-router";
import {generatePaymentLink, type GeneratePaymentLinkRequest} from "@/services/api.ts";

const photoBlobUrl = ref<string>()
const router = useRouter()
const route = useRoute()
const jobId = ref<number>()
const name = ref<string | null>(null)

async function buyBundle(bundle: string): Promise<void> {
  const payload: GeneratePaymentLinkRequest = { option: bundle }

  try {
    console.log(payload)
    const { link } = await generatePaymentLink(payload)
    window.location.href = link
  } catch (err) {
    console.error('Failed to get payment link:', err)
  }
}

function openAccount(): void {
  router.push("/account")
}

onMounted(async () => {
  name.value = localStorage.getItem("name")

  const raw = route.query.job_id
  jobId.value = Array.isArray(raw)
      ? Number(raw[0])
      : Number(raw)

  if (!jobId.value) {
    await router.push('/story/setup')
    return
  }

  const cached = await getCachedPhotoUrl(jobId.value)
  if (cached) {
    photoBlobUrl.value = cached
  }
});

</script>

<style scoped></style>
