<script setup lang="ts">
import {computed, h} from 'vue'
import {
  AlignRightOutlined,
  ColumnHeightOutlined,
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { baseTableProps, useTable } from './hooks'
import Query from './Query.vue'

const props = defineProps(baseTableProps)
const emit = defineEmits(['create', 'view'])
const {
  loading,
  tableRef,
  tableSizes,
  tableSize,
  expandQuery,
  columnsList,
  selectedKeys,
  selectedKey,
  otherTableProps,
  dataSouceList,
  isBatchRemove,
  drawer,
  contextHolder,
  onRefresh,
  onExpandQuery,
  onTableSize,
  onRemove,
  onEdit,
  onTableFilterKeys,
  onCreate,
  onBatchRemove,
} = useTable(props, emit)
const isSearch=computed(()=>props?.tool?.search)
</script>

<template>
  <div class="crud">
    <a-drawer
        v-model:open="drawer"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        style="color: red"
        title="Basic Drawer"
        placement="right"

    >
      <slot name="drawer"> </slot>
    </a-drawer>
    <contextHolder />
    <Query v-if="expandQuery" />
    <div class="crud-toolbar mb-15">
      <a-row>
        <a-col class="crud-toolbar-left">
          <slot name="toolbar">
            <a-button type="primary" ghost @click="onCreate">
              <PlusOutlined />
              {{ $t('m151') }}
            </a-button>
            <a-button danger ghost v-if="isBatchRemove" @click="onBatchRemove">
              <DeleteOutlined />
              {{ $t('m152') }}
            </a-button>
          </slot>
          <slot name="toolbar-after"> </slot>
        </a-col>
        <a-col class="crud-toolbar-right">
          <a-row>
            <a-col>
              <a-tooltip :title="$t('m153')" @click="onRefresh">
                <a-button type="text" :icon="h(ReloadOutlined)" />
              </a-tooltip>
            </a-col>
            <a-col v-if="isSearch">
              <a-tooltip :title=" $t('m154')" @click="onExpandQuery">
                <a-button type="text" :icon="h(SearchOutlined)" />
              </a-tooltip>
            </a-col>
            <a-col>
              <a-dropdown :trigger="['click']">
                <a-tooltip :title="$t('m155')">
                  <a-button type="text" :icon="h(ColumnHeightOutlined)" @click.prevent />
                </a-tooltip>
                <template #overlay>
                  <a-menu v-model:selectedKeys="tableSize" @click="onTableSize">
                    <a-menu-item v-for="item of tableSizes" :key="item.value">
                      {{ item.label }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-col>
            <a-col>
              <a-dropdown :trigger="['click']" placement="bottomLeft" v-model:open="selectedKey">
                <a-tooltip :title=" $t('m156') ">
                  <a-button type="text" :icon="h(AlignRightOutlined)" @click.prevent />
                </a-tooltip>
                <template #overlay>
                  <a-menu @click="onTableFilterKeys">
                    <div style="padding: 8px 8px 4px 8px"> {{ $t('m157') }}</div>
                    <a-menu-divider />
                    <a-menu-item v-for="item of columns" :key="item.key">
                      <a-checkbox
                        :checked="selectedKeys.includes(item.key)"
                        :value="item.key"
                        :key="item.key"
                      >
                        {{ item.title }}
                      </a-checkbox>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="crud-table">
      <a-table
        bordered
        :data-source="dataSouceList"
        :loading="loading"
        :scroll="{ x: '100%' }"
        :columns="columnsList"
        ref="tableRef"
        v-bind="otherTableProps"
      >
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key === 'actions'">
            <slot name="row-buttons-before" v-bind="record"></slot>
            <a-button type="link" size="small" @click="onEdit(record, index, column)">
              <EditOutlined />
              {{ $t('edit') }}
            </a-button>
            <a-popconfirm
              :title="$t('t7') "
              @confirm="onRemove(record, index, column)"
              :ok-text="$t('b9')"
              :cancel-text="$t('b10')"
            >
              <a-button type="link" size="small">
                <DeleteOutlined />
                 {{ $t('b11') }}
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less">
.crud {
  width: 100%;

  &-toolbar {
    &-left {
      flex: 1 1 auto;

      button {
        margin-right: 15px;
      }
    }

    &-right {
      flex: 0 0 200px;
      text-align: right;

      .ant-col {
        flex: 1 1 0;
      }
    }
  }
}
</style>
