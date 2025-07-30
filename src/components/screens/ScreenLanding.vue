<template>
  <div class="page">
    <div class="hero-panel">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />

      <!-- Decorative ovals -->
      <div class="oval oval-1"></div>
      <div class="oval oval-2"></div>
      <div class="oval oval-3"></div>
      <div class="oval oval-4"></div>

      <!-- Side images -->

      <div class="hero-content">
        <h1 class="hero-title">
          Transform your child
          <span class="crafty">into the hero</span>
          of their own story
        </h1>

        <p class="subtitle">AI-generated personalized fairytales in 5 minutes</p>

        <button @click="startCreating"  class="cta">Start</button>
      </div>

      <div class="trustpilot-badge">
        <img src="@/assets/trustpilot-logo.svg" alt="" class="tp-logo" />
        <div class="tp-stars-wrapper">
          <img v-for="n in 5" :key="n" src="@/assets/trustpilot-star.svg" alt="Rating" class="tp-stars" />
        </div>
        <span class="tp-reviews">Reviews 296</span>
      </div>
      <img src="../../assets/resources/landing-photo-1.png" alt="Girl" class="side-image left-image floating-left" />
      <img src="../../assets/resources/landing-photo-2.png" alt="Boy" class="side-image right-image floating-right" />

    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {isAuth} from "@/services/api.ts";
import {onMounted} from "vue";

const router = useRouter()

async function startCreating() {
if(isAuth.value)
  await router.push("/account")
else
  await router.push("/auth")
}

onMounted(async () => {
  if(isAuth.value) {
    await router.push("/account")
  }
})

</script>

<style scoped>
.page {
  min-height: 100vh;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 2rem 3rem;
  box-sizing: border-box;
}

.hero-panel {
  position: relative;
  flex: 1 1 auto; /* растягиваемся на всю доступную высоту */
  display: flex;
  flex-direction: column;
  justify-content: center; /* центрируем hero-content по вертикали */
  align-items: center;     /* и по горизонтали */
  background: #fc7b00;
  border-radius: 32px;
  padding: 3rem 4rem;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 0; /* добавляем для контекста */

}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: auto;
}

.hero-content {
  max-width: 680px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero-title {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
  color: #fff;
}

.crafty {
  font-family: "Crafty Girls", cursive;
  display: block;
  color: #fff;
  -webkit-text-stroke: 2px #fff;
}

.subtitle {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.45rem);
  color: #fff;
}

.cta {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.9rem 2.5rem;
  font-size: 1.45rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.cta::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      rgba(252, 123, 0, 0),
      rgba(255, 255, 255, 0.2),
      rgba(252, 123, 0, 0)
  );
  background-size: 300% 300%;
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cta:hover {
  transform: scale(1.05);
  box-shadow:
      0 0 10px rgba(252, 123, 0, 1),
      0 0 20px rgba(255, 255, 255, 0.7),
      0 0 30px rgba(252, 123, 0, 1);
}

.cta:hover::before {
  opacity: 1;
  animation: gradientShift 3s ease infinite;
}

.cta:active {
  transform: scale(0.95);
}

@keyframes gradientShift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}


.note {
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: #fff;
}

.trustpilot-badge {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: inline-flex; /* важно: inline-flex предотвращает переполнение */
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  white-space: nowrap;
  transform-origin: center;
  min-width: 340px;
}

.trustpilot-badge * {
  min-width: 0;
  flex-shrink: 0;
}

.tp-logo,
.tp-stars,
.tp-reviews {
  flex-shrink: 0;
}

.tp-reviews {
  color: #04DA8D;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.5rem;

}

.tp-stars-wrapper {
  display: flex;
  gap: 0.1rem;
  align-items: center;
}

.tp-logo {
  margin-right: 0.5rem;
  height: 20px;
  width: auto;
}

.tp-stars {
  height: 20px;
  width: auto;
}

.side-image {
  position: absolute;
  z-index: -1;
  width: 260px;
  border: 8px solid #fff;
  border-radius: 24px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  object-fit: cover;
  pointer-events: none;
}

@media (min-aspect-ratio: 1/1) {
  .floating-left {
    animation: floating-left 3.5s ease-in-out infinite;
  }

  .floating-right {
    animation: floating-right 3s ease-in-out infinite;
  }
}


@keyframes floating-left {
  0% { transform: translateY(0px) rotate(-10deg);}
  50% { transform: translateY(-14px) rotate(-8deg) ;}
  100% { transform: translateY(0px) rotate(-10deg);}
}

@keyframes floating-right {
  0% { transform: translateY(0px) rotate(12deg);}
  50% { transform: translateY(-14px) rotate(10deg) ;}
  100% { transform: translateY(0px) rotate(12deg);}
}

.left-image {
  width: calc(400px - (1920px - 100vw) * 0.1);
  left: calc(5% - (1920px - 100vw) * 0.15);
  top: 50%;
  transform: rotate(-18deg);
}

.right-image {
  width: calc(350px - (1920px - 100vw) * 0.1);
  right: calc(5% - (1920px - 100vw) * 0.15);
  top: 15%;
  transform: rotate(12deg);
}

.oval {
  position: absolute;
  background: #f07500;
  border-radius: 50%;
  opacity: 0.95;
  z-index: -1;

}

.oval-1 {
  width: 530px;
  height: 1000px;
  bottom: -600px;
  left: 0;
  transform: rotate(-20deg);
}

.oval-2 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  left: 20%;
}

.oval-3 {
  width: 700px;
  height: 1000px;
  bottom: -300px;
  left: 50%;
  transform: rotate(25deg);
}

.oval-4 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  left: 80%;
  transform: rotate(-20deg);
}

@media (max-aspect-ratio: 1/1) {
  .page {
    padding: 0; /* на мобилке панель заполняет весь экран */
  }

  .hero-panel {
    border-radius: 0; /* убираем скругления */
    padding: 2.5rem 1.25rem; /* чуть компактнее отступы */
  }

  .side-image {
    filter: blur(8px);
    opacity: 0.8;
  }

  .left-image {
    left: -7rem;
  }
  .right-image {
    right: -7rem;
  }
}
</style>
