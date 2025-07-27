<template>
  <div class="app-container">
    <transition name="fade">
      <div
          v-if="backgroundImage"
          class="background"
          :style="{ backgroundImage: `url('${backgroundImage}')` }"
          :key="backgroundImage"
      />
    </transition>

    <Header />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <GlobalNotice />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import GlobalNotice from "@/components/GlobalNotice.vue";
import { cachePhotoUrlWithName } from "@/services/photoCacheService";

import bg1 from "@/assets/backgrounds/background_1-min.jpg";
import bg2 from "@/assets/backgrounds/background_2-min.jpg";
import bg3 from "@/assets/backgrounds/background_3-min.jpg";
import bg4 from "@/assets/backgrounds/background_4-min.jpg";
import bg5 from "@/assets/backgrounds/background_5-min.jpg";
import bg6 from "@/assets/backgrounds/background_6-min.jpg";
import bg7 from "@/assets/backgrounds/background_7-min.jpg";
import bg8 from "@/assets/backgrounds/background_8-min.jpg";
import bg9 from "@/assets/backgrounds/background_9-min.jpg";
import bg10 from "@/assets/backgrounds/background_10-min.jpg";

const srcList = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10];
const entries = srcList.map((url, i) => ({ url, name: `bg-${i + 1}` }));

const excludedPaths = ["/", "/account", "/pricing"];

const route = useRoute();
const backgroundImage = ref<string | null>(null);

const cachedBlobUrls = ref<string[]>([]);
const preloadDone = ref(false);

async function preloadAll() {
  const results = await Promise.all(
      entries.map(async (e) => {
        try {
          const blobUrl = await cachePhotoUrlWithName(e.name, e.url);
          return blobUrl;
        } catch {
          return null;
        }
      })
  );

  cachedBlobUrls.value = results.filter((x): x is string => !!x);
  preloadDone.value = true;

  // Установим фон только после полной предзагрузки и только из успешно закэшированных.
  maybeSetBackgroundForCurrentRoute();
}

function pickRandomCached(): string | null {
  const list = cachedBlobUrls.value;
  if (!list.length) return null;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx] ?? null;
}

function maybeSetBackgroundForCurrentRoute() {
  if (!preloadDone.value) return;
  if (excludedPaths.includes(route.path)) {
    backgroundImage.value = null;
    return;
  }
  const next = pickRandomCached();
  backgroundImage.value = next;
}

onMounted(() => {
  // Не показываем фон до завершения предзагрузки.
  backgroundImage.value = null;
  preloadAll();
});

watch(
    () => route.path,
    () => {
      // Если предзагрузка не завершена — ничего не делаем (не мигаем).
      maybeSetBackgroundForCurrentRoute();
    }
);

onBeforeUnmount(() => {
  // Освобождаем все созданные blob URL
  for (const url of cachedBlobUrls.value) {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  }
});
</script>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.background {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
