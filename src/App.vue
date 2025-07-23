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
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";

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

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10];
const excludedPaths = ['/', '/account', '/pricing'];

const route = useRoute();
const backgroundImage = ref<string | null>(null);

const updateBackground = () => {
  if (excludedPaths.includes(route.path)) {
    backgroundImage.value = null;
  } else {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    backgroundImage.value = backgrounds[randomIndex];
  }
};

onMounted(updateBackground);
watch(() => route.path, updateBackground);
</script>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
