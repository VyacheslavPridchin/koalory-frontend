<template>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  googleRegister,
  googleLogin,
} from '@/services/api'
import {useRouter} from "vue-router";

const router = useRouter()

// Handle OAuth callback
onMounted(async () => {
  const hash = window.location.hash
  if (!hash) return

  const params = new URLSearchParams(hash.slice(1))
  const idToken = params.get('id_token')
  if (!idToken) return

  try {
    await router.push('/story/setup')

    await googleRegister({ token: idToken })

    const { access_token, refresh_token } = await googleLogin({ token: idToken })
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)

    // emit next or redirect
  } catch {
    await router.push('/auth')
  }
})
</script>

<style scoped>

</style>