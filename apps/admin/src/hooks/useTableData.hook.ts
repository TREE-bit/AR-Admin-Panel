import { ref,computed, nextTick } from "vue";
import type { Ref } from "vue";
import { message } from "ant-design-vue";
import i18n from '@/i18n';
const t = (key: string, args?: any) => {
  return computed(() => i18n.global.t(key, args)).value;
}


interface FilterRule {
  key: string;
  validValues?: any[];
}

interface UseTableDataOptions {
  query: Ref<Record<string, any>>;           // 查询参数
  api: (params: any) => Promise<any>;        // 请求方法
  filterRules?: FilterRule[];                // 过滤规则
  afterFetch?: (data: any[]) => any[];       // 获取数据后处理
  defaultPageSize?: number;                 // 默认每页条数
  resDataType?: Number;                     // 数据类型 1:res.data 2:res.data.list 其他:res.data
  notShowChangeSize?: boolean;                  // 是否显示改变每页条数;true:不显示 false:显示
  handleQueryFields?: (query: Record<string, any>) => Record<string, any>;  // 处理查询参数字段
  fetchType?: Number;                     // 获取数据的类型 1:游标请求 2:普通请求    
  afterGetDataFunc?: () => void;                  // 获取数据后执行函数
}

/**
 * 通用分页 + 游标分页 Hook
 */
export function useTableData(options: UseTableDataOptions) {
  const totalPage = ref(0);// 总页数
  // 分页信息
  const pagination = ref({
    total: 0,
    current: 1,
    pageSize: options.defaultPageSize || 20,
    showSizeChanger: options.notShowChangeSize ? false : true,
    showTotal: (total: any) => t("total", [total]),
  });
  const fetchType = options.fetchType || 1;
  // 数据与状态
  const dataType = options.resDataType || 1;
  const dataSource = ref<any[]>([]);
  const extendData = ref<any>({});
  const loading = ref(false);
  const response = ref<any>({});
  // 排序相关
  const columnVal = ref("");
  const sortVal = ref("");

  // 游标分页状态
  const oldPageNo = ref(0);
  const pageCurrent = ref(0);
  const queryCount = ref(0);

  /** 重置游标相关字段 */
  const resetPageQuery = () => {
    options.query.value.direction = "";
    options.query.value.nextColValue = "";
    options.query.value.nextCursorId = "";
    options.query.value.prevColValue = "";
    options.query.value.prevCursorId = "";
  };

  /** 辅助函数：用于提前获取游标信息 */
  const getforData = async () => {
    const queryS = getProcessedQuery();
    const res: any = await options.api(queryS);
    if (res.code == 1 || res.code === "1") {
      if(dataType == 1){
        options.query.value.nextColValue = res.extend?.nextColValue;
        options.query.value.nextCursorId = res.extend?.nextCursorId;
        options.query.value.prevColValue = res.extend?.prevColValue;
        options.query.value.prevCursorId = res.extend?.prevCursorId;
      }else if(dataType == 2){
        options.query.value.nextColValue = res.data.extend?.nextColValue;
        options.query.value.nextCursorId = res.data.extend?.nextCursorId;
        options.query.value.prevColValue = res.data.extend?.prevColValue;
        options.query.value.prevCursorId = res.data.extend?.prevCursorId;
      }else{
        options.query.value.nextColValue = res.extend?.nextColValue;
        options.query.value.nextCursorId = res.extend?.nextCursorId;
        options.query.value.prevColValue = res.extend?.prevColValue;
        options.query.value.prevCursorId = res.extend?.prevCursorId;
      }
    }
  };

  /** 获取处理后的查询参数 */
  const getProcessedQuery = () => {
    let queryS = JSON.parse(JSON.stringify(options.query.value));
    // 将空字符串统一转 undefined
    for (const key in queryS) {
      if (queryS[key] === "") queryS[key] = undefined;
    }
    if (options.handleQueryFields) {
      queryS = options.handleQueryFields(queryS);
    }
    return queryS;
  };

  /** 主请求逻辑（含游标分页判断） */
  const getList = async (isFirst:any = null) => {
    if(isFirst){
      pagination.value.current = 1;
      options.query.value.pageNo = 1;
      oldPageNo.value = 0;
      resetPageQuery();
    }
    loading.value = true;
    try {
      if (fetchType === 1) { // 游标分页处理
        const queryPageNo = options.query.value.pageNo;
        queryCount.value = queryPageNo - oldPageNo.value;
  
        // 分页方向处理
        if (queryPageNo === 1) {
          options.query.value.firstPage = true;
          options.query.value.lastPage = false;
          resetPageQuery();
        } else if (queryPageNo === pageCurrent.value) {
          options.query.value.firstPage = false;
          options.query.value.lastPage = true;
          resetPageQuery();
        } else if (queryCount.value > 0) {
          options.query.value.firstPage = false;
          options.query.value.lastPage = false;
          options.query.value.direction = "next";
          for (let i = 0; i < Math.abs(queryCount.value) - 1; i++) {
            await getforData();
          }
        } else if (queryCount.value <= 0) {
          options.query.value.firstPage = false;
          options.query.value.lastPage = false;
          options.query.value.direction = "prev";
          for (let i = 0; i < Math.abs(queryCount.value) - 1; i++) {
            await getforData();
          }
        }
      }
      
      const queryS = getProcessedQuery();
      const res: any = await options.api(queryS);
      if (res && (res.code === 1 || res.code === "1")) {
        response.value = res;
        let list: any[] = [];
        if(dataType == 1){
          list = res.data || [];
          extendData.value = res.extend;
          if(fetchType == 1){
            if(options.query.value.pageNo == 1){
              totalPage.value = res.total;
            }
            pagination.value.total = totalPage.value;
            pageCurrent.value = Math.ceil((totalPage.value || 0) / options.query.value.pageSize);
          }else{
            pagination.value.total = res.total;
            pageCurrent.value = Math.ceil((res.total || 0) / options.query.value.pageSize);
          }
        }else if(dataType == 2){
          list = res.data.list || [];
          extendData.value = res.data?.extend;
          if(fetchType == 1){
            if(options.query.value.pageNo == 1){
              totalPage.value = res.data.total;
            }
            pagination.value.total = totalPage.value;
            pageCurrent.value = Math.ceil((totalPage.value || 0) / options.query.value.pageSize);
          }else{
            pagination.value.total = res.data.total;
            pageCurrent.value = Math.ceil((res.data.total || 0) / options.query.value.pageSize);
          }
        }else{
          list = res.data || [];
          extendData.value = res.extend;
          if(fetchType == 1){
            if(options.query.value.pageNo == 1){
              totalPage.value = res.total;
            }
            pagination.value.total = totalPage.value;
            pageCurrent.value = Math.ceil((totalPage.value || 0) / options.query.value.pageSize);
          }else{
            pagination.value.total = res.total;
            pageCurrent.value = Math.ceil((res.total || 0) / options.query.value.pageSize);
          }
        }
        dataSource.value = options.afterFetch ? options.afterFetch(list) : list;
        
        if (fetchType === 1) { // 更新游标信息
          options.query.value.nextColValue = extendData.value?.nextColValue;
          options.query.value.nextCursorId = extendData.value?.nextCursorId;
          options.query.value.prevColValue = extendData.value?.prevColValue;
          options.query.value.prevCursorId = extendData.value?.prevCursorId;
        }
        // 分页信息
        pagination.value.current = options.query.value.pageNo;
        pagination.value.pageSize = options.query.value.pageSize;

        // 记录页码状态
        oldPageNo.value = options.query.value.pageNo;

        // 获取数据后执行函数
        if(options.afterGetDataFunc){
          options.afterGetDataFunc();
        }
      }
    } catch (err) {
      console.error("获取列表失败：", err);
      // message.error("获取列表失败");
    } finally {
      loading.value = false;
    }
  };

  /** 筛选过滤更新 */
  const updateQueryFilters = (filters: any) => {
    if (!options.filterRules) return;
    options.filterRules.forEach(({ key, validValues }) => {
      const filterVal = filters[key]?.[0];
      if (filterVal !== undefined) {
        if (validValues) {
          if (validValues.includes(filterVal)) {
            options.query.value[key] = filterVal;
          }
        } else {
          options.query.value[key] = filterVal;
        }
      }
    });
  };

  /** 排序更新 */
  const updateSort = (columnKey: any, order: any, current: any, pageSize: any) => {
    if ("asc" in options.query.value) {
      if (columnVal.value === columnKey) {
        pagination.value.current = current;
        pagination.value.pageSize = pageSize;
        if (sortVal.value != order) {
          pagination.value.current = 1;
          options.query.value.pageNo = 1;
        }
      } else if ((!("column" in options.query.value) || !options.query.value.column ) || order == undefined) {
        options.query.value.pageNo = current;
        pagination.value.current = current;
        pagination.value.pageSize = pageSize;
      } else {
        pagination.value.current = 1;
        options.query.value.pageNo = 1;
      }

      if (order == undefined) {
        options.query.value.asc = false;
        options.query.value.column = "";
        columnVal.value = "";
        sortVal.value = "";
      } else {
        options.query.value.column = columnKey;
        columnVal.value = columnKey;
        sortVal.value = order;
        options.query.value.asc = Boolean(order === "ascend");
      }
    } else {
      options.query.value.pageNo = current;
      options.query.value.pageSize = pageSize;
      pagination.value.current = current;
      pagination.value.pageSize = pageSize;
    }
  };

  /** 处理表格变化 */
  const handleTableChange = async (paginationInfo: any, filters: any, sorter: any) => {
    const { current, pageSize } = paginationInfo;
    if (pageSize != options.query.value.pageSize) {
      options.query.value.pageNo = 1;
      pagination.value.current = 1;
    } else {
      options.query.value.pageNo = current;
      pagination.value.current = current;
    }
    options.query.value.pageSize = pageSize;
    pagination.value.pageSize = pageSize;

    updateQueryFilters(filters);

    const { columnKey, order } = sorter;
    updateSort(columnKey, order, options.query.value.pageNo, pageSize);
    await nextTick();
    await getList();
  };

  /** 重置查询参数 */
  const resetQuery = () => {
    const q = options.query.value;
    for (const key in q) {
      if (["pageNo", "pageSize"].includes(key)) continue;
      q[key] = undefined;
    }
    pagination.value.current = 1;
    pagination.value.pageSize = options.defaultPageSize || 20;
    options.query.value.pageSize = options.defaultPageSize || 20;
    options.query.value.pageNo = 1;
    options.query.value.asc = false;
    resetPageQuery();
    getList();
  };

  return {
    dataSource,
    extendData,
    pagination,
    loading,
    response,
    getList,
    handleTableChange,
    resetQuery,
  };
}
