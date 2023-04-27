<script setup lang="ts">
import { onMounted, ref } from 'vue';
import createThreeScene, { getContainer } from "@/three/index"
import main from '@/three/main';

const canvas = ref(null)
onMounted(() => {
  const id = createThreeScene(canvas.value!)
  main()
  const container = getContainer()
  window.container = container
})
</script>


<template>
  <div class="scene" >
    <canvas ref="canvas"></canvas>
  </div>
</template>


<style scoped>
.scene{
  position: relative;
  pointer-events: auto;
  width: 100vw;
  height: 100vh;
}
</style>