<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const windowHeight = ref(window.innerHeight)
</script>

<template>
  <div class="container" :style="{height: windowHeight + 'px'}">
    <RouterView />
  </div>
</template>

<style lang="less">
#app {
  padding: 0;
  background-color: @doc-bg-color;
}
html {
  overflow: hidden;
}
body {
  overflow: hidden;
}
</style>
