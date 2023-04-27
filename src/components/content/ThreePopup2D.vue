<script setup lang="ts">
import {ref} from "vue"

const info = ref('ThreePopup2D')
</script>


<template>
  <h1 class="title">{{ info }}</h1>
</template>


<style scoped>
.title{
  font-size: 20px;
  color: green;
  background-color: aqua;
}


</style>