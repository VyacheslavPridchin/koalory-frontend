<template>
    <section class="flex flex-col min-h-screen bg-gradient-to-br from-violet-100 to-yellow-100 px-6 py-4">
      <div class="flex-grow flex justify-center items-center">
        <div class="card max-w-lg w-full">
          <h2 class="text-3xl font-extrabold font-[Nunito] text-center mb-4">🎉 {{ name }} is Ready for Adventure! 🎉</h2>
          <div class="w-full h-48 mb-6 rounded-2xl bg-gradient-to-tr from-violet-200 to-amber-200 flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
            <img
                src="https://via.assets.so/img.jpg?t=Preview&w=1920&h=1080&tc=blue&bg=#cecece"
                alt="Character in Location"
                class="w-full h-full object-cover animate-pulse"
            />
          </div>

          <p class="text-lg text-gray-700 text-center mb-4">Here's how their magical story begins...</p>
          <div class="w-full bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl p-6 mb-8">
            <h3 class="font-bold text-lg mb-2 text-indigo-800">📖 STORY PREVIEW</h3>
            <p class="text-gray-700 italic">
              "[Hero Name] woke up in [Location] feeling
              something magical in the air. Little did they know,
              today would be the day everything changed
              forever... As [he/she] stepped outside, a
              mysterious glow caught [his/her] attention. The
              adventure that would make [Hero Name] a legend
              was about to begin..."
            </p>
            <p class="text-center font-bold text-violet-600 mt-4">Want to discover what happens next? ✨</p>
          </div>
          <button @click="$emit('next')" class="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xl px-12 py-4 rounded-xl shadow-lg transition-all duration-150 transform hover:scale-105 animate-pulse">
            Continue the Story!
          </button>
          <p class="text-sm text-gray-600 mt-4">
            🎯 Choose your adventure package to unlock the full magical tale!
          </p>
          <div class="flex justify-center items-center gap-1 mt-8">
            <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
          </div>
          <p class="text-xs text-gray-400 mt-2">Preview Ready!</p>
        </div>
      </div>
  </section>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";

const totalDots = 7
const activeDots = 7

defineEmits<{
  (e: 'next'): void
}>()

const name = ref<string | null>(null)

onMounted(() => {
  name.value = localStorage.getItem("name");
})
</script>

<style scoped></style>
