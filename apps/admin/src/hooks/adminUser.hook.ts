import { getUserListPage, addUserApi, delUserApi } from "@/api/user.api";
import { message } from "ant-design-vue";
export function adminUser() {
  const getUserList = async (query: any) => {
    const res: any = await getUserListPage(query);
    return res.data || [];
  };
  const addUser = async(data:any)=>{
    const res: any = await addUserApi(data)
    if(res.code==1)message.success('添加成功')
    return res.data || []
  };
  const delUser = async(data:any)=>{
    const res: any = await delUserApi(data)
    if(res.code == 1){
      message.success('删除成功')
    }
    return res
  }
  return {
    getUserList,
    addUser,
    delUser
  };
}
