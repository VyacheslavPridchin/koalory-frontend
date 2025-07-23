<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16" style="background-color: #F2F1EE">
    <div class="logo-wrapper">
      <img src="../../../assets/logo.svg" alt="Logo" class="logo" />
    </div>
    <div class="card max-w-md w-full relative">
      <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center overflow-hidden">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover" />
      </div>

      <h2 class="text-2xl font-bold font-[Nunito] text-center mb-2">Perfect! Now...</h2>
      <p class="text-lg text-gray-700 text-center mb-4">
        How old is <span class="font-semibold text-orange-500">{{ name }}</span>?
      </p>
      <div class="grid grid-cols-5 gap-3 mb-4">
        <button v-for="n in 10" :key="n" @click="setAge(n + 2)"
                :class="[ 'rounded-lg py-3 px-2 font-bold text-xl transition', age === n + 2 ? 'bg-orange-200 ring-4 ring-orange-400' : 'bg-orange-100 hover:bg-orange-200'
    ]"
        >
          {{ n + 2 }}
        </button>
      </div>

      <div class="flex items-center gap-2 mb-5">
        <span class="text-sm text-gray-500">Custom Age:</span>
        <input
            v-model.number="custom"
            @input="setCustomAge"
            type="number"
            min="1"
            max="99"
            class="w-20 px-3 py-2 rounded-md border border-indigo-200 text-center text-lg"
        />
      </div>

      <p class="text-sm text-gray-500 mb-4 text-center">
        Don't worry – every age gets an amazing adventure!
      </p>
      <button :disabled="!age" @click="() => $emit('next', { age })" class="w-full text-center  bg-orange-500 hover:bg-orange-600  text-white font-bold py-4 rounded-lg text-lg shadow">Continue</button>
      <div class="flex justify-center items-center gap-1 mt-8">
        <span v-for="(dot, index) in totalDots" :key="index" :class="['progress-dot', index < activeDots ? 'active' : 'inactive']"></span>
      </div>
      <p class="text-xs text-gray-400 mt-2">Step 4 of 7</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const totalDots = 7
const activeDots = 4

const emits = defineEmits<{
  (e: 'next', payload: { age: number | null }): void
}>()

const age = ref<number | null>(null)
const custom = ref<number | null>(null)
const name = ref<string | null>(null)

onMounted(() => {
  name.value = localStorage.getItem("name");
})

function setAge(n: number) {
  age.value = n
  custom.value = n
}

function setCustomAge() {
  if (custom.value !== null && !isNaN(custom.value)) {
    age.value = custom.value
  } else {
    age.value = null
  }
}

</script>

<style scoped></style>
