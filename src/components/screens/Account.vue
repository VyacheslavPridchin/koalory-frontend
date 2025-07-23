<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <transition name="fade">
      <div v-if="isLoaded" class="w-full max-w-5xl">
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

        <!-- Cards Grid (с fade-анимацией появления) -->
          <div
              class="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4 sm:gap-6 max-w-6xl mx-auto items-stretch"
          >
            <!-- Create New Tale -->
            <div
                v-if="availableToCreate > 0"
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
                @click="openTale(tale)"
                class="bg-white rounded-xl shadow p-3 flex flex-col justify-between cursor-pointer
                     h-full min-h-[260px] transition duration-200 ease-out
                     hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97]"
            >
              <div
                  class="rounded-md aspect-[5/6] mb-3 relative overflow-hidden"
                  :style="{ backgroundColor: randomColor() }"
              >
                <transition name="fade">
                  <img
                      v-if="tale.imageVisible"
                      :src="tale.imageUrl"
                      alt="Tale cover"
                      class="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </transition>
              </div>

              <div class="flex flex-col justify-start items-stretch flex-1">
                <div class="flex justify-between items-start gap-2">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                      {{ tale.title }}
                    </div>
                  </div>
                  <div
                      class="px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap mt-0.5"
                      :class="tale.progress === 'finished'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'"
                  >
                    {{ tale.progress === 'finished' ? 'Complete' : 'Unfinished' }}
                  </div>
                </div>
              </div>

            </div>
          </div>
      </div>
      </transition>
    </div>
  </section>
</template>


<script setup lang="ts">import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllStories, getAvailableStories, logOut } from '@/services/api.ts';

const router = useRouter();
const availableToCreate = ref<number>(0);
const isLoaded = ref<boolean>(false);

const colors = ['#D5C8FB', '#FBD0D8', '#FDE57C', '#A4F0C1', '#C2F2F2', '#FFDADA', '#FFE9A3'];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

type Tale = {
  id: number;
  title: string;
  progress: string;
  genre: string;
  image: string;
  imageVisible: boolean;
  imageUrl: string; // object URL
};

const tales = ref<Tale[]>([]);

function openTale(tale: Tale) {
  switch (tale.progress) {
    case 'first_screen':
      router.push('/story/setup?job_id=' + tale.id);
      break;
    case 'generated_photo':
      router.push('/story/preview?job_id=' + tale.id);
      break;
    case 'story_theme':
      router.push('/story/genre?job_id=' + tale.id);
      break;
    case 'story_message':
      router.push('/story/theme?job_id=' + tale.id);
      break;
    case 'finished':
      router.push('/story/complete?job_id=' + tale.id);
      break;
  }
}

function createNewTale() {
  router.push('/story/setup');
}

function buyMoreTales() {
  router.push('/pricing');
}

function onLogout() {
  logOut();
}

function isValidImageUrl(url: string): boolean {
  return /^https?:\/\//.test(url); // только абсолютные HTTP(S)
}

onMounted(async () => {
  availableToCreate.value = (await getAvailableStories()).available_stories;
  const stories = await getAllStories();

  tales.value = stories.stories.map((s) => ({
    id: s.job_id,
    progress: s.progress,
    title: s.title ?? 'Untitled',
    genre: s.theme ?? 'Story',
    image: s.image ?? '',
    imageVisible: false,
    imageUrl: ''
  }));

  isLoaded.value = true;

  // Параллельно загружаем изображения
  await Promise.allSettled(tales.value.map(preloadImage));
});

async function preloadImage(tale: Tale): Promise<void> {
  if (!tale.image || !isValidImageUrl(tale.image)) return;

  try {
    const res = await fetch(tale.image);

    const blob = await res.blob();
    if (blob.size === 0) throw new Error('Empty image blob');

    tale.imageUrl = URL.createObjectURL(blob);
    tale.imageVisible = true;
  } catch (err) {
    console.warn(`Image preload failed for tale ${tale.id}:`, err);
    tale.imageVisible = false;
  }
}


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
