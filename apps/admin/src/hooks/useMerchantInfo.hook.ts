import { getMerchantInfoApi } from "@/api/merchant.api";
import { computed, ref } from "vue";

const merchantInfo = ref<any>({
});

export function useMerchantInfo() {
  const merchantDetail = computed(() => {
    return merchantInfo.value;
  });
  const getDetail = async(value:any)=>{
    const res: any = await getMerchantInfoApi(value)
    if(res && res.code === '1') merchantInfo.value = res.data;
  }
  return {
    merchantDetail,
    getDetail,
  };
}
