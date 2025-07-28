<template>
  <section class="flex flex-col justify-center items-center justify-square px-6 py-4">
    <div class="max-w-5xl w-full mx-auto flex flex-col items-center">
      <h2 class="text-4xl font-extrabold  text-center mb-2 md:text-3xl">
        Unlock the Full Adventure!
      </h2>
      <p class="text-lg text-gray-400 text-center mb-8">
        Choose your package to continue the magic.
      </p>
      <div class="grid grid-cols-1 grid gap-8 w-full">
        <!-- First story -->
        <div class="flex flex-col justify-between rounded-2xl border-2 border-black bg-white shadow-panel p-6">
          <div>
            <h3 class="font-extrabold mb-3 text-2xl text-black ">First story</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>1 personalized adventure story</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>5 illustrations featuring your child</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Your child as the main character</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Choose from 8 magical genres</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Beautiful PDF download</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Ready in 1 minute</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Perfect to try our service</li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="mt-3 text-7xl text-center font-medium text-black">$2.99</p>
            <button
                @click="buyBundle('one')"
                class="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg"
            >
              Get First Story
            </button>
          </div>
        </div>

        <!-- 3-story bundle -->
        <div class="relative flex flex-col justify-between rounded-2xl border-2 border-[#FC7B00] bg-white shadow-panel p-6">
          <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 flex items-center">
            <img src="@/assets/best-value-panel.svg" alt="Best Value" style="transform: rotateZ(-2deg); scale: 1.2"/>
          </span>
          <div>
            <h3 class="font-extrabold mb-3 text-2xl text-[#FC7B00]">3-Story Bundle</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>3 personalized adventure stories</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>15 illustrations featuring your child</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Your child as the hero in each story</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Choose from 8 magical genres</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Beautiful PDF files</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Live chat support</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Perfect for families</li>

            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="mt-3 text-7xl text-center font-medium text-[#FC7B00]">$5.99</p>
            <button
                @click="buyBundle('three')"
                class="w-full bg-[#FC7B00] hover:bg-orange-500 text-white font-bold py-3 rounded-lg"
            >
              Choose Bundle
            </button>
          </div>
        </div>

        <!-- 10-story bundle -->
        <div class="flex flex-col justify-between rounded-2xl border-2 border-[#00B5FC] bg-white shadow-panel p-6">
          <div>
            <h3 class="font-extrabold mb-3 text-2xl text-[#00B5FC]">10-Story Bundle</h3>
            <ul class="text-gray-700 text-base space-y-1">
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>10 personalized adventure stories</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>50 illustrations featuring your child</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Your child as the main character</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>All 8 genres included</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Premium PDF with animations</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Priority support</li>
              <li class="flex items-center"><span class="mr-2 text-xl text-black">★</span>Great for gifts</li>

            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <p class="mt-3 text-7xl text-center font-medium text-[#00B5FC]">$14.99</p>
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

@media (min-aspect-ratio: 1/1) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
