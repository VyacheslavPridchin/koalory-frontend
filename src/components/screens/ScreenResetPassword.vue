<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-md card">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-2">
          {{ success ? 'Password updated' : 'Create a new password' }}
        </h2>

        <p class="text-base sm:text-lg text-center mb-8 text-gray-400">
          {{
            success
                ? 'Your password has been changed. You can now sign in.'
                : 'Enter a new password and confirm it to regain access.'
          }}
        </p>

        <form v-if="!success" @submit.prevent="onSubmit" class="flex flex-col gap-4 mb-6">
          <div>
            <label class="text-sm text-gray-600 font-semibold">🔒 New password:</label>
            <input
                v-model="password"
                type="password"
                class="w-full mt-1 px-4 py-2 rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none"
                placeholder="••••••••"
                required
                minlength="8"
            />
          </div>

          <div>
            <label class="text-sm text-gray-600 font-semibold">🔒 Confirm password:</label>
            <input
                v-model="confirm"
                type="password"
                class="w-full mt-1 px-4 py-2 rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none"
                placeholder="••••••••"
                required
                minlength="8"
            />
            <p v-if="passwordMismatch" class="text-sm text-red-500 mt-1">Passwords must match</p>
          </div>

          <button
              type="submit"
              :disabled="isDisabled"
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            {{ loading ? 'Updating…' : 'Update password' }}
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

        <p v-if="!success" class="text-center text-gray-500 text-sm mb-2">
          <a @click.prevent="goBack" href="#" class="text-violet-600 font-bold underline">Sign In or Register</a>
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
import {ref, computed, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sha256Hex } from '@/utils/crypto'
import {isAuth, resetPassword} from "@/services/api.ts";

const route = useRoute()
const router = useRouter()

const resetTokenParam = route.query.reset_token as string | string[] | undefined
const token = Array.isArray(resetTokenParam) ? resetTokenParam[0] : (resetTokenParam ?? '')

const password = ref<string>('')
const confirm = ref<string>('')
const error = ref<string>('')
const loading = ref<boolean>(false)
const success = ref<boolean>(false)

const passwordMismatch = computed(() => confirm.value.length > 0 && password.value !== confirm.value)

const isDisabled = computed(() =>
    loading.value ||
    password.value.length < 8 ||
    confirm.value.length < 8 ||
    password.value !== confirm.value
)

function goBack() {
  router.push('/auth')
}

async function onSubmit() {
  error.value = ''

  if (!token) {
    error.value = 'Invalid or missing reset token.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    const hashed = await sha256Hex(password.value)
    await resetPassword({ token: token, password: hashed })
    success.value = true
  } catch (e: any) {
    error.value = e?.response?.data?.error || e?.message || 'Failed to update password'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isAuth.value) {
    await router.push('/account')
  }
})
</script>

<style scoped>
/* additional styles if needed */
</style>
