import JSEncrypt from "jsencrypt";

/**
 * 密码传输 RSA 加密（与 ar_wallet 同一套方案）
 * 与后端 RsaNewUtil 对齐：RSA/ECB/PKCS1Padding，密文 Base64；
 * 公钥（X.509 Base64，不带 PEM 头尾）按环境配置在 apps/admin/.env.* 的 VITE_RSA_PUBLIC_KEY
 */
const PUBLIC_KEY: string = String(import.meta.env.VITE_RSA_PUBLIC_KEY || "").trim();

let encryptor: JSEncrypt | null = null;
const getEncryptor = () => {
  if (!encryptor) {
    encryptor = new JSEncrypt();
    encryptor.setPublicKey(PUBLIC_KEY);
  }
  return encryptor;
};

/** 公钥加密任意明文；公钥未配置/无效或明文超长（2048 位密钥最多 245 字节）时返回 false */
export function rsaEncrypt(plaintext: string): string | false {
  if (!PUBLIC_KEY) return false;
  return getEncryptor().encrypt(plaintext);
}

/** nonce：当前时间戳，10 位（秒级） */
export const getNonce = () => String(Math.floor(Date.now() / 1000));

/**
 * 密码字段值加密：组装成 `pwd=<密码>&nonce=<10位时间戳>` 后 RSA 加密
 * 后端按 startsWith('pwd=') + lastIndexOf('&nonce=') 解析，因此密码本身可以包含 &
 * 公钥未配置或加密失败时打印错误并原样返回明文，避免尚未配置公钥的环境整个流程不可用
 */
export function encryptPwd(pwd: string): string {
  const ciphertext = rsaEncrypt(`pwd=${pwd}&nonce=${getNonce()}`);
  if (ciphertext === false) {
    console.error("[rsa] 密码加密失败：请检查当前环境 VITE_RSA_PUBLIC_KEY 是否配置正确，本次按明文发送");
    return pwd;
  }
  return ciphertext;
}

/** 后台约定的密码字段名；未显式指定字段时，请求里出现哪个就加密哪个 */
export const PWD_FIELDS: readonly string[] = ["password", "loginPwd", "newPwd", "confirmNewPwd"];

/**
 * 返回 data 的浅拷贝：其中存在且非空的密码字段值替换为 encryptPwd 结果，字段名保持不变，不修改入参
 * @param fields 本接口需要加密的字段名，缺省为 PWD_FIELDS
 */
export function withEncryptedPwd<T>(data: T, fields: readonly string[] = PWD_FIELDS): T {
  if (!data || typeof data !== "object") return data;
  const result: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  fields.forEach((field) => {
    const value = result[field];
    if (typeof value === "string" && value !== "") {
      result[field] = encryptPwd(value);
    }
  });
  return result as T;
}
