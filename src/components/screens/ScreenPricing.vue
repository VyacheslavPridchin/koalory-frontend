<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-4">
    <div class="max-w-4xl w-full mx-auto flex flex-col items-center">
      <h2 class="text-4xl font-extrabold  text-center mb-2 md:text-3xl">
        Unlock the Full Adventure!
      </h2>
      <p class="text-lg text-gray-400 text-center mb-8">
        Choose your package to continue the magic.
      </p>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <!-- First story -->
        <div class="h-80 flex flex-col justify-between rounded-2xl border-2 border-black bg-white shadow-panel p-6">
          <div>
            <h3 class="font-extrabold text-2xl text-black ">First story</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Full story (6000+ words)</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Custom illustrations</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Beautiful PDF file</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-4xl font-extrabold text-black">$2.50</p>
            <button
                @click="buyBundle('one')"
                class="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg"
            >
              Get First Story
            </button>
          </div>
        </div>

        <!-- 3-story bundle -->
        <div class="relative h-80 flex flex-col justify-between rounded-2xl border-2 border-[#FC7B00] bg-white shadow-panel p-6">
          <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 flex items-center">
            <img src="@/assets/best-value-panel.svg" alt="Best Value" style="transform: rotateZ(-2deg); scale: 1.2"/>
          </span>
          <div>
            <h3 class="font-extrabold text-2xl text-[#FC7B00]">3-Story Bundle</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>3 complete adventures</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Try different genres</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Perfect for the family</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-4xl font-extrabold text-[#FC7B00]">$5.99</p>
            <button
                @click="buyBundle('three')"
                class="w-full bg-[#FC7B00] hover:bg-orange-500 text-white font-bold py-3 rounded-lg"
            >
              Choose Bundle
            </button>
          </div>
        </div>

        <!-- 10-story bundle -->
        <div class="h-80 flex flex-col justify-between rounded-2xl border-2 border-[#00B5FC] bg-white shadow-panel p-6">
          <div>
            <h3 class="font-extrabold text-2xl text-[#00B5FC]">10-Story Bundle</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>10 complete adventures</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>All genres and themes</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Great for gifts!</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-4xl font-extrabold text-[#00B5FC]">$19.99</p>
            <button
                @click="buyBundle('ten')"
                class="w-full bg-[#00B5FC] hover:bg-blue-400 text-white font-bold py-3 rounded-lg"
            >
              Get 10 Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {generatePaymentLink, isAuth} from '@/services/api'
import type { GeneratePaymentLinkRequest } from '@/services/api'
const route = useRoute()
const router = useRouter()
const jobId = ref<number>();

async function buyBundle(bundle: string): Promise<void> {
  if(!isAuth.value){
    await router.push('/auth')
    return
  }

  const payload: GeneratePaymentLinkRequest = { option: bundle }
  if(jobId) payload.job_id = jobId.value;

  try {
    console.log(payload)
    const { link } = await generatePaymentLink(payload)
    window.location.href = link
  } catch (err) {
    console.error('Failed to get payment link:', err)
  }
}

onMounted(async () => {
  const raw = route.query.job_id
  jobId.value = Array.isArray(raw) ? Number(raw[0]) : Number(raw)
})

</script>

<style scoped>
.shadow-panel {
  box-shadow:
      0 12px 20px -5px rgba(0, 0, 0, 0.4),
      0 4px 6px -2px rgba(0, 0, 0, 0.3);
}
</style>
