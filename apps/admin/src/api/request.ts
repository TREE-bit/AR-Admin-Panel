import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { h } from "vue";
import { message } from "ant-design-vue";
import router from "@/router";
import { Login } from "./login.api";
import i18n from "@/i18n";
import { clearGlobalOverlays } from "@/utils/overlay";
import { WEAK_PASSWORD_CODE } from "@/utils/weakPassword";
import { applyPrototypeAdapter } from "@/prototype/mock";
import { isPrototype } from "@/prototype/env";

// 后端返回码在项目里存在字符串和数字两种形态，这里统一兼容。
type ApiCode = string | number | undefined;

// 统一描述项目里最常见的接口响应结构，保留额外字段兼容历史接口。
type ApiResponse<T = unknown> = {
  code?: ApiCode;
  msg?: string;
  data?: T;
  [key: string]: unknown;
};

// 刷新 token 期间，后续 401 请求会挂起在队列里，等待新 token 下发后重放。
type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

type RefreshTokenOptions = {
  retryRequest?: boolean;
  rejectWith?: unknown;
};

// 项目里约定 code=1 或无 code 视为成功。
const SUCCESS_CODE = "1";
const AUTH_CODE = "401";
// 业务 code=452 表示需要强制退出登录（此时 HTTP 状态码为 401），不走刷新 token。
const FORCE_LOGOUT_CODE = "452";
// 这两个业务码需要透传给调用方自行处理，不能在这里直接拦截成报错。
const RELAXED_CODES = new Set(["9006", "9007"]);
const reloginCode = [401];
// 在线人数接口允许单独降级，不影响全局登录态。
const ONLINE_COUNT_PATH = "/api/v1/onlineMemberCount/get";

// 控制刷新 token 的并发，避免多个 401 同时触发多次刷新请求。
let isRefreshToken = false;
let pendingRequests: PendingRequest[] = [];
// 强制下线次数：让仍在进行中的刷新 token 流程作废，避免刷新成功后又把 token 写回去。
let forceLogoutCount = 0;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 30 * 1000,
});

const getToken = () => localStorage.getItem("token") || "";
const getRefreshToken = () => localStorage.getItem("refresh_token") || "";
const getResponseCode = (code: ApiCode) => String(code ?? "");

// 登录态失效后统一清理本地凭证，避免旧 token 持续污染后续请求。
const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};

// 避免已经在登录页时重复 push，减少控制台无意义警告。
const redirectToLogin = () => {
  clearGlobalOverlays();
  if (router.currentRoute.value.path !== "/login") {
    router.push("/login");
  }
};

// 退出登录时需要保留的本地配置：语言、币种、列表列显示偏好（page+菜单id），这些与登录态无关。
const isPersistentStorageKey = (key: string) =>
  ["language", "locale", "currency"].includes(key) || key.startsWith("page");

// 清空登录相关的全部缓存：token、用户信息、菜单、标签页路由、服务器时间等 localStorage 项，
// 以及整个 sessionStorage（页面缓存 AR_PAGE_CASH 等），只保留上面的个人偏好。
const clearLoginCache = () => {
  Object.keys(localStorage)
    .filter((key) => !isPersistentStorageKey(key))
    .forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
};

// 强制退出登录：直接弹出接口返回的 msg，清空缓存并回到登录页。
// 提示使用固定 key，同一页面多个请求同时返回 452 时只保留一条，不会叠加刷屏。
const handleForceLogout = (msg?: string) => {
  forceLogoutCount += 1;
  if (msg) {
    message.error({ content: msg, key: "force-logout" });
  }
  clearLoginCache();
  redirectToLogin();
};

// 刷新成功后，唤醒所有挂起请求并用新 token 重放。
const resolvePendingRequests = (token: string) => {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
};

// 刷新失败时，挂起请求统一失败，避免 Promise 永远不结束。
const rejectPendingRequests = (error: unknown) => {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
};

// 后端错误文案有时较长，这里统一允许换行展示，避免 toast 被截断。
const showWarningMessage = (msg?: string) => {
  if (!msg) return;
  message.warning({
    content: h(
      "div",
      { style: { maxWidth: "400px", whiteSpace: "normal", wordBreak: "break-all" } },
      msg
    ),
  });
};

const showErrorMessage = (msg?: string) => {
  message.error(msg || "Network Error");
};

// 刷新 token 成功后，给原请求补上最新 token 再重试。
const retryWithToken = (config: InternalAxiosRequestConfig, token: string) => {
  config.headers = config.headers || {};
  config.headers.authorization = `Bearer ${token}`;
  return axiosInstance(config);
};

// 统一处理 access token 失效场景：
// 1. 没有 refresh_token，直接退回登录页
// 2. 刷新中，后续请求进入队列等待
// 3. 刷新成功，重放挂起请求
// 4. 刷新失败，清空登录态并跳转登录页
const handleTokenRefresh = async (
  config: InternalAxiosRequestConfig,
  options: RefreshTokenOptions = {}
) => {
  const { retryRequest = true, rejectWith } = options;
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthStorage();
    redirectToLogin();
    return Promise.reject(new Error("Missing refresh token"));
  }

  if (isRefreshToken) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({
        // 队列里只关心新的 token，真正的请求重试在这里执行。
        resolve: (token) => {
          if (retryRequest) {
            resolve(retryWithToken(config, token));
            return;
          }
          reject(rejectWith ?? new Error("Unauthorized"));
        },
        reject,
      });
    });
  }

  isRefreshToken = true;
  const forceLogoutCountAtStart = forceLogoutCount;
  // 刷新期间若被强制下线，刷新结果不论成功失败都作废：不写回 token、不提示、不重放挂起的请求。
  const abortIfForceLoggedOut = () => {
    if (forceLogoutCount === forceLogoutCountAtStart) return null;
    pendingRequests = [];
    return new Promise(() => {}) as Promise<never>;
  };

  try {
    const res = await Login({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    const abortedAfterSuccess = abortIfForceLoggedOut();
    if (abortedAfterSuccess) return abortedAfterSuccess;
    const accessToken = res.data?.access_token;
    const nextRefreshToken = res.data?.refresh_token;

    if (!accessToken || !nextRefreshToken) {
      throw new Error(res.data?.msg || "Refresh token failed");
    }

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", nextRefreshToken);
    resolvePendingRequests(accessToken);

    if (!retryRequest) {
      return Promise.reject(rejectWith ?? new Error("Unauthorized"));
    }

    return retryWithToken(config, accessToken);
  } catch (error) {
    const abortedAfterFailure = abortIfForceLoggedOut();
    if (abortedAfterFailure) return abortedAfterFailure;
    rejectPendingRequests(error);
    clearAuthStorage();
    redirectToLogin();
    showErrorMessage((error as Error)?.message);
    return Promise.reject(error);
  } finally {
    isRefreshToken = false;
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isPrototype) {
      applyPrototypeAdapter(config);
      return config;
    }
    // 每次请求发出前都从本地读取 token，避免使用内存中的旧值。
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

(
  axiosInstance.interceptors.response as {
    use: (
      onFulfilled: (response: AxiosResponse<ApiResponse>) => unknown,
      onRejected: (error: AxiosError<ApiResponse>) => unknown
    ) => number;
  }
).use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data, config } = response;
    const code = getResponseCode(data?.code);

    // 历史接口存在不返回 code 的情况，这里继续按成功处理，避免影响旧接口。
    if (!code || code === SUCCESS_CODE) {
      return data;
    }

    if (code === AUTH_CODE) {
      // 如果连刷新 token 接口本身都返回 401，说明 refresh_token 也已经失效，只能重新登录。
      if (config.url === "/ar-auth/oauth/token") {
        clearAuthStorage();
        redirectToLogin();
        showErrorMessage(data?.msg);
        return Promise.reject(data) as Promise<never>;
      }
      // 普通业务接口 401 时，尝试走刷新 token 流程。
      return handleTokenRefresh(config as InternalAxiosRequestConfig, {
        retryRequest: false,
        rejectWith: data,
      }) as Promise<never>;
    }

    if (code === FORCE_LOGOUT_CODE) {
      // 兜底：万一后端以 2xx 返回 code=452，同样强制下线（正常情况走下方错误回调）。
      handleForceLogout(data?.msg);
      return new Promise(() => {}) as Promise<never>;
    }

    if (code === "999999") {
      // 保持原项目行为：提示错误，但仍把响应体返回给调用方。
      showErrorMessage(data?.msg);
      return data;
    }

    if (code === "1193") {
      // 业务方要求这里走固定国际化文案，而不是直接展示后端 msg。
      message.warning(i18n.global.t("n498"));
      return data;
    }

    if (code === WEAK_PASSWORD_CODE) {
      // 创建账户 / 修改密码接口判定为弱密码，统一提示按密码规则重新设置。
      showWarningMessage(i18n.global.t("n2013"));
      return data;
    }

    if (RELAXED_CODES.has(code)) {
      // 特殊业务码由页面自行判断，拦截器不做额外兜底。
      return data;
    }

    // 其余非成功码统一做告警提示，但不阻断调用方继续读取响应内容。
    showWarningMessage(data?.msg);
    return data as never;
  },
  (error: AxiosError<ApiResponse>) => {
    const response = error.response;
    const responsePath = response?.data?.path;

    if (getResponseCode(response?.data?.code) === FORCE_LOGOUT_CODE) {
      // 业务 code=452 时 HTTP 状态码是 401，响应会进入这里而不是成功回调。
      // 必须排在 401 刷新 token 之前判断，否则会被当成 token 过期去刷新。
      // 清缓存、回登录页后返回永远不结束的 Promise，调用方的 then / catch / finally 都不再执行。
      handleForceLogout(response?.data?.msg);
      return new Promise(() => {}) as Promise<never>;
    }

    if (responsePath === ONLINE_COUNT_PATH) {
      // 在线人数接口失败不弹全局错误，避免后台轮询把页面提示刷屏。
      console.warn("onlineMemberCount request failed");
      return Promise.reject(error) as Promise<never>;
    }

    if (response?.status && reloginCode.includes(response.status) && error.config) {
      // 某些后端错误是直接走 HTTP 401，而不是业务 code=401，这里也统一纳入刷新流程。
      return handleTokenRefresh(error.config as InternalAxiosRequestConfig, {
        retryRequest: false,
        rejectWith: error,
      }) as Promise<never>;
    }

    // 兜底网络异常提示，优先展示后端返回文案。
    showErrorMessage(response?.data?.msg || error.message);
    return Promise.reject(error) as Promise<never>;
  }
);

export default axiosInstance;
