<script setup lang="ts">
import Scene from './components/content/Scene.vue';

</script>

<template>
  <Scene />
  <router-view></router-view>
</template>

<style scoped>
:global(#app) {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
