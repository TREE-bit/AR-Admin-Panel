import axios, { 
  InternalAxiosRequestConfig,
} from "axios";
import router from "@/router";
import { message } from "ant-design-vue";
import { applyPrototypeAdapter } from "@/prototype/mock";
import { isPrototype } from "@/prototype/env";
const ex = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60 * 1000,
  responseType: 'blob' // 设置响应类型为 blob
});
ex.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isPrototype) {
      applyPrototypeAdapter(config);
      return config;
    }
    // 在发送请求之前做些什么
    config.data.lang = localStorage.getItem('language') || 'en';
    const token = localStorage.getItem("token");
    if (token) {
      config.headers
        .authorization = "Bearer " + token;
    }
    return config;
  }
  ,
  (error: any) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);


const createFile = (content:any) => {
  const blob = new Blob([content.data]);
  const fileName = content.headers['content-disposition'].split('filename=')[1];
  if ("download" in document.createElement("a")) {
    // 非IE下载
    const elink = document.createElement("a");
    elink.download = fileName;
    elink.style.display = "none";
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
}

//异步导出
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60 * 1000,
  // responseType: 'blob'
});
// 添加请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isPrototype) {
      applyPrototypeAdapter(config);
      return config;
    }
    // 在发送请求之前做些什么
    config.data.lang = localStorage.getItem('language') || 'en';
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = "Bearer " + token;
    }
    return config;
  },
  (error: any) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);
// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    if (data.code && data.code != "1") {
      // 处理错误响应
      if (data.code === "401") {
        // 未授权，可能是令牌过期
        message.error(data.msg || "Unauthorized, please log in again");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
      } else {
        message.error(data.msg || "Request failed");
      }
      return Promise.reject(data);
    } else {
      return Promise.resolve(data);
    }
  },
  (error) => {
    // 网络或服务器错误
    if (error.response) {
      const { data, config } = error.response;
      if( data && data.code && data.code == "401") {
        router.push("/login");
      }else{
        message.error("Response Error:", error.response);
      }
    } else {
      message.error("Network Error");
    }
    return Promise.reject(error);
  }
);
// 撮合订单列表导出
// export async function matchingOrderAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/api/v1/matchingOrderAdmin/export", data))
// }
export function matchingOrderAdminExport(data: any) {
  return request.post("/ar-manager/api/v1/matchingOrderAdmin/export", data)
}

// 卖出订单列表导出
// export async function paymentOrderAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/paymentOrderAdmin/export", data))
// }
export function paymentOrderAdminExport(data: any) {
  return request.post("/ar-manager/paymentOrderAdmin/export", data)
}

// 买入订单列表导出
// export async function collectionOrderAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/collectionOrderAdmin/export", data))
// }
export function collectionOrderAdminExport(data: any) {
  return request.post("/ar-manager/collectionOrderAdmin/export", data)
}
// USDT买入订单列表导出
// export async function usdtBuyOrderAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/usdtBuyOrderAdmin/export", data))
// }
export function usdtBuyOrderAdminExport(data: any) {
  return request.post("/ar-manager/usdtBuyOrderAdmin/export", data)
}
// USDT卖出订单列表导出
// export async function usdtSellOrderAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/usdtSellOrderAdmin/export", data))
// }
export function usdtSellOrderAdminExport(data: any) {
  return request.post("/ar-manager/usdtSellOrderAdmin/export", data)
}
//代收订单导出列表
// export async function merchantInfoAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/api/v1/merchantInfoAdmin/export", data))
// }
export function merchantInfoAdminExport(data: any) {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/export", data)
}
// 商户列表导出
export function merchantInfoAdminListExport(data: any) {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/listExport", data)
}
// 代付订单列表导出
// export async function fetchWithdrawOrderExport(data: any) {
//   createFile(await ex.post("/ar-manager/api/v1/merchantInfoAdmin/fetchWithdrawOrderExport", data))
// }
export function fetchWithdrawOrderExport(data: any) {
  return request.post("/ar-manager/api/v1/merchantInfoAdmin/fetchWithdrawOrderExport", data)
}
// 申诉订单列表导出
// export async function appealOrderControllerExport(data: any) {
//   createFile(await ex.post("/ar-manager/api/v1/appealOrderAdmin/export", data))
// }
export function appealOrderControllerExport(data: any) {
  return request.post("/ar-manager/api/v1/appealOrderAdmin/export", data)
}
// 买入日报表导出
export async function queryBuyReportExport(data: any) {
  createFile(await ex.post("/ar-manager/buySellReport/queryBuyReportExport", data))
}
// 买入月报表导出
export async function queryBuyMonthReportExport(data: any) {
  createFile(await ex.post("/ar-manager/buySellReport/queryBuyMonthReportExport", data))
}
// 卖出日报表导出
export async function querySellReportExport(data: any) {
  createFile(await ex.post("/ar-manager/buySellReport/querySellReportExport", data))
}
// 卖出月报表导出
export async function querySellMonthReportExport(data: any) {
  createFile(await ex.post("/ar-manager/buySellReport/querySellMonthReportExport", data))
}
// 商户日报表导出
export async function biMerchantDailyExport(data: any) {
  createFile(await ex.post("/ar-manager/api/v1/biMerchantDaily/export", data))
}
// 商户月报表导出
export async function biMerchantDailyExportMonth(data: any) {
  createFile(await ex.post("/ar-manager/api/v1/biMerchantMonth/export", data))
}
// 商户账变导出
// export async function accountChangeAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/api/v1/accountChangeAdmin/export", data))
// }
export  function accountChangeAdminExport(data: any) {
  return request.post("/ar-manager/api/v1/accountChangeAdmin/export", data)
}
// 四方日报表导出
export async function quadReportExport(data: any) {
  createFile(await ex.post("/ar-manager/buySellReport/quadReportExport", data))
}
// 四方月报表导出
export async function quadMonthReportExport(data: any) {
  createFile(await ex.post("/ar-manager/buySellReport/quadMonthReportExport", data))
}

// 邮箱导出
export async function mailAccountConfigAdminEmailExport(data: any) {
  createFile(await ex.post("/ar-manager/mailAccountConfigAdmin/emailExport", data))
}
// 会员账变导出
// export async function memberAccounthangeAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/memberAccounthangeAdmin/export", data))
// }
export  function memberAccounthangeAdminExport(data: any) {
  return request.post("/ar-manager/memberAccounthangeAdmin/export", data)
}
//母订单列表导出
// export async function matchPoolAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/matchPoolAdmin/export", data))
// }
export function matchPoolAdminExport(data: any) {
  return request.post("/ar-manager/matchPoolAdmin/export", data)
}
//风控用户列表导出
// export async function riskUserHitRecordAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/riskUserHitRecordAdmin/export", data))
// }
export function riskUserHitRecordAdminExport(data: any) {
  return request.post("/ar-manager/riskUserHitRecordAdmin/export", data)
}
//欠费订单导出
// export async function memberArrearsRecordAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/memberArrearsRecordAdmin/debtInfoExport", data))
// }
export function memberArrearsRecordAdminExport(data: any) {
  return  request.post("/ar-manager/memberArrearsRecordAdmin/debtInfoExport", data)
}
//欠费订单信息导出
// export async function memberArrearsRecordAdminListPageExport(data: any) {
//   createFile(await ex.post("/ar-manager/memberArrearsRecordAdmin/listPageExport", data))
// }
export function memberArrearsRecordAdminListPageExport(data: any) {
  return request.post("/ar-manager/memberArrearsRecordAdmin/listPageExport", data)
}
// 会员列表导出
// export async function memberInfoAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/api/v1/memberInfoAdmin/export", data))
// }
export function memberInfoAdminExport(data: any) {
 return request.post("/ar-manager/api/v1/memberInfoAdmin/export", data)
}

// 充值失败列表导出
// export async function rechargeFailureForAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/rechargeFailureForAdmin/export", data))
// }
export async function rechargeFailureForAdminExport(data: any) {
  return request.post("/ar-manager/rechargeFailureForAdmin/export", data)
}
// 蚂蚁层级列表导出
// export async function antMemberInfoAdminExport(data: any) {
//   createFile(await ex.post("/ar-manager/antMemberInfoAdmin/export", data))
// }
export async function antMemberInfoAdminExport(data: any) {
  return request.post("/ar-manager/antMemberInfoAdmin/export", data);
}
// 会员黑名单列表导出
export async function memberBlackExport(data: any) {
  return request.post("/ar-manager/memberBlack/export", data)
}
// 任务领取记录导出
export async function taskCollectionRecordExport(data: any) {
  return request.post("/ar-manager/api/v1/taskCollectionRecord/export", data)
}

// 通道代收列表导出
export async function channelCollectionOrderListPageForExport(data: any) {
  return request.post("/ar-manager/channelCollectionOrderAdmin/listPageForExport", data)
}

// 通道账变列表导出
export async function channelAccountChangeAdminListPageForExport(data: any) {
  return request.post("/ar-manager/channelAccountChangeAdmin/listPageForExport", data)
}
// UPI ID风控列表导出
export async function upiRiskControlLogAdminExport(data: any) {
  return request.post("/ar-manager/upiRiskControlLogAdmin/export", data)
}
// 用户解禁列表导出
export async function collectionInfoAdminListUnbanLogPageExport(data: any) {
  return request.post("/ar-manager/collectionInfoAdmin/listUnbanLogPageExport", data)
}
// 收款列表导出
export async function collectionInfoAdminListPageExport(data: any) {
  return request.post("/ar-manager/collectionInfoAdmin/listPageExport", data)
}

// 异常断连日志列表导出
export async function disConnectMonitorAdminExport(data: any) {
  return request.post("/ar-manager/disConnectMonitorAdmin/export", data)
}

// 自动开启卖出日志导出
export async function systemAutoSellLogAdminExport(data: any) {
  return request.post("/ar-manager/api/v1/systemAutoSellLogAdmin/export", data)
}

// 工单列表导出
export async function workOrderRecordExport(data: any) {
  return request.post("/ar-manager/api/v1/workOrderRecord/export", data)
}

// 人工卖出订单记录导出
export async function getQuickUpiOrBankOrderLogExport(data: any) {
  return request.post("/ar-manager/generateQuickUpiOrBankAdmin/export", data);
}

// 会员通话记录信息下载
export async function appInfoReportCallLogInfoDownload(data: any) {
  return createFile(await ex.post("/ar-manager/appInfoReport/callLogInfo/download", data));
}

// 会员通讯录信息下载
export async function appInfoReportContactInfoDownload(data: any) {
  return createFile(await ex.post("/ar-manager/appInfoReport/contactInfo/download", data));
}
// 会员短信记录导出
export async function appInfoReportMemberSmsExport(data: any) {
  return createFile(await ex.post("/ar-manager/appInfoReport/memberSms/export", data));
}



