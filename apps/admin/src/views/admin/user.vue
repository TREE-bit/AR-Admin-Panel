<template>
  <div class="search">
    <h2>{{ $t('m22') }}</h2>
    <a-row>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.username"
          class="searchstyle"
          :placeholder="$t('t8')"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          allowClear
          class="searchstyle"
          :placeholder="$t('p54')"
          show-search
          v-model:value="query.role"
        >
          <a-select-option
            v-for="(item, index) in roleList"
            :key="index"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-button type="primary" :loading="loading" :icon="h(SearchOutlined)" @click="getUserList(1)">{{
        $t("search")
      }}</a-button>
      <a-button type="primary" :loading="loading" @click="resetQuery">{{ $t("reset") }}</a-button>
      <a-button type="primary" :loading="loading" @click="showAddUserDialog" v-permission="'admin:v1::users'">{{
        $t("addUsers")
      }}</a-button>
    </a-row>
  </div>
  <a-table
    :dataSource="userList"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    rowKey="id"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'listRole'">
        <a-tooltip>
          <template #title>
            <span style="background:#fff;color:#000;" v-for="item in record.listRole" class="arbListTag" :key="item.id">{{
              item.name
            }}</span>
          </template>
          <div class="toopTipStyle2 arbListTagBox">
            <span v-for="item in record.listRole" class="arbListTag" :key="item.id">{{
              item.name
            }}</span>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'status'">
        <span class="arbListTag">
          <span class="pointTag" :style="record.status == 1 ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
          {{ record.status == 1 ? $t("enabled") : $t("disabled") }}
        </span>
      </template>
      <template v-if="column.key === 'lastLoginIp'">
        <a-tooltip>
          <template #title>{{ record.lastLoginIp }}</template>
          <div class="toopTipStyle">{{ record.lastLoginIp }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'action'">
        <span
          class="actionBtn actionBtnColor1"
          @click="showEditPageFun(record)"
          v-permission="'admin:v1::users-put'"
          >{{ $t("edit") }}
        </span>
        <!-- <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:v1::users-put'"
          >{{ $t("edit") }}
        </a-tag> -->
        <span
          class="actionBtn actionBtnColor2"
          @click="handleEditPassowrd(record.id, record.username)"
          v-permission="'admin:v1::updateUserPwd'"
          >{{ $t("userResetPwd") }}
        </span>
        <!-- <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="handleEditPassowrd(record.id)"
          v-permission="'admin:v1::updateUserPwd'"
          >{{ $t("userResetPwd") }}
        </a-tag> -->

        <span
          class="actionBtn actionBtnColor3"
          v-permission="'admin:v1::users-del'"
          @click="showDelMod(record.id)"
          >{{ $t("b11") }}
        </span>
        <!-- <a-popconfirm
          :title="$t('t7')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="delUser(record.id)"
        >
          <template #description>
            <span style="color: red">{{ $t("t17") }}</span>
          </template>
          <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:v1::users-del'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm> -->

        <span 
          class="actionBtn actionBtnColor4"
          @click="showResetGoole(record.id)"
          v-permission="'admin:v1::resetGoogle'"
            >{{ $t("ss4") }}
        </span>
        <!-- <a-popconfirm
          :title="$t('ss5')"
          @confirm="handleRestGoole(record.id)"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
        >
          <template #description>
            <span style="color: red">{{ $t("ss6") }}</span>
          </template>
          <a-tag color="yellow" style="cursor: pointer" size="small" @click=""
          v-permission="'admin:v1::resetGoogle'"
            >{{ $t("ss4") }}
          </a-tag>
        </a-popconfirm> -->
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addUserDialog"
    :title="addUserForm.id ? $t('n3') : $t('n4')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="addUserForm"
      :label-col="{ span: 4}"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item :label="$t('l61')" name="roleIds"  :rules="[{required:true,message:''}]">
        <a-select
          allowClear
          ref="select"
          style="width: 100%"
          :placeholder="$t('t9')"
          mode="multiple"
          show-search
          v-model:value="addUserForm.roleIds"
        >
          <a-select-option
            v-for="(item, index) in roleList"
            :key="index"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('l60')" name="username"  :rules="[{required:true,message:''}]">
        <a-input v-trim v-model:value="addUserForm.username" :placeholder="$t('t8')" />
      </a-form-item>
      <a-form-item v-if="!addUserForm.id" :label="$t('m784')" name="loginPwd"  :rules="[{required:true,message:''}]">
        <a-input-password v-trim
          v-model:value="addUserForm.loginPwd"
          :maxlength="16"
          autocomplete="new-password"
          :placeholder="$t('m562') + $t('m784')"
        />
        <PasswordRuleTips :password="addUserForm.loginPwd" :username="addUserForm.username" />
      </a-form-item>
      <!-- <a-form-item :label="$t('l62')" name="nickname" required>
        <a-input v-trim
          v-model:value="addUserForm.nickname"
          :placeholder="$t('t10')"
        />
      </a-form-item>
      <a-form-item :label="$t('l35')" name="mobile" required>
        <a-input v-trim v-model:value="addUserForm.mobile" :placeholder="$t('t11')" />
      </a-form-item>
      <a-form-item :label="$t('l63')" name="email" >
        <a-input v-trim v-model:value="addUserForm.email" :placeholder="$t('t12')" />
      </a-form-item> -->
      <a-form-item :label="$t('state')" name="status">
        <a-switch
          v-model:checked="addUserForm.status"
          :checked-children="$t('open')"
          :un-checked-children="$t('close')"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" :loading="loading" @click="addBtn(Boolean(addUserForm.id))">{{
          addUserForm.id ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddUserIdalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="updatePasswordDialog"
    :title="$t('userResetPwd')"
    @ok="updatePassword"
  >
    <a-form
      :model="updatePasswordForm"
      :label-col="{ span: 4 }"
      ref="editPwdRef"
    >
      <a-form-item
        :label="$t('userNewPwd')"
        name="newPwd"
        :rules="[{ required: true, message: $t('t13') }]"
      >
        <a-input-password
          v-model:value="updatePasswordForm.newPwd"
          :placeholder="$t('userRule3')"
        />
        <PasswordRuleTips :password="updatePasswordForm.newPwd" :username="updatePasswordUsername" />
      </a-form-item>
      <a-form-item
        :label="$t('userCPwd')"
        name="confirmNewPwd"
        :rules="[{ required: true, message: $t('t14') }]"
      >
        <a-input-password
          v-model:value="updatePasswordForm.confirmNewPwd"
          :placeholder="$t('t14')"
        />
      </a-form-item>
      <a-form-item :label="$t('l64')" name="pwdTips">
        <a-input v-trim
          v-model:value="updatePasswordForm.pwdTips"
          :placeholder="$t('t15')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 删除 -->
  <a-modal
    v-model:open="delMod"
    @ok="delUser(delId)"
    @cancel="closeDelMod"
  >
    <template #title>
      <ExclamationCircleOutlined style="color: #faad14; font-size: 20px;margin-right: 6px;" />
      {{ $t("t7") }}
    </template>
    <h2 style="color:rgb(253, 11, 26)">{{ $t('t17') }}</h2>
  </a-modal>
  <!-- 重置谷歌密钥 -->
  <a-modal
    v-model:open="resetModal"
    @ok="handleRestGoole(resetValidGoogleId)"
    @cancel="closeResetMod"
  >
    <template #title>
      <ExclamationCircleOutlined style="color: #faad14; font-size: 20px;margin-right: 6px;" />
      {{ $t("ss5") }}
    </template>
    <h2 style="color:rgb(253, 11, 26)">{{ $t('ss6') }}</h2>
  </a-modal>
</template>

<script setup lang="ts">
import { adminRole } from "@/hooks/adminRole.hook";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { adminUser } from "@/hooks/adminUser.hook";
import { message } from "ant-design-vue";
import {
  addUserApi,
  editUserApi,
  editUserPassword,
  getUserListPage,
resetValidGoogle,
} from "@/api/user.api";
import { ColumnType } from "ant-design-vue/es/table";
import { useI18n } from "vue-i18n";
import { userPwdReg} from "@/utils/publicData"
import { getWeakPasswordError } from "@/utils/weakPassword"
import PasswordRuleTips from "@/components/PasswordRuleTips.vue"
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const adminRoleHook = adminRole();
const adminUserHook = adminUser();
const editPwdRef = ref();
const warningIcon = h(ExclamationCircleOutlined, {
  style: 'color: #faad14; font-size: 22px;',
})
const columns: ColumnType[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 80,
  },
  {
    title: t("l60"),
    dataIndex: "username",
    key: "username",
    align: "center",
    width: 150,
  },
  {
    title: t("l61"),
    dataIndex: "listRole",
    key: "listRole",
    align: "center",
    width: 300,
  },
  {
    title: t("l62"),
    dataIndex: "nickname",
    key: "nickname",
    align: "center",
    width: 150,
  },
  {
    title: t("l59"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
  },
  {
    title: t("m430"),
    dataIndex: "loginCount",
    key: "loginCount",
    align: "center",
    width: 120,
  },
  {
    title: t("m431"),
    dataIndex: "lastLoginIp",
    key: "lastLoginIp",
    align: "center",
    width: 180,
  },
  {
    title: t("m432"),
    dataIndex: "lastLoginTime",
    key: "lastLoginTime",
    align: "center",
    width: 140,
  },
  {
    title: t("operation"),
    key: "action",
    align: "center",
    width: 330,
  },
];
const query = ref({
  username: undefined,
  role: null,
  pageNo: 1,
  pageSize: 50,
});
const userList = ref([]);
const roleList = ref<any[]>([]);
const loading = ref(false);
const addUserDialog = ref(false);
const updatePasswordDialog = ref(false);
const total = ref(0);
const addUserForm:any = ref({
  // nickname: "", // nicheng
  roleIds: [], // rolelist
  status: 1, // state
  username: undefined,
  loginPwd: undefined,
  gender: undefined,
  // email: "",
  // mobile: "",
});

const updatePasswordForm = ref<any>({
  newPwd: "",
  confirmNewPwd: "",
  pwdTips: "",
  id: -1,
});
// 被重置密码的用户名，仅用于弱密码校验（密码不能包含完整用户名），不随接口提交
const updatePasswordUsername = ref("");
const pagination = computed(() => ({
  total: total.value,
  current: query.value.pageNo,
  pageSize: query.value.pageSize,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
}));
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag?.current;
  query.value.pageSize = pag?.pageSize;
  getUserList();
};
const getUserList = async (isFirst:any =null) => {
  if(isFirst){
    query.value.pageNo =1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await getUserListPage(query.value).catch((err) => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    userList.value = res.data || [];
    total.value = res.total || 0;
    loading.value = false;
  }
};
const getRoleList = async () => {
  roleList.value = await adminRoleHook.getList();
};

const resetQuery = () => {
  query.value={
    username: undefined,
    role: undefined,
    pageNo: 1,
    pageSize: 50,
  }
  pagination.value.current = 1;
  pagination.value.pageSize = 50;
  clearSelected();
  getUserList();
};
const showAddUserDialog = () => {
  clearAddUserForm();
  addUserDialog.value = true;
};
const showEditPageFun = (data: any) => {
  selectedRow();
  const {
    // email,
    gender,
    id,
    // mobile,
    // nickname,
    listRole: roleIds,
    status,
    username,
  } = data;
  const value = {
    // email,
    gender,
    id,
    // mobile,
    // nickname,
    status,
    username,
    roleIds,
  };
  value.roleIds = value.roleIds.map((item: any) => item.id);
  addUserForm.value = value;
  addUserDialog.value = true;
};
const closeAddUserIdalog = () => {
  clearAddUserForm();
  addUserDialog.value = false;
};
const clearAddUserForm = () => {
  addUserForm.value = {
    // nickname: "", // nicheng
    roleIds: [], // jueselieb
    status: 1, // zhuangtai
    username: undefined,
    gender: undefined,
    loginPwd: undefined,
    // email: "",
    // mobile: "",
  };
};
// 重置谷歌密钥
const resetModal = ref(false);
const resetValidGoogleId = ref<any>(undefined);
const showResetGoole = (id: number) => {
  resetValidGoogleId.value = id;
  resetModal.value = true;
};
const handleRestGoole = async(id: number) => {
  // console.log('id',id)
  loading.value = true;
  const res: any = await resetValidGoogle({userId: id}).finally(()=>loading.value = false);
  if (res && res.code == "1") {
    message.success(t("s10"));
    closeResetMod();
  }
};
const closeResetMod = () => {
  resetModal.value = false;
  resetValidGoogleId.value = undefined;
}

const handleEditPassowrd = (id: number, username: string) => {
  selectedRow();
  updatePasswordForm.value.id = id;
  updatePasswordUsername.value = username;
  updatePasswordDialog.value = true;
};

const updatePassword = async () => {
  if(updatePasswordForm.value.newPwd!=updatePasswordForm.value.confirmNewPwd){
    message.error(t('userRule6'));
    return;
  }
  if(!userPwdReg.test(updatePasswordForm.value.newPwd)){
    message.error(t('m562') + t('m932'));
    return;
  }
  const weakError = getWeakPasswordError(updatePasswordForm.value.newPwd, updatePasswordUsername.value);
  if (weakError) {
    message.error(weakError);
    return;
  }
  loading.value = true;
  const res: any = await editUserPassword(updatePasswordForm.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    updatePasswordDialog.value = false;
    message.success(t("s7"));
    editPwdRef.value.resetFields();
    getUserList();
  }
};

const addBtn = async (isEdit: Boolean = false) => {
  if(addUserForm.value.roleIds.length==0 || !addUserForm.value.roleIds){
    message.error(t('m563')+t('l61'));
    return;
  }
  if(!addUserForm.value.username){
    message.error(t('m562')+t('l60'));
    return;
  }
  let res:any;
  if (isEdit) {
    loading.value = true;
    res = await editUserApi(addUserForm.value.id, addUserForm.value).finally(()=>loading.value = false);
  } else {
    if(!userPwdReg.test(addUserForm.value.loginPwd)){
      message.error(t('m562') + t('m932'));
      return;
    }
    const weakError = getWeakPasswordError(addUserForm.value.loginPwd, addUserForm.value.username);
    if (weakError) {
      message.error(weakError);
      return;
    }
    res = await addUserApi(addUserForm.value);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t("s7") : t("s8"));
    closeAddUserIdalog();
    getUserList();
  }
};

// 删除
const delMod = ref(false);
const delId= ref(undefined);
const showDelMod = (id: any) => {
  delId.value = id;
  delMod.value = true;
};
const delUser = async (id: any) => {
  const res: any = await adminUserHook.delUser(id);
  if(res && res.code == '1'){
    getUserList();
    closeDelMod();
  }
};
const closeDelMod = () => {
  delMod.value = false;
  delId.value = undefined;
};
onMounted(() => {
  getUserList();
  getRoleList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style scoped lang="less">
.actionBtn {
  padding: 3px 8px;
  margin: 2px;
  border-radius: 4px;
  margin-right: 2px;
  cursor: pointer;
}
.actionBtnColor1{
  color: #fff;
  background-color: rgb(22, 155, 213);
}
.actionBtnColor2{
  color: #fff;
  background-color: rgb(14, 186, 139);
}
.actionBtnColor3{
  color: #fff;
  background-color: rgb(253, 11, 26);
}
.actionBtnColor4{
  color: #d4b106;
  background-color: #feffe6;
  border: 1px solid #fffb8f;
}
</style>
