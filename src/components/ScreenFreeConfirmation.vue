<template>
  <section class="flex flex-col min-h-screen px-6 py-4 bg-white">
    <div class="flex-grow flex justify-center items-center">
      <div class="card max-w-lg w-full">
      <div class="w-32 h-32 mb-6 rounded-full bg-gradient-to-tr from-yellow-200 to-violet-200 flex items-center justify-center floating">
        <span class="text-6xl">🎉</span>
      </div>
      <h2 class="text-3xl font-extrabold font-[Nunito] text-center mb-3">Awesome! Your Free Story is Coming!</h2>
      <p class="text-lg text-gray-600 text-center mb-6">[Hero Name]'s adventure is being crafted right now...</p>
      <div class="w-full bg-indigo-50 rounded-xl p-6 mb-8 text-left text-lg">
        <p class="mb-2">📧 <strong>Check your email in 5 minutes</strong> for:</p>
        <ul class="list-disc list-inside space-y-1 text-base text-gray-700">
          <li>✅ Complete personalized story (6,000+ words)</li>
          <li>✅ Custom illustrations featuring [Hero Name]</li>
          <li>✅ Professional PDF ready to read or print</li>
        </ul>
      </div>
      <p class="text-base text-gray-600 mb-8">🔔 Don't forget to check the spam folder - sometimes magic gets lost there!</p>
      <p class="text-lg text-gray-700 text-center mb-4">While you wait, want to create even more adventures?</p>
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <button @click="$emit('next')" class="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg shadow">Add Another Character</button>
        <button @click="$emit('next')" class="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg shadow">Upgrade to Bundle</button>
      </div>
      <a @click="$emit('next')" class="text-gray-500 underline mt-4 text-sm cursor-pointer">Skip for Now</a>
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
