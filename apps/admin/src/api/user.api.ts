import axios, { AxiosProgressEvent } from 'axios';
import request from './request'
import { withEncryptedPwd } from '@/utils/rsa'
// 创建后台用户：loginPwd 组装 pwd=&nonce= 后 RSA 加密传输，字段名不变
export function addUserApi(data: any) {
  return request.post('/ar-manager/api/v1/users', withEncryptedPwd(data, ['loginPwd']))
}
// 修改菜单
export function editUserApi(userId: any, data: any) {
  return request.put('/ar-manager/api/v1/users/' + userId, data)
}
// 删除菜单
export function delUserApi(ids: any) {
  return request.delete(`/ar-manager/api/v1/users/${ids}`)
}
// 获取角色列表
export function getUserListPage(data: any) {
  return request.post('/ar-manager/api/v1/users/listPage', data)
}
// header修改当前用户密码：newPwd / confirmNewPwd 分别组装 pwd=&nonce= 后 RSA 加密传输，字段名不变
export function updateCurrentUserPwd(data: {
  confirmNewPwd: string,
  id:number,
  newPwd: string,
  pwdTips: string
}) {
  return request.post('/ar-manager/api/v1/users/updateCurrentUserPwd', withEncryptedPwd(data, ['newPwd', 'confirmNewPwd']))
}
// 修改用户密码：newPwd / confirmNewPwd 分别组装 pwd=&nonce= 后 RSA 加密传输，字段名不变
export function editUserPassword(data: {
  confirmNewPwd: string,
  id:number,
  newPwd: string,
  pwdTips: string
}) {
  return request.post('/ar-manager/api/v1/users/updateUserPwd', withEncryptedPwd(data, ['newPwd', 'confirmNewPwd']))
}

// 退出登录
export function logout() {
  return request.delete('/ar-auth/oauth/logout')
}

// 绑定google验证器
export function setValidGoogle(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post('/ar-manager/api/v1/users/validGoogle', data, config)
}

// 重置谷歌密钥
export function resetValidGoogle(data: any) {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return request.post('/ar-manager/api/v1/users/resetGoogle', data, config)
}

// 获取在线人数
// export function getOnline() {
//   const config = {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   };
//   return request.post('/ar-manager/api/v1/users/online', {}, config)
// }
export function getOssUrl(data:any) {
  return request.post('/ar-manager/oss/generatePresignedUrl',data)
}

// export function OssUpload({signedUrl,file}:any) {
//   let config = {
//     headers: { //添加请求头
//       'Content-Type': file.type
//     }
//   }
//   return  axios.put(signedUrl,file,config)

// }
export function OssUpload({
  signedUrl,
  file,
  onProgress
}: {
  signedUrl: string;
  file: File;
  onProgress?: (percent: number) => void;
}) {
  const config = {
    headers: {
      'Content-Type': file.type
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress?.(percent);
      }
    }
  };

  return axios.put(signedUrl, file, config);
}