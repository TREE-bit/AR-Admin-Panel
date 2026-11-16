import { computed, reactive, ref, ExtractPropTypes, createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { baseTableProps, DataColumns, DataColumn } from './type'
import { Column, isFunction } from './column'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
export const tableSizes = [
  {
    value: 'middle',
    label: '默认',
  },
  {
    value: 'small',
    label: '紧凑',
  },
  {
    value: 'large',
    label: '宽松',
  },
]
export function useTable(
  props: ExtractPropTypes<typeof baseTableProps>,
  emit: (name: any, ...args: any[]) => void,
) {
  const tableRef = ref()
  const formRef = ref()
  const loading = ref<boolean>(false)
  const drawer=ref(false)
  const dataSouceList = ref([...(props.dataSource || [])])
  const query = ref(true)
  const expandQuery = computed(()=>props?.tool?.search?query.value:false)
  const selected = ref<any[]>([])
  const tableSize = ref<string[]>(['middle'])
  const selectedKeys = ref<string[]>(['actions'].concat(props.columns.map((item) => item.key)))
  const selectedKey = ref(false)
  const selectedRowKeys = ref<string[]>([])
  const [_modal, contextHolder] = Modal.useModal()
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 3000,
  })
  const onShowSizeChange = (_current: number, size: number) => {
    pagination.pageSize = size
    pagination.page = 1
  }
  const onSelectedRowChange = (keys: string[]) => {
    selectedRowKeys.value = keys
  }
  const paginationProps = computed(() => ({
    total: pagination.total,
    current: pagination.page,
    pageSize: pagination.pageSize,
    showSizeChanger: true,
    onChange: (page: number) => {
      pagination.page = page
    },
    onShowSizeChange,
  }))
  const columnsList = computed<DataColumns>(() => {
    const list = ([] as DataColumns).concat(props.columns)
    list.push(
      Column({
        label: '操作',
        key: 'actions',
        type: 'actions',
        width: 100,
      }),
    )
    return list.filter((item) => selectedKeys.value.includes(item.key as string))
  })
  const rowSelection = ref({
    onChange: onSelectedRowChange,
  })
  const otherTableProps = computed(() => {
    return {
      pagination: paginationProps,
      defaultExpandAllRows: false,
      rowKey: 'userName',
      size: tableSize.value[0],
      rowSelection: props.fetchBatchremove ? rowSelection : null,
    }
  })
  const isBatchRemove = computed(
    () => selectedRowKeys.value.length > 0 && isFunction(props.fetchBatchremove),
  )
  const onExpandQuery = () => {
    query.value = !query.value
  }
  const onTableSize = (item: any) => {
    tableSize.value = item.keyPath
  }
  const onTableFilterKeys = (item: any) => {
    if (selectedKeys.value.includes(item.key)) {
      selectedKeys.value = selectedKeys.value.filter((key) => key !== item.key)
    } else {
      selectedKeys.value = Array.from<string>(new Set([item.key].concat(selectedKeys.value)))
    }
  }
  const onRefresh = () => {
    if (!props.fetchData || !isFunction(props.fetchData)) return
    return props.fetchData()
  }
  const onEdit = (data: any, index: number, column: DataColumn) => {
    emit('edit', { data, index, column })
  }
  const onRemove = async (data: any, index: number, column: DataColumn) => {
    if (!props.fetchRemove || !isFunction(props.fetchRemove)) return
    return props.fetchRemove(data, index, column)
  }
  const onCreate = () => {
    drawer.value=true;
    emit('create')
  }
  const onBatchRemove = () => {
    const confirm = Modal.confirm({
      title: '删除确认',
      icon: createVNode(ExclamationCircleOutlined),
      content: () => (
        <div>
          您确认要删除<strong>{selectedRowKeys.value.join(',')}</strong>?
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      transitionName: 'ant-fade',
      centered: true,
      onOk() {
        if (!props.fetchBatchremove || !isFunction(props.fetchBatchremove)) return
        return props.fetchBatchremove(selectedRowKeys)
      },
      onCancel() {
        confirm.destroy()
      },
    })
  }
  return {
    tableRef,
    formRef,
    loading,
    selected,
    expandQuery,
    tableSize,
    columnsList,
    selectedKeys,
    selectedKey,
    otherTableProps,
    rowSelection,
    dataSouceList,
    selectedRowKeys,
    isBatchRemove,
    drawer,
    tableSizes,
    contextHolder,
    onRefresh,
    onExpandQuery,
    onTableSize,
    onTableFilterKeys,
    onRemove,
    onEdit,
    onBatchRemove,
    onCreate,
  }
}
export function useCrud() {
  const loading = ref<boolean>(false)
  return {
    loading,
  }
}
