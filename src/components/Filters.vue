<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import { useLinkStore } from '@/stores/linkStore.js'
import { useLink } from '@/composables/useLink'

const { getLink } = useLink()
const linkStore = useLinkStore()

const updateFilters = async () => {
  try {
    const data = await getLink(true, false)
    if (!data) return
    linkStore.listLink = data
  } catch (error) {
    console.log('Ошибка загрузки', error)
  }
}
</script>

<template>
  <div class="md:flex gap-5 justify-center block">
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linkStore.sortByPopular"
        inputId="sortByPopular"
        name="sortByPopular"
        binary
        @change="updateFilters"
      />
      <label for="sortByPopular">Сначала популярные</label>
    </div>
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linkStore.onlyFavorites"
        inputId="onlyFavorites"
        name="onlyFavorites"
        binary
        @change="updateFilters"
      />
      <label for="onlyFavorites">Только избранные</label>
    </div>
  </div>
</template>
