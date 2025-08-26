<script setup lang="ts">
import { onMounted } from 'vue'
import Button from 'primevue/button'

import { useLinkStore } from '@/stores/linkStore'
import { useLink } from '@/composables/useLink'
import Loader from '@/components/Loader.vue'
import CardLink from '@/components/CardLink.vue'
import Filters from '@/components/Filters.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'

const { loading, getLink } = useLink()
const linkStore = useLinkStore()

async function loadLink() {
  try {
    const data = await getLink()
    if (!data) return
    linkStore.listLink.push(...data)
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    if (accessToken) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }
  try {
    const data = await getLink()
    if (!data) return
    linkStore.listLink = data
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <template v-if="linkStore.offset === 0">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardSkeleton v-for="i in 6" :key="i" /></div
  ></template>
  <div v-else>
    <h2 v-if="!linkStore.listLink.length" class="font-bold text-center">
      Вы пока еще не добавили ссылок
    </h2>
    <template v-else>
      <Filters />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardLink v-for="link in linkStore.listLink" :key="link.id" :link="link" />
      </div>
      <div class="flex justify-center mt-3">
        <Button
          v-if="linkStore.hasMore"
          label="Показать еще"
          @click="loadLink"
          :loading="loading"
        />
      </div>
    </template>
  </div>
</template>
