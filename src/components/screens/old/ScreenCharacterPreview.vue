<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-br from-yellow-50 to-pink-100" style="background-color: #F2F1EE">
    <div class="card max-w-lg w-full">
      <div class="logo-wrapper">
        <img src="../../../assets/logo.svg" alt="Logo" class="logo" />
      </div>
      <h2 class="text-3xl font-extrabold font-[Nunito] text-center mb-4">✨ Meet Your Hero! ✨</h2>
      <div class="w-64 h-64 mb-6 rounded-2xl bg-gradient-to-tr from-violet-200 to-amber-200 flex items-center justify-center  overflow-hidden shadow-lg border-4 border-white">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover animate-pulse" />
      </div>
      <p class="text-xl text-gray-700 text-center mb-4">
        Wow! Look how amazing this character looks!
      </p>
      <p class="text-lg text-center mb-8"  style="color: #C1C1C1;">
        Now let's give them a name and personality to create their incredible adventure.
      </p>
      <button @click="$emit('next')" class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-lg transform hover:scale-105">
        Let's Continue!
      </button>
      <div class="flex justify-center items-center gap-1 mt-8">
        <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
      </div>
      <p class="text-xs text-gray-400 mt-2">Step 2 of 7</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const totalDots = 7
const activeDots = 2

defineEmits<{
  (e: 'next'): void
}>()
</script>

<style scoped></style>
