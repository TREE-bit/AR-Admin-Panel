<template>
    <div class="search">
        <h2>{{ $getMenuName() }}</h2>
    </div>
    <div class="dataContent">
        <dataIframe v-if="biDataUrl[23]" :url="biDataUrl[23]" />
        <a-empty v-else  :description="$t('n336')" ></a-empty>
    </div>
</template>

<script setup lang="ts">
import { biDataUrl } from '@/utils/publicData';
import dataIframe from './components/dataIframe.vue'
</script>
<style lang="less" scoped>
</style>