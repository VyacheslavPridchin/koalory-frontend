<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-md card">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-2">
          {{ verified ? 'Verified' : 'Enter verification code' }}
        </h2>

        <p class="text-base sm:text-lg text-center mb-8 text-gray-400">
          {{
            verified
                ? 'Your email was successfully verified.'
                : `We sent a 6‑digit code to ${emailToShow}. Enter it below to continue.`
          }}
        </p>

        <form v-if="!verified" @submit.prevent="onSubmit" class="flex flex-col gap-6 mb-6">
          <div
              class="flex justify-center gap-2 select-none"
              @paste.prevent="onContainerPaste"
          >
            <input
                v-for="(_, i) in boxes"
                :key="i"
                ref="inputs"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="1"
                class="w-12 h-12 text-center text-xl rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none"
                :value="digits[i]"
                @input="onInput(i, $event)"
                @keydown="onKeydown(i, $event)"
                @focus="onFocus(i)"
                @paste.prevent="onInputPaste(i, $event)"
            />
          </div>

          <button
              type="submit"
              :disabled="isDisabled"
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            {{ loading ? 'Verifying…' : 'Verify' }}
          </button>

          <div class="flex flex-col items-center gap-2">
            <button
                type="button"
                :disabled="cooldown > 0 || loading"
                @click="onResend"
                class="text-violet-600 font-bold underline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ cooldown > 0 ? `Resend in ${formattedCooldown}` : 'Resend code' }}
            </button>

            <a href="#" @click.prevent="goBack" class="text-gray-400 underline">
              Back
            </a>
          </div>
        </form>

        <div v-else class="flex flex-col gap-4 mb-6">
          <button
              @click="goNext"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-base sm:text-lg shadow"
          >
            Continue
          </button>
          <a href="#" @click.prevent="goBack" class="text-center text-violet-600 font-bold underline">
            Back
          </a>
        </div>

        <p v-if="error" class="text-center text-red-500 mb-4">{{ error }}</p>

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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createVerification, getAvailableStories, isAuth, updateAuthStatus, verifyCode } from '@/services/api.ts'

const router = useRouter()
const route = useRoute()

const emailToShow = localStorage.getItem('email')

const BOX_COUNT = 6
const RESEND_SECONDS = 120

const boxes = Array.from({ length: BOX_COUNT })
const digits = ref<string[]>(Array.from({ length: BOX_COUNT }, () => ''))
const inputs = ref<(HTMLInputElement | null)[]>([])

const loading = ref(false)
const error = ref('')
const verified = ref(false)

const cooldown = ref(0)
let cooldownTimer: number | undefined

const codeParamRaw = route.query.code as string | string[] | undefined
const codeParam = Array.isArray(codeParamRaw) ? codeParamRaw[0] : codeParamRaw

const codeValue = computed(() => digits.value.join(''))
const isDisabled = computed(() => loading.value || codeValue.value.length !== BOX_COUNT)

const formattedCooldown = computed(() => {
  const mm = Math.floor(cooldown.value / 60)
  const ss = cooldown.value % 60
  const mmStr = mm.toString().padStart(2, '0')
  const ssStr = ss.toString().padStart(2, '0')
  return `${mmStr}:${ssStr}`
})

function focusIndex(i: number) {
  const el = inputs.value?.[i]
  el?.focus()
}

function selectIndex(i: number) {
  const el = inputs.value?.[i]
  el?.select()
}

function goBack() {
  router.push('/auth')
}

function goNext() {
  router.push('/account')
}

function sanitizeDigit(ch: string) {
  const m = ch.match(/\d/)
  return m ? m[0] : ''
}

function onInput(i: number, e: Event) {
  const target = e.target as HTMLInputElement
  let val = target.value

  if (val.length > 1) {
    distributeFrom(0, val)
    return
  }

  val = sanitizeDigit(val)
  digits.value[i] = val
  target.value = val

  if (val && i < BOX_COUNT - 1) {
    focusIndex(i + 1)
    selectIndex(i + 1)
  }
}

function onKeydown(i: number, e: KeyboardEvent) {
  const key = e.key

  // Разрешаем Ctrl/Cmd + V для вставки
  if ((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'V')) {
    return
  }

  if (key === 'Backspace') {
    if (digits.value[i]) {
      digits.value[i] = ''
    } else if (i > 0) {
      digits.value[i - 1] = ''
      focusIndex(i - 1)
    }
    e.preventDefault()
    return
  }

  if (key === 'ArrowLeft' && i > 0) {
    focusIndex(i - 1)
    e.preventDefault()
    return
  }

  if (key === 'ArrowRight' && i < BOX_COUNT - 1) {
    focusIndex(i + 1)
    e.preventDefault()
    return
  }

  if (key === 'Enter') {
    if (!isDisabled.value) onSubmit()
    e.preventDefault()
    return
  }

  if (key.length === 1 && !/\d/.test(key)) {
    e.preventDefault()
  }
}

function onFocus(i: number) {
  selectIndex(i)
}

function onInputPaste(i: number, e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  const only = text.replace(/\D+/g, '')
  if (!only) return
  distributeFrom(0, only)
}

function onContainerPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  distributeFrom(0, text)
}

function distributeFrom(startIndex: number, text: string) {
  const onlyDigits = text.replace(/\D+/g, '')
  for (let j = 0; j < BOX_COUNT; j++) {
    const srcIdx = j - startIndex
    const ch = srcIdx >= 0 && srcIdx < onlyDigits.length ? onlyDigits[srcIdx] : ''
    digits.value[j] = ch || ''
  }

  const firstEmpty = digits.value.findIndex((d) => !d)
  const focusTo = firstEmpty === -1 ? BOX_COUNT - 1 : firstEmpty
  nextTick(() => {
    focusIndex(focusTo)
    selectIndex(focusTo)
  })
}

async function onSubmit() {
  error.value = ''
  if (codeValue.value.length !== BOX_COUNT) return

  loading.value = true
  try {
    const tokens = await verifyCode({ email: localStorage.getItem('email') as string, code: codeValue.value })
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)

    updateAuthStatus()

    if ((await getAvailableStories()).available_stories > 0)
      await router.push('/story/setup')
    else
      await router.push('/account')

    verified.value = true
  } catch (e: any) {
    error.value = e?.response?.data?.error || e?.message || 'Verification failed'
  } finally {
    loading.value = false
  }
}

function startCooldown(seconds: number) {
  cooldown.value = seconds
  if (cooldownTimer) window.clearInterval(cooldownTimer)
  cooldownTimer = window.setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0 && cooldownTimer) {
      window.clearInterval(cooldownTimer)
      cooldownTimer = undefined
      cooldown.value = 0
    }
  }, 1000) as unknown as number
}

async function onResend() {
  if (cooldown.value > 0) return
  if (!emailToShow) {
    await router.push('/auth')
    return
  }
  error.value = ''
  loading.value = true
  try {
    await createVerification({ email: emailToShow })
    startCooldown(RESEND_SECONDS)
  } catch (e: any) {
    error.value = e?.response?.data?.error || e?.message || 'Failed to resend code'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isAuth.value) {
    await router.push('/account')
    return
  }

  if (!emailToShow) {
    await router.push('/auth')
    return
  }

  if (codeParam) {
    const normalized = String(codeParam).replace(/\D+/g, '').slice(0, BOX_COUNT)
    for (let i = 0; i < BOX_COUNT; i++) {
      digits.value[i] = normalized[i] ?? ''
    }
  }

  await createVerification({ email: emailToShow })
  startCooldown(RESEND_SECONDS)

  await nextTick(() => {
    const firstEmpty = digits.value.findIndex((d) => !d)
    const idx = firstEmpty === -1 ? BOX_COUNT - 1 : firstEmpty
    focusIndex(idx)
    selectIndex(idx)
  })
})

onBeforeUnmount(() => {
  if (cooldownTimer) window.clearInterval(cooldownTimer)
})
</script>

<style scoped>
/* additional styles if needed */
</style>
