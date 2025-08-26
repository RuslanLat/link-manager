<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useTheme } from '@/composables/useTheme'
import TheHeader from './components/TheHeader.vue'

const { getUserTheme } = useTheme()
const authStore = useUserStore()

onMounted(async () => {
  getUserTheme()
  await authStore.getUser()
})
</script>

<template>
  <TheHeader v-if="authStore.user" />
  <RouterView />
</template>

<style scoped></style>
