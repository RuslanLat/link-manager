<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Dialog, InputText, Button, Toast, Message } from 'primevue'
import { Form } from '@primevue/forms'
import Loader from '@/components/Loader.vue'
import { useToastNotifications } from '@/composables/useToastNotifications'
import { useCategory } from '@/composables/useCategory'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()

const modelValue = defineModel<boolean>()
const { showToast } = useToastNotifications()
const { loading, saveCategory, deleteCategory } = useCategory()

const categoryName = ref<string>('')

const rules = z.object({
  categoryName: z.string().min(3, { message: 'Должно быть минимум 3 символов' }),
})
const resolver = ref(zodResolver(rules))

async function save({ valid }: { valid: boolean }) {
  if (!valid) return
  try {
    const data = await saveCategory(categoryName.value)
    if (!data) return
    categoryStore.listCategory.push(data[0])
    categoryName.value = ''
    showToast('success', 'Успех', 'Категория добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить категорию')
  }
}

async function del(id: number) {
  try {
    await deleteCategory(id)
    categoryStore.filterById(id)
    showToast('success', 'Ошибка', 'Категория удалена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось удалить категорию')
  }
}
</script>

<template>
  <Toast />
  <Dialog modal header="Категории" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form
      v-slot="$form"
      :initial-values="{ categoryName }"
      :resolver="resolver"
      :validate-on-blur="true"
      :validate-on-value-update="false"
      @submit="save"
    >
      <Loader v-if="loading" />
      <template v-else>
        <div class="gap-2 mb-2">
          <InputText
            name="categoryName"
            v-model="categoryName"
            class="flex-auto w-full"
            autocomplete="off"
            placeholder="Название новой категории"
          />
          <Message
            v-if="$form.categoryName?.invalid"
            severity="error"
            variant="simple"
            size="small"
            >{{ $form.categoryName.error.message }}</Message
          >
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="submit" label="Добавить" :loading="loading" />
        </div>
        <div
          class="grid mt-3 grid-cols-[1fr_32px] mb-1 gap-5"
          v-for="category in categoryStore.listCategory"
          :key="category.id"
        >
          {{ category.name }}
          <Button
            type="button"
            rounded
            size="small"
            variant="text"
            icon="pi pi-times"
            @click="del(category.id)"
          /></div
      ></template>
    </Form>
  </Dialog>
</template>
