import type { PropType } from 'vue'
import type { TableProps, FormItemProps } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table/interface'
import { ColumnGroupType, ColumnType } from 'ant-design-vue/es/table/interface'

export interface TableForm {
  // 组件
  component: string
  // 组件类型
  componentType?: string
  formItem: FormItemProps
  // 是否禁用
  disabled: boolean
  //
  type: string
}
export interface TablePagination {
  pageSize: number
  /**
   * 页码形式
   */
  page: number
  total: number
}
export interface TableColumn {
  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 宽度
   */
  width: number | string
  /**
   * 列是否固定在左侧或者右侧。 true 表示固定在左侧
   */
  fixed?: boolean | 'left' | 'right'
  /**
   * 标题
   */
  label: string
  /**
   * 键名
   */
  key: string
  /**
   * 字段名
   * 当列类型为 表单字段、排序字段、筛选字段 时， prop 是必填的
   *
   * 支持属性路径, 例如 a.b
   */
  prop?: string

  type?: 'index' | 'selection' | 'expand' | 'actions' | 'default' | 'query'
  form?: TableForm
  readonly title?:string
}
export interface CrudProps<Item extends {}> {
  /**
   * 唯一 id, 用于获取唯一 id
   */
  rowKey?: string | symbol | ((row: Item) => string | number)
  /**
   * 列声明
   */
  columns: TableColumn[]
}
export type DataColumns = ColumnsType
export type DataColumn = ColumnGroupType<Record<string, any>> | ColumnType
export interface TableTool{
  search:boolean
}
export const baseTableProps = {
  tool:{
    type:Object as PropType<TableTool>,
    default:()=>Object.create({search:false,})
  },
  pagination: {
    type: Object as PropType<TablePagination>,
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: [],
  },
  dataSource: {
    type: Array as PropType<TableProps['dataSource']>,
    default: [],
  },
  fetchData: Function,
  fetchEdit: Function,
  fetchRemove: Function,
  fetchCreate: Function,
  fetchBatchremove: Function,
  /**
   * 选中行
   */
  selectionRow: {
    type: Array as PropType<TableProps['dataSource']>,
  },

  /**
   * 点击行展开详情
   */
  clickRowToView: {
    type: Array as PropType<TableProps['dataSource']>,
  },

  expand: {
    type: Array as PropType<TableProps['dataSource']>,
  },
}
