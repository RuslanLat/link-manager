<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, Button, Menubar, Toast, ToggleSwitch } from 'primevue'
import { useUserStore } from '@/stores/userStore'
import { useAuth } from '@/composables/useAuth'
import { useToastNotifications } from '@/composables/useToastNotifications'
import { useCategory } from '@/composables/useCategory'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTheme } from '@/composables/useTheme'

import CategoriesModal from '@/components/Modals/CategoriesModal.vue'
import CreateLinkModal from '@/components/Modals/CreateLinkModal.vue'

const categoryStore = useCategoryStore()

const router = useRouter()
const authStore = useUserStore()
const { loading, errorMessage, signOut } = useAuth()
const { checked, getUserTheme } = useTheme()
const { showToast } = useToastNotifications()
const { getCategory } = useCategory()

const categoriesDialogVisible = ref<boolean>(false)
const createLinkDialogVisible = ref<boolean>(false)

const emailFirstLetter = computed(() =>
  authStore.user?.email ? authStore.user.email[0].toUpperCase() : '',
)

async function signOutUser() {
  try {
    await signOut()
    authStore.resetUser()
    await router.replace({ name: 'auth' })
  } catch {
    showToast('error', 'Ошибка выхода', errorMessage.value)
  }
}
async function getCategoryData() {
  try {
    const data = await getCategory()
    if (!data || !data.length) return
    categoryStore.listCategory = data
  } catch {
    showToast('error', 'Ошибка', 'Не удалось получить категории')
  }
}

onMounted(async () => {
  getUserTheme()
  await getCategoryData()
})
</script>

<template>
  <CategoriesModal v-model="categoriesDialogVisible" />
  <CreateLinkModal v-model="createLinkDialogVisible" />
  <div class="mb-5">
    <Toast />
    <Menubar>
      <template #start>
        <div class="flex items-center gap-2">
          <span class="font-bold">Link Manager</span>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-link" rounded @click="createLinkDialogVisible = true" />
            <Button icon="pi pi-folder" rounded @click="categoriesDialogVisible = true" />
          </div>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="checked as boolean">
            <template #handle="{ checked }">
              <i :class="['!text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]" />
            </template>
          </ToggleSwitch>
          <Avatar :label="emailFirstLetter" size="large" shape="circle" />
          <Button
            icon="pi pi-sign-out"
            rounded
            severity="secondary"
            :loading="loading"
            @click="signOutUser"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>
