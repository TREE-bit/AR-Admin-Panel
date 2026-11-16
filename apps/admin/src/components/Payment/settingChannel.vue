<template>
  <colPayment :id="id" :thirdCode="thirdCode"  :type="1"/>
  <payPayment :id="id" :thirdCode="thirdCode" :type="2"/>
</template>

<script setup lang="ts">
import colPayment from './components/colPayment.vue';
import payPayment from './components/payPayment.vue';
defineProps(['id','thirdCode'])
</script>