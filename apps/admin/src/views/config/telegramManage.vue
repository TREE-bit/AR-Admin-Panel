<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.groupName"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n807')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.groupId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n806')"
        />
      </a-col>
      <a-col :span="6">
        <a-select
          mode="multiple"
          class="searchstyle"
          v-model:value="query.bindMerchantCodes"
          :placeholder="$t('m563')+$t('n9')"
          @change="selNameChange"
        >
          <a-select-option v-for="(item, index) in merchantList" :key="index" :value="item.value">
          {{ item.label }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          v-model:value="query.groupType"
          class="searchstyle"
          :placeholder="$t('m563')+$t('n805')"
          :options="Object.entries(groupTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: $t(value), }))"
        >
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          v-model:value="query.status"
          class="searchstyle"
          :placeholder="$t('m563')+$t('state')"
        >
          <a-select-option :value="0" > {{ $t("disabled") }} </a-select-option>
          <a-select-option :value="1" > {{ $t("enabled") }} </a-select-option>
        </a-select>
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
        <a-button
          type="primary"
          @click="addGroup"
          v-permission="'admin:telegramGroupAdmin:save'"
          >{{ $t("add") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'groupName'">
        <a-tooltip>
          <template #title>{{ record.groupName }}</template>
          <div class="toopTipStyle">{{ record.groupName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'groupId'">
        <a-tooltip>
          <template #title>{{ record.groupId }}</template>
          <div class="toopTipStyle">{{ record.groupId }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bindMerchantCodes'">
        <div v-if="record.groupType == '1'">
          <a-tooltip v-if="record.bindMerchantCodes.length>0">
            <template #title>{{ record.bindMerchantCodes.join(",") }}</template>
            <div class="toopTipStyle3">{{ record.bindMerchantCodes.join(",") }}</div>
          </a-tooltip>
          <span v-else>-</span>
        </div>
        <span v-else>all</span>
      </template>
      <template v-if="column.key === 'msgTemplateIds'">
        <a-tooltip color="white">
          <template #title >
            <a-tag style="padding: 2px;" color="green" v-for="(item, index) in record.msgTemplateIds" :key="index">
              {{ $t(tgMsgEnumMerchant[item]) }}
            </a-tag>
          </template>
          <div class="toopTipStyle3">
            <a-tag  color="green" v-for="(item, index) in record.msgTemplateIds" :key="index">
              {{ $t(tgMsgEnumMerchant[item]) }}
            </a-tag>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'groupType'">
        {{ $getMapItem(groupTypeMap,record.groupType) || '-' }}
      </template>
      <template v-if="column.key === 'status'">
        <a-tag>
          <a-badge :color="record.status == 1 ? 'green' : 'red'" />
          {{ record.status == 1 ? $t("enabled") : $t("disabled") }}
        </a-tag>
      </template>
      <!-- <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div class="toopTipStyle">{{ record.remark }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'action'">
        <!-- 查看 -->
        <a-tag
          color="green"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          >{{ $t("b23") }}
        </a-tag>
        <!-- 启用/禁用 -->
          <a-popconfirm
            :title="record.status == 1 ? $t('b28')+$t('disabled')+'?' : $t('b28')+$t('enabled')+'?'"
            :ok-text="$t('b9')"
            :cancel-text="$t('b10')"
            @confirm="changeStatus(record)"
          >
            <a-tag
              :color="record.status == 1 ? 'red' : 'green'"
              style="cursor: pointer"
              size="small"
              v-permission="'admin:telegramGroupAdmin:enable'"
              >{{ record.status == 1 ? $t("disabled") : $t("enabled") }}
            </a-tag>
          </a-popconfirm>
        <div class="actionBtnLine"></div>
        <!-- 编辑 -->
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editMsg(record)"
          v-permission="'admin:telegramGroupAdmin:update'"
          >{{ $t("edit") }}
        </a-tag>
        <!-- 删除 -->
        <a-popconfirm
          :title="$t('t7')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="delMsg(record)"
        >
          <template #description>
            <span style="color: red">{{ $t("t17") }}</span>
          </template>
          <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:telegramGroupAdmin:delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="groupMod"
    :title="btnType == 1 ? $t('n813') : btnType == 2? $t('n814'):$t('n815')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="groupForm"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item
        :label="$t('n807')"
        name="groupName"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input v-trim :disabled="btnType == 3" v-model:value="groupForm.groupName" :placeholder="$t('m562')+$t('n807')" />
      </a-form-item>
      <a-form-item
        :label="$t('n806')"
        name="groupId"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input v-trim :disabled="btnType != 1" v-model:value="groupForm.groupId" :placeholder="$t('m562')+$t('n806')" />
      </a-form-item>
      <a-form-item
        :label="$t('n805')"
        name="groupType"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select
         :disabled="btnType == 3 "
          allowClear
          class="searchstyle"
          :placeholder="$t('m562')+$t('n805')"
          v-model:value="groupForm.groupType"
          :options="Object.entries(groupTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: $t(value), }))"
          @change="groupTypeChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n812')"
        name="bindMerchantCodes"
        :rules="[{ required: true, message: '' }]"
        v-if="groupForm.groupType == '1'"
      >
        <a-select
         :disabled="btnType == 3"
          mode="multiple"
          :maxTagCount="5"
          class="searchstyle"
          v-model:value="groupForm.bindMerchantCodes"
          :placeholder="$t('m563')+$t('n811')"
          @change="codesChange"
          allowClear
        >
          <a-select-option
            v-for="(item, key) in merchantList"
            :key="key"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('n803')"
        name="msgTemplateIds"
        :rules="[{ required: true, message: '' }]"
      >
        <a-select
         :disabled="btnType == 3"
          mode="multiple"
          :maxTagCount="4"
          class="searchstyle"
          v-model:value="groupForm.msgTemplateIds"
          :placeholder="$t('m563')+$t('n803')"
          @change="msgTemplateChange"
          :options="Object.entries(tgMsgEnumMerchant )
          .map(([key, value]:[any,any]) => ({ value:key, label: $t(value), }))
          .filter(item => item.value !== '0' && item.value !== '1')"
          allowClear
        >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('n810')">
        <a-switch
         :disabled="btnType == 3"
          v-model:checked="groupForm.status"
          :checked-children="$t('open')"
          :un-checked-children="$t('close')"
          :checkedValue="1"
          :unCheckedValue="0"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button :loading="loading" :disabled="btnType == 3" type="primary" @click="addBtn()">{{ $t("save") }}</a-button>
        <a-button style="margin-left: 10px" @click="closeMod">{{ $t("l54") }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="sendMsgMod"
    :title="$t('n809')"
    :footer="null"
  >
    <a-form
      ref="formRef"
      :model="msgForm"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 13 }"
    >
      <a-form-item
        :label="$t('n807')"
        :rules="[{ required: true, message: '' }]"
      >
        <a-input v-trim disabled v-model:value="msgForm.groupName" />
      </a-form-item>
      <a-form-item
        :label="$t('n808')"
        name="msg"
        :rules="[{ required: true, message: '' }]"
      >
        <a-textarea  v-model:value="msgForm.msg" :rows="4" :placeholder="$t('m562')+$t('n808')" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="addBtn()">{{
          $t("n160")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeMod">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h , computed} from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { tgMsgEnumMerchant } from "@/utils/publicData";
import {
  roborManagementListMarquees,
  addMerchantBindBot,
  updateMerchantBindBot,
  delMerchantBindBot,
  telegramGroupAdminDisable,
  telegramGroupAdminEnable,
} from '@/api/c2cconfig.api'
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useMerchantStore } from '@/stores/useMerchantStore'
const { getTabH } = useTabHeight(250);
const merchantStore = useMerchantStore();
const merchantList = computed(() => merchantStore.merchantList);
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const btnType = ref(1);
const query = ref({
  asc: '',
  column: '',
  pageNo: 1,
  pageSize: 20,
  groupName: '',
  groupId: '',
  bindMerchantCodes: [],
  groupType: undefined,
  status: undefined,
});
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    width: 80,
    customRender: ({ index }:{index:any}) => index + 1,
  },
  {
    title: t("n807"),
    dataIndex: "groupName",
    key: "groupName",
    align: "center",
    width: 100,
  },
  {
    title: t("n806"),
    dataIndex: "groupId",
    key: "groupId",
    align: "center",
    width: 100,
  },
  {
    title: t("n805"),
    dataIndex: "groupType",
    key: "groupType",
    align: "center",
    width: 100,
  },
  {
    title: t("n804"),
    dataIndex: "bindMerchantCodes",
    key: "bindMerchantCodes",
    align: "center",
    width: 200,
  },
  {
    title: t("n803"),
    dataIndex: "msgTemplateIds",
    key: "msgTemplateIds",
    align: "center",
    width: 300,
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 100,
  },
  {
    title: t("l67"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 140,
  },
  {
    title: t("operation"),
    dataIndex: "updateactionBy",
    key: "action",
    align: "center",
    fixed: "right",
    width: 160,
  },
];
const groupTypeMap: any = ref({
  0: t("n802"),// 内部群
  1: t("n801"),// 商户群
})
const pagination = ref({
  total: 0,
  pageNo: 1,
  pageSize: 20,
  current: 1,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (isFirst: any =null) => {
  if(isFirst){
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  const res:any = await roborManagementListMarquees(query.value).finally(()=>loading.value=false);
  if (res.code === "1") {
    dataSource.value = res.data || [];
    pagination.value.total = res.total || 0;
  }
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.pageNo = pag.current;
  pagination.value.pageSize = pag.pageSize;
  pagination.value.current = pag.current;
  query.value.pageSize = pag.pageSize;
  query.value.pageNo = pag?.current;
  getList();
};
const resetQuery = () => {
  query.value = {
    asc: '',
    column: '',
    pageNo: 1,
    pageSize: 20,
    groupName: '',
    groupId: '',
    bindMerchantCodes: [],
    groupType: undefined,
    status: undefined,
  };
  pagination.value.current = 1;
  pagination.value.pageSize = 20;
  clearSelected();
  getList();
};
/****************发送消息***************/
const sendMsgMod = ref(false);
const msgForm:any = ref({
  ip: "",
  remark: "",
  groupType: '1',
  status: "1",
});
/****************新增/编辑/查看列表***************/
const groupMod = ref(false);
const groupForm: any = ref({
  groupName: "",
  groupId: "",
  groupType: 1,
  bindMerchantCodes: [],
  msgTemplateIds: [],
  status: 0,
});
const addGroup = () => {
  groupForm.value = {
    groupName: "",
    groupId: "",
    groupType: 1,
    bindMerchantCodes: [],
    msgTemplateIds: [],
    status: 0,
  };
  groupMod.value = true;
  btnType.value = 1;
};
const isEdit = ref(false);
const editMsg = (data: any) => {
  selectedRow();
  const { id,groupName,groupId,groupType,bindMerchantCodes,msgTemplateIds,status } = data;
  groupForm.value = {id,groupName,groupId,groupType,bindMerchantCodes,status};
  groupForm.value.msgTemplateIds = msgTemplateIds.filter((item: any) => item != 0 && item != 1);
  btnType.value = 2;
  groupMod.value = true;
};
const checkDetail = (data: any) => {
  selectedRow();
  const { id,groupName,groupId,groupType,bindMerchantCodes,msgTemplateIds,status } = data;
  groupForm.value = {id,groupName,groupId,groupType,bindMerchantCodes,status};
  groupForm.value.msgTemplateIds = msgTemplateIds.filter((item: any) => item != 0 && item != 1);
  btnType.value = 3;
  groupMod.value = true;
};
const changeStatus = async (value: any) => {
  const { id, status } = value;
  console.log(id, status);
  let res:any
  if (status == 1) {
    res= await telegramGroupAdminDisable(id);
  } else {
    res= await telegramGroupAdminEnable(id);
  }
  if (res.code === "1") {
    message.success(t("s10"));
    resetQuery();
  }
}
const closeMod = () => {
  groupForm.value = {
    groupName: "",
    groupId: "",
    groupType: 1,
    bindMerchantCodes: [],
    msgTemplateIds: [],
    status: 0,
  };
  isEdit.value = false;
  groupMod.value = false;
};
const delMsg = async (value: any) => {
  const res:any = await delMerchantBindBot(value.id);
  if (res.code === "1") {
    message.success(t("s10"));
    resetQuery();
  }
};
const addBtn = async () => {
  if (groupForm.value.groupName == "") {
    return message.error(t('m562')+t('n807'));
  }
  if (groupForm.value.groupId == "") {
    return message.error(t('m562')+t('n806'));
  }
  if (![1,0].includes(groupForm.value.groupType)) {
    return message.error(t('m563')+t('n805'));
  }
  if(groupForm.value.groupType == 1){
    if (groupForm.value.bindMerchantCodes.length === 0) {
      return message.error(t('m563')+t('n811'));
    }
  }
  if (groupForm.value.msgTemplateIds.length === 0) {
    return message.error(t('m563')+t('n816'));
  }
  let res:any;
  if (btnType.value === 2) {
    res = await updateMerchantBindBot(groupForm.value);
  } else {
    res = await addMerchantBindBot(groupForm.value);
  }
  if (res.code === "1") {
    message.success(t("s8"));
    closeMod();
    resetQuery();
  }
};
const groupTypeChange:any = () => {
  groupForm.value.bindMerchantCodes = [];
  groupForm.value.msgTemplateIds = [];
}
const selNameChange:any = (value: any) => {
  query.value.bindMerchantCodes = value || [];
}
const codesChange:any = (value: any[]) => {
  groupForm.value.bindMerchantCodes = value;
}
const msgTemplateChange:any = (value: any) => {
  groupForm.value.msgTemplateIds = value;
}
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
// :deep(.ant-modal-title) {
//   text-align: center;
//   width: 100%;
//   font-weight: bold;
//   font-size: 18px; /* Adjust the font size as needed */
// }
// .ant-modal-title {
//   text-align: center;
//   width: 100%;
//   font-weight: bold;
//   font-size: 18px; /* Adjust the font size as needed */
// }
</style>
