<template>
  <transition name="slide" appear>
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
  </transition>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { isAuth } from '@/services/api.ts'

const route = useRoute()
const router = useRouter()

const onMenuClick = () => {
  router.push('/account')
}
</script>

<style scoped>
.header-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  box-sizing: border-box;
  z-index: 1000;

  /* Десктоп по умолчанию: абсолютный, вне потока */
  position: absolute;
  top: 0;
  left: 0;
}

/* Мобильные/высокие экраны: возвращаем в поток лэйаута */
@media (max-aspect-ratio: 1/1) {
  .header-container {
    position: relative;
  }
}

.logo-wrapper {
  grid-column: 2;
  justify-self: center;

  background: #fc7b00;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-icon-wrapper {
  grid-column: 3;
  justify-self: end;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.menu-icon-wrapper:hover {
  transform: scale(1.08);
}

.menu-icon-wrapper:active {
  transform: scale(1);
}

.menu-icon {
  width: 25px;
  height: 25px;
}

/* Fade для иконки меню */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide для всего Header */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
  will-change: transform, opacity;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
