<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-white">
    <div class="card max-w-2xl w-full relative">
      <div class="absolute top-8 right-8 w-28 h-28 rounded-full bg-white/50 border-2 border-violet-100 flex items-center justify-center">
        <img src="https://svgshare.com/i/17xs.svg" alt="Character Preview" class="w-20 h-20"/>
      </div>
      <div class="w-28 h-28 mb-6 rounded-full bg-gradient-to-tr from-yellow-200 to-pink-200 flex items-center justify-center">
        <span class="text-4xl animate-pulse">💖</span><span class="text-4xl">⭐</span>
      </div>
      <h2 class="text-2xl font-bold font-[Nunito] text-center mb-2">
        Almost ready! Is there a special message for [Hero Name]'s story? ✨
      </h2>
      <textarea v-model="theme" rows="3" class="w-full px-5 py-4 rounded-xl border border-violet-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-lg mb-4"></textarea>
      <div class="bg-yellow-50 rounded-lg p-4 text-sm text-gray-600 w-full mb-6">
        <span class="font-semibold">🌟 Popular themes:</span>
        <ul class="list-disc list-inside ml-2">
          <li>Friendship & teamwork, Believing in yourself</li>
          <li>Kindness & helping others, Overcoming fears</li>
          <li>Family love, Being unique & special, Never giving up</li>
        </ul>
        <div class="mt-2">✍️ Or write your own idea — just a few words is perfect!</div>
      </div>
      <div class="flex flex-row gap-4 w-full">
        <button @click="() => $emit('next', { theme: '' })" class="flex-1 bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold py-3 rounded-lg border border-violet-200">
          Skip — Surprise Me!
        </button>
        <button :disabled="!theme" @click="() => $emit('next', { theme })" class="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg shadow disabled:opacity-50">
          Continue with Theme
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const emits = defineEmits<{
  (e: 'next', payload: { theme: string }): void
}>()
const theme = ref('')
</script>

<style scoped></style>
