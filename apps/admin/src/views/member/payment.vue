<template>
  <div class="search">
    <a-row>
      <!-- <a-col :span="4">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.type"
          :placeholder="$t('m563')+$t('m656')"
        >
          <a-select-option
            v-for="(item, key) in peymentStatus"
            :value="key"
            :key="item"
            >{{ $t(item) }}</a-select-option
          >
        </a-select>
      </a-col> -->
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          placeholder="UPI ID"
        />
      </a-col>
      <!-- <a-col :span="4">
        <a-input v-trim
          v-model:value="query.upiName"
          class="searchstyle"
          placeholder="UPI Name"
        />
      </a-col> -->
      <!-- <a-col :span="4">
        <a-input
          v-model:value="query.bankCardOwner"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m663')"
        />
      </a-col> -->
      <!-- <a-col :span="4">
        <a-input
          v-model:value="query.bankCardNumber"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m652')"
        />
      </a-col> -->
      <!-- <a-col :span="4">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.bankCode"
          :placeholder="$t('m563')+$t('m581')"
        >
          <a-select-option v-for="(item, index) in bankList" :key="index" :value="index">
          {{ item }}
          </a-select-option>
        </a-select>
      </a-col> -->
      <a-button
        class="ml15"
        type="primary"
        :icon="h(SearchOutlined)"
        @click="getList(1)"
        >{{ $t("search") }}</a-button
      >
      <a-button type="primary" danger @click="resetquery">{{
        $t("reset")
      }}</a-button>
    </a-row>
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :pagination="paginationConfig"
    bordered
    @change="getChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'memberId'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.memberId }}</a-button
        >
        <CopyOutlined v-if="record.memberId" class="copyId"  @click="$copyId(record.memberId)" />
      </template>
      <template v-if="column.key === 'collectedStatus'">
        {{ record.collectedStatus === "1" ? $t("publicType1") : $t("l54") }}
      </template>
      <template v-if="column.key === 'type'">
        {{ $t(payTypeData[Number(record.type)]) }}
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip>
          <template #title>{{ record.type == 3 ? record.upiId : record.bankCardNumber }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.type == 3 ? record.upiId : record.bankCardNumber }}</div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'upiName'">
        <a-tooltip>
          <template #title>{{ record.type == 3 ? record.upiName : record.bankCardOwner }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.type == 3 ? record.upiName : record.bankCardOwner }}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'bankName'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.bankName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.bankName}}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankCode'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.bankCode}}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'ifscCode'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.ifscCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.ifscCode}}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'email'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.email }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.email}}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip>
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operation'">
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:collectionInfoAdmin:getInfo'"
          >{{ $t("b23") }}
        </a-tag>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="edit(record)"
          v-permission="'admin:collectionInfoAdmin:update'"
          >{{ $t("edit") }}
        </a-tag>
        
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="isEdit ? $t('edit') : $t('add')"
    :footer="null"
  >
    <a-form
      :model="addForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-group v-if="addForm.type == 3">
        <a-form-item :label="$t('c9')" name="Member Id">
          <a-input v-trim v-model:value="addForm.memberId" disabled />
        </a-form-item>
        <a-form-item label="UPI ID" name="UPI ID " :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.upiId" class="w100" />
        </a-form-item>
        <!-- <a-form-item label="UPI Name" name="UPI Name" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.upiName" class="w100" />
        </a-form-item> -->
        <a-form-item :label="$t('l35')" name="Phone Number">
          <a-input-number v-model:value="addForm.mobileNumber" class="w100" />
        </a-form-item>
      </a-group>

      <a-group v-if="addForm.type == 1">
        <a-form-item :label="$t('c9')" name="Member Id">
          <a-input v-trim v-model:value="addForm.memberId" disabled />
        </a-form-item>
        <a-form-item :label="$t('m581')" name="UPI Name" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="addForm.bankCode"
            :placeholder="$t('m563')+$t('m581')"
          >
            <a-select-option v-for="(item, index) in bankListData" :key="index" :value="item.code">
            {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('m652')" name="bankCardNumber" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.bankCardNumber" class="w100" />
        </a-form-item>
        <a-form-item :label="$t('m662')" name="bankCardOwner" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.bankCardOwner" class="w100" />
        </a-form-item>
        <a-form-item :label="$t('ifscCode')" name="ifscCode" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.ifscCode" class="w100" />
        </a-form-item>
        <a-form-item :label="$t('m591')" name="mobileNumber">
          <a-input v-trim v-model:value="addForm.mobileNumber" class="w100" />
        </a-form-item>
        <a-form-item :label="$t('l63')" name="email">
          <a-input v-trim v-model:value="addForm.email" class="w100" />
        </a-form-item>
      </a-group>

      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="update">{{
          $t("publicSubmit")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="openDetail"
    :title="$t('l89')"
    width="900px"
    :footer="null"
  >
    <memberPaymentCheckInfo />
  </a-modal>
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <MemberDetail 
    v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.memberId"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, h } from "vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useMember } from "@/hooks/useMember.hook";
import memberPaymentCheckInfo from "@/components/Member/getMemberPaymentInfo.vue";
import { memberPaymentList, editMemberPaymentList, getBankCodeMap } from "@/api/menber";
import message from "ant-design-vue/es/message";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { payTypeData, upiIdReg } from "@/utils/publicData";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { version } from "nprogress";
const { getTabH } = useTabHeight();
const { t } = useI18n();
const { paginationConfig } = usePagination();
const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref<any>({
  asc: true,
  column: "",
  pageNo: 1,
  pageSize: 10,
  upiId: "",
  // upiName: "",
  bankCode: null,
  bankName: "",
  type: null,
  memberId: "",
  bankCardOwner: "",
  bankCardNumber: "",
  version: 1,
});
const addDialog = ref(false);
const isEdit = ref(false);
const dataSource = ref([]);
const peymentStatus = ref({
  3: t("m168"),
  1: t("m166"),
})
const bankList = <any>ref({})
const bankListData = <any>ref([])
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 100,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t("m656"),
    dataIndex: "type",
    key: "type",
    align: "center",
    width: 150,
  },
  // {
  //   title: t("c10"),
  //   dataIndex: "memberAccount",
  //   key: "memberAccount",
  //   align: "center",
  //   width: 180,
  // },
  {
    title: t("l35"),
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    align: "center",
    width: 150,
  },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
  },
  // {
  //   title: 'UPI Name',
  //   dataIndex: "upiName",
  //   key: "upiName",
  //   align: "center",
  //   width: 180,
  // },
  // {
  //   title: t("m581"),
  //   dataIndex: "bankName",
  //   key: "bankName",
  //   align: "center",
  //   width: 180,
  // },
  // {
  //   title: t('m651'),
  //   dataIndex: "bankCode",
  //   key: "bankCode",
  //   align:"center",
  //   width: 180,
  // },
  // {
  //   title: "ifscCode",
  //   dataIndex: "ifscCode",
  //   key: "ifscCode",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: t("l63"),
  //   dataIndex: "email",
  //   key: "email",
  //   align: "center",
  //   width: 180,
  // },
  {
    title: t("m660"),
    dataIndex: "collectedAmount",
    key: "collectedAmount",
    align: "center",
    width: 150,
  },
  {
    title: t("m661"),
    dataIndex: "collectedNumber",
    key: "collectedNumber",
    align: "center",
    width: 150,
  },
  {
    title: t("l70"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 180,
  },
  {
    title: t("state"),
    dataIndex: "collectedStatus",
    key: "collectedStatus",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 140,
    fixed: "right",
  },
];
const addForm = ref<any>({
  id: undefined,
  bankCardNumber: "",
  bankCardOwner: "",
  bankCode: "",
  bankName: "",
  ifscCode: "",
  email: "",
  memberId: "",
  mobileNumber: null,
  type: undefined,
  upiId: null,
  // upiName: null,
});
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
const getList = async (isFirst:any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    paginationConfig.current = 1;
  }
  loading.value = true;
  // query.value.bankName = query.value.bankCode ? bankList.value[query.value.bankCode] : null;
  const res: any = await memberPaymentList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data || [];
    paginationConfig.total = res.total || 0;
  }
};
// const getBankList = async () => {
//   const res: any = await getBankCodeMap();
//   if (res && res.code === "1") {
//     bankList.value = res.data || {};
//     Object.keys(res.data).map((item:any)=>{
//       bankListData.value.push({code:item,value:res.data[item]});
//     });
//   }
// }
const resetquery = () => {
  query.value = {
    asc: true,
    column: "",
    pageNo: 1,
    pageSize: 10,
    upiId: "",
    // upiName: "",
    bankCode: null,
    bankName: "",
    type: null,
    memberId: "",
    bankCardOwner: "",
    bankCardNumber: "",
    version: 1,
  };
  paginationConfig.current = 1;
  paginationConfig.pageSize = 10;
  clearSelected();
  getList();
};
const edit = async (value: any) => {
  selectedRow();
  isEdit.value = true;
  const {
    id,
    bankCardNumber,
    bankCardOwner,
    bankName,
    bankCode,
    ifscCode,
    email,
    memberId,
    mobileNumber,
    type,
    upiId,
    // upiName,
  } = value;
  addForm.value = {
    id,
    bankCardNumber,
    bankCardOwner,
    bankName,
    bankCode,
    ifscCode,
    email,
    memberId,
    mobileNumber,
    type,
    upiId,
    // upiName,
  };
  addDialog.value = true;
};
const update = async () => {
  // addForm.value.bankName = bankList.value[addForm.value.bankCode];

  if(addForm.value.type === 3){
    if(!addForm.value.upiId){
      return message.error(t("m562")+"UPI ID");
    }
    if(!upiIdReg.test(addForm.value.upiId)){
      return message.error("UPI ID " + t("n283"));
    }
    // if(addForm.value.upiName.trim() === ""){
    //   return message.error(t("m562")+"UPI Name");
    // }
  }
  if(addForm.value.type === 1){
    if(addForm.value.bankCode.trim() === ""){
      return message.error(t("m563")+t("m581"));
    }
    if(addForm.value.bankCardNumber.trim() === ""){
      return message.error(t("m562")+t("m652"));
    }
    if(addForm.value.bankCardOwner.trim() === ""){
      return message.error(t("m562")+t("m662"));
    }
    if(addForm.value.ifscCode.trim() === ""){
      return message.error(t("m562")+"ifscCode");
    }
  }
  const res: any = await editMemberPaymentList(addForm.value);
  if (res && res.code === "1") {
    message.success(t("s10"));
    addDialog.value = false;
    getList();
  }
};

const closedalog = () => {
  addForm.value = {
    id: undefined,
    bankCardNumber: "",
    bankCardOwner: "",
    bankName: "",
    bankCode: "",
    ifscCode: "",
    email: "",
    memberId: "",
    mobileNumber: null,
    type: undefined,
    upiId: null,
    upiName: null,
  };
  isEdit.value = false;
  addDialog.value = false;
};
const getChange = async (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.current = current;
  paginationConfig.pageSize = pageSize;
  await getList();
};
const { getDetail } = useMember();
const openDetail = ref(false);
const detailObj = ref<any>({});
const checkDetail = (value: any) => {
  selectedRow();
  const { id } = value;
  getDetail({ id });
  openDetail.value = true;
  detailObj.value = value;
};
onMounted(() => {
  // getBankList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped></style>
