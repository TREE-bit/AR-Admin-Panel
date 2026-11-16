import { useClipboard } from '@vueuse/core'
import { message } from 'ant-design-vue';
import { computed } from "vue";
import i18n from '@/i18n';
export * from './publicData'
const t = (key: string, args?: any) => {
  return computed(() => i18n.global.t(key, args)).value;
}
const {  copy } = useClipboard()

export function currency(
  amount: number | string,
  isShowSymbol: boolean = true
) {
  const symbol = localStorage.getItem("currency") || "ARB";
  const language = localStorage.getItem("language") || "en";
  // 将输入转换为数字，确保它是有效的
  const number = parseFloat(amount as string) || 0;
  // 检查输入是否为有效数字
  if (isNaN(number)) {
    return "Invalid input";
  }

  // 使用 toLocaleString 方法将数字格式化为货币形式
  // 并设置最多保留两位小数 , 如果不展示默认的货币符号，就传参false；
  const config = isShowSymbol
    ? {
        style: "currency",
        currency: symbol, // 可根据需要更改货币符号
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    : {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
  const formattedCurrency = number.toLocaleString(language, config);

  return formattedCurrency;
}

export function thousand(amount: number | string){
  let number = parseFloat(amount as string) || 0;
  // 检查输入是否为有效数字
  if (isNaN(number)) {
    number = 0;
  }
  const ThousandNumber = number.toLocaleString();

  return ThousandNumber;
}

export function convertMillisecondsToMinutesSeconds(milliseconds: number) {
  // 计算分钟和秒
  let minutes = Math.floor(milliseconds / (1000 * 60));
  let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  // 将结果作为对象返回
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}

export function getCallbackStatus(statusCode: number) {
  switch (statusCode) {
    case 1:
      return "n93";
    case 2:
      return "s18";
    case 3:
      return "s19";
    case 4:
      return "s20";
    case 5:
      return "s21";
    default:
      return "n64";
  }
}

// 实现一个方法，传入秒数，返回多少小时多少分钟多少秒，例如2小时14分15秒，没有分时不显示分钟，没有小时不显示小时
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = remainingSecondsAfterHours % 60;

  const hoursPart = hours > 0 ? `${hours}`+t('hour') : "";
  const minutesPart = minutes > 0 ? `${minutes}`+t('minute') : "";
  const secondsPart = `${remainingSeconds}`+t('s');

  return `${hoursPart}${minutesPart}${secondsPart}`;
}
//实现一个方法a-select设置show-search时可搜索value
export function filterOption(input: any, option: any) {
  return option.label.includes(input) || option.value.includes(input);
}


export function getMapItem(map: any, key: any){
  return map[key] || key;
}
export function copyId(id: any)  {
  copy(id);
  message.success('copy success');
}

// 递归处理对象，把空字符串转成 undefined
export function replaceEmptyWithUndefined<T extends Record<string, any>>(obj: T): T {
  const newObj = { ...obj }
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === '') {
      (newObj as Record<string, any>)[key] = undefined
    } else if (typeof newObj[key] === 'object' && newObj[key] !== null && !Array.isArray(newObj[key])) {
      (newObj as Record<string, any>)[key] = replaceEmptyWithUndefined(newObj[key]) // 递归处理子对象
    }
  })
  return newObj
}
/**
 * 格式化金额：保留指定小数位（默认 2）
 * @param amount number | string
 * @param digits number 小数位数，默认 2
 * @returns 格式化后的字符串（比如 "15.00K", "2.00M, "0.50B", "12345.67"）
 */
export function formatAmountWithUnits(amount: number | string | null | undefined, digits = 2): string {
  if (amount === null || amount === undefined || amount === '') return '0'

  const n = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : Number(amount)
  if (!isFinite(n)) return '0'

  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)

  if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(digits)}B`  // Billion
  }
  if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(digits)}M`  // Million
  }
  if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(digits)}K`  // Thousand
  }

  // 小于十万直接显示原始数值，保留小数位
  return `${sign}${abs.toFixed(digits)}`
}

// 四舍五入到最接近的指定步长（默认100）
export const fixToStep = (form: any, key: string, step = 100) => {
  const value = form[key]
  if (value == null) return
  form[key] = Math.round(value / step) * step
}
// 将秒数格式化为 天 小时 分钟 的国际化字符串
export const formatMinutesI18n = (minutes: number, t: (key: string) => string) => {
  if (!minutes || minutes <= 0) {
    return `0${t('分钟')}`
  }

  const day = Math.floor(minutes / (24 * 60))
  const hour = Math.floor((minutes % (24 * 60)) / 60)
  const minute = minutes % 60

  const result: string[] = []

  if (day > 0) result.push(`${day}${t('n341')}`)
  if (hour > 0) result.push(`${hour}${t('hour')}`)
  if (minute > 0) result.push(`${minute}${t('minute')}`)

  return result.join('')
}
//格式化时间戳，1按秒，2按毫秒
export const formatTimes = (timestamp: number | string,type: number = 1) => {
  const date = type == 1 ? new Date(Number(timestamp) * 1000) :  new Date(Number(timestamp))

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
