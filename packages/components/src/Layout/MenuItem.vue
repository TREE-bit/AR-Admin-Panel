<template>
  <template v-for="item in filterMenus" :key="item.id || item.fullPath" :path="item.key">
    <template v-if="isShowSubMenu(item)">
      <Menu.SubMenu :key="item?.id" :path="item.key" v-bind="$attrs">
        <template #title>
          <MenuItemContent :item="item" />
        </template>
        <template v-if="item.children">
          <MyMenuItem :menus="item.children" />
        </template>
      </Menu.SubMenu>
    </template>
    <template v-else>
      <Menu.Item :key="item?.id" :path="item.key" :title="$t(item.label)">
        <MenuItemContent :item="item"/>
      </Menu.Item>
    </template>
  </template>
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { Menu } from 'ant-design-vue'
import MenuItemContent from './MenuContent.vue'

defineOptions({
  name: 'MyMenuItem',
})

const props = defineProps({
  menus: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const filterMenus = computed(() => {
  return [...props.menus].sort((a, b) => (a?.sort || 0) - (b?.sort || 0))
})

const isShowSubMenu = (menuItem:any) => {
  return menuItem?.children?.length > 0
}
</script>

<style scoped></style>
