<script setup lang="ts">
import { Layout } from '@ar/components'
import { userInfo } from '@/hooks'
const { menuTreeList, menuList } = userInfo()
</script>

<template>
  <Layout :menus="menuTreeList" :menuList="menuList">
    <a-card>
      <router-view />
    </a-card>

  </Layout>
</template>

<style scoped lang="less"></style>
