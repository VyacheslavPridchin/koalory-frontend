<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-b from-violet-50 via-white to-yellow-50">
    <div class="card max-w-2xl w-full relative">
      <div class="w-28 h-28 mb-6 rounded-full bg-gradient-to-br from-pink-200 to-violet-200 flex items-center justify-center">
        <span class="text-4xl animate-bounce">🎨</span><span class="text-4xl animate-pulse">🎮</span><span class="text-4xl">🦸</span>
      </div>
      <h2 class="text-2xl font-bold font-[Nunito] text-center mb-2">Let's make [Hero Name]'s story even more magical!</h2>
      <p class="text-base text-gray-700 text-center mb-4">Tell me what [Hero Name] loves most...</p>
      <textarea v-model="text" rows="4" class="w-full px-5 py-4 rounded-xl border border-violet-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-lg mb-3"></textarea>
      <div class="text-sm text-gray-600 mb-4 text-left w-full bg-violet-50 p-3 rounded-lg">
        <p class="font-bold">💡 Include:</p>
        <p>🎨 Interests & passions, 🧩 Favorite hobbies, 🎮 Games they love, 📚 School subjects, 🧸 Favorite toys/characters, 🦸 Heroes they admire</p>
      </div>
      <button :disabled="!text" @click="() => $emit('next', { interests: text })" class="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-lg text-lg shadow disabled:opacity-50">Continue</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const emits = defineEmits<{
  (e: 'next', payload: { interests: string }): void
}>()
const text = ref('')
</script>

<style scoped></style>
