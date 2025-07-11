<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-4 bg-gradient-to-b from-violet-50 via-white to-yellow-50">
    <div class="flex-grow flex justify-center items-center">
      <div class="card max-w-lg w-full">
        <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center overflow-hidden floating">
          <img src="https://via.assets.so/img.jpg?t=Icon&w=150&h=150&tc=blue&bg=#cecece" alt="Character Preview" class="w-full h-full object-cover" />
        </div>

        <h2 class="text-[1.8rem] font-extrabold font-[Nunito] text-center mb-2 whitespace-nowrap">
          Let's bring your hero to life! 🌟
        </h2>
        <p class="text-lg text-gray-600 text-center mb-6">
          Upload a photo to see the magic happen instantly.
        </p>

        <!-- Drag & Drop Zone -->
        <div
            class="relative w-full flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-violet-50 to-yellow-50 rounded-2xl border-2 border-dashed border-violet-200 cursor-pointer transition hover:bg-yellow-50 hover:border-yellow-400 text-violet-700 font-bold text-lg mb-4 min-h-[220px]"
            @dragover.prevent
            @dragenter.prevent
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
        >
          <!-- If image is selected, show preview -->
          <template v-if="preview">
            <img :src="preview" alt="Preview" class="w-32 h-32 object-cover rounded-xl shadow-md floating" />
            <button @click.stop="clearImage" class="absolute -top-2 -right-2 bg-white text-red-500 rounded-full shadow p-1 text-sm hover:bg-red-100 transition">
              ❌
            </button>
          </template>

          <template v-else>
            <span class="text-4xl mb-2">📷</span>
            <span>Upload Photo</span>
            <span class="block mt-2 text-sm text-gray-500 font-normal">or drag and drop here</span>
            <span class="block mt-1 text-xs text-gray-400 font-normal">Supported: JPG, PNG (max 10MB)</span>
          </template>

          <input type="file" accept="image/jpeg,image/png" class="hidden" ref="fileInput" @change="onFileChange" />
        </div>

        <!-- Info Section -->
        <div class="bg-indigo-50 rounded-lg p-4 text-sm text-gray-700 mb-6 text-center">
          ✨ <strong>Why photo first?</strong> You'll see your character come to life immediately!
        </div>

        <div class="flex items-center justify-center gap-2 mb-6">
          <span class="text-gray-400 text-lg">🔒</span>
          <span class="text-xs text-gray-500">
            <strong>Privacy Promise:</strong> We only use your photo to create character art, then securely delete it.
          </span>
        </div>

        <p class="text-xs text-gray-500 text-center mb-6">
          💡 <strong>Tip:</strong> Clear face photos work best - but any photo creates magic!
        </p>

        <button
            :disabled="!selected"
            @click="() => $emit('next', { photo: selected })"
            class="w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-lg text-lg shadow disabled:opacity-50"
        >
          ✨ Create My Hero
        </button>

        <div class="flex justify-center items-center gap-1 mt-8">
          <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
        </div>
        <p class="text-xs text-gray-400 mt-2">Step 1 of 7</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const totalDots = 7
const activeDots = 1

const emits = defineEmits<{
  (e: 'next', payload: { photo: File | null }): void
}>()

const selected = ref<File | null>(null)
const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleFile(file: File) {
  selected.value = file
  preview.value = URL.createObjectURL(file)
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) handleFile(files[0])
}

function onDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files && files[0]) handleFile(files[0])
}

function clearImage() {
  selected.value = null
  preview.value = null
  fileInput.value?.value && (fileInput.value.value = '')
}
</script>

<style scoped>
</style>
