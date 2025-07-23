<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-5xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 mt-8 max-w-6xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-800">Your Tales 📚</h1>
          <div class="flex items-center space-x-4 text-sm text-gray-700">
            <span>
              Available to create:
              <span class="text-indigo-600 font-semibold">{{ availableToCreate }}</span>
            </span>
            <img
                src="@/assets/icon-logout.svg"
                alt="Logout"
                class="w-6 h-6 cursor-pointer"
                style="filter: invert(1);"
                @click="onLogout"
            />
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4 sm:gap-6 max-w-6xl mx-auto items-stretch">
          <!-- Create New Tale -->
          <div
              @click="createNewTale"
              class="bg-[#F5F3FF] border-2 border-dashed border-indigo-200 rounded-xl flex flex-col items-center justify-center text-indigo-600 cursor-pointer
                   shadow-sm hover:shadow-md transition duration-200 ease-out
                   h-full min-h-[260px] hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97]"
          >
            <div class="bg-white rounded-full shadow w-16 h-16 flex items-center justify-center mb-2 text-4xl">
              +
            </div>
            <div class="text-xs font-semibold text-center">Create New Tale</div>
          </div>

          <!-- Buy More Tales -->
          <div
              @click="buyMoreTales"
              class="bg-[#FEFCE8] border-2 border-dashed border-yellow-300 rounded-xl flex flex-col items-center justify-center text-yellow-600 cursor-pointer
                   shadow-sm hover:shadow-md transition duration-200 ease-out
                   h-full min-h-[260px] hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97]"
          >
            <div class="bg-white rounded-full shadow w-16 h-16 flex items-center justify-center mb-2 text-3xl">
              🛒
            </div>
            <div class="text-xs font-semibold text-center">Buy More Tales</div>
          </div>

          <!-- Tale Cards -->
          <div
              v-for="(tale, idx) in tales"
              :key="tale.id"
              @click="openTale(tale.id)"
              class="bg-white rounded-xl shadow p-3 flex flex-col justify-between cursor-pointer
                   h-full min-h-[260px] transition duration-200 ease-out
                   hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97]"
          >
            <div
                class="rounded-md aspect-[5/6] mb-3 relative overflow-hidden"
                :style="{ backgroundColor: randomColor() }"
            >
              <img
                  v-if="tale.image"
                  :src="tale.image"
                  alt="Tale cover"
                  class="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>

            <div class="text-sm font-semibold text-gray-900 leading-snug">{{ tale.title }}</div>
            <div class="text-xs text-gray-500">{{ tale.genre }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from "vue-router";
import {getAllStories, getAvailableStories, isAuth, logOut} from "@/services/api.ts";

const router = useRouter()
const availableToCreate = ref<number>(0);

const colors = ['#D5C8FB', '#FBD0D8', '#FDE57C', '#A4F0C1', '#C2F2F2', '#FFDADA', '#FFE9A3'];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const tales = ref<{id: number; title: string; genre: string; image: string}[]>([]);

function openTale(id: number) {
  console.log('Open tale with ID:', id);
  router.push('/story/complete?job_id=' + id);

  // router.push(`/tale/${id}`);
}

function createNewTale() {
  console.log('Create new tale');
  router.push('/story/setup');
}

function buyMoreTales() {
  console.log('Buy more tales');
  router.push('/pricing');

  // open modal or go to store
}

function onLogout() {
  console.log('Logout clicked');
  // Очистить токен/выйти
  logOut();
}

onMounted(async () => {
  availableToCreate.value = (await getAvailableStories()).available_stories;
  const stories = await getAllStories();

  tales.value = stories.stories.map((s, i) => ({
    id: s.job_id, // или другое уникальное значение
    title: s.title ?? 'Без названия',
    genre: s.theme ?? 'Story', // если нет жанра — укажи заглушку
    image: s.image ?? ''
  }));
});

</script>
