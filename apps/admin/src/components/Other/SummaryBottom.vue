<template>
  <a-table-summary fixed="bottom">
    <a-table-summary-row v-for="(row, rowIndex) in summaryRows" :key="rowIndex">
      <!-- 合并 label + 非统计字段 -->
      <a-table-summary-cell
        :col-span="getMergeColSpan(row)"
        class="label-box"
      >
        <div class="label-text">
          {{ row.label }}
        </div>
      </a-table-summary-cell>

      <!-- 剩余统计字段 -->
      <template v-for="col in getOrderedColumns(row).slice(getMergeColSpan(row) - 1)" :key="col.dataIndex">
        <a-table-summary-cell :index="col.index" align="center" style="color:red">
          <!-- 多值情况 -->
          <template v-if="Array.isArray(row.fields[col.dataIndex])">
            <div v-for="(item, i) in row.fields[col.dataIndex] as any" :key="i" style="white-space: nowrap">
              {{ item.text }}：{{ currency(item.value,false) }}
            </div>
          </template>

          <!-- 单值情况 -->
          <template v-else>
            {{
              (() => {
                const value = row.fields[col.dataIndex];
                if (value === null || value === undefined ) return '';
                return isNaN(Number(value)) ? value : currency(Number(value), false);
              })()
            }}
          </template>
        </a-table-summary-cell>
      </template>
    </a-table-summary-row>
  </a-table-summary>
</template>

<script setup lang="ts">
import { currency, thousand } from "@/utils";
import { nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";

type SummaryFieldValue =
  | number
  | { text: string; value: number }[];

type SummaryRow = {
  label: string;
  fields: Record<string, SummaryFieldValue>;
  fixedPositions?: Record<string, number>; // 以 label 为 index=0
};

const props = defineProps<{
  summaryRows: SummaryRow[];
  dynamicColumns: { dataIndex: string }[];
  firstColumnLabel: string;
}>();
// 返回当前 row 的列顺序并标记 index（以 label 为 index 0）
const getOrderedColumns = (row: SummaryRow) => {
  const fixed = row.fixedPositions || {};
  const cols = [...props.dynamicColumns].filter(
    (col) => col.dataIndex !== props.firstColumnLabel
  );

  const placed = new Set<string>();
  const finalCols: (null | { dataIndex: string; index: number })[] = [];

  // 插入固定位置列（注意：index=1 表示 label 后第一列）
  for (const [dataIndex, pos] of Object.entries(fixed)) {
    const col = cols.find((c) => c.dataIndex === dataIndex);
    if (col) {
      finalCols[pos] = { dataIndex, index: pos };
      placed.add(dataIndex);
    }
  }

  // 插入未指定位置的列
  let cursor = 1; // 从 index 1 开始（0 是 label）
  for (const col of cols) {
    if (placed.has(col.dataIndex)) continue;
    while (finalCols[cursor]) cursor++;
    finalCols[cursor] = { dataIndex: col.dataIndex, index: cursor };
  }

  // 去掉 null
  return finalCols.filter(Boolean) as { dataIndex: string; index: number }[];
};

const getMergeColSpan = (row: SummaryRow): number => {
  const orderedCols = getOrderedColumns(row);

  // 找到第一个出现在 fields 中的统计字段在 orderedCols 中的位置
  const firstStatIndex = orderedCols.findIndex((col) =>
    Object.prototype.hasOwnProperty.call(row.fields, col.dataIndex)
  );

  return firstStatIndex === -1 ? 1 : firstStatIndex +1; // +1 包括 label 本身
};
let labelText: HTMLCollectionOf<Element> | [];
let scrollTarget: HTMLElement | null = null;
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScrollLeft = labelText[0].clientWidth - 100;
  const left = target.scrollLeft < maxScrollLeft ? target.scrollLeft : maxScrollLeft;
  if (labelText) {
    Array.from(labelText).forEach((element: Element) => {
      (element as HTMLElement).style.left = `${left}px`;
    });
  }
};
onMounted(() => {
  nextTick(() => {
    labelText = document.getElementsByClassName('label-text');
  });
  scrollTarget = document.getElementsByClassName('ant-table-body')[0] as HTMLElement;
  if (scrollTarget) {
    scrollTarget.addEventListener('scroll', handleScroll);
  }
});
onBeforeUnmount(() => {
  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', handleScroll);
  }
});
</script>
<style scoped lang="less">
.label-box {
  .label-text {
    position: relative;
  }
}
</style>
