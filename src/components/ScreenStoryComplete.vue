<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-br from-yellow-50 via-white to-violet-100">
    <div class="card max-w-2xl w-full">
      <span class="text-6xl mb-4">🎉</span>
      <h2 class="text-4xl font-extrabold font-[Nunito] text-center mb-4">[Hero Name]'s Adventure is Complete!</h2>
      <div class="w-full flex flex-col md:flex-row items-center gap-8 mb-6">
        <div class="flex-shrink-0">
          <div class="w-48 h-64 bg-violet-200 rounded-lg shadow-2xl flex items-center justify-center border-4 border-white">
            <img src="https://svgshare.com/i/17xs.svg" alt="Story Cover" class="w-32" />
          </div>
        </div>
        <div class="flex-1 text-center md:text-left">
          <h3 class="text-2xl font-bold text-violet-800">"[Generated Story Title]"</h3>
          <p class="italic text-gray-600 mb-4">A personalized [genre] adventure featuring [Hero Name]</p>
          <ul class="text-gray-700 text-base mb-4 space-y-1">
            <li>📖 <b>6,247 words</b> of pure magic</li>
            <li>🎨 Custom illustrations featuring <b>[Hero Name]</b> in <b>[Location]</b></li>
            <li>✨ Delivered to your email in beautiful PDF format</li>
          </ul>
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <button class="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg shadow text-lg">📧 Check Your Email</button>
            <button @click="$emit('next')" class="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg shadow text-lg">🔄 Create Another Story</button>
          </div>
        </div>
      </div>
      <p class="text-xs text-gray-500 mb-6">Story sent to: [email address]. Also check spam folder!</p>
      <div class="flex flex-wrap gap-3 justify-center">
        <button class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">📱 Share with Friends</button>
        <button class="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">⭐ Rate Us</button>
        <button class="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">💬 Leave Feedback</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'next'): void
}>()
</script>

<style scoped></style>
