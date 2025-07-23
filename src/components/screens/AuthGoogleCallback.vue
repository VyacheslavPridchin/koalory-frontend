<template>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  googleRegister,
  googleLogin, updateAuthStatus,
} from '@/services/api'
import {useRouter} from "vue-router";

const router = useRouter()

// Handle OAuth callback
onMounted(async () => {
  const hash = window.location.hash
  console.log(hash)
  if (!hash) {
    await router.push('/story/setup')
    return
  }

  const params = new URLSearchParams(hash.slice(1))
  const idToken = params.get('id_token')
  console.log(idToken)
  if (!idToken) {
    await router.push('/story/setup')
    return
  }

  try {
    const { access_token, refresh_token } = await googleRegister({ token: idToken })
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    updateAuthStatus()

    await router.push('/story/setup')
    return
  } catch { }

  try {
    const { access_token, refresh_token } = await googleLogin({ token: idToken })
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    updateAuthStatus()

    await router.push('/story/setup')
    return
    // emit next or redirect
  } catch {
    await router.push('/auth')
  }
})
</script>

<style scoped>

</style>