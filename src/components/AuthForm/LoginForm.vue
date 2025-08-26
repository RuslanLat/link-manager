<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import { useRouter } from 'vue-router'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

import { useToastNotifications } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'

const authStore = useUserStore()
const router = useRouter()

const { showToast } = useToastNotifications()
const { loading, errorMessage, singIn, singInWithGitHub } = useAuth()

const emits = defineEmits(['resetPassword'])

const formData = ref({
  email: '',
  password: '',
})

const rules = z.object({
  email: z.email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})

const resolver = ref(zodResolver(rules))

async function submitForm({ valid }: { valid: boolean }) {
  if (!valid) return
  try {
    await singIn(formData.value.email, formData.value.password)
    await authStore.getUser()
    await router.replace({ name: 'home' })
  } catch {
    showToast('error', 'Ошибка входа', errorMessage.value)
  }
}
</script>

<template>
  <Toast />
  <Form
    v-slot="$form"
    :initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitForm"
  >
    <div class="mb-3">
      <InputText
        name="email"
        placeholder="Введите текст ..."
        type="text"
        v-model="formData.email"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple" size="small">{{
        $form.email.error.message
      }}</Message>
    </div>
    <div class="mb-3">
      <InputText
        name="password"
        placeholder="Введите пароль ..."
        type="password"
        v-model="formData.password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" variant="simple" size="small">{{
        $form.password.error.message
      }}</Message>
    </div>
    <span class="cursor-pointer mb-3 block" @click="emits('resetPassword')">Забыли пароль?</span>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Вход" :loading="loading" />
      <Button
        icon="pi pi-github"
        class="w-full"
        label="GitHub"
        severity="contrast"
        @click="singInWithGitHub"
      />
    </div>
  </Form>
</template>
