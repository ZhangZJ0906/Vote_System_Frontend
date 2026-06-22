<script setup>
import { computed } from 'vue'
import { RouterView,useRoute } from 'vue-router'
import ToolBar from '@/components/ToolBar.vue'
const route = useRoute()
const showToolBar = computed(() => route.name !== 'Login')
</script>

<template>
<ToolBar v-if="showToolBar"></ToolBar>
  <RouterView>

  </RouterView>

</template>

<style scoped></style>
