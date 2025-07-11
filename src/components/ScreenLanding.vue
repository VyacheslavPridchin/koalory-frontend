<template>
  <section class="magical-bg min-h-screen flex flex-col justify-center items-center relative px-6 py-16">
    <div class="max-w-3xl text-center relative z-10">
      <h1 class="text-5xl md:text-6xl font-extrabold font-[Nunito] leading-tight mb-4 text-white drop-shadow-lg">
        Transform Your Child Into The Hero Of Their Own Story ✨
      </h1>
      <p class="text-xl font-semibold text-indigo-100 mb-8">
        AI-generated personalized fairytales in 5 minutes
      </p>
      <button @click="$emit('next')" class="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xl px-14 py-5 rounded-xl shadow-lg transition-all duration-150 mb-3 transform hover:scale-105">
        START FOR FREE
      </button>
      <div class="text-indigo-100 text-base mb-6">No credit card required • First story completely free</div>
      <div class="flex items-center justify-center gap-2 text-yellow-200 text-lg">
        <span class="text-2xl">⭐</span>4.9/5 from 10,000+ happy families
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'next'): void
}>()
</script>

<style scoped>
/* (all styles are in global index.css) */
</style>
