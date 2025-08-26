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
const { loading, errorMessage, resetPassword } = useAuth()

const formData = ref({
  email: '',
})

const rules = z.object({
  email: z.email({ message: 'Некорректный email' }),
})

const resolver = ref(zodResolver(rules))

async function submitForm({ valid }: { valid: boolean }) {
  if (!valid) return
  try {
    await resetPassword(formData.value.email)
    showToast('success', 'Ссылка на сброс пароля уже на вашей почте', errorMessage.value)
  } catch {
    showToast('error', 'Некорректный email', errorMessage.value)
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
    <div class="grid">
      <Button type="submit" class="w-full" label="Сброс пароля" :loading="loading" />
    </div>
  </Form>
</template>
