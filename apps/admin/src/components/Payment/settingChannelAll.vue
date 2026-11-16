<template>
  <colPaymentAll :id="id" :thirdCode="thirdCode"  :type="1"/>
  <payPaymentAll :id="id" :thirdCode="thirdCode" :type="2"/>
</template>

<script setup lang="ts">
import colPaymentAll from './components/colPaymentAll.vue';
import payPaymentAll from './components/payPaymentAll.vue';
defineProps(['id','thirdCode'])
</script>