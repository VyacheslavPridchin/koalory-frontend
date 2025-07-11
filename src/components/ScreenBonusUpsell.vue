<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-tl from-yellow-50 via-white to-violet-100">
    <div class="card max-w-2xl w-full">
      <div class="flex items-center justify-center -space-x-8 mb-6">
        <div class="w-24 h-24 rounded-full bg-violet-200 border-4 border-white shadow-lg z-10 flex items-center justify-center">
          <img src="https://svgshare.com/i/17xs.svg" class="w-16"/>
        </div>
        <div class="w-20 h-20 rounded-full bg-pink-200 border-4 border-white shadow-lg flex items-center justify-center"><span class="text-4xl">👩</span></div>
        <div class="w-20 h-20 rounded-full bg-blue-200 border-4 border-white shadow-lg flex items-center justify-center"><span class="text-4xl">👨</span></div>
      </div>
      <h2 class="text-3xl font-bold font-[Nunito] text-center mb-2">[Hero Name] was just the beginning… 👑</h2>
      <p class="text-base text-gray-700 text-center mb-6">
        Since you loved [Hero Name]'s adventure, imagine creating stories for family, friends, or for special occasions!
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
        <div class="relative rounded-2xl border-2 border-orange-400 bg-orange-50 shadow-lg p-6 flex flex-col items-center text-center">
          <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">GREAT VALUE</span>
          <h3 class="font-extrabold text-xl mb-2 font-[Nunito]">3-STORY BUNDLE</h3>
          <p class="text-3xl font-extrabold text-gray-800 mb-2">$5.99</p>
          <ul class="text-gray-700 text-sm text-left mb-4 list-disc list-inside">
            <li>Try different characters & genres</li>
            <li>Perfect for the whole family</li>
          </ul>
          <button @click="$emit('next')" class="w-full bg-orange-400 hover:bg-orange-300 text-gray-900 font-bold py-3 rounded-lg shadow">Create More Magic</button>
        </div>
        <div class="rounded-2xl border-2 border-violet-400 bg-violet-50 shadow-lg p-6 flex flex-col items-center text-center">
          <h3 class="font-extrabold text-xl mb-2 font-[Nunito]">UNLIMITED STORIES</h3>
          <p class="text-3xl font-extrabold text-gray-800 mb-2">$9.99<span class="text-lg font-normal">/mo</span></p>
          <ul class="text-gray-700 text-sm text-left mb-4 list-disc list-inside">
            <li>Create whenever inspiration strikes</li>
            <li>All genres and themes included</li>
          </ul>
          <button @click="$emit('next')" class="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg shadow">Go Unlimited</button>
        </div>
      </div>
      <a @click="$emit('next')" class="text-center text-sm text-gray-500 underline mt-2 cursor-pointer">Maybe Later — I'm Happy with One</a>
      <p class="text-xs text-gray-400 mt-4">⭐ 97% of families who try one story create at least 3 more!</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'next'): void
}>()
</script>

<style scoped></style>
