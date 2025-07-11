<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-tl from-pink-50 via-white to-violet-100">
    <div class="card max-w-4xl w-full">
      <img src="https://via.assets.so/img.jpg?t=Icon&w=150&h=150&tc=blue&bg=#cecece" class="h-24 mb-7 mx-auto floating" alt="Magical Books"/>
      <h2 class="text-3xl font-bold font-[Nunito] text-center mb-2">
        Perfect! Now what kind of adventure should [Hero Name] have?
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8 mb-3 w-full">
        <div
            v-for="opt in options"
            :key="opt.value"
            @click="select(opt.value)"
            :class="[
      'p-4 rounded-xl border-2 cursor-pointer transform transition-transform text-center',
      opt.border,
      opt.bg,
      selectedGenres.includes(opt.value) ? 'border-4 border-violet-500 scale-105 shadow-md' : 'hover:-translate-y-1'
    ]"
        >
          <span class="text-4xl mb-2 block">{{ opt.icon }}</span>
          <div class="font-bold">{{ opt.label }}</div>
        </div>
      </div>

      <button
          :disabled="selectedGenres.length === 0"
          @click="() => $emit('next', { genre: selectedGenres })"
          class="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-12 rounded-lg text-lg shadow disabled:opacity-50"
      >
        Continue
      </button>

    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const emits = defineEmits<{
  (e: 'next', payload: { genre: string[] }): void
}>()

const selectedGenres = ref<string[]>([])

const options = [
  { value: 'fantasy', label: 'Fantasy & Magic', icon: '🔮', border: 'border-violet-200', bg: 'bg-gradient-to-br from-violet-50 to-white' },
  { value: 'epic',    label: 'Epic Adventure', icon: '🗺️', border: 'border-yellow-200', bg: 'bg-gradient-to-br from-yellow-50 to-white' },
  { value: 'mystery', label: 'Mystery & Detective', icon: '🕵️', border: 'border-pink-200', bg: 'bg-gradient-to-br from-pink-50 to-white' },
  { value: 'fun',     label: 'Comedy & Fun', icon: '😄', border: 'border-orange-200', bg: 'bg-gradient-to-br from-orange-50 to-white' },
  { value: 'cozy',    label: 'Cozy & Heartwarming', icon: '🏠', border: 'border-green-200', bg: 'bg-gradient-to-br from-green-50 to-white' },
  { value: 'bedtime', label: 'Peaceful Bedtime', icon: '🌙', border: 'border-blue-200', bg: 'bg-gradient-to-br from-blue-50 to-white' },
  { value: 'growth',  label: 'Inspiring & Growth', icon: '🧠', border: 'border-indigo-200', bg: 'bg-gradient-to-br from-indigo-50 to-white' },
  { value: 'custom',  label: 'Custom Theme', icon: '🎨', border: 'border-gray-200', bg: 'bg-gradient-to-br from-gray-100 to-white' },
]

function select(value: string) {
  if (selectedGenres.value.includes(value)) {
    selectedGenres.value = selectedGenres.value.filter(g => g !== value)
  } else {
    selectedGenres.value.push(value)
  }
}
</script>

<style scoped></style>
