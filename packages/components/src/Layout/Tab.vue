<script setup lang="ts">
import { h,ref } from 'vue'
import { DownOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useLayoutCtx } from './useLayout.hook'
import { useRoute, useRouter } from 'vue-router'
const { collapsed, tabsList, getCurrentTab, onTabAction,setPageCash, clearTabsMenu, setClickCount } = useLayoutCtx();
const route = useRoute()
const router = useRouter()
const loadingTabs = ref<string[]>([])

let cashPageList = JSON.parse(sessionStorage.getItem('AR_PAGE_CASH') || '[]') 

const onChangePage = (key: string) => {
  if (!Object.is(route.fullPath, key)) {
    router.push(key)
  }
  setPageCash(key)
  setClickCount(key as any)
  // 显示 loading 图标
  if (!loadingTabs.value.includes(key)) {
    loadingTabs.value.push(key)
  }

  // 1 秒后隐藏
  setTimeout(() => {
    loadingTabs.value = loadingTabs.value.filter(i => i !== key)
  }, 1000)
}
</script>

<template>
  <div class="tabs" :class="collapsed ? 'collapsed' : ''">
    <div class="tabs-wraper">
      <a-tabs
        :activeKey="getCurrentTab.fullPath"
        tab-position="top"
        hide-add
        type="editable-card"
        @edit="onTabAction"
        @change="onChangePage"
      >
        <a-tab-pane
          v-for="(item, index) in tabsList"
          :key="item.fullPath"
        >
            <template #tab>
              <LoadingOutlined
                v-if="loadingTabs.includes(item.fullPath)"
                style="margin-right: 6px"
              />
              {{ $t(item.meta.title) }}
            </template>
          </a-tab-pane>
        <template #rightExtra>
          <DeleteOutlined @click="clearTabsMenu()" style="cursor: pointer;"/>
          <!-- <a-button :icon="h(DownOutlined)" /> -->
        </template>
      </a-tabs>
    </div>
  </div>
</template>

<style lang="less">
.tabs {
  // position: fixed;
  // z-index: 100;
  // width: calc(100% - 200px);
  // left: 200px;
  background-color: #f5f7f9;
  &.collapsed {
    width: calc(100% - var(--app-sider-collapsed-width));
    left: var(--app-sider-collapsed-width);
  }
  &-wraper {
    width: 100%;
    // padding: 6px 12px;
    margin-bottom: 6px;
  }
  &-left {
    padding-right: 100px;
  }
  &-right {
    position: absolute;
  }

  .ant-tabs-nav {
    margin-bottom: 0;
    &:before {
      display: none;
    }
    .ant-tabs-tab {
      background: var(--app-color-surface);
      height: var(--app-control-height);
      border-radius: var(--app-radius-xs) !important;
      border: none;
      margin-right: 6px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
