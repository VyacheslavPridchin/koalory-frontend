<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-white">
    <div class="card max-w-md w-full relative">
      <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center overflow-hidden">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover" />
      </div>
      <span class="text-4xl mb-4">🌟</span>
      <h2 class="text-2xl font-bold font-[Nunito] text-center mb-2">Your hero is waiting for a name...</h2>
      <p class="text-lg text-gray-700 text-center mb-6">What should we call them?</p>
      <input v-model="name" type="text" placeholder="Type the name here" class="w-full px-5 py-4 rounded-xl border border-indigo-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-xl text-center mb-2"/>
      <p class="text-gray-500 text-xs text-center mb-7">
        ✨ This could be your child, yourself, or any special person you want to see as the main character.
      </p>
      <button :disabled="!name" @click="handleContinue" class="w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-lg text-lg shadow disabled:opacity-50">Continue</button>
      <div class="flex justify-center items-center gap-1 mt-8">
        <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
      </div>
      <p class="text-xs text-gray-400 mt-2">Step 3 of 7</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const totalDots = 7
const activeDots = 3

const emits = defineEmits<{
  (e: 'next', payload: { name: string }): void
}>()

const name = ref('')

const handleContinue = () => {
  localStorage.setItem("name", name.value)
  emits('next', { name: name.value })
}
</script>

<style scoped></style>
