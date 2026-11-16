<template>
  <Result title="404 Not Found" :tip="$t('m160')" type="404">
    <a-button type="primary" @click="() => $router.push('/')">{{$t('m161')}}</a-button>
  </Result>
</template>

<script lang="ts" >
export default {
  name: 'Result404',
};
</script>

<script setup lang="ts">
import Result from './index.vue';
</script>
