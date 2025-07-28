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
              @paste.prevent="onPaste"
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
              ← Back
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
            ← Back
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

const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
let visibilityHandlerAttached = false

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
    distributeFrom(i, val)
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
  // На мобильных попробуем автозаполнение при первом фокусе,
  // если код ещё не введён полностью.
  maybeAutoPaste()
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  distributeFrom(0, text)
}

function distributeFrom(startIndex: number, text: string) {
  const onlyDigits = text.replace(/\D+/g, '')
  for (let j = 0; j < BOX_COUNT; j++) {
    const srcIdx = j - startIndex
    const ch = srcIdx >= 0 && srcIdx < onlyDigits.length ? onlyDigits[srcIdx] : ''
    digits.value[j] = ch || digits.value[j]
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

/** ======== АВТОВСТАВКА С МОБИЛЬНЫХ / ЧТЕНИЕ ИЗ БУФЕРА ========= */

async function readClipboardText(): Promise<string> {
  // iOS Safari не поддерживает navigator.permissions для clipboard-read.
  // Делаем безопасную попытку чтения, ловим ошибки.
  try {
    const canAsk = typeof navigator.permissions?.query === 'function'
    if (canAsk) {
      // @ts-expect-error — нестандартное имя разрешения
      const status = await navigator.permissions.query({ name: 'clipboard-read' })
      if (status.state === 'denied') return ''
      // Если 'prompt' или 'granted' — пробуем читать.
    }
    if (!('clipboard' in navigator) || typeof navigator.clipboard.readText !== 'function') return ''
    const text = await navigator.clipboard.readText()
    return text ?? ''
  } catch {
    return ''
  }
}

function looksLikeOtp(text: string) {
  const cleaned = text.replace(/\D+/g, '')
  return cleaned.length >= 4 // допускаем 4-8 цифр; распределим первые 6
}

async function tryAutoPasteFromClipboard() {
  const alreadyFull = codeValue.value.length === BOX_COUNT
  if (alreadyFull) return

  const text = await readClipboardText()
  if (!text) return

  if (looksLikeOtp(text)) {
    distributeFrom(0, text)
  }
}

function maybeAutoPaste() {
  if (!isMobile) return
  // Не спамим попытками: пробуем только если не заполнено и есть поддержка.
  if (codeValue.value.length === BOX_COUNT) return
  void tryAutoPasteFromClipboard()
}

function attachVisibilityAutoPaste() {
  if (visibilityHandlerAttached) return
  const handler = async () => {
    if (document.visibilityState === 'visible') {
      // Пользователь мог скопировать код в другом приложении/вкладке.
      await tryAutoPasteFromClipboard()
    }
  }
  document.addEventListener('visibilitychange', handler)
  visibilityHandlerAttached = true

  // Возвращаем функцию для отписки:
  cleanupFns.push(() => document.removeEventListener('visibilitychange', handler))
}

/** ============================================================= */

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
    // Сразу же попробуем автопаст после повтора отправки
    maybeAutoPaste()
  } catch (e: any) {
    error.value = e?.response?.data?.error || e?.message || 'Failed to resend code'
  } finally {
    loading.value = false
  }
}

const cleanupFns: Array<() => void> = []

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

  // Стартуем изначальный кулдаун на 2 минуты
  startCooldown(RESEND_SECONDS)

  await nextTick(() => {
    const firstEmpty = digits.value.findIndex((d) => !d)
    const idx = firstEmpty === -1 ? BOX_COUNT - 1 : firstEmpty
    focusIndex(idx)
    selectIndex(idx)
  })

  // Автопопытка вставки на мобильных сразу после монтирования.
  if (isMobile) {
    // Небольшая задержка, чтобы UI стабилизировался.
    setTimeout(() => {
      void tryAutoPasteFromClipboard()
    }, 50)
    attachVisibilityAutoPaste()
  }
})

onBeforeUnmount(() => {
  if (cooldownTimer) window.clearInterval(cooldownTimer)
  cleanupFns.forEach((fn) => fn())
})
</script>

<style scoped>
/* additional styles if needed */
</style>
