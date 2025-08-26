<script setup lang="ts">
import { ref } from 'vue'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import LoginForm from '@/components/AuthForm/LoginForm.vue'
import RegistrationForm from '@/components/AuthForm/RegistrationForm.vue'
import ResetPasswordForm from './ResetPasswordForm.vue'

const enum AuthTab {
  SingIn = 'singin',
  SingUp = 'singup',
  Reset = 'reset',
}

const activeTab = ref<AuthTab>(AuthTab.SingIn)
</script>
<template>
  <Tabs v-model:value="activeTab">
    <TabList>
      <Tab :value="AuthTab.SingIn">Вход</Tab>
      <Tab :value="AuthTab.SingUp">Регистрация</Tab>
    </TabList>
    <TabPanels>
      <TabPanel :value="AuthTab.SingIn"
        ><LoginForm @reset-password="activeTab = AuthTab.Reset"
      /></TabPanel>
      <TabPanel :value="AuthTab.SingUp"><RegistrationForm /></TabPanel>
      <TabPanel :value="AuthTab.Reset"><ResetPasswordForm /></TabPanel>
    </TabPanels>
  </Tabs>
</template>
