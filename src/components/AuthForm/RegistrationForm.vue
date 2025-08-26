<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

import { useToastNotifications } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'

const { showToast } = useToastNotifications()
const { loading, errorMessage, singUp, singInWithGitHub } = useAuth()

const formData = ref({
  email: '',
  password: '',
  firstName: '',
})

const rules = z.object({
  email: z.email({ message: 'Некорректный email' }),
  password: z.string().min(5, { message: 'Должно быть минимум 6 символов' }),
  firstName: z.string().min(1, { message: 'Имя обязательно для заполнения' }),
})

const resolver = ref(zodResolver(rules))

async function submitForm({ valid }: { valid: boolean }) {
  if (!valid) return
  try {
    await singUp(formData.value.email, formData.value.password, formData.value.firstName)
  } catch {
    showToast('error', 'Ошибка регистрации', errorMessage.value)
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
        placeholder="Введите email ..."
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
    <div class="mb-3">
      <InputText
        name="firstname"
        placeholder="Введите своё имя ..."
        type="text"
        v-model="formData.firstName"
        class="w-full"
      />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" :loading="loading" />
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
