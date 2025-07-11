import { createRouter, createWebHistory } from 'vue-router'

import ScreenLanding from '@/components/ScreenLanding.vue'
import ScreenAuth from '@/components/ScreenAuth.vue'
import ScreenPhotoUpload from '@/components/ScreenPhotoUpload.vue'
import ScreenCharacterPreview from '@/components/ScreenCharacterPreview.vue'
import ScreenCharacterName from '@/components/ScreenCharacterName.vue'
import ScreenCharacterAge from '@/components/ScreenCharacterAge.vue'
import ScreenCharacterGender from '@/components/ScreenCharacterGender.vue'
import ScreenCharacterLocation from '@/components/ScreenCharacterLocation.vue'
import ScreenStoryPreview from '@/components/ScreenStoryPreview.vue'
import ScreenPricing from '@/components/ScreenPricing.vue'
import ScreenFreeConfirmation from '@/components/ScreenFreeConfirmation.vue'
import ScreenInterestsHobbies from '@/components/ScreenInterestsHobbies.vue'
import ScreenGenreSelection from '@/components/ScreenGenreSelection.vue'
import ScreenStoryTheme from '@/components/ScreenStoryTheme.vue'
import ScreenFinalGeneration from '@/components/ScreenFinalGeneration.vue'
import ScreenStoryComplete from '@/components/ScreenStoryComplete.vue'
import ScreenBonusUpsell from '@/components/ScreenBonusUpsell.vue'

const routes = [
  { path: '/', component: ScreenLanding },
  { path: '/auth', component: ScreenAuth },
  { path: '/upload', component: ScreenPhotoUpload },
  { path: '/preview', component: ScreenCharacterPreview },
  { path: '/name', component: ScreenCharacterName },
  { path: '/age', component: ScreenCharacterAge },
  { path: '/gender', component: ScreenCharacterGender },
  { path: '/location', component: ScreenCharacterLocation },
  { path: '/story-preview', component: ScreenStoryPreview },
  { path: '/pricing', component: ScreenPricing },
  { path: '/confirm', component: ScreenFreeConfirmation },
  { path: '/interests', component: ScreenInterestsHobbies },
  { path: '/genre', component: ScreenGenreSelection },
  { path: '/theme', component: ScreenStoryTheme },
  { path: '/generate', component: ScreenFinalGeneration },
  { path: '/complete', component: ScreenStoryComplete },
  { path: '/bonus', component: ScreenBonusUpsell },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
