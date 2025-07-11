<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-6 py-16 bg-gradient-to-br from-yellow-50 via-white to-violet-100">
    <div class="max-w-4xl w-full mx-auto flex flex-col items-center">
      <div class=" right-8 mb-6 w-28 h-28 rounded-full bg-violet-50 border-4 border-violet-100 flex items-center justify-center overflow-hidden">
        <img src="https://i.pravatar.cc/150?img=11" alt="Character Preview" class="w-full h-full object-cover" />
      </div>
      <h2 class="text-3xl font-extrabold font-[Nunito] text-center mb-2">
        Unlock [Hero Name]'s Complete Adventure! 📚
      </h2>
      <p class="text-lg text-gray-700 text-center mb-8">
        You've seen how amazing [Hero Name] looks and felt the magic beginning...
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <!-- Free -->
        <div class="rounded-2xl border-4 border-yellow-400 bg-yellow-50 shadow-lg p-7 flex flex-col items-center text-center transform scale-105">
          <h3 class="font-extrabold text-2xl mb-2 font-[Nunito]">FIRST STORY FREE</h3>
          <ul class="text-gray-700 text-base text-left mb-6 space-y-2 list-disc list-inside">
            <li>Complete 6,000+ word story</li>
            <li>Multiple custom illustrations</li>
            <li>Professional PDF format</li>
            <li>Email delivery in 5 minutes</li>
          </ul>
          <button @click="$emit('next')" class="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 mt-auto rounded-lg shadow-lg">
            Get My Free Story
          </button>
          <p class="text-xs text-gray-600 mt-2">No credit card required!</p>
        </div>
        <!-- Bundle -->
        <div class="relative rounded-2xl border-2 border-orange-400 bg-orange-50 shadow-lg p-7 flex flex-col items-center text-center">
          <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">BEST VALUE</span>
          <h3 class="font-extrabold text-2xl mb-2 font-[Nunito]">3-STORY BUNDLE</h3>
          <p class="text-4xl font-extrabold text-gray-800 mb-2">$5.99</p>
          <ul class="text-gray-700 text-base text-left mb-6 space-y-2 list-disc list-inside">
            <li>3 complete adventures</li>
            <li>Try different genres</li>
            <li>Perfect for testing favorites</li>
          </ul>
          <button @click="$emit('next')" class="w-full bg-orange-400 hover:bg-orange-300 text-gray-900 font-bold py-3 mt-auto rounded-lg shadow">
            Choose Bundle
          </button>
        </div>
        <!-- Unlimited -->
        <div class="rounded-2xl border-2 border-violet-400 bg-violet-50 shadow-lg p-7 flex flex-col items-center text-center">
          <h3 class="font-extrabold text-2xl mb-2 font-[Nunito]">UNLIMITED</h3>
          <p class="text-4xl font-extrabold text-gray-800 mb-2">$9.99<span class="text-lg font-normal">/mo</span></p>
          <ul class="text-gray-700 text-base text-left mb-6 space-y-2 list-disc list-inside">
            <li>Unlimited stories</li>
            <li>All genres & themes</li>
            <li>Priority support</li>
          </ul>
          <button @click="$emit('next')" class="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 mt-auto rounded-lg shadow">
            Get Unlimited
          </button>
          <p class="text-xs text-gray-600 mt-2">Cancel anytime</p>
        </div>
      </div>
      <p class="text-center mt-8 text-gray-500 text-sm">🔒 Secure checkout • 30-day money back guarantee</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'next'): void
}>()
</script>

<style scoped></style>
