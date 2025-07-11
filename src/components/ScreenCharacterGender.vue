<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-white">
    <div class="card max-w-md w-full relative">
      <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center overflow-hidden">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover" />
      </div>
      <h2 class="text-2xl font-bold font-[Nunito] text-center mb-5">Choose <span class="font-semibold text-violet-700">{{ name }}'s</span> gender:</h2>
      <div class="flex flex-row gap-4 justify-center items-stretch mb-3">
        <button
            @click="select('Boy')"
            :class="[
      'flex flex-col items-center justify-center p-4 w-28 flex-1 rounded-xl shadow text-center transition',
      gender === 'Boy' ? 'bg-violet-200 ring-4 ring-violet-400' : 'bg-violet-50 hover:bg-violet-200'
    ]"
        >
          <span class="text-3xl">👦</span>
          <span class="text-xl font-bold">Boy</span>
        </button>

        <button
            @click="select('Girl')"
            :class="[
      'flex flex-col items-center justify-center p-4 w-28 flex-1 rounded-xl shadow text-center transition',
      gender === 'Girl' ? 'bg-violet-200 ring-4 ring-violet-400' : 'bg-violet-50 hover:bg-violet-200'
    ]"
        >
          <span class="text-3xl">👧</span>
          <span class="text-xl font-bold">Girl</span>
        </button>

        <button
            @click="select('Other')"
            :class="[
      'flex flex-col items-center justify-center p-4 w-28 flex-1 rounded-xl shadow text-center transition',
      gender === 'Other' ? 'bg-violet-200 ring-4 ring-violet-400' : 'bg-violet-50 hover:bg-violet-200'
    ]"
        >
          <span class="text-3xl">⭐</span>
          <span class="text-xl font-bold">Other</span>
        </button>
      </div>

      <p class="text-center text-base text-gray-500 mb-7 mt-3">🌈 Every hero is special and unique in their own way!</p>
      <button :disabled="!gender" @click="() => $emit('next', { gender })" class="w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-lg text-lg shadow">Continue</button>
      <div class="flex justify-center items-center gap-1 mt-8">
        <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
      </div>
      <p class="text-xs text-gray-400 mt-2">Step 5 of 7</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const totalDots = 7
const activeDots = 5

const emits = defineEmits<{
  (e: 'next', payload: { gender: string }): void
}>()

const gender = ref<string>('')
const name = ref<string | null>(null)

onMounted(() => {
  name.value = localStorage.getItem("name");
})

function select(g: string) { gender.value = g }
</script>

<style scoped></style>
