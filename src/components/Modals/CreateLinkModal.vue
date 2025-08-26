<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Dialog, InputText, Button, Toast, Message, Textarea, Select, Checkbox } from 'primevue'
import { Form } from '@primevue/forms'
import type { Tables } from '@/database.types.ts'

import { useCategoryStore } from '@/stores/categoryStore'
import { useUserStore } from '@/stores/userStore'
import { useLinkStore } from '@/stores/linkStore'
import { useToastNotifications } from '@/composables/useToastNotifications'
import { useLink } from '@/composables/useLink'

const modelValue = defineModel<boolean>()
const categoryStore = useCategoryStore()
const userStore = useUserStore()
const linkStore = useLinkStore()
const { showToast } = useToastNotifications()
const { loading, saveLink, updateLink } = useLink()

const props = withDefaults(defineProps<{ isEdit?: boolean; id?: number }>(), { isEdit: false })

const rules = z.object({
  name: z.string().min(1, { message: 'Название обязательно для заполнение' }),
  url: z.url({ message: 'Некорректная ссылка' }),
})

const resolver = ref(zodResolver(rules))

type Category = Partial<Tables<'categories'>>

interface formInput {
  name: string
  url: string
  description: string
  category: Category | null
  isFavorite: boolean
}

const formInputs = ref<formInput>({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const clear = () => {
  console.log(formInputs.value)
  formInputs.value = {
    name: '',
    url: '',
    description: '',
    category: null,
    isFavorite: false,
  }
}

const getDomain = (url: string) => {
  const { hostname } = new URL(url)
  const parts = hostname.split('.')
  if (parts.length > 2) {
    return parts.slice(-2).join('.')
  }
  return hostname
}

const addNewLink = async () => {
  const hostname = getDomain(formInputs.value.url)

  const payload = {
    name: formInputs.value.name,
    url: formInputs.value.url,
    description: formInputs.value.description,
    category: formInputs.value.category?.id as number,
    clickCount: 0,
    isFavorite: formInputs.value.isFavorite,
    previewImage: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=32`,
    user_id: userStore.user?.id as string,
  }

  try {
    const data = await saveLink(payload)
    linkStore.listLink.push(data[0])
    modelValue.value = false
    clear()
    showToast('success', 'Успех', 'Ссылка добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить ссылку')
  }
}

const updateLinkData = async () => {
  const payload = {
    name: formInputs.value.name,
    url: formInputs.value.url,
    description: formInputs.value.description,
    category: formInputs.value.category!.id,
    isFavorite: formInputs.value.isFavorite,
  }
  try {
    await updateLink(payload, props.id!)
    linkStore.updateLink(payload, props.id as number)
    showToast('success', 'Успех', 'Ссылка изменена')
  } catch {
    showToast('error', 'При изменении ссылка произошла ошибка')
  }
}

const submitForm = async () => {
  if (props.isEdit) {
    await updateLinkData()
  } else {
    await addNewLink()
  }
}

function getLink() {
  const link = linkStore.getLinkById(props.id!)
  formInputs.value.name = link.name!
  formInputs.value.url = link.url!
  formInputs.value.description = link.description!
  formInputs.value.isFavorite = link.isFavorite!
  formInputs.value.category = link.categories!
}

const loadModal = () => {
  if (props.isEdit) {
    getLink()
  }
}

const textButton = computed(() => {
  return props.isEdit ? 'Сохранить' : 'Добавить'
})

const textHeader = computed(() => {
  return props.isEdit ? 'Редактирование ссылки' : 'Создание ссылки'
})

onMounted(loadModal)
</script>

<template>
  <Toast />
  <Dialog modal :header="textHeader" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form
      v-slot="$form"
      :initial-values="formInputs"
      :resolver="resolver"
      :validate-on-blur="true"
      :validateOnValueUpdate="false"
      @submit="submitForm"
    >
      <div class="mb-3">
        <InputText
          name="name"
          v-model="formInputs.name"
          class="w-full"
          autocomplete="off"
          placeholder="Название ссылки"
        />
        <Message v-if="$form.name?.invalid" severity="error" variant="simple" size="small">
          {{ $form.name.error.message }}
        </Message>
      </div>
      <div class="mb-3">
        <InputText
          name="url"
          v-model="formInputs.url"
          class="w-full"
          autocomplete="off"
          placeholder="Ссылка"
        />
        <Message v-if="$form.url?.invalid" severity="error" variant="simple" size="small">
          {{ $form.url.error.message }}
        </Message>
      </div>
      <div class="mb-3">
        <Select
          v-model="formInputs.category"
          :options="categoryStore.listCategory"
          optionLabel="name"
          placeholder="Выберите категорию"
          class="w-full"
        />
      </div>
      <div class="mb-3">
        <Textarea
          v-model="formInputs.description"
          class="w-full"
          style="resize: none"
          placeholder="Описание"
        />
      </div>
      <div class="mb-3 flex items-center gap-2">
        <Checkbox v-model="formInputs.isFavorite" inputId="isFavorite" binary />
        <label for="isFavorite">Добавить в избранное</label>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button :label="textButton" type="submit" :loading="loading" />
      </div>
    </Form>
  </Dialog>
</template>
