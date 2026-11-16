// src/stores/useCommonStore.ts
import { defineStore } from 'pinia';
import { getThirdCodeList } from '@/api/channel.api';
import { ref } from 'vue';



export const useThirdCode = defineStore('thirdCode', () => {
  const thirdCodeList:any = ref<any>([]);

  let retryCount = 0;
  const MAX_RETRY = 3;

  const fetchThirdCodeData = async () => {
    try {
      const res: any = await getThirdCodeList();
      if (res?.code == 1) {
        thirdCodeList.value = res.data.map((item:any) => ({
          value: item,
          label: item
        }));
      }
    } catch (err) {
      retryCount++;
      if (retryCount < MAX_RETRY) {
        await getThirdCodeList();
      } else {
        console.error("获取三方编码失败:", err);
      }
    }
  };

  return {
    thirdCodeList,
    fetchThirdCodeData,
  };
});
