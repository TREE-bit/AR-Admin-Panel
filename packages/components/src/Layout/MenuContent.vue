<template>
  <!-- <MailOutlined /> -->
  <Icon :type="item.icon" v-if="item.icon" />
  <span>{{ $t(item.label) }}</span>
</template>

<script lang="ts" setup>
import { MailOutlined } from '@ant-design/icons-vue'
import { PropType } from 'vue'
import Icon from './component/Icon.vue';

defineProps({
  item: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
})
const getMenuKey = (key:string) => {
  const path = key.split('_').join('/');
  const cashPageList = JSON.parse(sessionStorage.getItem('AR_PAGE_CASH') || '[]') 
  if(cashPageList.findIndex((item:any) => item == path) != -1) {
    cashPageList.push(path)
  }
  console.log(path)
  sessionStorage.setItem('AR_PAGE_CASH', JSON.stringify(cashPageList))
  console.log(JSON.parse(sessionStorage.getItem('AR_PAGE_CASH') || '[]'))
}
</script>
