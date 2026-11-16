<template>
  <div class="search">
    <a-row style="margin: 0 0 15px 0">
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.bankName"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('m581')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.cardOwnerName"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('n621')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.bankCardNumber"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+$t('m652')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.ifsc"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562')+'IFSC CODE'"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary" v-permission="'admin:bankCardBlacklistAdmin:add'" @click="showAdd()">{{
          $t("add")
        }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'bankName'">
      <a-tooltip v-if="record.bankName">
        <template #title>
          {{ record.bankName }}
          <CopyOutlined v-if="record.bankName" class="copyId"  @click="$copyId(record.bankName)" />
        </template>
        <div class="toopTipStyle2">
          {{ record.bankName }}
          <CopyOutlined v-if="record.bankName" class="copyId"  @click="$copyId(record.bankName)" />
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'cardOwnerName'">
      <a-tooltip v-if="record.cardOwnerName">
        <template #title>
          {{ record.cardOwnerName }}
        </template>
        <div class="toopTipStyle2">
          {{ record.cardOwnerName }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'bankCardNumber'">
      <a-tooltip v-if="record.bankCardNumber">
        <template #title>
          {{ record.bankCardNumber }}
        </template>
        <div class="toopTipStyle2">
          {{ record.bankCardNumber }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'ifsc'">
      <a-tooltip v-if="record.ifsc">
        <template #title>
          {{ record.ifsc }}
        </template>
        <div class="toopTipStyle2">
          {{ record.ifsc }}
        </div>
      </a-tooltip>
      <span v-else>-</span>
    </template>
    <template v-if="column.key === 'createTime'">
      {{ record.createTime || '-' }}
    </template>
    <template v-if="column.key === 'operate'">
      <a-tag
        color="red"
        style="cursor: pointer;"
        size="small"
        @click="showDeleteDialog(record)"
        v-permission="'admin:bankCardBlacklistAdmin:removeBlack'"
        >{{ $t("b11") }}
      </a-tag>
    </template>
    </template>
  </a-table>
  <!-- 新增银行卡黑名单 -->
   
  <a-modal v-model:open="blackMod" :title="$t('add')" :footer="null" :width="640">
    <a-form
      ref="formRef"
      class="black-form"
      :model="blackForm"
      :rules="blackRules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 17 }"
      @validate="onFormValidate"
    >
      <a-form-item :label="$t('m581')" name="bankName">
        <a-input v-trim v-model:value="blackForm.bankName" :placeholder="$t('sellOutBankNameRequired')" @input="revalidateIfError('bankName')" />
      </a-form-item>
      <a-form-item :label="$t('n621')" name="cardOwnerName">
        <a-input v-trim v-model:value="blackForm.cardOwnerName" :placeholder="$t('sellOutOwnerNameRequired')" @input="revalidateIfError('cardOwnerName')" />
      </a-form-item>
      <a-form-item :label="t('m652')" name="bankCardNumber" :extra="$t('n2047')">
        <a-input v-trim v-model:value="blackForm.bankCardNumber" :placeholder="$t('sellOutBankCardNumberRequired')" @input="revalidateIfError('bankCardNumber')" />
      </a-form-item>
      <a-form-item label="IFSC CODE" name="ifsc" :extra="$t('n2049')">
        <a-input v-trim v-model:value="blackForm.ifsc" :placeholder="$t('n2048')" @input="onIfscInput" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8 }">
        <a-button type="primary" :loading="loading" @click="add()">{{
          $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 删除二次确认 -->
  <a-modal
    v-model:open="deleteDialog"
    :title="$t('n2058')"
    :width="480"
    :footer="null"
    :maskClosable="false"
    :closable="!deleting"
    :keyboard="!deleting"
  >
    <div class="del-record">
      <div>{{ $t('m581') }}: {{ deleteRow.bankName || '-' }}</div>
      <div>{{ $t('m652') }}: {{ deleteRow.bankCardNumber || '-' }}</div>
      <div>IFSC CODE: {{ deleteRow.ifsc || '-' }}</div>
    </div>
    <div class="del-desc">{{ $t('n2059') }}</div>
    <div class="dlg-footer">
      <a-button :disabled="deleting" @click="closeDeleteDialog">{{ $t('b10') }}</a-button>
      <a-button type="primary" danger :loading="deleting" @click="confirmDelete">{{ $t('n1823') }}</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, nextTick } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import {
  bankCardBlacklistAdminListPage,
  bankCardBlacklistAdminAdd,
  bankCardBlacklistAdminRemoveBlock,
} from "@/api";
import { currency } from "@/utils/index";
import { useI18n } from "vue-i18n";
// import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { getIfscErrorKey, normalizeIfsc, upperCaseInput } from "@/utils/ifsc";
const { getTabH } = useTabHeight();
// const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
const { t } = useI18n();
const query = ref({
  asc: false,
  column: "",
  pageNo: 1,
  pageSize: 20,
  bankCardNumber: undefined,
  bankName: undefined,
  cardOwnerName: undefined,
  ifsc: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const columns:any = [
  {
    title: t("m581"),
    dataIndex: "bankName",
    key: "bankName",
    align: "center",
    width: 150,
  },
  {
    title: t("n621"),
    dataIndex: "cardOwnerName",
    key: "cardOwnerName",
    align: "center",
    width: 150,
  },
  {
    title: t("m652"),
    dataIndex: "bankCardNumber",
    key: "bankCardNumber",
    align: "center",
    width: 150,
  },
  {
    title: 'IFSC CODE',
    dataIndex: "ifsc",
    key: "ifsc",
    align: "center",
    width: 150,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 150,
  },
  {
    title: t("operation"),
    dataIndex: "operate",
    key: "operate",
    align: "center",
    width: 120,
    // fixed: 'right',
  },
];
const {
  dataSource,
  extendData,
  response,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: bankCardBlacklistAdminListPage,
  defaultPageSize: 20,
  filterRules: [
  ],
});
// 新增银行卡黑名单
const blackMod = ref(false);
const formRef = ref<any>();
const blackForm = ref<any>({
  bankName: undefined,
  cardOwnerName: undefined,
  bankCardNumber: undefined,
  ifsc: undefined,
})
// 银行卡号：去首尾空白后只能是 9—18 位半角数字，按顺序取第一条错误
const validateBankCardNumber = (_rule: any, value: any) => {
  const cardNo = String(value ?? '').trim();
  if (!cardNo) return Promise.reject(t('n2050'));
  if (!/^[0-9]+$/.test(cardNo)) return Promise.reject(t('n2051'));
  if (cardNo.length < 9 || cardNo.length > 18) return Promise.reject(t('n2052'));
  return Promise.resolve();
};
// IFSC：去首尾空白、转大写后逐项校验，按顺序取第一条错误
const validateIfsc = (_rule: any, value: any) => {
  const errorKey = getIfscErrorKey(value);
  return errorKey ? Promise.reject(t(errorKey)) : Promise.resolve();
};
// 失焦和点「创建」时校验，避免还没输完就出现红字；字段已有红字时由 revalidateIfError 在输入中实时复校
const blackRules: Record<string, Rule[]> = {
  bankName: [{ required: true, whitespace: true, message: t('sellOutBankNameRequired'), trigger: 'blur' }],
  cardOwnerName: [{ required: true, whitespace: true, message: t('sellOutOwnerNameRequired'), trigger: 'blur' }],
  bankCardNumber: [{ required: true, validator: validateBankCardNumber, trigger: 'blur' }],
  ifsc: [{ required: true, validator: validateIfsc, trigger: 'blur' }],
};
const fieldsWithError = ref<Record<string, boolean>>({});
const onFormValidate = (name: any, status: boolean) => {
  fieldsWithError.value[String(name)] = !status;
};
const revalidateIfError = (name: string) => {
  if (fieldsWithError.value[name]) formRef.value?.validateFields([name]).catch(() => {});
};
// IFSC 输入自动转大写（保持光标位置）
const onIfscInput = (e: Event) => {
  upperCaseInput(e, (v) => { blackForm.value.ifsc = v; });
  revalidateIfError('ifsc');
};
const showAdd = () => {
  blackForm.value = {
    bankName: undefined,
    cardOwnerName: undefined,
    bankCardNumber: undefined,
    ifsc: undefined,
  };
  blackMod.value = true;
  // 清掉上次打开时残留的校验提示
  fieldsWithError.value = {};
  nextTick(() => formRef.value?.clearValidate());
}
const add = async () =>{
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  const { bankName, cardOwnerName, bankCardNumber, ifsc } = blackForm.value;
  loading.value = true;
  const res: any = await bankCardBlacklistAdminAdd({
    bankName: String(bankName).trim(),
    cardOwnerName: String(cardOwnerName).trim(),
    bankCardNumber: String(bankCardNumber).trim(),
    ifsc: normalizeIfsc(ifsc),
  }).finally(()=>{loading.value = false});
  if(res && res.code == 1){
    message.success(t('s10'));
    closeAddDalog();
    getList();
  }
}
const closeAddDalog = ()=> {
  blackMod.value = false;
  blackForm.value = {
    bankName: undefined,
    cardOwnerName: undefined,
    bankCardNumber: undefined,
    ifsc: undefined,
  };
}
/**************** 删除（二次确认） ***************/
const deleteDialog = ref(false);
const deleting = ref(false);
const deleteRow = ref<any>({});
const showDeleteDialog = (record: any) => {
  deleteRow.value = record;
  deleting.value = false;
  deleteDialog.value = true;
};
const closeDeleteDialog = () => {
  deleteDialog.value = false;
};
const isTimeoutError = (err: any) =>
  err?.code === 'ECONNABORTED' || err?.code === 'ETIMEDOUT' || /timeout/i.test(err?.message || '');
// 删除失败后按 IFSC 查一次列表并按 id 比对，确认记录是否已被删除（卡号可能脱敏，不作为查询条件）；
// 查询失败或结果可能不完整时返回 null（按删除失败处理）
const RECHECK_PAGE_SIZE = 100;
const recordStillExists = async (row: any): Promise<boolean | null> => {
  const res: any = await bankCardBlacklistAdminListPage({
    asc: false,
    column: '',
    pageNo: 1,
    pageSize: RECHECK_PAGE_SIZE,
    firstPage: true,
    lastPage: false,
    ifsc: row.ifsc || undefined,
  }).catch(() => null);
  if (!res || String(res.code) !== '1') return null;
  const list: any[] = Array.isArray(res.data) ? res.data : [];
  if (list.some((item: any) => item.id === row.id)) return true;
  return list.length < RECHECK_PAGE_SIZE ? false : null;
};
// 确认删除：成功刷新当前列表（保留筛选条件）；超时提示刷新确认；其余失败再确认记录是否已被他人删除
const confirmDelete = async () => {
  const row = deleteRow.value;
  deleting.value = true;
  let res: any = null;
  try {
    res = await bankCardBlacklistAdminRemoveBlock({ id: row.id });
  } catch (err: any) {
    if (isTimeoutError(err)) {
      deleting.value = false;
      message.warning(t('n2062'));
      return;
    }
  }
  if (res && res.code == 1) {
    deleting.value = false;
    message.success(t('s9'));
    closeDeleteDialog();
    getList();
    return;
  }
  const exists = await recordStillExists(row);
  deleting.value = false;
  if (exists === false) {
    message.warning(t('n2061'));
    closeDeleteDialog();
    getList();
    return;
  }
  message.error(t('n2060'));
}
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3,40).getTabH.value;
});
</script>
<style lang="less" scoped>
.black-form :deep(.ant-form-item-extra) {
  font-size: 12px;
}
.del-record {
  background: #f5f6f8;
  border-radius: 6px;
  padding: 10px 14px;
  margin: 8px 0 14px;
  line-height: 26px;
  word-break: break-all;
}
.del-desc {
  margin-bottom: 20px;
}
.dlg-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
