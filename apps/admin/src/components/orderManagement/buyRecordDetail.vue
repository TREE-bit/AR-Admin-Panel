<template>
    <div class="container">
      <Info :listInfo="listInfo"></Info>
    </div>
  </template>
  
  <script lang="ts" setup>
  import Info from "./components/buyRecordCheck.vue";
  defineProps(['listInfo']);
  </script>
  
  <style scoped lang="less">
  .container {
   width: 100%;
  }
  </style>
  