<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="p-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Skeleton size="2rem" class="m-2"></Skeleton>
        <Skeleton width="10rem"></Skeleton>
      </div>
      <Skeleton shape="circle" size="3rem" class="mr-2"></Skeleton>
    </div>
    <Skeleton width="12rem" class="m-2"></Skeleton>
    <Skeleton height="2rem" class="m-2"></Skeleton>
  </div>
</template>
