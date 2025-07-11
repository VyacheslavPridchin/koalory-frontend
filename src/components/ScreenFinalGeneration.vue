<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-tr from-yellow-50 via-white to-violet-100">
    <div class="card max-w-xl w-full">
      <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center overflow-hidden floating">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover" />
      </div>
      <h2 class="text-3xl font-bold font-[Nunito] text-center mb-3">[Hero Name]'s Epic Adventure is Being Created! ✨</h2>
      <div class="w-full my-6">
        <div class="flex flex-col gap-3 text-base text-left">
          <div class="flex items-center gap-3"><span>🎨</span><span>Perfecting illustrations for <b>[Hero Name]</b>...</span><span class="ml-auto text-yellow-500">●●●○○</span></div>
          <div class="flex items-center gap-3"><span>✍️</span><span>Weaving the [genre] adventure...</span><span class="ml-auto text-violet-400">●●○○○</span></div>
          <div class="flex items-center gap-3"><span>🌟</span><span>Adding the magic of [theme]...</span><span class="ml-auto text-pink-400">●○○○○</span></div>
          <div class="flex items-center gap-3"><span>📚</span><span>Polishing the final masterpiece...</span><span class="ml-auto text-gray-300">○○○○○</span></div>
        </div>
        <div class="h-3 mt-6 bg-gray-200 rounded-full w-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-violet-500 rounded-full animate-pulse" style="width: 45%;"></div>
        </div>
      </div>
      <p class="text-center text-gray-600 mt-3">✨ Creating something truly special for <b>[Hero Name]</b> in <b>[Location]</b>!</p>
      <p class="text-center text-gray-500 text-sm mt-3">🔔 We'll email when ready — usually 3–5 minutes. Feel free to close this window!</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'next'): void
}>()
</script>

<style scoped></style>
