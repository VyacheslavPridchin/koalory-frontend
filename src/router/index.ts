import { createRouter, createWebHistory } from 'vue-router'

import ScreenLanding from '@/components/screens/ScreenLanding.vue'
import ScreenAuth from '@/components/screens/ScreenAuth.vue'
import ScreenPhotoUpload from '@/components/screens/old/ScreenPhotoUpload.vue'
import ScreenCharacterPreview from '@/components/screens/old/ScreenCharacterPreview.vue'
import ScreenCharacterName from '@/components/screens/old/ScreenCharacterName.vue'
import ScreenCharacterAge from '@/components/screens/old/ScreenCharacterAge.vue'
import ScreenCharacterGender from '@/components/screens/old/ScreenCharacterGender.vue'
import ScreenCharacterLocation from '@/components/screens/old/ScreenCharacterLocation.vue'
import ScreenStoryPreview from '@/components/screens/ScreenStoryPreview.vue'
import ScreenPricing from '@/components/screens/ScreenPricing.vue'
import ScreenFreeConfirmation from '@/components/screens/old/ScreenFreeConfirmation.vue'
import ScreenInterestsHobbies from '@/components/screens/ScreenInterestsHobbies.vue'
import ScreenGenreSelection from '@/components/screens/ScreenGenreSelection.vue'
import ScreenStoryTheme from '@/components/screens/ScreenStoryTheme.vue'
import ScreenFinalGeneration from '@/components/screens/ScreenFinalGeneration.vue'
import ScreenStoryComplete from '@/components/screens/ScreenStoryComplete.vue'
import ScreenBonusUpsell from '@/components/screens/ScreenBonusUpsell.vue'
import ScreenSetupInformation from "@/components/screens/ScreenSetupInformation.vue";
import AuthGoogleCallback from "@/components/screens/AuthGoogleCallback.vue";
import ScreenPaymentResult from "@/components/screens/ScreenPaymentResult.vue";
import Account from "@/components/screens/Account.vue";
import {isAuth} from "@/services/api.ts";

const routes = [
  { path: '/', component: ScreenLanding },
  { path: '/auth', component: ScreenAuth },
  { path: '/auth/google-callback', component: AuthGoogleCallback },
  { path: '/story/setup', component: ScreenSetupInformation },
  // { path: '/upload', component: ScreenPhotoUpload },
  // { path: '/preview', component: ScreenCharacterPreview },
  // { path: '/name', component: ScreenCharacterName },
  // { path: '/age', component: ScreenCharacterAge },
  // { path: '/gender', component: ScreenCharacterGender },
  // { path: '/location', component: ScreenCharacterLocation },
  { path: '/story/preview', component: ScreenStoryPreview },
  { path: '/pricing', component: ScreenPricing },
  { path: '/payment', component: ScreenPaymentResult },
  // { path: '/confirm', component: ScreenFreeConfirmation },
  { path: '/story/interests', component: ScreenInterestsHobbies },
  { path: '/story/genre', component: ScreenGenreSelection },
  { path: '/story/custom-theme', component: ScreenStoryTheme },
  { path: '/story/generate', component: ScreenFinalGeneration },
  { path: '/story/complete', component: ScreenStoryComplete },
  { path: '/story/bonus', component: ScreenBonusUpsell },
  { path: '/account', component: Account },
  { path: '/:catchAll(.*)', redirect: '/' },

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Добавляем проверку авторизации
router.beforeEach(async (to, from, next) => {
  const publicPaths = ['/', '/auth', '/pricing']
  const isPublic = publicPaths.includes(to.path)

  if (!isPublic && !isAuth.value) {
    return next('/auth')
  }

  next()
})

export default router
