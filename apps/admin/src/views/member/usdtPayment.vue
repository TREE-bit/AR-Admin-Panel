<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('m562')+$t('c9')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.address"
          class="searchstyle"
          :placeholder="$t('m562')+$t('userUSDTaddress')"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.deleted"
          :placeholder="$t('m563')+$t('m832')"
        >
          <a-select-option :value="1">{{ $t("m893") }}</a-select-option>
          <a-select-option :value="0">{{ $t("m894") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
      </a-col>
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
      <template v-if="column.key === 'deleted'">
        {{ record.deleted == "1" ? $t("m893") : $t("m894") }}
      </template>
      <!-- <template v-if="column.key === 'bankCode'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.bankCode}}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'createBy'">
        {{ record.updateBy || record.createBy }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'operation'">
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          >{{ $t("b23") }}
        </a-tag>
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="edit(record)"
          v-permission="'admin:usdtReceiveInfo:updateUsdtReceiveInfo'"
          >{{ $t("edit") }}
        </a-tag>
        
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="isEdit ? $t('edit') : $t('b23')"
    :footer="null"
  >
    <a-form
      :model="addForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :label="$t('m891')">
        USDT-TRC20
      </a-form-item>
      <a-form-item :label="$t('userUSDTaddress')" name="address" :rules="[{ required: true, message: ''}]">
        <a-textarea v-trim 
          :disabled="!isEdit"
          v-model:value="addForm.address"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button v-show="isEdit" type="primary" @click="update">{{
          $t("publicSubmit")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- <a-modal
    v-model:open="openDetail"
    :title="$t('l89')"
    width="900px"
    :footer="null"
  >
    <memberPaymentCheckInfo />
  </a-modal> -->
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
import { 
  listUsdtReceiveInfo,
  updateUsdtReceiveInfo,
 } from "@/api/menber";
import message from "ant-design-vue/es/message";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { payTypeData } from "@/utils/publicData";
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
  pageSize: 20,
  memberId: undefined,
  address: undefined,
  deleted: undefined,
  createTimeStart: "",
  createTimeEnd: "",
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
    title: t("userUSDTaddress"),
    dataIndex: "address",
    key: "address",
    align: "center",
    width: 200,
  },
  {
    title: t("m832"),
    dataIndex: "deleted",
    key: "deleted",
    align: "center",
    width: 120,
  },
  {
    title: t("l48"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 120,
  },
  {
    title: t("l67"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 160,
  },
  {
    title: t("operation"),
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 100,
    fixed: "right",
  },
];
const addForm = ref<any>({
  id: undefined,
  address: "",
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
  paginationConfig.pageSize = query.value.pageSize;
  paginationConfig.current = query.value.pageNo;
  const res: any = await listUsdtReceiveInfo(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data.list || [];
    paginationConfig.total = res.data.total || 0;
  }
};
const resetquery = () => {
  query.value = {
    asc: true,
    column: "",
    pageNo: 1,
    pageSize: 20,
    memberId: undefined,
    address: undefined,
    deleted: undefined,
    createTimeStart: "",
    createTimeEnd: "",
  };
  paginationConfig.current = 1;
  paginationConfig.pageSize = 20;
  clearSelected();
  getList();
};
const usdtInfoId = ref();
const edit = async (value: any) => {
  selectedRow();
  isEdit.value = true;
  const {
    id,
    address,
  } = value;
  usdtInfoId.value = id;
  addForm.value = {
    address,
  };
  addDialog.value = true;
};

const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
const update = async () => {
  if(!trc20Regex.test(addForm.value.address)){
    return message.error(t("m562")+ t("m892"));
  }
  const res: any = await updateUsdtReceiveInfo(usdtInfoId.value,addForm.value);
  if (res && res.code === "1") {
    message.success(t("s10"));
    addDialog.value = false;
    getList();
  }
};

const closedalog = () => {
  addForm.value = {
    address: undefined,
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
  const { id, address } = value;
  addForm.value.address = address;
  addDialog.value = true;
  isEdit.value = false;
};
onMounted(() => {
  // getBankList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped></style>
