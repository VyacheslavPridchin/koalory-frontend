<template>
  <section class="justify-square flex flex-col px-4 py-6">
    <div class="flex justify-center w-full">
      <div class="w-full max-w-4xl card flex flex-col items-center relative overflow-visible">
        <!-- Left layer: static flow, full width -->
        <div class="flex flex-col items-center md:items-start space-y-6 w-full">
          <h2 class="text-4xl font-semibold text-black text-center md:text-start">
            {{ name }}'s Adventure <span class="hidden md:inline"><br/></span><span class="inline md:hidden"> </span>is Complete!
          </h2>
          <h3 class="text-2xl font-bold" style="color: #FC7B00;">
            "{{ storyTitle }}"
          </h3>
          <p class="italic text-gray-600">
            A personalized adventure featuring {{ name }}
          </p>
          <ul class="list-none space-y-1 text-gray-700">
            <li class="flex items-start">
              <span class="mr-2 text-xl">★</span>
              <span class="text-lg"><b>{{ wordCount }} words</b> of pure magic</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2 text-xl">★</span>
              <span class="text-lg">Custom illustrations featuring <b>{{ name }}</b></span>
            </li>
            <li class="flex items-start">
              <span class="mr-2 text-xl">★</span>
              <span class="text-lg">Delivered to your email in<br/> beautiful PDF format</span>
            </li>
          </ul>
          <!-- Buttons now vertical and limited width -->
          <div class="flex flex-col items-center md:items-start space-y-4 w-full">
            <button
                class="w-full max-w-xs flex-shrink-0 self-center md:self-start bg-black text-white font-bold py-3 rounded-lg shadow text-lg"
                @click="downloadPDF"
            >
              Download PDF
            </button>
            <button
                @click="createAnother"
                class="w-full max-w-xs flex-shrink-0 self-center md:self-start bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-lg shadow text-lg"
            >
              Create Another Story
            </button>
          </div>
          <p class="text-sm text-gray-500">
            Story sent to: {{ email }}. Also check spam folder!
          </p>
          <div class="flex flex-wrap justify-center gap-2 md:justify-start md:space-x-3">
            <button class="bg-orange-100 hover:bg-orange-200 text-gray-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold">
              📱 Share with Friends
            </button>
            <button class="bg-blue-100 hover:bg-blue-200 text-gray-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold">
              ⭐ Rate Us
            </button>
            <button class="bg-orange-100 hover:bg-orange-200 text-gray-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold">
              💬 Leave Feedback
            </button>
          </div>

        </div>

        <!-- Right layer: absolutely positioned, wider, vertically centered -->
        <div class="absolute w-3/4 bottom-0 right-0 right-layer" style="pointer-events: none">
          <div class="relative w-full h-full">
            <!-- scrollable content pane beneath the tablet -->
            <div class="absolute inset-0 overflow-hidden bg-white"
                 style="z-index: 5; height: 65%; top: 51%; transform: translateY(-53%) translateX(87%) rotateZ(8deg); width: 51%; padding: 13px 10px 15px 8px;">
              <div class="h-full overflow-y-auto p-4 space-y-4" style="pointer-events: visible">
                <h3 class="text-xl font-bold"> {{ storyTitle }} </h3>
                <div
                    v-for="(item, idx) in mixedContent"
                    :key="idx"
                >
                  <p v-if="item.type === 'text'" class="text-gray-800" style="pointer-events: none">
                    {{ item.content }}
                  </p>
                  <img
                      v-else-if="item.type === 'image'"
                      :src="item.content"
                      alt="Placeholder"
                      class="w-full rounded-md"
                      style="pointer-events: none"
                  />
                </div>
                <p class="text-center text-sm text-gray-500">
                  Download the PDF for full story view...
                </p>
              </div>

            </div>
            <!-- tablet frame on top -->
            <img
                src="@/assets/resources/preview_tablet.png"
                alt="Tablet Preview"
                class="w-full h-auto relative z-10"
                style="pointer-events: none"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {getAvailableStories, requestStory} from "@/services/api.ts";
import {useRoute, useRouter} from "vue-router";

const name = ref<string | null>(null);
const storyTitle = ref<string | null>(null);
const pdfUrl = ref<string | null>(null);
const wordCount = ref<string | null>(null);
const email = ref<string | null>(null);
const texts = ref<string[]>([]);
const images = ref<string[]>([]);


const jobId = ref<number>()
const router = useRouter()
const route = useRoute()

const mixedContent = computed(() => {
  const mixed: { type: 'text' | 'image'; content: string }[] = []
  const maxLength = Math.max(texts.value.length, images.value.length)
  for (let i = 0; i < maxLength; i++) {
    if (texts.value[i]) mixed.push({ type: 'text', content: texts.value[i] })
    if (images.value[i]) mixed.push({ type: 'image', content: images.value[i] })
  }
  return mixed
})

onMounted(async () => {
  const raw = route.query.job_id
  jobId.value = Array.isArray(raw)
      ? Number(raw[0])
      : Number(raw)

  if (!jobId.value) {
    await router.push('/story/setup')
    return
  }

  name.value = localStorage.getItem('name');

  const result = await requestStory(jobId.value ?? -1)
  storyTitle.value = result.title;
  pdfUrl.value = result.pdf_url;
  wordCount.value = result.word_count;
  email.value = result.email;

  texts.value = result.text as string[];
  images.value = result.images as string[];

});

function downloadPDF(): void {
  if (!pdfUrl.value || !storyTitle.value) return;

  const link = document.createElement('a');
  link.href = pdfUrl.value;
  link.download = `${storyTitle.value}.pdf`;
  link.click();
}

async function createAnother(): Promise<void> {
  if((await getAvailableStories()).available_stories == 0){
    await router.push({ path: '/story/bonus', query: { job_id: String(jobId.value) }})
  } else {
    await router.push('/story/setup')
  }
}

</script>

<style scoped>
.card.relative {
  position: relative;
}

@media (max-aspect-ratio: 1/1) {
  .right-layer {
    display: none !important;
  }
  .adaptive-break {
    display: inline;
  }
  .adaptive-br {
    display: none;
  }
}
@media (min-aspect-ratio: 1/1) {
  .adaptive-break {
    display: none;
  }
  .adaptive-br {
    display: inline;
  }
}

</style>
