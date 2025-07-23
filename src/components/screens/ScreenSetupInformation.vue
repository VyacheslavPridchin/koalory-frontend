<template>
  <section class="justify-square flex flex-col px-4 py-6 ">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-4xl card">
        <!-- Header -->
        <div class="flex flex-col items-center mb-6">
          <div class="w-12 h-12 mb-2 bg-orange-50 rounded-full flex items-center justify-center text-2xl">
              🪄
          </div>
          <h1 class="text-2xl font-extrabold">Create Your Hero</h1>
          <p class="text-gray-500">Tell us a little about the main character.</p>
        </div>

        <!-- Form grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Photo upload -->
          <div>
            <h3 class="text-sm font-semibold mb-2">1. Hero's Photo</h3>
            <div
                class="relative flex flex-col items-center justify-center p-4 bg-orange-50 border-2 border-dashed border-orange-400 rounded-2xl text-orange-500 font-bold text-center cursor-pointer hover:bg-yellow-50 hover:border-yellow-400 transition min-h-[240px]"
                @dragover.prevent @dragenter.prevent @drop.prevent="onDrop" @click="fileInput?.click()"
            >
              <template v-if="preview">
                <img :src="preview" class="w-24 h-24 object-cover rounded-xl shadow mb-2" />
                <button @click.stop="clearImage"
                        class="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50">
                  ❌
                </button>
              </template>
              <template v-else>
                <span class="text-3xl mb-1">📷</span>
                <div>Click to upload</div>
                <div class="text-xs text-gray-500">PNG, JPG up to 10MB</div>
              </template>
              <input type="file" accept="image/png,image/jpeg" class="hidden" ref="fileInput"
                     @change="onFileChange" />
            </div>
            <p class="text-gray-400 text-center" style="font-size: 12px; padding-top: 10px">🔒 We only use the photo to create illustrations, then we securely delete it.</p>
          </div>

          <!-- Inputs -->
          <div class="space-y-4">
            <!-- Name & Gender -->
            <div>
              <h3 class="text-sm font-semibold mb-2">2. Name & Gender</h3>
              <input
                  v-model="name"
                  type="text"
                  placeholder="e.g., Anna or Little Fox"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 text-lg mb-3"
              />
              <div class="flex gap-2">
                <button
                    @click="gender = 'Boy'"
                    :class="gender === 'Boy' ? activeBtn : inactiveBtn"
                >
                  👦 Boy
                </button>
                <button
                    @click="gender = 'Girl'"
                    :class="gender === 'Girl' ? activeBtn : inactiveBtn"
                >
                  👧 Girl
                </button>
              </div>
            </div>

            <!-- Age -->
            <div>
              <h3 class="text-sm font-semibold mb-2">3. Age</h3>
              <div class="flex items-center gap-2">
                <input
                    type="range"
                    min="1"
                    max="12"
                    v-model.number="age"
                />
                <input
                    type="number"
                    v-model.number="age"
                    min="1"
                    class="w-12 px-2 py-1 rounded-md border border-gray-300 text-center"
                />
              </div>
            </div>

            <!-- Location -->
            <div>
              <h3 class="text-sm font-semibold mb-2">4. Where does the hero live?</h3>
              <input
                  v-model="location"
                  type="text"
                  placeholder="In a treehouse, a crystal castle..."
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 text-lg"
              />
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <button
            :disabled="!canSubmit || isLoading"
            @click="createHero"
            class="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg shadow disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          <span v-if="!isLoading">✨ Create Hero</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"/>
          </svg>
        </button>

      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from 'vue'

const router = useRouter();

const selected = ref<File | null>(null)
const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const isLoading = ref(false)

onMounted(async () => {
  if(!isAuth.value) await router.push('/auth')
  if((await getAvailableStories()).available_stories == 0) await router.push('/account')
})

function handleFile(file: File) {
  const img = new Image()
  const reader = new FileReader()

  reader.onload = () => {
    if (typeof reader.result === 'string') {
      img.src = reader.result
    }
  }

  img.onload = () => {
    const MAX_SIZE = 512
    const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height, 1)
    const width = Math.round(img.width * scale)
    const height = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, width, height)

    canvas.toBlob((blob) => {
      if (blob) {
        const resizedFile = new File([blob], file.name, { type: file.type })
        selected.value = resizedFile
        preview.value = URL.createObjectURL(resizedFile)
      }
    }, file.type)
  }

  reader.readAsDataURL(file)
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}
function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}
function clearImage() {
  selected.value = null
  preview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const name = ref('')
const gender = ref('')
const age = ref<number | null>(5)
const location = ref('')

const canSubmit = computed(() =>
    selected.value && name.value && gender.value && age.value !== null && location.value
)

const activeBtn =
    'flex-1 py-2 rounded-xl shadow ring-4 ring-orange-400 bg-orange-200 transition'
const inactiveBtn =
    'flex-1 py-2 rounded-xl shadow bg-white border border-gray-300 hover:bg-gray-50 transition'

import {createStory, getAvailableStories, isAuth, submitFirstScreen} from '@/services/api'
import type { FirstScreenPayload } from '@/services/api'
import {useRoute, useRouter} from "vue-router";
const jobId = ref<number>()

const route = useRoute()

async function createHero() {
  if (!selected.value || !name.value || !gender.value || !age.value || !location.value) return

  isLoading.value = true

  const reader = new FileReader()
  reader.onload = async () => {
    localStorage.setItem('photo', reader.result as string)
    localStorage.setItem('name', name.value)
    localStorage.setItem('gender', gender.value)
    localStorage.setItem('age', String(age.value))
    localStorage.setItem('location', location.value)

    try {

      const raw = route.query.job_id
      const query_job_id = Array.isArray(raw)
          ? Number(raw[0])
          : Number(raw)

      if (query_job_id) {
        jobId.value = query_job_id
      } else {
        const { job_id } = await createStory()
        jobId.value = job_id
      }

      const payload: FirstScreenPayload = {
        job_id: jobId.value,
        name: name.value,
        gender: gender.value,
        age: age.value ?? 5,
        location: location.value,
        photo: selected.value!
      }

      await submitFirstScreen(payload)
      await router.push({ path: '/story/preview', query: { job_id: String(jobId.value) } })
    } catch (err: any) {
      console.error(err.response?.data?.detail || 'Ошибка при отправке данных')
    } finally {
      isLoading.value = false
    }
  }

  reader.readAsDataURL(selected.value)
}



</script>

<style scoped>
/* slider */
input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  height: 4px;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  background: #FC7B00;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

}
input[type=range]::-webkit-slider-runnable-track {
  height: 8px;
  background: #d1d5db;
  border-radius: 99px;
}
input[type=range]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  background: #FC7B00;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
}
input[type=range]::-moz-range-track {
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

</style>
