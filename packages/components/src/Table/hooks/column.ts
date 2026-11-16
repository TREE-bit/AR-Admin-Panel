import type { ColumnType } from 'ant-design-vue/es/table/interface'
import { TableColumn } from './type'
export function isFunction(value: unknown): boolean {
  return typeof value === 'function'
}
export function Column(options: TableColumn): ColumnType {
  const { label: title, align = 'center', key, ...other } = options
  return {
    title,
    align,
    key,
    dataIndex: key,
    ...other,
  }
}
