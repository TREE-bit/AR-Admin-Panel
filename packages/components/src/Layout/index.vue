<template>
  <a-layout class="layout">
    <Sider>
      <slot name="menu" />
    </Sider>
    <a-layout class="layout-main">
      <Header >
        <slot name="header"></slot>
      </Header>
      <a-layout-content>
        <a-layout class="layout-content">
          <Tab />
          <a-layout-content>
            <slot></slot>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { watch } from 'vue'
import Sider from './Sider.vue'
import Header from './Header.vue'
import Tab from './Tab.vue'
import { useLayout, PropsBase } from './useLayout.hook'
const props = defineProps(PropsBase)
const { useProvide, addTabs, getSimpleRoute, setLocal, intLocal, route } = useLayout(props)
useProvide()
intLocal()
watch(
  () => route.fullPath,
  () => {
    if (props.blackList.some((n) => n === route.name)) return
    addTabs(getSimpleRoute(route))
  },
  { immediate: true },
)
// Save the data until the page is closed or refreshed
window.addEventListener('beforeunload', () => {
  setLocal()
})
</script>
<style lang="less">
.layout {
  flex-direction: row;
  width: 100%;
  .ant-layout-header {
    background: transparent;
    padding-inline-start: 0;
  }
  &-logo {
    width: 100%;
    display: flex;
    height: var(--app-header-height);
    border-bottom: 1px solid var(--app-color-border);
    &-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: var(--app-header-height);
    }

    .logo {
      width: 100%;
      height: 100%;
      color: rgba(0, 0, 0, 0.9);
      padding: 0 12px;
      &:hover {
        cursor: pointer;
      }
    }
    .t-logo {
      width: 100%;
      &:hover {
        cursor: pointer;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }
  &-header {
    &-inner {
      padding-left: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--app-color-border);
      height: var(--app-header-height);
    }
    &-side {
      background: var(--app-color-surface);
      right: 0;
      z-index: 10;
      width: auto;
      transition: left 0.3s ease, background-color 0.2s ease;
      position: fixed;
      top: 0;
      left: var(--app-sider-width);
      &.collapsed {
        left: var(--app-sider-collapsed-width);
      }
    }

    &-left {
      display: flex;
      align-items: normal;
      line-height: 0;
    }
  }
  &-sider {
    width: fit-content;
    position: relative;
    transition: width 0.2s ease;
    &-content {
      height: 100%;
      &-small {
        height: 100%;
        width: var(--app-sider-collapsed-width);
      }
    }
    &-placeholder {
      flex: 1 1 var(--app-sider-width);
      min-width: var(--app-sider-width);
      transition: flex-basis 0.3s ease, min-width 0.3s ease;
      &-small {
        flex: 1 1 var(--app-sider-collapsed-width);
        min-width: var(--app-sider-collapsed-width);
        transition: flex-basis 0.3s ease, min-width 0.3s ease;
      }
    }

    &-nav {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 200;
      transition: width 0.3s ease, background-color 0.2s ease;
      min-height: 100%;
      height: 100%;
      width: var(--app-sider-width);
      background: var(--app-color-surface);
      display: flex;
      align-items: center;
      flex-direction: column;
      &.collapsed {
        width: var(--app-sider-collapsed-width);
      }
      .ant-menu-inline-collapsed {
        width: 100%;
      }
    }
  }
  &-main {
    flex: 1;
    width: 100%;
    overflow-x: hidden;
  }
  &-content {
    // height: calc(100vh - 100px);
    height: calc(100vh - var(--app-header-height));
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--app-content-padding);
    .ant-layout-content {
      // padding: 0 15px 15px 15px;
      .ant-btn + .ant-btn {
        margin-left: 10px;
      }
    }
  }
}
</style>
