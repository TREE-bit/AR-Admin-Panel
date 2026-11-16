import { nextTick } from "vue";

// IFSC 格式：共 11 位，前 4 位英文字母，第 5 位为数字 0，后 6 位为英文字母或数字（服务端同样按此正则校验）
export const IFSC_REG = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// 标准化：只去首尾空白并转大写，中间的空格等非法字符保留，交给校验报错
export const normalizeIfsc = (value: unknown) => String(value ?? "").trim().toUpperCase();

// 逐项校验（DEV-965），按顺序返回第一条不满足规则的 i18n key，全部通过返回空字符串
export const getIfscErrorKey = (value: unknown) => {
  const ifsc = normalizeIfsc(value);
  if (!ifsc) return "n2053";
  if (!/^[A-Z0-9]+$/.test(ifsc)) return "n2054";
  if (ifsc.length !== 11) return "n2055";
  if (!/^[A-Z]{4}/.test(ifsc)) return "n2056";
  if (ifsc[4] !== "0") return "n2057";
  return "";
};

// 输入框 input 事件里把内容转大写并保持光标位置（直接整体改写 v-model 会让光标跳到末尾）
export const upperCaseInput = (e: Event, setValue: (value: string) => void) => {
  const el = e.target as HTMLInputElement | null;
  if (!el || el.value === el.value.toUpperCase()) return;
  const { selectionStart, selectionEnd } = el;
  setValue(el.value.toUpperCase());
  nextTick(() => el.setSelectionRange(selectionStart, selectionEnd));
};
