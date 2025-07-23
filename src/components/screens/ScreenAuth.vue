<template>
  <section class=" justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-md card">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-2">
          {{ mode === 'register' ? 'Welcome to Koalory!👋' : 'Sign In to Koalory' }}
        </h2>
        <p class="text-base sm:text-lg text-center mb-8 text-gray-400">
          {{ mode === 'register'
            ? "Let's create something magical together."
            : 'Enter your credentials to continue.' }}
        </p>

        <!-- Google -->
        <div class="flex flex-col gap-4 mb-7">
          <button
              @click="signInWithGoogle"
              class="w-full bg-[#4285F4] hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow"
          >
            <span>📧</span>
            {{ mode === 'register' ? 'Continue with Gmail' : 'Sign in with Gmail' }}
          </button>
        </div>

        <div class="flex items-center mb-5">
          <hr class="flex-1 border-gray-200" />
          <span class="mx-3 text-gray-400 text-xs tracking-wider">OR</span>
          <hr class="flex-1 border-gray-200" />
        </div>

        <!-- Email form -->
        <form @submit.prevent="onEmailSubmit" class="flex flex-col gap-4 mb-6">
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
          <div>
            <label class="text-sm text-gray-600 font-semibold">🔒 Password:</label>
            <input
                v-model="password"
                type="password"
                class="w-full mt-1 px-4 py-2 rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none"
                placeholder="••••••••"
                required
            />
          </div>
          <button
              type="submit"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            {{ mode === 'register' ? 'Create My Account' : 'Sign In' }}
          </button>
        </form>

        <p v-if="error" class="text-center text-red-500 mb-4">{{ error }}</p>

        <!-- Toggle link -->
        <p class="text-center text-gray-500 text-sm mb-2">
          {{ mode === 'register' ? 'Already have an account?' : "Don't have an account?" }}
          <a @click.prevent="toggleMode" href="#" class="text-violet-600 font-bold underline">
            {{ mode === 'register' ? 'Sign In' : 'Register' }}
          </a>
        </p>

        <div class="flex items-center justify-center mt-4">
          <span class="text-xs sm:text-sm text-gray-400">
            🔒 Your data is safe with us. We use bank‑level encryption.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {
  emailRegister,
  emailLogin, updateAuthStatus, isAuth
} from '@/services/api'
import {useRouter} from "vue-router";
import { sha256Hex } from '@/utils/crypto'

const mode = ref<'register' | 'login'>('login')
const email = ref('')
const password = ref('')
const error = ref('')

const clientId = '231152860826-k646avtssic22vgg9u106k5vi80mvg6b.apps.googleusercontent.com'
const redirectUri = window.location.origin + '/auth/google-callback'

const router = useRouter()

function toggleMode() {
  mode.value = mode.value === 'register' ? 'login' : 'register'
  error.value = ''
}

// OAuth flow
function signInWithGoogle() {
  const authEndpoint = 'https://accounts.google.com/o/oauth2/auth'
  const params = new URLSearchParams({
    response_type: 'token id_token',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    prompt: 'select_account',
    nonce: Math.random().toString(36).substring(2),
  })
  window.location.href = `${authEndpoint}?${params}`
}

async function onEmailSubmit() {
  error.value = ''
  try {
    const hashed = await sha256Hex(password.value)

    let tokens
    if (mode.value === 'register') {
      tokens = await emailRegister({ email: email.value, password: hashed })
    } else {
      tokens = await emailLogin({ email: email.value, password: hashed })
    }

    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    localStorage.setItem('email', email.value)
    updateAuthStatus()

    await router.push('/account')

    // emit next or redirect
    // e.g. router.push or emit('next')
  } catch (e: any) {
    // если это ответ с JSON { success: false, error: "..." }
    error.value = e.response?.data?.error
        || e.message
        || (mode.value === 'register'
            ? 'Registration failed'
            : 'Login failed')
  }
}

onMounted(async () => {
  if(isAuth.value) {
    await router.push('/account')
  }
})
</script>

<style scoped>
/* дополнительные стили при необходимости */
</style>
