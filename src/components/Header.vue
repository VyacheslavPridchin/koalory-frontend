<template>
  <div v-if="route.path !== '/'" class="header-container">
    <div class="logo-wrapper">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
    </div>

    <transition name="fade">
      <div
          v-if="isAuth && route.path !== '/account'"
          class="menu-icon-wrapper"
          @click="onMenuClick"
      >
        <img src="@/assets/icon-dots.svg" alt="Menu" class="menu-icon" />
      </div>
    </transition>
  </div>
</template>




<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { isAuth } from "@/services/api.ts"

const route = useRoute()
const router = useRouter()

const onMenuClick = () => {
  router.push('/account')
}

</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 1000;
  position: static;
}

@media (min-aspect-ratio: 1/1) {
  .header-container {
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
  }
  .menu-icon-wrapper {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
}

.logo-wrapper {
  background: #FC7B00;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.menu-icon-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.menu-icon-wrapper:hover {
  transform: scale(1.1) translateY(-50%);
}

.menu-icon-wrapper:active {
  transform: scale(1) translateY(-50%);
}

.menu-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(52%) sepia(86%) saturate(528%) hue-rotate(359deg) brightness(105%) contrast(101%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
