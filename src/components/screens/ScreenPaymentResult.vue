<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-lg card flex flex-col items-center">
        <h2 class="text-3xl max-w-sm font-semibold text-center mb-2">{{ title }}</h2>
        <p class="text-base text-gray-400 text-center mb-4">{{ subtitle }}</p>

        <button
            @click="handleContinue"
            class="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg shadow transition"
        >
          Continue
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

const success = route.query.success === 'true'
const jobId = route.query.job_id as string | undefined

const title = ref(success ? 'Thank you!' : 'Payment error')
const subtitle = ref(
    success
        ? 'Payment was successful. Now you can start creating your story.'
        : 'Unfortunately, there was an error with your payment.'
)

function handleContinue() {
  if (jobId) {
    router.push({ path: '/story/interests', query: { job_id: jobId } })
  } else {
    router.push('/account')
  }
}
</script>

<style scoped></style>