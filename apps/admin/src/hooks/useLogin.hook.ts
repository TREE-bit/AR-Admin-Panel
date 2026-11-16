import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@ar/shared";
import { LoginSchema } from "@/api";
import { AUTH_MENU, BIND_GOOGLE_ACCOUNT } from "./constants";
import { useToast } from "./useToast.hook";
import { Login } from "@/api";
import { userInfo } from "./userInfo.hook";
import { message } from "ant-design-vue";
import { clearGlobalOverlays } from "@/utils/overlay";
import { WEAK_PASSWORD_STORAGE_KEY } from "@/utils/weakPassword";
import { isPrototype } from "@/prototype/env";

const user = userInfo();
// 登录公共流程：登录页和绑定谷歌页共用
function useLoginFlow() {
  const toast = useToast();
  const router = useRouter();
  const { localStore } = useStorage();
  // 调登录接口并写入登录态：未绑定谷歌进绑定页返回 'bind'，否则拉菜单进入首页返回 'home'；登录失败返回 false
  // auto 为绑定谷歌后的自动登录：不弹成功提示；仍返回未绑定时不保存账号密码、不跳绑定页，交给调用方处理
  const login = async (params: LoginSchema, auto = false) => {
    if (isPrototype) {
      const username = params.username || "原型用户";
      localStorage.setItem("userInfo", JSON.stringify({ userId: "prototype", username, isAdmin: 1 }));
      localStorage.setItem("token", "prototype-token");
      localStorage.setItem("refresh_token", "prototype-refresh");
      localStorage.setItem("isBindGoogle", "1");
      localStorage.removeItem(WEAK_PASSWORD_STORAGE_KEY);
      localStore.remove(AUTH_MENU);
      localStore.remove(BIND_GOOGLE_ACCOUNT);
      if (!auto) toast.success("登录成功");
      localStorage.setItem("AR_ROUTE", "[]");
      sessionStorage.clear();
      clearGlobalOverlays();
      await user.getMenus();
      await router.push("/");
      return "home";
    }
    const { data } = await Login(params);
    if(data.code !== '1') {
      message.error(data.msg)
      return false
    }
    if (!data?.data) return false;
    const { userId, username, isAdmin } = data.data.accessToken;
    // 谷歌密钥只有未绑定时绑定页要用，已绑定或自动登录时不保存，避免长期留在 localStorage
    const googlesecret = data.data.isBindGoogle == 0 && !auto ? data.data.googlesecret : undefined;
    localStorage.setItem('userInfo',JSON.stringify({ userId, username, isAdmin, googlesecret }));
    localStorage.setItem('token', data.data.accessToken.access_token,);
    localStorage.setItem('refresh_token', data.data.accessToken.refresh_token);
    localStore.remove(AUTH_MENU);
    if (!auto) toast.success("登录成功");
    localStorage.setItem('AR_ROUTE','[]')
    sessionStorage.clear();
    clearGlobalOverlays();
    // 弱密码登录：允许正常登录，进入主界面后由 Header 弹出改密引导（绑定谷歌后自动登录会按新的返回值重新写入）
    if (data.data.isWeakPassword === true) {
      localStorage.setItem(WEAK_PASSWORD_STORAGE_KEY, "1");
    } else {
      localStorage.removeItem(WEAK_PASSWORD_STORAGE_KEY);
    }
    localStorage.setItem('isBindGoogle', data.data.isBindGoogle);
    // 未绑定谷歌先进绑定页，不拉菜单：新账号菜单可能为空或请求失败，会卡在登录页
    if (data.data.isBindGoogle == 0) {
      if (auto) return 'bind';
      // 保存本次输入的账号密码（登录接口会自动加密），绑定成功后自动登录用；存 localStorage 刷新绑定页也不丢，10 分钟过期
      localStore.set(BIND_GOOGLE_ACCOUNT, { username: params.username, password: params.password }, 10 * 60);
      router.push({ path: "/googleVerification" }).catch((err) => {});
      return 'bind';
    }
    try {
      await user.getMenus();
      await router.push("/");
    } finally {
      // 登录完成即清除保存的账号密码（正常登录，或绑定谷歌后自动登录成功）；拉菜单失败也清除
      localStore.remove(BIND_GOOGLE_ACCOUNT);
    }
    return 'home';
  };
  // 绑定谷歌成功后，用登录时保存的账号密码 + 刚绑定的谷歌验证码自动登录，拿新 token 进入系统（旧 token 一直是未绑定状态，不能沿用）；
  // 没有保存的账号密码（如已过期）、自动登录失败或仍返回未绑定时，清掉登录态回登录页重新登录
  const loginAfterBindGoogle = async (totpCode: string) => {
    let result: Awaited<ReturnType<typeof login>> = false;
    try {
      // 已绑定成功，谷歌密钥用不到了，先从 userInfo 中删除（自动登录失败回登录页时也不会留下）
      const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
      delete info.googlesecret;
      localStorage.setItem('userInfo', JSON.stringify(info));
      const account = localStore.get<Pick<LoginSchema, "username" | "password">>(BIND_GOOGLE_ACCOUNT);
      if (account) {
        result = await login({ grant_type: "password", captchaId: "", ...account, totpCode }, true);
      }
    } catch (e) {}
    if (result === 'home') return;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push("/login").catch(() => {});
  };
  return { login, loginAfterBindGoogle };
}
export function useLogin() {
  const loading = ref(false);
  const { login } = useLoginFlow();
  const form = reactive<LoginSchema>({
    grant_type: "password",
    username: isPrototype ? "prototype" : "",
    password: isPrototype ? "prototype" : "",
    captchaId: "",
    totpCode: "",
  });
  const disabled = computed(() => {
    return !(form.username && form.password);
  });
  const onLogin = async () => {
    if (loading.value) return;
    try {
      loading.value = true;
      await login(form);
    } catch (e) {
    } finally {
      loading.value = false;
    }
  };
  return {
    form,
    loading,
    disabled,
    onLogin,
  };
}
// 绑定谷歌页用：绑定成功后自动登录进入系统
export function useBindGoogleLogin() {
  const { loginAfterBindGoogle } = useLoginFlow();
  return { loginAfterBindGoogle };
}
