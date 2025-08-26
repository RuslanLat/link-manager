<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import SpeedDial from 'primevue/speeddial'
import { useToastNotifications } from '@/composables/useToastNotifications.js'
import { useLinkStore } from '@/stores/linkStore'
import { useLink } from '@/composables/useLink'
import type { linkWithCategoryQuery } from '@/composables/useLink'
import CreateLinkModal from './Modals/CreateLinkModal.vue'

const linkStore = useLinkStore()
const { showToast } = useToastNotifications()
const { changeIsFavorite, deleteLink, addClickCount } = useLink()
const createLinkDialogVisible = ref(false)
const props = defineProps<{ link: linkWithCategoryQuery[number] }>()

const itemsMenuButton = ref([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: async () => {
      try {
        await changeIsFavorite(props.link.id, !props.link.isFavorite as boolean)
        linkStore.changeIsFavorite(props.link.id)
        showToast('success', 'Успешно', 'Изменения сохранены')
      } catch {
        showToast('error', 'Ошибка')
      }
    },
  },
  {
    label: 'Скопировать',
    icon: 'pi pi-link',
    command: async () => {
      await copyToClipboard()
    },
  },
  {
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    command: () => {
      createLinkDialogVisible.value = true
    },
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        await deleteLink(props.link.id)
        linkStore.removeLink(props.link.id)
        showToast('success', 'Успешно', 'Ссылка удалена')
      } catch {
        showToast('error', 'Ошибка')
      }
    },
  },
])

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.link.url!)
    showToast('success', `Успешно`, `Скопировано ${props.link.name}`)
  } catch {
    showToast('error', 'Ошибка при копировании')
  }
}

const openLink = async () => {
  await addClickCount(props.link.id, props.link.clickCount! + 1)
  linkStore.addClickCount(props.link.id)
}

const isFavoriteBgCard = computed(() => {
  return props.link.isFavorite ? 'var(--p-button-success-hover-background)' : ''
})
</script>

<template>
  <Toast />
  <CreateLinkModal v-model="createLinkDialogVisible" is-edit :id="link.id" />
  <Card class="relative" :style="{ backgroundColor: isFavoriteBgCard }">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.previewImage!" :alt="link.name!" />
        <a :href="link.url!" target="_blank" @click="openLink">{{ link.name }}</a>
        <SpeedDial
          :model="itemsMenuButton"
          direction="down"
          style="position: absolute; right: 20px; top: 20px"
          :tooltip-options="{ event: 'hover', position: 'left' }"
        />
      </div>
    </template>
    <template #content>
      <div class="flex gap-2 flex-col">
        <div class="font-bold">{{ link.categories!.name }}</div>
        <div class="h-full" v-if="link.description">{{ link.description }}</div>
      </div>
    </template>
  </Card>
</template>
