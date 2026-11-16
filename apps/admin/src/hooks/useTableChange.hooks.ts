import { ref } from "vue";

interface FilterRule {
  key: string;
  validValues?: any[];
}

interface UseTableChangeOptions {
  query: any;
  pagination: any;
  getList: () => void;
  filterRules?: FilterRule[];
}

export function useTableChange(options: UseTableChangeOptions) {
  const columnVal = ref("");
  const sortVal = ref("");
  const isChange = ref(false);

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

  const updateSort = (columnKey: any, order: any, current: any, pageSize: any) => {
    if('asc' in options.query.value){
      if (columnVal.value === columnKey) {
        options.pagination.value.current = current;
        options.pagination.value.pageSize = pageSize;
        if (sortVal.value != order) {
            options.pagination.value.current = 1;
            options.query.value.pageNo = 1;
        }
      } else if(options.query.value.column == '' && order == undefined) {
        options.query.value.pageNo = current;
        options.pagination.value.current = current;
        options.pagination.value.pageSize = pageSize;
      }else{
        options.pagination.value.current = 1;
        options.query.value.pageNo = 1;
      }
      if (order == undefined) {
        options.query.value.asc = false;
        options.query.value.column = "";
        columnVal.value = "";
        sortVal.value = "";
        isChange.value = false;
      } else {
        options.query.value.column = columnKey;
        columnVal.value = columnKey;
        sortVal.value = order;
        options.query.value.asc = Boolean(order === "ascend");
        isChange.value = true;
      }
    }else{
      options.query.value.pageNo = current;
      options.query.value.pageSize = pageSize;
      options.pagination.value.current = current;
      options.pagination.value.pageSize = pageSize;
    }
    
  };


  const handleTableChange = (paginationInfo: any, filters: any, sorter: any) => {
    const { current, pageSize } = paginationInfo;
    // 更新查询参数，设置当前页码和每页条数
    if(pageSize != options.query.value.pageSize){
      options.query.value.pageNo = 1;
      options.pagination.value.current = 1;
    }else{
      options.query.value.pageNo = current;
      options.pagination.value.current = current;
    }
    options.query.value.pageSize = pageSize;
    options.pagination.value.pageSize = pageSize;
  
    // 更新筛选条件
    updateQueryFilters(filters);
  
    const { columnKey, order } = sorter;
    updateSort(columnKey, order, options.query.value.pageNo, pageSize);
  
    
  
    // 获取数据列表
    options.getList();
  };
  
  

  return {
    handleTableChange,
    isChange,
  };
}
