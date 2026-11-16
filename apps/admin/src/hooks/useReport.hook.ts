
import { PaymentOrderApi, PaymentOrderMonthApi,
    WithdrawOrderApi, WithdrawOrderMonthApi,
    MerchantOrderApi, MercantOrderMonthApi,
    selectQuadReportPage, selectQuadMonthReportPage,
} from "@/api/report";
import { ref } from "vue";

export function useReport() {
    const dateType = ref<any>('day');
    const getPaymentOrder = ()=>{
        if(dateType.value === 'day') return PaymentOrderApi;
        return PaymentOrderMonthApi
    }
    const getBiWithdrawOrder = ()=>{
        if(dateType.value === 'day') return WithdrawOrderApi;
        return WithdrawOrderMonthApi
    }
    const getMerchantOrder = ()=>{
        if(dateType.value === 'day') return MerchantOrderApi;
        return MercantOrderMonthApi
    }
    const getFourReportOrder = ()=>{
        if(dateType.value === 'day') return selectQuadReportPage;
        return selectQuadMonthReportPage
    }
    return { dateType, getPaymentOrder, getBiWithdrawOrder, getMerchantOrder, getFourReportOrder }
}
