<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

import { useToastNotifications } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { showToast } = useToastNotifications()
const { loading, errorMessage, updatePassword } = useAuth()

const formData = ref({
  password: '',
})

const rules = z.object({
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})

const resolver = ref(zodResolver(rules))

async function submitForm({ valid }: { valid: boolean }) {
  if (!valid) return
  try {
    await updatePassword(formData.value.password)
    router.replace('/auth')
  } catch {
    showToast('error', 'Ошибка при создании нового пароля', errorMessage.value)
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
        name="password"
        placeholder="Введите новый пароль ..."
        type="password"
        v-model="formData.password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" variant="simple" size="small">{{
        $form.password.error.message
      }}</Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Задать новый пароль" :loading="loading" />
    </div>
  </Form>
</template>
