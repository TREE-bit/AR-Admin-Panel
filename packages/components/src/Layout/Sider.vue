<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue'
import MenuItem from './MenuItem.vue'
import LogoFull from '../assets/assets-logo-full.svg?component'
import AssetLogo from '../assets/assets-t-logo.svg?component'
import { useLayoutCtx } from './useLayout.hook'
import { useRoute } from 'vue-router'
const { collapsed, goMenu, menus, menuList } = useLayoutCtx()
const rootSubmenuKeys = computed(() => menus.value.map((item) => item.id))
const route = useRoute()
const state = reactive<any>({
  openKeys: [],
  selectedKeys: [],
})
const getLogo = computed(() => {
  if (collapsed.value) return AssetLogo
  return LogoFull
})
const placeholderClass = computed(
  () => `layout-sider-${collapsed.value ? 'placeholder-small' : 'placeholder'}`,
)
const contentClass = computed(() => `layout-sider-${collapsed.value ? 'content-small' : 'content'}`)
const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find((key) => !state.openKeys.includes(key))
  if (!latestOpenKey) {
    // 用户点击的是当前展开的菜单，再次点击则折叠它
    state.openKeys = []
  } else if (rootSubmenuKeys.value.includes(latestOpenKey)) {
    // 只展开一个一级菜单（最新点击的）
    state.openKeys = [latestOpenKey]
  } else {
    // 不在一级菜单中，保留当前展开项
    state.openKeys = openKeys
  }
}
watch(
  ()=>route.name,
  (val:any)=>{
    // state.selectedKeys = [val];
    const selectedId = menuList.value.find((item: any) => item.path == val?.split('_').join('/'))?.id
    const openId = menuList.value.find((item: any) => item.path == val?.split('_').join('/'))?.parentId
    state.selectedKeys = [selectedId]
    state.openKeys = [openId]
    // state.openKeys[0] = ('_' + route.name.split('_')[1]) || [];
    // state.selectedKeys[0] = route.name || [];
  }
)
onMounted(()=>{
  const routeName: any = route.name;
  state.openKeys = [menuList.value.find((item: any) => item.path == routeName.split('_').join('/'))?.parentId]
  state.selectedKeys = [menuList.value.find((item: any) => item.path == routeName.split('_').join('/'))?.id]
  // state.openKeys[0] = ('_' + route.name.split('_')[1]) || [];
  // state.selectedKeys[0] = route.name || [];
})
</script>

<template>
  <div class="layout-sider">
    <div :class="contentClass">
      <div class="layout-sider-nav" :class="collapsed ? 'collapsed' : ''">
        <div class="layout-logo">
          <span class="layout-logo-wrapper">
            <component :is="getLogo" :class="collapsed ? 't-logo' : 'logo'" />
          </span>
        </div>
        <slot>
          <a-menu
            v-model:selectedKeys="state.selectedKeys"
            :openKeys="state.openKeys"
            mode="inline"
            :inline-collapsed="collapsed"
            @click="goMenu"
            @openChange="onOpenChange"
          >
            <MenuItem :menus="menus" />
          </a-menu>
        </slot>
      </div>
      <div :class="placeholderClass" />
    </div>
  </div>
</template>
<style scoped>
/* 设置滚动条的宽度、颜色和样式 */
::-webkit-scrollbar {
  width: 0.2px; /* 滚动条宽度 */
}

/* 设置滚动条轨道的颜色 */
::-webkit-scrollbar-track {
  background-color: #f5f5f5; /* 轨道颜色 */
}

/* 设置滚动条滑块的颜色 */
::-webkit-scrollbar-thumb {
  background-color: #f5f5f5; /* 滑块颜色 */
}

/* 设置滚动条滑块的hover状态样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #f5f5f5; /* hover状态下的滑块颜色 */
}
.layout-sider-nav>ul{
  overflow-y: auto;
  overflow-x: hidden;
}
</style>