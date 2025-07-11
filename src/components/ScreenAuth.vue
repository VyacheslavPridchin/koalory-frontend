<template>
  <section class="flex flex-col justify-center items-center min-h-screen px-4 py-6 bg-white">
    <div class="flex-grow flex justify-center items-center w-full">
      <div class="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-violet-100">
        <h2 class="text-2xl sm:text-3xl font-extrabold font-[Nunito] text-center mb-2">
          Welcome to Koalory! 👋
        </h2>
        <p class="text-base sm:text-lg text-gray-600 text-center mb-8">
          Let's create something magical together.
        </p>
        <div class="flex flex-col gap-4 mb-7">
          <button class="w-full bg-[#4285F4] hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 shadow">
            <span>📧</span> Continue with Gmail
          </button>
          <button class="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-3 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 border border-indigo-300">
            Continue with Email
          </button>
        </div>
        <div class="flex items-center mb-5">
          <hr class="flex-1 border-gray-200" />
          <span class="mx-3 text-gray-400 text-xs tracking-wider">OR</span>
          <hr class="flex-1 border-gray-200" />
        </div>
        <form class="flex flex-col gap-4 mb-6">
          <div>
            <label class="text-sm text-gray-600 font-semibold">📧 Email:</label>
            <input type="email" class="w-full mt-1 px-4 py-2 rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none transition" placeholder="your@email.com" />
          </div>
          <div>
            <label class="text-sm text-gray-600 font-semibold">🔒 Create Password:</label>
            <input type="password" class="w-full mt-1 px-4 py-2 rounded-md border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-200 outline-none transition" placeholder="Make it strong!" />
          </div>
          <button @click.prevent="$emit('next')" class="w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg mt-2 text-base sm:text-lg shadow">
            Create My Account
          </button>
        </form>
        <p class="text-center text-gray-500 text-sm mb-2">
          Already have an account? <a href="#" class="text-violet-600 font-bold underline">Sign In</a>
        </p>
        <div class="flex items-center justify-center gap-2 mt-4">
          <span class="text-gray-400 text-lg">🔒</span>
          <span class="text-xs sm:text-sm text-gray-400">Your data is safe with us. We use bank-level encryption.</span>
        </div>
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
