<template>
  <div class="field-doc">
    <div class="search">
      <h2>{{ $t('字段理解文档') }}</h2>
    </div>
    <p class="field-doc-lead">
      这里展示已经存档的页面、字段和字段理解。校正状态跟着存档走：已确认的按确认内容展示，待校正的还是按页面初读写下的。
    </p>
    <div class="field-doc-stats">
      <button type="button" class="stat" :class="{ active: !status && !onlyGap }" @click="resetFilter">
        <span>页面</span>
        <strong>{{ fieldNotePages.length }}</strong>
      </button>
      <button type="button" class="stat" :class="{ active: status === 'confirmed' }" @click="pickStatus('confirmed')">
        <span>已确认</span>
        <strong>{{ confirmedCount }}</strong>
      </button>
      <button type="button" class="stat" :class="{ active: status === 'pending' }" @click="pickStatus('pending')">
        <span>待校正</span>
        <strong>{{ pendingCount }}</strong>
      </button>
      <button type="button" class="stat" :class="{ active: onlyGap }" @click="onlyGap = !onlyGap">
        <span>已写理解 / 字段</span>
        <strong>{{ understoodTotal }} / {{ fieldTotal }}</strong>
      </button>
    </div>
    <div class="field-doc-filters">
      <a-select
        v-model:value="group"
        allow-clear
        placeholder="栏目"
        class="filter-group"
        :options="groupOptions"
      />
      <a-select
        v-model:value="status"
        allow-clear
        placeholder="校正状态"
        class="filter-status"
        :options="statusOptions"
      />
      <a-input
        v-model:value="keyword"
        allow-clear
        class="filter-keyword"
        placeholder="搜页面、路由、字段、理解"
      />
    </div>
    <a-table
      size="middle"
      bordered
      row-key="no"
      :columns="pageColumns"
      :data-source="rows"
      :expand-row-by-click="true"
      :pagination="pagination"
      :scroll="{ x: 1100 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'confirmed' ? 'green' : 'orange'">
            {{ record.status === 'confirmed' ? '已确认' : '待校正' }}
          </a-tag>
          <a-tag v-if="record.retired">菜单已弃用</a-tag>
        </template>
        <template v-else-if="column.key === 'understoodCount'">
          {{ record.understoodCount }} / {{ record.fields.length }}
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <p v-if="record.statusRaw" class="field-doc-status">{{ record.statusRaw }}</p>
        <div v-if="record.lead.length" class="field-doc-lead-lines">
          <div v-for="item in record.lead" :key="item">{{ item }}</div>
        </div>
        <a-table
          v-if="record.showFields.length"
          size="small"
          bordered
          :columns="fieldColumns"
          :data-source="record.showFields"
          :pagination="false"
          :scroll="{ x: 980 }"
        >
          <template #bodyCell="{ column, record: field }">
            <template v-if="column.key === 'meaning'">
              <span v-if="field.meaning">{{ field.meaning }}</span>
              <span v-else class="muted">未写</span>
            </template>
            <template v-else-if="column.key === 'note'">
              <span v-if="field.note">{{ field.note }}</span>
              <span v-else class="muted">—</span>
            </template>
          </template>
        </a-table>
        <p v-else class="muted">这一节没有拆出字段表。</p>
        <div v-if="record.showEnums.length" class="field-doc-enums">
          <div class="enum-title">同页枚举</div>
          <div v-for="item in record.showEnums" :key="item">{{ item }}</div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { fieldNotePages } from '@/prototype/fieldNotePages'

type StatusFilter = 'confirmed' | 'pending' | 'retired'

const group = ref<string>()
const status = ref<StatusFilter>()
const keyword = ref('')
const onlyGap = ref(false)

const confirmedCount = fieldNotePages.filter((page) => page.status === 'confirmed').length
const pendingCount = fieldNotePages.filter((page) => page.status === 'pending').length
const fieldTotal = fieldNotePages.reduce((sum, page) => sum + page.fields.length, 0)
const understoodTotal = fieldNotePages.reduce((sum, page) => sum + page.understoodCount, 0)

const groupOptions = [...new Set(fieldNotePages.map((page) => page.group))].map((item) => ({
  label: item,
  value: item,
}))

const statusOptions = [
  { label: '已确认', value: 'confirmed' },
  { label: '待校正', value: 'pending' },
  { label: '菜单已弃用', value: 'retired' },
]

const pageColumns = [
  { title: '序号', dataIndex: 'no', key: 'no', width: 72 },
  { title: '栏目', dataIndex: 'group', key: 'group', width: 120 },
  { title: '页面', dataIndex: 'title', key: 'title', width: 220 },
  { title: '路由', dataIndex: 'route', key: 'route', width: 260 },
  { title: '校正状态', key: 'status', width: 180 },
  { title: '字段数', dataIndex: 'fieldCount', key: 'fieldCount', width: 90 },
  { title: '已写理解', key: 'understoodCount', width: 110 },
]

const fieldColumns = [
  { title: '小节', dataIndex: 'part', key: 'part', width: 160 },
  { title: '字段', dataIndex: 'field', key: 'field', width: 180 },
  { title: '列标题', dataIndex: 'label', key: 'label', width: 180 },
  { title: '字段理解', dataIndex: 'meaning', key: 'meaning' },
  { title: '备注', dataIndex: 'note', key: 'note', width: 220 },
]

const pagination = {
  pageSize: 20,
  showSizeChanger: true,
  pageSizeOptions: ['20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 页`,
}

function includes(text: string, word: string) {
  return text.toLowerCase().includes(word)
}

function pickStatus(value: StatusFilter) {
  onlyGap.value = false
  status.value = status.value === value ? undefined : value
}

function resetFilter() {
  status.value = undefined
  onlyGap.value = false
}

const rows = computed(() => {
  const word = keyword.value.trim().toLowerCase()
  return fieldNotePages.flatMap((page) => {
    if (group.value && page.group !== group.value) return []
    if (status.value === 'retired' && !page.retired) return []
    if (status.value && status.value !== 'retired' && page.status !== status.value) return []
    const pageHit = !word || [page.title, page.route, page.group, String(page.no), page.statusRaw, ...page.lead].some((item) => includes(item, word))
    const matchedFields = word
      ? page.fields.filter((item) => [item.part, item.field, item.label, item.meaning, item.note].some((text) => includes(text, word)))
      : page.fields
    const matchedEnums = word ? page.enums.filter((item) => includes(item, word)) : page.enums
    if (!pageHit && !matchedFields.length && !matchedEnums.length) return []
    const showFields = (pageHit ? page.fields : matchedFields).filter((item) => !onlyGap.value || !item.meaning.trim())
    if (onlyGap.value && !showFields.length) return []
    return [{
      ...page,
      fieldCount: page.fields.length,
      showFields: showFields.map((item, index) => ({ ...item, key: `${page.no}-${index}-${item.field}` })),
      showEnums: pageHit ? page.enums : matchedEnums,
    }]
  })
})
</script>

<style scoped>
.field-doc-lead {
  margin: 0 0 12px;
  color: rgba(0, 0, 0, 0.65);
}
.field-doc-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.stat {
  min-width: 140px;
  padding: 10px 14px;
  text-align: left;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
}
.stat span {
  display: block;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
.stat strong {
  display: block;
  margin-top: 4px;
  font-size: 20px;
}
.stat.active {
  border-color: #1677ff;
  background: #e6f4ff;
}
.field-doc-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.filter-group,
.filter-status {
  width: 180px;
}
.filter-keyword {
  width: 320px;
}
.field-doc-status,
.field-doc-lead-lines {
  margin: 0 0 8px;
}
.field-doc-enums {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.7;
}
.enum-title {
  font-weight: 600;
}
.muted {
  color: rgba(0, 0, 0, 0.35);
}
:deep(.ant-table-cell) {
  white-space: normal;
  word-break: break-word;
}
</style>
