

import { getMemberPaymentListInfo} from "@/api/menber";
import { computed, ref } from "vue";

const memberPaymentChcek = ref<any>({});
export function useMember() {
  const mPayCheck = computed(() => {
    return memberPaymentChcek.value;
  });
  const getDetail = async(value:any)=>{
    const res: any = await getMemberPaymentListInfo(value)
    if(res && res.code === '1') memberPaymentChcek.value = res.data[0];
  }
  const getMemberDetails = async(value:any)=>{
    const res: any = await getMemberPaymentListInfo(value)
    if(res && res.code === '1') memberPaymentChcek.value = res.data[0];
  }
 
  return {
    mPayCheck,
    getDetail,
    getMemberDetails,
  }
}
