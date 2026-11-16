import i18n from "@/i18n";

// 弱密码检测（DEV-957）：后台创建新账户、修改密码时校验，已有账号登录不受影响。
// 规则与后端保持一致，后端判定为弱密码时业务接口返回 code=10015，登录接口返回 isWeakPassword=true。
export const WEAK_PASSWORD_CODE = "10015";
// 登录返回弱密码时写入的标记，进入主界面后弹出改密引导并清除；退出登录清缓存时会一并清掉。
export const WEAK_PASSWORD_STORAGE_KEY = "isWeakPassword";
export const WEAK_PASSWORD_KEYWORDS = ["demo", "test", "admin", "null", "mock", "dev", "prod"];

export type WeakPasswordRule = "username" | "letterSeq" | "digitSeq" | "keyword" | "repeat";

export const WEAK_PASSWORD_RULES: WeakPasswordRule[] = ["username", "letterSeq", "digitSeq", "keyword", "repeat"];

const isLetter = (c: string) => c >= "a" && c <= "z";
const isDigit = (c: string) => c >= "0" && c <= "9";

// 连续 3 个字符按编码依次 +1 或依次 -1（如 abc、cba、123、321）
const hasSequence = (s: string, match: (c: string) => boolean) => {
  for (let i = 0; i + 2 < s.length; i++) {
    const [a, b, c] = [s[i], s[i + 1], s[i + 2]];
    if (!match(a) || !match(b) || !match(c)) continue;
    const d1 = b.charCodeAt(0) - a.charCodeAt(0);
    const d2 = c.charCodeAt(0) - b.charCodeAt(0);
    if (d1 === d2 && Math.abs(d1) === 1) return true;
  }
  return false;
};

const RULE_CHECKS: Record<WeakPasswordRule, (pwd: string, username: string) => boolean> = {
  username: (pwd, username) => !!username && pwd.includes(username),
  letterSeq: (pwd) => hasSequence(pwd, isLetter),
  digitSeq: (pwd) => hasSequence(pwd, isDigit),
  keyword: (pwd) => WEAK_PASSWORD_KEYWORDS.some((k) => pwd.includes(k)),
  repeat: (pwd) => /(.)\1\1/.test(pwd),
};

// 返回密码命中的弱密码规则（全部忽略大小写），未命中返回空数组
export function getWeakPasswordRules(password?: string, username?: string): WeakPasswordRule[] {
  if (!password) return [];
  const pwd = password.toLowerCase();
  const name = (username || "").trim().toLowerCase();
  return WEAK_PASSWORD_RULES.filter((rule) => RULE_CHECKS[rule](pwd, name));
}

export function getWeakPasswordRuleText(rule: WeakPasswordRule) {
  const t = i18n.global.t;
  const map: Record<WeakPasswordRule, string> = {
    username: t("n2008"),
    letterSeq: t("n2009"),
    digitSeq: t("n2010"),
    keyword: t("n2011", [WEAK_PASSWORD_KEYWORDS.join("、")]),
    repeat: t("n2012"),
  };
  return map[rule];
}

// 表单校验用：命中弱密码规则时返回第一条规则文案，否则返回空字符串
export function getWeakPasswordError(password?: string, username?: string) {
  const [rule] = getWeakPasswordRules(password, username);
  return rule ? getWeakPasswordRuleText(rule) : "";
}
