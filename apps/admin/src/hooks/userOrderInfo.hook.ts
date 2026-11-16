import { getUstdBuyOrderInfo, getBuyRecordCheckInfo, getBuyOrderCheckInfo,getsaleOrderCheck, getMatchListResult, getIncorrectOrderVoucher, getAppealDetails } from "@/api/order.api";
import { currency } from "@/utils";
import { computed, ref } from "vue";

const usdtBuyOrderInfo = ref<any>({});
export function getUsdtBuyOrderInfo() {
  const usdtBOrderInfo = computed(() => {
    return usdtBuyOrderInfo.value;
  });
  const clearData = ()=>{
    usdtBuyOrderInfo.value = {}
  }
  const getDetail = async(value:any)=>{
    clearData()
    const res: any = await getUstdBuyOrderInfo(value)
    if(res && res.code === '1') usdtBuyOrderInfo.value = res.data;
  }
  const getBuyRecordCheckDetail = async(value:any)=>{
    clearData()
    const res: any = await getBuyRecordCheckInfo(value)
    if(res && res.code === '1') usdtBuyOrderInfo.value = res.data;
  }
  const getBuyOrderCheckDetail = async(value:any)=>{
    clearData()
    const res: any = await getBuyOrderCheckInfo(value)
    if(res && res.code === '1') usdtBuyOrderInfo.value = res.data;
  }
  const getsaleOrderDetail = async(value:any)=>{
    clearData()
    const res: any = await getsaleOrderCheck(value)
    if(res && res.code === '1') usdtBuyOrderInfo.value = res.data;
  }
  const getMatchListDetail = async(value:any)=>{
    clearData()
    const res: any = await getMatchListResult(value)
    if(res && res.code === '1') usdtBuyOrderInfo.value = res.data;
  }
  const getAmountErrorVoucher = async(value:any)=>{
    clearData()
    const res: any = await getIncorrectOrderVoucher(value)
    if(res && res.code === '1'){
      usdtBuyOrderInfo.value = res.data;
      usdtBuyOrderInfo.value.picInfo && (usdtBuyOrderInfo.value.picInfo = usdtBuyOrderInfo.value.picInfo.split(','));
      usdtBuyOrderInfo.value.sellerPics && (usdtBuyOrderInfo.value.sellerPics = usdtBuyOrderInfo.value.sellerPics.split(','));
    } 
  }
  const getAppealDetailData = async(value:any)=>{
    clearData()
    const res: any = await getAppealDetails(value)
     if(res && res.code === '1'){
      const data = res.data;
      data?.picInfo && (data.picInfo = data.picInfo.split(','))
      data?.sellerPics && (data.sellerPics = data.sellerPics.split(','))
      usdtBuyOrderInfo.value = data
    } 
  }
  return {
    usdtBOrderInfo,
    getDetail,
    getBuyRecordCheckDetail,
    getBuyOrderCheckDetail,
    getsaleOrderDetail,
    getMatchListDetail,
    getAmountErrorVoucher,
    getAppealDetailData
  }
}