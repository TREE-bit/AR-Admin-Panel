<template>
    <div class="container">
      <Info :detailData="detailData" :assembleRecord="assembleRecord" ></Info>
    </div>
  </template>
  
  <script lang="ts" setup>
  import Info from "./components/assembleCheck.vue";
  defineProps(['detailData', 'assembleRecord']);
  </script>
  
  <style scoped lang="less">
  
  .container {
   width: 100%;
  }
  </style>
  