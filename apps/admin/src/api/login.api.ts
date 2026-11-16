import request from "./request";
import axios from "axios";
import { MenusSchema, ResultSchema } from "./model";
import { ContentType } from "@ar/shared";
import { withEncryptedPwd } from "@/utils/rsa";
// 登录：password 组装 pwd=&nonce= 后 RSA 加密传输，字段名不变（refresh_token 刷新不带密码，原样透传）
export function Login(data: any) {
  return axios
    .create({
      headers: {
        "Content-Type": ContentType.FormURLEncoded,
        authorization: "Basic YXI6YXI=",
      },
      baseURL: import.meta.env.VITE_APP_BASE_API,
      timeout: 10 * 1000,
    })
    .post(import.meta.env.VITE_APP_BASE_API + "ar-auth/oauth/token", withEncryptedPwd(data, ["password"]));
}

// 当前永久版定的菜单
export function UserMenu() {
  return request.post<ResultSchema<MenusSchema>>(
    "/ar-manager/menu/currentUser"
  );
}
// 轮询获取在线人数和时间
export function getOnlineCount() {
  return request.get("/ar-manager/api/v1/onlineMemberCount/get");
}