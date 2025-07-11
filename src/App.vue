<template>
  <div>
    <Transition name="fade" mode="out-in">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-bind="screenProps" @next="goNext" />
      </router-view>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  photo: null as File | null,
  name: '',
  age: null as number | null,
  gender: '',
  location: '',
})

function goNext(payload?: any) {
  if (payload && typeof payload === 'object') {
    Object.assign(formData.value, payload)
  }

  // Example route flow
  const routeOrder = [
    '/', '/auth', '/upload', '/preview', '/name', '/age', '/gender', '/location',
    '/story-preview', '/pricing', '/confirm', '/interests', '/genre',
    '/theme', '/generate', '/complete', '/bonus'
  ]

  const currentIndex = routeOrder.indexOf(router.currentRoute.value.path)
  const nextRoute = routeOrder[currentIndex + 1]
  if (nextRoute) router.push(nextRoute)
}

const screenProps = computed(() => ({
  heroName: formData.value.name,
  heroAge: formData.value.age,
  heroGender: formData.value.gender,
  heroLocation: formData.value.location,
  photoFile: formData.value.photo,
}))
</script>


<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>