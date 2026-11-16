<script setup lang="ts"></script>

<template>
  <div class="layout-page">
    <div class="layout-page-header">
      <a-breadcrumb class="mb-15">
        <a-breadcrumb-item>{{ $t('m19') }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('m162') }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="flex">
        <div class="layout-page-header-main">
          <div class="layout-page-header-row flex">
            <div class="layout-page-header-title mb-15">{{ $t('m22') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.layout {
  &-page {
    margin: -20px -20px 0;
  }
  &-page-header {
    padding: 16px 32px 0 32px;
    background: var(--app-color-surface);
    border-bottom: 1px solid var(--app-color-border);
    &-main {
      flex: 0 1 auto;
      width: 100%;
    }
    &-row {
      width: 100%;
    }
    &-title,
    &-contnet {
      flex: auto;
    }
    &-title {
      display: inline-block;
      color: #17233d;
      font-weight: 500;
      font-size: 20px;
    }
    &-contnet {
      margin-bottom: 16px;
      font-size: 12px;
    }
  }
}
</style>
