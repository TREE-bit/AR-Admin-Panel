<template>
<h1>富文本测试</h1>
  <div class="testEditor">
    <Aieditor  :announcement-content="content" @change="change"/>
  </div>
  <div class="testEditor" style="padding-left: 40px;" v-html="content"> </div>
</template>
<script lang="ts" setup>
// import Aieditor from '@/components/aieditor.vue'
import { ref , onMounted, defineAsyncComponent } from 'vue'
const Aieditor = defineAsyncComponent(() => import('@/components/aieditor.vue'))
const content=ref('请编辑活动内容')
const change = (val:any)=>{
  content.value=val
}
</script>
<style lang="less" scoped>
.testEditor{
  width: 50%;
  float: left;
}
</style>