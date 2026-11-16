// src/stores/useCommonStore.ts
import { defineStore } from 'pinia';
import { getMerchantInfoAdminList } from '@/api/merchant.api';
import { ref } from 'vue';

interface MerchantInfo {
  username: string;
  code: string;
}

export const useMerchantStore = defineStore('merchant', () => {
  const merchantList:any = ref<MerchantInfo[]>([]);

  let retryCount = 0;
  const MAX_RETRY = 3;

  const fetchMerchantData = async () => {
    try {
      const res: any = await getMerchantInfoAdminList({ pageNo: 1, pageSize: 1000 });
      if (res?.code === "1") {
        merchantList.value = res.data.map(({ username, code }:{username:any,code:any}) => ({
          value: code,
          label: username,
          username: username,
        }));
      }
    } catch (err) {
      retryCount++;
      if (retryCount < MAX_RETRY) {
        await fetchMerchantData();
      } else {
        console.error("获取商户列表失败:", err);
      }
    }
  };

  return {
    merchantList,
    fetchMerchantData,
  };
});
