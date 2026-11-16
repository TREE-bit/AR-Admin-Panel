import { computed } from "vue";

const CACHE_EXPIRE = 30 * 60 * 1000; // 30分钟

export function usePageCash() {
  const pageCash = computed(() => JSON.parse(sessionStorage.getItem("AR_PAGE_CASH") || "[]"));

  /** 设置缓存（包含时间戳） */
  const setPageCash = (name: string, query: any, res: any, extend: any = {}) => {
    const now = Date.now();
    sessionStorage.setItem(name + "query", JSON.stringify({ value: query, time: now }));
    sessionStorage.setItem(name + "res", JSON.stringify({ value: res, time: now }));
    sessionStorage.setItem(name + "extend", JSON.stringify({ value: extend, time: now }));
  };

  /** 获取缓存（超时则清除） */
  const getPageCash = (name: string) => {
    const queryItem = JSON.parse(sessionStorage.getItem(name + "query") || "{}");
    const dataItem = JSON.parse(sessionStorage.getItem(name + "res") || "[]");
    const extendItem = JSON.parse(sessionStorage.getItem(name + "extend") || "{}");

    // 校验时间戳是否超时
    const isExpired = (item: any) => {
      if (!item?.time) return true;
      return Date.now() - item.time > CACHE_EXPIRE;
    };

    if (queryItem && (isExpired(queryItem) || isExpired(dataItem))) {
      clearPageCash(name);
      return { queryCash: {}, res: {}, extend: {} };
    }

    return {
      queryCash: queryItem.value || {},
      res: dataItem.value || {},
      extend: extendItem.value || {},
    };
  };

  /** 清除缓存 */
  const clearPageCash = (name: string) => {
    sessionStorage.removeItem(name + "query");
    sessionStorage.removeItem(name + "res");
    sessionStorage.removeItem(name + "extend");
  };

  return {
    pageCash,
    setPageCash,
    getPageCash,
    clearPageCash,
  };
}
