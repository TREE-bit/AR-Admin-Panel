<template>
  <div class="search">
    <h2>{{ $t('m18') }}</h2>
    <a-row>
      <a-col :span="2">
        <a-input v-trim
          v-model:value="query.collectionInfoId"
          class="searchstyle"
          :placeholder="$t('n1163')"
        />
      </a-col>
      <a-col :span="2">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('c9')"
        />
      </a-col>
      <a-col :span="2" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.kycId"
          class="searchstyle"
          :placeholder="'KYC ID'"
        />
      </a-col>
      <a-col :span="2">
        <a-input v-trim
          v-model:value="query.mobileNumber"
          class="searchstyle"
          :placeholder="$t('n1162')"
        />
      </a-col>
      <a-col :span="2" v-show="isShowMoreSearch">
        <a-input v-trim
          v-model:value="query.upiId"
          class="searchstyle"
          placeholder="UPI ID"
        />
      </a-col>
      <a-col :span="2">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.collectedStatus"
          :placeholder="$t('state')"
        >
          <a-select-option value="1"> {{ $t('enabled') }} </a-select-option>
          <a-select-option value="0"> {{ $t('disabled') }} </a-select-option>
        </a-select>
      </a-col>
      <a-col v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.startUpdateTime" v-model:endTime="query.endUpdateTime" :title="$t('n1160')" :type="1"/>
      </a-col>
      <a-col v-show="isShowMoreSearch">
        <timeRange v-model:startTime="query.startCreateTime" v-model:endTime="query.endCreateTime" :title="$t('添加时间')" :type="1"/>
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
      <ArrowDownOutlined v-show="!isShowMoreSearch" @click="showMoreSearch" />
      <ArrowUpOutlined v-show="isShowMoreSearch" @click="showMoreSearch" />
      <a-button
        class="ml15"
        type="primary"
        :icon="h(SearchOutlined)"
        @click="getList(1)"
        >{{ $t("search") }}</a-button
      >
      <a-button type="primary"  @click="resetQuery">{{
        $t("reset")
      }}</a-button>
      <ExportButton
        :query="query"
        :api="collectionInfoAdminListPageExport"
        permission="admin:collectionInfoAdmin:listPageExport"
      />
          <!-- <a-button type="primary" :loading="loading" @click="exportList" v-permission="'admin:collectionInfoAdmin:listPageExport'">{{
            $t("export")
          }}</a-button> -->
    </a-row>
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :pagination="pagination"
    bordered
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'kycId'">{{ record.kycId }}
        <CopyOutlined v-if="record.kycId" class="copyId"  @click="$copyId(record.kycId)" />
        <span v-else>-</span>
      </template>
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
        <!-- {{ record.collectedStatus === "1" ? $t("publicType1") : $t("l54") }} -->
          <span :style="record.collectedStatus == '1' ? 'color:green' : 'color:red'">
            {{ record.collectedStatus == "1" ? $t('enabled') : $t('disabled') }}
          </span>
      </template>
      <template v-if="column.key === 'type'">
        {{ record.type ? $t($getMapItem(payTypeData,record.type)) : '-' }}
      </template>
      <template v-if="column.key === 'upiId'">
        <a-tooltip>
          <template #title>{{ record.type == 3 ? record.upiId : record.bankCardNumber }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.type == 3 ? record.upiId : record.bankCardNumber }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operatorType'">
        {{ $getMapItem(operationContentMap,record.operatorType) || '-' }}
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
      <!-- <template v-if="column.key === 'ifscCode'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.ifscCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.ifscCode}}</div>
        </a-tooltip>
      </template> -->
      <!-- <template v-if="column.key === 'email'">
        <div v-if="record.type == 3"> {{ '-' }} </div>
        <a-tooltip v-if="record.type == 1">
          <template #title>{{ record.email }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{record.email}}</div>
        </a-tooltip>
      </template> -->
      <template v-if="column.key === 'memberAccount'">
        <a-tooltip>
          <template #title>{{ record.memberAccount }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.memberAccount }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || '-' }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || '-' }}
      </template>
      <template v-if="column.key === 'operation'">
        <div class="paymentBox1">
          <!-- 连接日志 -->
          <a-tag 
            color="rgba(14, 186, 139, 1)"
            style="cursor: pointer"
            size="small"
          @click="openConnectLog(record)">{{ $t('n1152') }}</a-tag>
          <!-- 操作日志 -->
          <a-tag 
            color="rgba(14, 186, 139, 1)"
            style="cursor: pointer"
            size="small"
          @click="openOperationLog(record)">{{ $t('n1149') }}</a-tag>
        </div>
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:collectionInfoAdmin:getInfo2'"
          >{{ $t("b23") }}
        </a-tag>
        <div class="paymentBox2">
          <!-- 编辑 -->
          <a-tag
            :color="record.kycId ? 'rgba(22, 155, 213, 1)' : 'rgba(212, 216, 218, 1)'"
            :style="record.kycId ? 'cursor: pointer' : 'cursor: not-allowed'"
            size="small"
            @click="record.kycId && edit(record)"
            v-permission="'admin:collectionInfoAdmin:update2'"
            >{{ $t("edit") }}
          </a-tag>
          <!-- <a-popconfirm
            :title="record.collectedStatus == '1' ? $t('m768') : $t('m767')"
            :ok-text="$t('b9')"
            :cancel-text="$t('b10')"
            @confirm="changeStatus(record)"
          > -->
          <!-- 禁用、启用 -->
            <a-tag
              :color="record.collectedStatus == '1' ? 'red' : 'rgba(14, 186, 139, 1)'"
              style="cursor: pointer"
              size="small"
              v-permission="'admin:collectionInfoAdmin:disable2'"
              @click="record.collectedStatus == '1'?showChangeDis(record,4):showChangeDis(record,5)"
              >{{ record.collectedStatus == "1" ? $t('disabled') : $t('enabled') }}
            </a-tag>
            <!-- </a-popconfirm> -->
            <!-- 删除 -->
            <a-popconfirm
              :title="$t('t7')"
              :ok-text="$t('yes')"
              :cancel-text="$t('no')"
              @confirm="delC(record)"
            >
              <template #icon
                ><question-circle-outlined style="color: red"
              /></template>
              <a-tag color="red"
                style="cursor: pointer"
                size="small"
                v-permission="'admin:collectionInfoAdmin:deletepayment'">
                {{ $t("b11") }}</a-tag>
            </a-popconfirm>
        </div>
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
        <a-form-item :label="$t('c9')" name="memberId">
          <a-input v-trim v-model:value="addForm.memberId" disabled />
        </a-form-item>
        <a-form-item label="UPI ID" name="upiId" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.upiId" class="w100" />
        </a-form-item>
        <!-- <a-form-item label="UPI Name" name="UPI Name" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addForm.upiName" class="w100" />
        </a-form-item> -->
        <a-form-item :label="$t('l35')" name="mobileNumber">
          <a-input-number v-model:value="addForm.mobileNumber" class="w100" />
        </a-form-item>
      </a-group>

      <a-group v-if="addForm.type == 1">
        <a-form-item :label="$t('c9')" name="memberId">
          <a-input v-trim v-model:value="addForm.memberId" disabled />
        </a-form-item>
        <a-form-item :label="$t('m581')" name="bankCode" :rules="[{ required: true, message: ''}]">
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
  <!-- kyc连接日志 -->
<a-modal
  v-model:open="connectModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelConnectLog"
  >
  <kycConnectLog
    v-if="connectModel"
    :bankCode="bankCode"
    :phoneNumber="phoneNumber"
    />
  </a-modal>
  <!-- 操作日志 -->
<a-modal
  v-model:open="operationModel"
  :footer="null"
  wrap-class-name="full-modal"
  width="100%"
  @cancel="cancelOperationLog"
  >
  <payInfoOperationLog
    v-if="operationModel"
    :upiId="upiId"
    />
    <div style="text-align: center; margin-top: 15px;">
      <a-button type="default" @click="cancelOperationLog">{{ $t('l54') }}</a-button>
    </div>
  </a-modal>
  <!-- 启用、禁用 -->
  <a-modal
    v-model:open="showPayInfoDis"
    :footer="null"
  >
    <div v-if="payInfoData.status == 4" style="margin-top: 25px;">
      <span style="color: red; margin-right: 4px;">*</span>
      <span>{{ $t('n1151') }}：</span>
      <a-select 
        v-model:value="payInfoData.timeRangeType"
        style="width: 300px;"
        :options="Object.keys(timeRangeTypeMap).map(key => ({ label: $t(timeRangeTypeMap[key]), value: Number(key) }))"
      >
      </a-select>
    </div>
    <div style="margin-top: 15px; display: flex; align-items: flex-start;">
      <span style="color: red; margin-right: 4px;">*</span>
      <a-textarea
        v-model:value="payInfoData.remark"
        v-trim
        style="width: 400px;"
        :rows="4"
        :maxlength="200"
        :placeholder="$t('pleaseEnter') + $t('remark')"
      ></a-textarea>
    </div>
    <div style="margin-top: 25px; text-align: center;">
      <a-button @click="closePayInfoDis">{{ $t("b10") }}</a-button>
      <a-button type="primary" style="margin-left: 10px" :loading="loading" @click="confirmChangeStatus">{{ $t("b28") }}</a-button>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, h } from "vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { SearchOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons-vue";
import { useMember } from "@/hooks/useMember.hook";
import memberPaymentCheckInfo from "@/components/Member/getMemberPaymentInfo.vue";
import payInfoOperationLog from "@/components/Member/payInfoOperationLog.vue";
import { memberPaymentList, editMemberPaymentList, 
  delcollectionInfoAdmin,
  getBankCodeMap, memberPaymentenable, memberPaymentDisable,
  collectionInfoAdminUpdateStatus } from "@/api/menber";
  import { collectionInfoAdminListPageExport } from "@/api/export";
import message from "ant-design-vue/es/message";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { payTypeData, upiIdReg, timeRangeTypeMap, operationContentMap } from "@/utils/publicData";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import kycConnectLog from "@/components/Kyc/kycConnectLog.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const { paginationConfig } = usePagination();
// const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
const query = ref({
  asc: false,
  column: "",
  pageNo: 1,
  pageSize: 20,
  upiId: undefined,
  collectionInfoId: undefined,
  mobileNumber: undefined,
  // upiName: "",
  // bankCode: null,
  // bankName: "",
  // type: null,
  memberId: undefined,
  // bankCardOwner: "",
  // bankCardNumber: "",
  version: 2,
  collectedStatus: undefined,
  kycId: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
  startCreateTime: '',
  endCreateTime: '',
  startUpdateTime: '',
  endUpdateTime: '',
});
const isShowMoreSearch = ref(false);
const showMoreSearch = () => {
  isShowMoreSearch.value = !isShowMoreSearch.value;
  setTimeout(() => {
    getTabH.value = useTabHeight().getTabH.value;
  },100)
}
const addDialog = ref(false);
const isEdit = ref(false);
// const dataSource = ref([]);
// const extendData = ref<any>({});
const peymentStatus = ref({
  3: t("m168"),
  1: t("m166"),
})
const bankList = <any>ref({})
const bankListData = <any>ref([])
const columns:any = [
  {
    title: t("n1163"),
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 100,
    fixed: "left",
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
    fixed: "left",
  },
  {
    title: "KYC ID",
    dataIndex: "kycId",
    key: "kycId",
    align: "center",
    width: 180,
    fixed: "left",
  },
  {
    title: t("n1162"),
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    align: "center",
    width: 150,
    fixed: "left",
  },
  {
    title: 'UPI ID',
    dataIndex: "upiId",
    key: "upiId",
    align: "center",
    width: 180,
    fixed: "left",
  },
  {
    title: t("state"),
    dataIndex: "collectedStatus",
    key: "collectedStatus",
    align: "center",
    width: 100,
    fixed: "left",
  },
  // {
  //   title: t("m656"),
  //   dataIndex: "type",
  //   key: "type",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: t("c10"),
  //   dataIndex: "memberAccount",
  //   key: "memberAccount",
  //   align: "center",
  //   width: 180,
  // },
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
  // {
  //   title: t("m223"),
  //   dataIndex: "createBy",
  //   key: "createBy",
  //   align: "center",
  //   width: 120,
  // },
  {
    title: t("l70"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n1160"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n1161"),
    dataIndex: "operatorType",
    key: "operatorType",
    align: "center",
    width: 120,
  },
  {
    title: t("m814"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 120,
  },
  {
    title: t("operation"),
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 220,
    fixed: "right",
  },
];
const addForm = ref<any>({
  id: undefined,
  bankCardNumber: undefined,
  bankCardOwner: undefined,
  bankCode: undefined,
  bankName: undefined,
  ifscCode: undefined,
  email: undefined,
  memberId: undefined,
  mobileNumber: undefined,
  type: undefined,
  upiId: undefined,
  collectedStatus: undefined,
  // upiName: null,
});
const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields:(q) => ({
    ...q,
    version: 2,
  }),
  api: memberPaymentList,
  defaultPageSize: 20,
  filterRules: [],
});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (isFirst:any = null) => {
//   if (isFirst) {
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }
//   loading.value = true;
  
//     const queryPageNo = query.value.pageNo;
//     queryCount.value = queryPageNo - oldPageNo.value;
//     if(query.value.pageNo == 1){
//       query.value.firstPage = true;
//       query.value.lastPage = false;
//       resetPageQuery();
//     }else if(query.value.pageNo == pageCurrent.value){
//       query.value.firstPage = false;
//       query.value.lastPage = true;
//       resetPageQuery();
//     }else if(queryCount.value > 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'next';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }else if(queryCount.value <= 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'prev';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }
//   // query.value.bankName = query.value.bankCode ? bankList.value[query.value.bankCode] : null;
//   const res: any = await memberPaymentList(query.value).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data || [];
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     paginationConfig.current = query.value.pageNo;
//     paginationConfig.pageSize = query.value.pageSize;
//     paginationConfig.total = res.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await memberPaymentList(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
// // const getBankList = async () => {
// //   const res: any = await getBankCodeMap();
// //   if (res && res.code === "1") {
// //     bankList.value = res.data || {};
// //     Object.keys(res.data).map((item:any)=>{
// //       bankListData.value.push({code:item,value:res.data[item]});
// //     });
// //   }
// // }
// const resetquery = () => {
//   query.value = {
//     asc: false,
//     column: "",
//     pageNo: 1,
//     pageSize: 20,
//     upiId: undefined,
//     // upiName: "",
//     // bankCode: null,
//     // bankName: "",
//     // type: null,
//     memberId: undefined,
//     // bankCardOwner: "",
//     // bankCardNumber: "",
//     version: 2,
//     collectedStatus: undefined,
//     kycId: undefined,
//     mobileNumber: undefined,
//     startCreateTime: '',
//     endCreateTime: '',
//     startUpdateTime: '',
//     endUpdateTime: '',
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   paginationConfig.current = 1;
//   paginationConfig.pageSize = 20;
//   clearSelected();
//   getList();
// };
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
    collectedStatus,
    kycId,
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
    collectedStatus,
    kycId,
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
    bankCardNumber: undefined,
    bankCardOwner: undefined,
    bankName: undefined,
    bankCode: undefined,
    ifscCode: undefined,
    email: undefined,
    memberId: undefined,
    mobileNumber: undefined,
    type: undefined,
    upiId: undefined,
    collectedStatus: undefined,
    // upiName: undefined,
  };
  isEdit.value = false;
  addDialog.value = false;
};

// 启用、禁用
const showPayInfoDis = ref(false);
const payInfoData = ref({
  id: undefined,
  status: undefined,
  timeRangeType: 1 as any,
  remark: undefined,
});
const showChangeDis = (val:any,collectedStatus:any) => {
  const { id} = val;
  payInfoData.value.id = id;
  payInfoData.value.status = collectedStatus;
  payInfoData.value.timeRangeType = collectedStatus == 4 ? 1 : undefined;
  showPayInfoDis.value = true;
  
};

const closePayInfoDis = () => {
  showPayInfoDis.value = false;
  payInfoData.value = {
    id: undefined,
    status: undefined,
    timeRangeType: 1,
    remark: undefined,
  };
};
const confirmChangeStatus = async () => {
  let res: any;
  if(!payInfoData.value.remark){
    message.error(t("m562") + t("remark"));
    return;
  }
  loading.value = true;
  res = await collectionInfoAdminUpdateStatus(payInfoData.value).finally(() => loading.value = false);
  if (res && res.code == "1") {
    message.success(t("s10"));
    closePayInfoDis();
    await getList();
  }
}
// const changeStatus = async (val: any) => {
//   const { id, collectedStatus} = val;
//   let res;
//   loading.value = true;
//   if(collectedStatus == '1'){
//     res = await memberPaymentDisable( id ).finally(() => loading.value = false);
//   } else {
//     res = await memberPaymentenable( id ).finally(() => loading.value = false);
//   }
//   if (res && res.code == "1") {
//     message.success(t("s10"));
//     getList();
//   }
// }

// 打开连接日志
const connectModel = ref(false);
const bankCode = ref("");
const phoneNumber = ref("");
const openConnectLog = (value: any) => {
  bankCode.value = value.bankCode;
  phoneNumber.value = value.mobileNumber;
  connectModel.value = true;
};
const cancelConnectLog = () => {
  connectModel.value = false;
  bankCode.value = "";
  phoneNumber.value = "";
};
// 打开操作日志
const operationModel = ref(false);
const upiId = ref("");;
const openOperationLog = (value: any) => {
  upiId.value = value.upiId;
  operationModel.value = true;
};
const cancelOperationLog = () => {
  operationModel.value = false;
  upiId.value = "";
};
// 删除

const delC = async (value: any) => {
  const res: any = await delcollectionInfoAdmin({ id: value.id });
  if (res && res.code === "1") {
    message.success(t("s10"));
    await getList();
  }
};

// const getChange = async (value: any) => {
//   const { current, pageSize } = value;
//   if(pageSize != paginationConfig.pageSize){
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }else{
//     query.value.pageNo = current;
//     paginationConfig.current = current;
//   }
//   query.value.pageSize = pageSize;
//   paginationConfig.pageSize = pageSize;
//   await getList();
// };
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
const exportList = async () => {
  const data = JSON.parse(JSON.stringify(query.value));
  loading.value = true;
  const res: any = await collectionInfoAdminListPageExport(data).finally(() => {
    loading.value = false;
  });
  if (res.code == "1") {
    message.success(t("n545"));
  }
};
onMounted(() => {
  // getBankList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
  .paymentBox2{
    margin-top: 8px;
  }
</style>
