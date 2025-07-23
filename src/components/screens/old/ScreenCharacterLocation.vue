<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-b from-indigo-50 via-white to-pink-50">
    <div class="logo-wrapper">
      <img src="../../../assets/logo.svg" alt="Logo" class="logo" />
    </div>
    <div class="card max-w-md w-full relative">
      <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center overflow-hidden">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover" />
      </div>
      <h2 class="text-2xl font-bold font-[Nunito] text-center mb-2">
        Now, where does <span class="font-semibold text-orange-500">{{ name }}</span> live? 🏡
      </h2>
      <p class="text-base text-gray-700 text-center mb-4">
        This could be anywhere your imagination takes us...
      </p>
      <input v-model="loc" type="text" placeholder="A magical forest, under the sea..." class="w-full px-5 py-4 rounded-xl border border-indigo-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 text-lg text-center mb-2"/>
      <div class="bg-indigo-50 rounded-lg p-4 text-xs text-left text-gray-600 mt-3 mb-6">
        <span class="font-semibold">💡 Examples:</span>
        <ul class="list-disc list-inside ml-2">
          <li>New York City</li>
          <li>A magical forest village</li>
          <li>Under the sea</li>
          <li>On Mars</li>
          <li>A cozy countryside farm</li>
        </ul>
      </div>
      <button :disabled="!loc" @click="() => $emit('next', { location: loc })" class="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg text-lg shadow">Continue</button>
      <div class="flex justify-center items-center gap-1 mt-8">
        <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
      </div>
      <p class="text-xs text-gray-400 mt-2">Step 6 of 7</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const totalDots = 7
const activeDots = 6

const emits = defineEmits<{
  (e: 'next', payload: { location: string }): void
}>()

const loc = ref('')
const name = ref<string | null>(null)

onMounted(() => {
  name.value = localStorage.getItem("name");
})
</script>

<style scoped></style>
