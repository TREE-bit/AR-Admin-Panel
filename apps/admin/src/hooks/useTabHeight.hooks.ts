import { ref, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';

export function useTabHeight(t: any = 1,h: number = 10) {
  const { height } = useWindowSize();
  const headerH = 76;
  const pageationH = 66;
  const getTabH = ref(280);
  // 1: 有分页和总计 2: 有总计 3: 有分页 4: 无分页和总计
  const updateTabHeight = () => {
    const searchElementHeight = (document.getElementsByClassName('search')[0] as HTMLElement)?.offsetHeight || 0;
    const totalH =  (document.getElementsByClassName('ant-table-summary')[0] as HTMLElement)?.offsetHeight || 0;
    const tabsH =  (document.getElementsByClassName('tabs')[0] as HTMLElement)?.offsetHeight || 0;
    if(t == 1){ getTabH.value = height.value- headerH - searchElementHeight - tabsH - totalH - pageationH - h;}
    else if(t == 2) { getTabH.value = height.value - headerH - searchElementHeight - tabsH - totalH - h;}
    else if(t == 3) { getTabH.value = height.value - headerH - searchElementHeight - tabsH - pageationH - h;}
    else if(t == 4) { getTabH.value = height.value - headerH - searchElementHeight - tabsH - h;}
    if (getTabH.value < 280) getTabH.value = 280;
  };

  watch(height, updateTabHeight, { immediate: true });

  return {
    getTabH,
  };
}