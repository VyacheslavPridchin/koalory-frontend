<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-md card">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-2">
          {{ sent ? 'Check your email' : 'Reset your password' }}
        </h2>
        <p class="text-base sm:text-lg text-center mb-8 text-gray-400">
          {{
            sent
                ? `If an account exists for ${email}, you'll receive a password reset link shortly.`
                : "Enter your email address and we'll send you a reset link."
          }}
        </p>

        <form v-if="!sent" @submit.prevent="onSubmit" class="flex flex-col gap-4 mb-6">
          <div>
            <label class="text-sm text-gray-600 font-semibold">📧 Email:</label>
            <input
                v-model="email"
                type="email"
                class="w-full mt-1 px-4 py-2 rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none"
                placeholder="you@example.com"
                required
            />
          </div>

          <button
              type="submit"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            Send reset link
          </button>
        </form>

        <div v-else class="flex flex-col gap-4 mb-6">
          <button
              @click="goBack"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            Back to sign in
          </button>
        </div>

        <p v-if="error" class="text-center text-red-500 mb-4">{{ error }}</p>

        <p class="text-center text-gray-500 text-sm mb-2">
          <a @click.prevent="goBack" href="#" class="text-violet-600 font-bold underline">
            Back
          </a>
        </p>

        <div class="flex items-center justify-center mt-4">
          <span class="text-xs text-center sm:text-sm text-gray-400">
            🔒 Your data is safe with us. We use bank‑level encryption.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import {isAuth, requestPasswordReset} from "@/services/api.ts";

const email = ref<string>('')
const error = ref<string>('')
const sent = ref<boolean>(false)

const router = useRouter()

function goBack() {
  router.back()
}

async function onSubmit() {
  error.value = ''

  try {
    await requestPasswordReset({ email: email.value })

    sent.value = true
  } catch (e: any) {
    error.value = e?.response?.data?.error || e?.message || 'Failed to send reset link'
  }
}

onMounted(async () => {
  if(isAuth.value) {
    await router.push('/account')
  }
})
</script>

<style scoped>
/* additional styles if needed */
</style>
