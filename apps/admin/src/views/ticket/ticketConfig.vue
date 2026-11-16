<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col>
        <a-button
          type="primary"
          @click="showAddTicket()"
          v-permission="'admin:workOrderConfig:save'"
          >{{ $t("n1036") }}</a-button
        >
        <a-button type="primary" @click="actionHistroy">{{
          $t("n1037")
        }}</a-button>
        <a-button type="primary" @click="setTicketType">{{
          $t("n960")
        }}</a-button>
        <a-button type="primary" @click="setOperationPermis">{{
          $t("n1038")
        }}</a-button>
      </a-col>
    </a-row>
    <a-row style="margin-top: 6px;">
      <a-col :span="3">
        <a-input
          v-trim
          v-model:value="query.workOrderName"
          :allowClear="true"
          class="searchstyle"
          :placeholder="$t('m562')+$t('n955')"
        ></a-input>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          v-model:value="query.orderRelation"
          :placeholder="$t('m563')+$t('n957')"
          class="searchstyle"
          :options="Object.entries(orderRelationMap).map(([key, value]:[any,any]) => ({ label: value, value: Number(key) }))"></a-select>
      </a-col>
      <a-col >
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime"  :title="$t('n977')" :type="1"/>
      </a-col>
      <a-col>
        <a-button  type="primary" :loasing="loading" @click="getList(1)">{{ $t('search') }}</a-button>
        <a-button  type="primary" :loasing="loading" @click="reset">{{ $t('reset') }}</a-button>
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
      <template v-if="column.key === 'loginLimit'">
        {{ record.loginLimit == 0 ? $t('n959') : $t('m704') }}
      </template>
      <template v-if="column.key === 'status'">
        <a-switch
          :disabled="!hasPermission('admin:rechargeFailureForAdmin:updateStatus')"
          :checked="record.status == 1 ? true : false"
          @change="switchSale($event, record)"
        />
      </template>
      <template v-if="column.key === 'orderRelation'">
        {{ $getMapItem(orderRelationMap,record.orderRelation)|| '-' }}
      </template>
      <template v-if="column.key === 'workOrderName'">
        <a-tooltip>
          <template #title>{{ record.workOrderName }}</template>
          <div class="toopTipStyle">
              {{ record.workOrderName }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'workOrderTypeName'">
        <a-tooltip>
          <template #title>{{ record.workOrderTypeName }}</template>
          <div class="toopTipStyle">
              {{ record.workOrderTypeName }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'materialItems'">
        <a-tooltip v-if="record.materialItems">
          <template #title>
              <span v-for="(item,index) in record.materialItems.split(',')" :key="index">
                {{ materialItemsMap[item] }}
                <span v-if="index != record.materialItems.split(',').length-1">,</span>
              </span>
          </template>
          <div class="toopTipStyle">
              <span v-for="(item,index) in record.materialItems.split(',')" :key="index">
                {{ materialItemsMap[item] }}
                <span v-if="index != record.materialItems.split(',').length-1">,</span>
              </span>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'remark'">
        <a-tooltip>
          <template #title>{{ record.remark }}</template>
          <div class="toopTipStyle">
              {{ record.remark }}
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key ==='createBy'">
        {{ record.updateBy || record.createBy || '-' }}
      </template>
      <template v-if="column.key ==='createTime'">
        {{ record.updateTime || record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditTicket(record)"
          v-permission="'admin:rechargeFailureForAdmin:update'"
          >{{ $t("edit") }}
        </a-tag>
        <a-popconfirm
          :title="$t('t16')"
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="deleteTicket(record.id)"
          :ok-button-props="{ loading: loading }"
        >
          <a-tag
            color="rgb(253, 11, 26)"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:rechargeFailureForAdmin:delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
    <!-- <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'phoneNumber'"
        />
    </template> -->
  </a-table>
  <!-- 添加/编辑工单 -->
   <a-modal
    v-model:open="addTicketVisible"
    :destroyOnClose="true"
    :footer="null"
    :width="900"
    centered
    wrapClassName="custom-modal"
  >
    <template #title>
      <div style="font-size: 16px;text-align: center; font-weight: 600;">
        {{ isAdd ? $t("n986") : $t("n987") }}
      </div>
      <div style="text-align: center;">
        <a-button :type="isShowEnglish ? 'primary' : 'default'" @click="selectLang('1')" style="width: 100px;">English</a-button>
        <a-button :type="!isShowEnglish ? 'primary' : 'default'" @click="selectLang('2')" style="width: 100px;margin-left: 10px;">हिंदी</a-button>
      </div>
    </template>
    <a-row
      :gutter="[16, 16]"
    >
      <a-col :span="11" class="formItemBox">
        <div class="ant-form-item" v-if="isShowEnglish">
          <div class="ant-form-item-label">
            <label><span class="requiredRed">*</span>{{ $t("n955") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-input v-model:value="workOrderNameEn" :placeholder="$t('m562')+$t('n955')" />
          </div>
        </div>
        <div class="ant-form-item" v-if="!isShowEnglish">
          <div class="ant-form-item-label">
            <label><span class="requiredRed">*</span>{{ $t("n955") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-input v-model:value="workOrderNameHi" :placeholder="$t('m562')+$t('n955')" />
          </div>
        </div>
        <div class="ant-form-item">
          <div class="ant-form-item-label" style="line-height: 36px;">
            <label><span class="requiredRed">*</span>{{ $t("n956") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-input-number
              v-model:value="ticketForm.sort"
              style="width: 100%;height: 32px;"
              :min="1"
              :placeholder="$t('m562')+$t('n956')"
            />
          </div>
        </div>
        <div class="ant-form-item">
          <div class="ant-form-item-label">
            <label><span class="requiredRed">*</span>{{ $t("n957") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-select
              v-model:value="ticketForm.orderRelation"
              style="width: 100%;"
              :placeholder="$t('m563')+$t('n957')"
              :options="Object.keys(orderRelationMap).map(key => ({ label: orderRelationMap[key], value: Number(key) }))"
            ></a-select>
          </div>
        </div>
        <div class="ant-form-item">
          <div class="ant-form-item-label">
            <label><span class="requiredRed">*</span>{{ $t("n958") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-radio-group v-model:value="ticketForm.loginLimit">
              <a-radio :value="0">{{ $t("n959") }}</a-radio>
              <a-radio :disabled="isNoLogin" :value="1">{{ $t("m704") }}</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="ant-form-item">
          <div class="ant-form-item-label">
            <label><span class="requiredRed">*</span>{{ $t("n960") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-select v-model:value="ticketForm.workOrderTypeId" style="width: 100%;" :placeholder="$t('m563')+$t('n960')">
              <a-select-option
                v-for="item in workOrderTypeList"
                :key="item.workOrderTypeId"
                :value="item.workOrderTypeId"
                >{{ item.workOrderTypeName }}</a-select-option
              >
            </a-select>
          </div>
        </div>
        <div class="ant-form-item">
          <div class="ant-form-item-label">
            <label>{{ $t("remark") }}:</label>
          </div>
          <div class="ant-form-item-explain">
            <a-textarea
              v-model:value="ticketForm.remark"
              :placeholder="$t('m562')+$t('remark')"
              :rows="2"
              :maxLength="200"
            />
          </div>
        </div>
        <div class="ticketH5ItemAddBtn" v-if="!isAdditem">
          <a-button type="primary" @click="isAdditem = true">
            +{{ $t("n961") }}
          </a-button>
        </div>
        <div class="ticketH5ItemOptions" v-if="isAdditem">
          <div v-for="(item, index) in itemListMap" :key="index">
            <div class="ticketH5ItemOptionsItem" @click="addH5Item(index)">
              {{ item }}
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12" class="formItemBox" style="margin-left: auto;">
        <div class="ticketH5ItemBox-label">
          <label><span class="requiredRed">*</span>{{ $t("n962") }}:</label>
        </div>
        <div class="ticketH5ItemBox">
        <!-- 英文版 -->
        <draggable
          v-if="englishForm.length && isShowEnglish"
          v-model="englishForm"
          item-key="labelId"
          animation="200"
          handle=".drag-handle"
          @end="onEnglishDragEnd"
        >
          <template #item="{ element, index }">
            <div class="ticketH5Item">
              <div class="ticketH5Item-label">
                <span class="drag-handle" style="cursor: move;">⠿</span>
                {{ $t('n962') + (index + 1) }}
              </div>
              <div class="ticketH5Item-content">
                <div class="ticketH5Item-input">
                  <!-- :disabled="mustSelect!=0 && (element.labelId==mustSelect|| element.labelId==mustSelect+1)" -->
                  <input
                    :placeholder="element.labelTitle"
                    size="small"
                    v-model="element.labelTitle"
                  />
                </div>
                <div v-if="[1,2,3,7,8].includes(Number(element.type))" class="ticketH5Item-placeholder">
                  {{ $t("m562") + element.labelTitle }}
                </div>
                <input
                  v-if="[4,5,6].includes(Number(element.type))" class="ticketH5Item-placeholder"
                  :placeholder="$t('n963')"
                  size="small"
                  v-model="element.notes"
                />
                <div v-if="element.type==6" class="ticketH5Item-placeholder">
                  {{ $t("n964") }}
                </div>
                <div>
                  <FileImageFilled class="ticketH5Item-uploadIcon" v-if="element.type == 4" />
                  <VideoCameraFilled class="ticketH5Item-uploadIcon" v-if="element.type == 5" />
                  <FilePptFilled class="ticketH5Item-uploadIcon" v-if="element.type == 6" />
                </div>
                <div class="ticketH5Item-required">
                  <a-checkbox
                    :disabled="mustSelect!=0 && (element.labelId==mustSelect|| element.labelId==mustSelect+1)"
                    v-model:checked="element.isRequired"
                    @click="checkedRequired(index,$event,'en')"
                    :true-value="1"
                    :false-value="0"
                  >
                    {{ $t("n965") }}
                  </a-checkbox>
                </div>
                <div class="ticketH5Item-delete">
                  <a-button
                    type="primary"
                    danger
                    size="small"
                    @click="delTicketH5Item(index)"
                    v-if="mustSelect==0 || (element.labelId!=mustSelect && element.labelId!=mustSelect+1)"
                  >
                    {{ $t("b11") }}
                  </a-button>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <!-- 印地语版 -->
        <draggable
          v-if="hindiForm.length && !isShowEnglish"
          v-model="hindiForm"
          item-key="labelId"
          animation="200"
          handle=".drag-handle"
          @end="onHindiDragEnd"
        >
          <template #item="{ element, index }">
            <div class="ticketH5Item">
              <div class="ticketH5Item-label">
                <span class="drag-handle" style="cursor: move;">⠿</span>
                {{ $t('n962') + (index + 1) }}
              </div>
              <div class="ticketH5Item-content">
                <div class="ticketH5Item-input">
                  <!-- :disabled="mustSelect!=0 && (element.labelId==mustSelect|| element.labelId==mustSelect+1)" -->
                  <input
                    :placeholder="element.labelTitle"
                    size="small"
                    v-model="element.labelTitle"
                  />
                </div>
                <div v-if="[1,2,3,7,8].includes(Number(element.type))" class="ticketH5Item-placeholder">
                  {{ $t("m562") + element.labelTitle }}
                </div>
                <input
                  v-if="[4,5,6].includes(Number(element.type))" class="ticketH5Item-placeholder"
                  :placeholder="$t('n963')"
                  size="small"
                  v-model="element.notes"
                />
                <div v-if="element.type==6" class="ticketH5Item-placeholder">
                  {{ $t("n964") }}
                </div>
                <div>
                  <FileImageFilled class="ticketH5Item-uploadIcon" v-if="element.type == 4" />
                  <VideoCameraFilled class="ticketH5Item-uploadIcon" v-if="element.type == 5" />
                  <FilePptFilled class="ticketH5Item-uploadIcon" v-if="element.type == 6" />
                </div>
                <div class="ticketH5Item-required">
                  <a-checkbox
                    :disabled="mustSelect!=0 && (element.labelId==mustSelect|| element.labelId==mustSelect+1)"
                    v-model:checked="element.isRequired"
                    @click="checkedRequired(index,$event,'hi')"
                    :true-value="1"
                    :false-value="0"
                  >
                    {{ $t("n965") }}
                  </a-checkbox>
                </div>
                <div class="ticketH5Item-delete">
                  <a-button
                    type="primary"
                    danger
                    size="small"
                    @click="delTicketH5Item(index)"
                    v-if="mustSelect==0 || (element.labelId!=mustSelect && element.labelId!=mustSelect+1)"
                  >
                    {{ $t("b11") }}
                  </a-button>
                </div>
              </div>
            </div>
          </template>
        </draggable>
        </div>
      </a-col>
    </a-row>
    <div style="text-align: center; margin-top: 20px;">
      <a-button type="primary" @click="addTicketVisible = false; isAdditem = false;">{{ $t("b10") }}</a-button>
      <a-button type="primary" style="margin-left: 20px;" @click="showPreview">{{ $t("n966") }}</a-button>
      <a-button type="primary" @click="saveTicket" :loading="loading" style="margin-left: 20px;">{{ $t("save") }}</a-button>
    </div>
  </a-modal>
  <!-- 预览 -->
  <a-modal
    v-model:open="previewVisible"
    :destroyOnClose="true"
    :footer="null"
    :width="400"
    centered
  >
    <div class="previewBox">
      <div v-for="(item,index) in englishForm" :key="index"
        class="previewItem">
        <div class="previewLabel">
          <span v-if="item.isRequired" class="redStart">*</span>
          <span>{{ item.labelTitle }}</span>
        </div>
        <div v-if="[1,2,3,7,8].includes(Number(item.type))" class="previewInput">
          <span>{{ $t('m562') + item.labelTitle }}</span>
        </div>
        <div v-if="[4,5,6].includes(Number(item.type))" class="previewNotice">
          <span>{{ item.notes }}</span>
        </div>
        <div v-if="item.type==6" class="previewInput">
          {{ $t("n964") }}
        </div>
        <div v-if="[4,5,6].includes(Number(item.type))" class="previewUpload">
          <PlusCircleFilled  class="previewUploadAdd" />
          <div v-if="item.type==4" class="previewUploadText">{{ $t('n967') }}</div>
          <div v-if="item.type==5" class="previewUploadText">{{ $t('n968') }}</div>
          <div v-if="item.type==6" class="previewUploadText">{{ $t('n969') }}</div>
        </div>
      </div>      
    </div>
  </a-modal>
  <!-- 操作历史 -->
  <a-modal
    v-model:open="actionHistroyVisible"
    :destroyOnClose="true"
    :footer="null"
    centered
    wrap-class-name="full-modal"
    width="100%"
  >
    <ticketHistory v-if="actionHistroyVisible" />
  </a-modal>
  <!-- 工单类型 -->
  <a-modal
    v-model:open="setTicketTypeVisible"
    :title="$t('n960')"
    :width="800"
    :destroyOnClose="true"
    :footer="null"
    centered
  >
    <div class="ticketTypeBox">
      <div class="ticketTypeItem" v-if="workOrderTypeList.length" v-for="(item,index) in workOrderTypeList">
        {{ index+1 }}. {{ item.workOrderTypeName }}
        <a-popconfirm
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="deleteTickType(item.workOrderTypeId)"
          :ok-button-props="{ loading: loading }"
        >
          <template #icon></template>
          <template #title>
            <h3 class="text-center mb-10">{{ $t("n971") }}</h3>
            {{ $t("n972") }}
          </template>
          <CloseCircleFilled  v-permission="'admin:workOrderTypeConfig:delete'" class="delTicketTypeItem" />
        </a-popconfirm>
      </div>
      <PlusSquareFilled class="addTicketTypeItem" v-permission="'admin:workOrderTypeConfig:save'" @click="addTicketTypeItem" />
    </div>
  </a-modal>
  <a-modal
    v-model:open="saveTicketTypeVisible"
    :width="400"
    :destroyOnClose="true"
    :footer="null"
    centered
    @cancel="cancelInputTicketType"
  >
    <template #title>
      <div style="font-size: 16px;text-align: center; font-weight: 600;">
        {{ $t("n960") }}
      </div>
    </template>
    <div class="inputTicketTypeItem">
      <label style="white-space: nowrap;">{{ $t("n973") }}:</label>
      <a-input 
        v-trim 
        v-model:value="newTicketType" 
        :placeholder="$t('m562')+$t('n973')" 
        style="flex: 1;"
      />
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a-button type="primary" @click="cancelInputTicketType">{{ $t("b10") }}</a-button>
      <a-button type="primary" :loading="loading" style="margin-left: 20px;" @click="saveTicketType">{{ $t("save") }}</a-button>
    </div>
  </a-modal>
  <!-- 工单操作权限 -->
  <a-modal
    v-model:open="setOperationPermisVisible"
    :title="$t('n974')"
    :width="800"
    :destroyOnClose="true"
    :footer="null"
    centered
    @cancel="cancelTicketPermiss"
  >
    <ticketPermiss v-if="setOperationPermisVisible" />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, watchEffect } from "vue";
import { PlusCircleFilled,FileImageFilled,FilePptFilled,VideoCameraFilled,CloseCircleFilled,PlusSquareFilled } from "@ant-design/icons-vue";
import {  
  workOrderConfigListPage,
  workOrderTypeConfigListPage,
  workOrderTypeConfigSaveOrUpdate,
  workOrderTypeConfigDelete,
  workOrderConfigSave,
  workOrderConfigUpdate,
  workOrderConfigDelete,
  workOrderConfigUpdateStatus,
 } from "@/api/ticket.api";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import ticketHistory from "./components/ticketHistory.vue";
import ticketPermiss from "./components/ticketPermiss.vue";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import {  replaceEmptyWithUndefined } from "@/utils/index";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import draggable from "vuedraggable";
import { message, Modal } from "ant-design-vue";
import { usePermission } from "@/hooks";
const { hasPermission }=usePermission();
const [startIndiaTime,endIndiaTime,inputTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
const dataSource = ref([]);
const extendData = ref({
  cntPageTotal: 0,
  cntTotal: 0,
});
const loading = ref(false);
const query = ref({
  asc: true,
  column: "updateTime",
  pageNo: 1,
  pageSize: 20,
  workOrderName: undefined,
  workOrderSeq: undefined,
  operatorName:undefined,
  orderRelation: undefined,
  startTime: '',
  endTime: '',
});
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    width: 60,
    customRender: ({ index }: { index: number }) => index + 1,
  },
  {
    title: t("n955"),
    dataIndex: "workOrderName",
    key: "workOrderName",
    align: "center",
    width: 150,
  },
  {
    title: t("n975"),
    dataIndex: "materialItems",
    key: "materialItems",
    align: "center",
    width: 150,
  },
  {
    title: t("n960"),
    dataIndex: "workOrderTypeName",
    key: "workOrderTypeName",
    align: "center",
    width: 150,
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 150,
  },
  {
    title: t("n957"),
    dataIndex: "orderRelation",
    key: "orderRelation",
    align: "center",
    width: 150,
  },
  {
    title: t("n958"),
    dataIndex: "loginLimit",
    key: "loginLimit",
    align: "center",
    width: 150,
  },
  {
    title: t("n976"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 150,
  },
  {
    title: t("n977"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 150,
  },
  {
    title: t("remark"),
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 150,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 150,
  },
];
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      cnt: extendData.value.cntPageTotal || 0,
    },
  },
  {
    label: t("m55"),
    fields: {
      cnt: extendData.value.cntTotal || 0,
    },
  },
]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (isFirst:any = 0) => {
  if(isFirst) {
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const queryParams = replaceEmptyWithUndefined(query.value);
  const res: any = await workOrderConfigListPage(queryParams).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.list || [];
    // extendData.value = res.extend || {};
    pagination.value.total = res.data.total;
  }
};
const reset = () => {
  query.value = {
    asc: true,
    column: "updateTime",
    pageNo: 1,
    pageSize: 20,
    workOrderName: undefined,
    workOrderSeq: undefined,
    operatorName:undefined,
    orderRelation: undefined,
    startTime: '',
    endTime: '',
  };
  getList(1);
};
const { handleTableChange } = useTableChange({
  query,
  pagination,
  getList,
  filterRules: [],
});

// 添加工单
const isShowEnglish = ref(true);
const itemListMap = ref<any>({
  1: "UTR",
  2: t('n953'), // 订单信息
  3: "UPI ID",
  4: t('m105'),//图片
  5: t('m305'), //视频
  6: "PDF",
  7: t('l80'),//其他
});
const itemListEnMap = ref<any>({
  1: "UTR",
  2: t('n953'), // 订单信息
  3: "UPI ID",
  4: 'Image',//图片
  5: 'Video', //视频
  6: "PDF",
  7: 'Other',//其他
});
const materialItemsMap = ref<any>({
  1: "UTR",
  2: t('l90'), // 订单号
  3: "UPI ID",
  4: t('m105'),//图片
  5: t('m305'), //视频
  6: "PDF",
  7: t('l80'),//其他
  8: t('n42'),//订单金额
});
const orderRelationMap = ref<any>({
  1: t('m145'),//"买入订单"
  2: t('m139'),//"卖出订单"
  0: t('n954'),//"无"
});
const workOrderNameEn = ref('');
const workOrderNameHi = ref('');
const ticketForm = ref({
  id: undefined,
  sort: undefined,
  orderRelation: 0,
  loginLimit: 1,
  workOrderTypeId: undefined,
  // status: 0,
  workOrderName: undefined,
  materialItems: undefined,
  workOrderSeq: undefined,
  remark: undefined,
  listData: [] as any[],
});
const englishForm = ref<any>([]);
const hindiForm = ref<any>([]);
const selectLang = (lang:any) => {
  if(lang == '1'){
    isShowEnglish.value = true;
  }else if(lang == '2'){
    isShowEnglish.value = false;
  }
};
const addTicketVisible = ref(false);
const isAdd = ref(false);
const isEdit = ref(false);
const isAdditem = ref(false);
const isNoLogin = ref(false);
const mustSelect = ref(0);// 当关联订单不为“无”时必须选择的项
const itemListMaxId = computed(() => {
  let maxId = 0;
  englishForm.value.forEach((item:any) => {
    if(item.labelId > maxId){
      maxId = item.labelId;
    }
  });
  return maxId || 0;
});
const showAddTicket = () => {
  ticketForm.value = {
    id: undefined,
    sort: undefined,
    orderRelation: 0,
    loginLimit: 1,
    workOrderTypeId: undefined,
    // status: 0,
    workOrderName: undefined,
    materialItems: undefined,
    workOrderSeq: undefined,
    remark: undefined,
    listData: [] as any[],
  };
  englishForm.value = [];
  hindiForm.value = [];
  workOrderNameEn.value = '';
  workOrderNameHi.value = '';
  mustSelect.value = 0;
  addTicketVisible.value = true;
  isAdd.value = true;
  isEdit.value = false;
  isAdditem.value = false;
  isNoLogin.value = false;
  isShowEnglish.value = true;
};
watchEffect(() => {
  if(ticketForm.value.orderRelation == 0){
    isNoLogin.value = false;
  }else{
    ticketForm.value.loginLimit = 0;
    isNoLogin.value = true;
  }
  if(ticketForm.value.orderRelation != 0 && !mustSelect.value){
    if(isHaveType(2)){
      englishForm.value = englishForm.value.map((item:any) => {
        if(item.type == 2 || item.type == 8){
          item.isRequired = 1;
        }
        return item;
      });
      hindiForm.value = hindiForm.value.map((item:any) => {
        if(item.type == 2 || item.type == 8){
          item.isRequired = 1;
        }
        return item;
      });
      mustSelect.value = englishForm.value.find((item:any) => item.type == 2).labelId;
      if(!isEdit){
        englishForm.value[englishForm.value.findIndex((item:any) => item.type == 2)].labelTitle = 'Order Number';
        hindiForm.value[hindiForm.value.findIndex((item:any) => item.type == 2)].labelTitle = 'Order Number';
        englishForm.value[englishForm.value.findIndex((item:any) => item.type == 8)].labelTitle = 'Order Amount';
        hindiForm.value[hindiForm.value.findIndex((item:any) => item.type == 8)].labelTitle = 'Order Amount';
      }
    }else{
      mustSelect.value = itemListMaxId.value+1;
      englishForm.value.push(
        {
          labelId: itemListMaxId.value+1,
          labelTitle: 'Order Number',
          type: 2,
          sort: itemListMaxId.value+1,
          isRequired: 1,
          notes: '',
          labelContent: '',
          language: 1,
          workOrderName: workOrderNameEn.value,
          workOrderSeq: undefined,
        },
        {
          labelId: itemListMaxId.value+2,
          labelTitle: 'Order Amount',
          type: 8,
          sort: itemListMaxId.value+2,
          isRequired: 1,
          notes: '',
          labelContent: '',
          language: 1,
          workOrderName: workOrderNameEn.value,
          workOrderSeq: undefined,
        }
      );
      hindiForm.value.push(
        {
          labelId: itemListMaxId.value-1,
          labelTitle: 'Order Number',
          type: 2,
          sort: itemListMaxId.value-1,
          isRequired: 1,
          notes: '',
          labelContent: '',
          language: 2,
          workOrderName: workOrderNameHi.value,
          workOrderSeq: undefined,
        },
        {
          labelId: itemListMaxId.value,
          labelTitle: 'Order Amount',
          type: 8,
          sort: itemListMaxId.value,
          isRequired: 1,
          notes: '',
          labelContent: '',
          language: 2,
          workOrderName: workOrderNameHi.value,
          workOrderSeq: undefined,
        }
      );
    }
  }
  if(ticketForm.value.orderRelation == 0){
    if(mustSelect.value){
      // englishForm.value = englishForm.value.filter((item:any) => item.labelId != mustSelect.value && item.labelId != (mustSelect.value+1));
      // hindiForm.value = hindiForm.value.filter((item:any) => item.labelId != mustSelect.value && item.labelId != (mustSelect.value+1));
      englishForm.value = englishForm.value.map((item:any) => {
        if(item.type == 2 || item.type == 8){
          item.isRequired = 0;
        }
        return item;
      });
      hindiForm.value = hindiForm.value.map((item:any) => {
        if(item.type == 2 || item.type == 8){
          item.isRequired = 0;
        }
        return item;
      });
      mustSelect.value = 0;
    }
  }
});
const addH5Item = (type:any) => {
  isAdditem.value = false;
  if(![4,5,6,7].includes(Number(type)) && isHaveType(type)){
    return message.error(t('n978'));
  }
  if(type == 2){
    englishForm.value.push(
      {
        labelId: itemListMaxId.value+1,
        labelTitle: 'Order Number',
        type: 2,
        sort: itemListMaxId.value+1,
        isRequired: 0,
        notes: '',
        labelContent: '',
        language: 1,
        workOrderName: workOrderNameEn.value,
        workOrderSeq: undefined,
      },
      {
        labelId: itemListMaxId.value+2,
        labelTitle: 'Order Amount',
        type: 8,
        sort: itemListMaxId.value+2,
        isRequired: 0,
        notes: '',
        labelContent: '',
        language: 1,
        workOrderName: workOrderNameEn.value,
        workOrderSeq: undefined,
      }
    );
    hindiForm.value.push(
      {
        labelId: itemListMaxId.value-1,
        labelTitle: 'Order Number',
        type: 2,
        sort: itemListMaxId.value-1,
        isRequired: 0,
        notes: '',
        labelContent: '',
        language: 2,
        workOrderName: workOrderNameHi.value,
        workOrderSeq: undefined,
      },
      {
        labelId: itemListMaxId.value,
        labelTitle: 'Order Amount',
        type: 8,
        sort: itemListMaxId.value,
        isRequired: 0,
        notes: '',
        labelContent: '',
        language: 2,
        workOrderName: workOrderNameHi.value,
        workOrderSeq: undefined,
      }
    );
  }else{
    englishForm.value.push(
      {
        labelId: itemListMaxId.value+1,
        labelTitle: itemListEnMap.value[type],
        type: type,
        sort: itemListMaxId.value+1,
        isRequired: 0,
        notes: '',
        labelContent: '',
        language: 1,
        workOrderName: workOrderNameEn.value,
        workOrderSeq: undefined,
      }
    );
    hindiForm.value.push(
      {
        labelId: itemListMaxId.value,
        labelTitle: itemListEnMap.value[type],
        type: type,
        sort: itemListMaxId.value,
        isRequired: 0,
        notes: '',
        labelContent: '',
        language: 2,
        workOrderName: workOrderNameHi.value,
        workOrderSeq: undefined,
      }
    );
  }
};
const isHaveType = (type:any) => {
  return englishForm.value.some((item:any) => item.type == type);
};
const checkedRequired = (index:any,e:any,type:any) => {
  if(type == 'en'){
    const is = e.target.checked;
    englishForm.value[index].isRequired = is ? 1 : 0;
    hindiForm.value[index].isRequired = is ? 1 : 0;
    return;
  }else if(type == 'hi'){
    const is = e.target.checked;
    hindiForm.value[index].isRequired = is ? 1 : 0;
    englishForm.value[index].isRequired = is ? 1 : 0;
    return;
  }
};
const delTicketH5Item = (index:any) => {
  // console.log(englishForm.value[index].type);
  if(englishForm.value[index].type == 2 || englishForm.value[index].type == 8){
    englishForm.value = englishForm.value.filter((item:any) => item.type != 2);
    englishForm.value = englishForm.value.filter((item:any) => item.type != 8);
    hindiForm.value = hindiForm.value.filter((item:any) => item.type != 2);
    hindiForm.value = hindiForm.value.filter((item:any) => item.type != 8);
    console.log(englishForm.value);
    return;
  }
  englishForm.value.splice(index,1);
  hindiForm.value.splice(index,1);
};
// 启用、禁用
const switchSale = async (e: any, val: any) => {
  const { id, status} = val
  const s = e == "1" ? 1 : 0;
  Modal.confirm({
    title: s ? t("m767") : t("m768"), 
    onOk: async () => {
      let res:any;
      loading.value = true;
      res = await workOrderConfigUpdateStatus({ id,status: s,}).finally(()=>loading.value = false);
      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
    },
  });
};
// 编辑
const showEditTicket = (record:any) => {
  const {id,sort,orderRelation,materialItems,loginLimit,workOrderTypeId,workOrderSeq,workOrderName,remark} = record;
  ticketForm.value = {
    id,
    sort,
    orderRelation,
    loginLimit,
    workOrderTypeId,
    // status: 0,
    workOrderName,
    materialItems,
    workOrderSeq,
    remark,
    listData: [],
  };
  // workOrderNameEn.value = record.listData.find((item:any) => item.language == 1)?.workOrderName || '';
  // workOrderNameHi.value = record.listData.find((item:any) => item.language == 2)?.workOrderName || workOrderNameEn;
  englishForm.value = record.listData.filter((item:any) => item.language == 1);
  hindiForm.value = record.listData.filter((item:any) => item.language == 2);
  workOrderNameEn.value = englishForm.value[0]?.workOrderName || '';
  workOrderNameHi.value = hindiForm.value[0]?.workOrderName || workOrderNameEn.value;
  if(ticketForm.value.orderRelation != 0 ){
    mustSelect.value = englishForm.value.find((item:any) => item.type == 2)?.labelId || 0;
  }
  isAdd.value = false;
  isEdit.value = true;
  isShowEnglish.value = true;
  addTicketVisible.value = true;
};
// 保存工单
const saveTicket = async () => {
  ticketForm.value.workOrderName = workOrderNameEn.value;
  englishForm.value.map((item:any)=>{
    item.workOrderName = workOrderNameEn.value;
    item.isRequired = item.isRequired ? 1 : 0;
    return item;
  });
  hindiForm.value.map((item:any)=>{
    item.workOrderName = workOrderNameHi.value || workOrderNameEn.value;
    item.isRequired = item.isRequired ? 1 : 0;
    return item;
  });
  ticketForm.value.listData = [...englishForm.value,...hindiForm.value];
  ticketForm.value.materialItems = englishForm.value.map((item:any) => item.type).join(',');
  // console.log(ticketForm.value);return;
  if(!ticketForm.value.workOrderName){
    return message.error(t('m562')+t('n955'));
  }
  if(ticketForm.value.sort == undefined){
    return message.error(t('m562')+t('n956'));
  }
  if(ticketForm.value.workOrderTypeId == undefined){
    return message.error(t('m563')+t('n960'));
  }
  if(!englishForm.value.length){
    return message.error(t('n979'));
  }
  if(englishForm.value.some((item:any) => !item.labelTitle)){
    return message.error(t('m562')+t('n980'));
  }
  let res:any;
  loading.value = true;
  if(isAdd.value){
    // 新增
    res = await workOrderConfigSave(ticketForm.value).finally(()=>loading.value = false);
    if (res && res.code === "1") {
      message.success(t('s10'));
      addTicketVisible.value = false;
      getList();
    }
  }else{
    // 编辑
    res = await workOrderConfigUpdate(ticketForm.value).finally(()=>loading.value = false);
    if (res && res.code === "1") {
      message.success(t('s10'));
      addTicketVisible.value = false;
      getList();
    }
  }
};

// 统一的拖拽同步方法
const reorderById = (targetList: any[], referenceList: any[]) => {
  const idOrder = referenceList.map(item => item.labelId);
  targetList.sort((a, b) => idOrder.indexOf(a.labelId) - idOrder.indexOf(b.labelId));
  // const ids = targetList.map(item => item.labelId);
  // const ids2 = referenceList.map(item => item.labelId);
  // console.log(ids,ids2);
};

// 英文拖拽结束 → 按英文顺序重排印地语
const onEnglishDragEnd = () => {
  reorderById(hindiForm.value, englishForm.value);
  englishForm.value.map((item:any,index:any)=>item.sort = index+1);
  hindiForm.value.map((item:any,index:any)=>item.sort = index+1);
};

// 印地语拖拽结束 → 按印地语顺序重排英文
const onHindiDragEnd = () => {
  reorderById(englishForm.value, hindiForm.value);
  englishForm.value.map((item:any,index:any)=>item.sort = index+1);
  hindiForm.value.map((item:any,index:any)=>item.sort = index+1);
};
// 删除
const deleteTicket = async (id:any) => {
  loading.value = true;
  const res: any = await workOrderConfigDelete({ id }).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    getList();
  }
};

// 预览
const previewVisible = ref(false);
const showPreview = () => {
  previewVisible.value = true;
};


//操作历史
const actionHistroyVisible = ref(false);
const actionHistroy = () => {
  actionHistroyVisible.value = true;
};

//工单类型
const workOrderTypeList = ref<{ workOrderTypeId: number,workOrderTypeName: string }[]>([]);
const getTypeList = async () => {
  const res: any = await workOrderTypeConfigListPage().finally(()=>{});
  if (res && res.code === "1") {
    workOrderTypeList.value = res.data || [];
  }
};
const maxTicketType = computed(() => {
  let maxId = 0;
  workOrderTypeList.value.forEach((item:any) => {
    if(item.value > maxId){
      maxId = item.value;
    }
  });
  return maxId || 0;
});
const setTicketTypeVisible = ref(false);
const saveTicketTypeVisible = ref(false);
const newTicketType = ref('');
const setTicketType = () => {
  setTicketTypeVisible.value = true;
};
const deleteTickType = async (value:any) => {
  loading.value = true;
  const res: any = await workOrderTypeConfigDelete({ id: value }).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    getTypeList();
  }
};
const addTicketTypeItem = () => {
  newTicketType.value = '';
  saveTicketTypeVisible.value = true;
};
const saveTicketType = async () => {
  if(!newTicketType.value){
    return message.error(t('m562')+t('n973'));
  }
  loading.value = false;
  const res: any = await workOrderTypeConfigSaveOrUpdate({ workOrderTypeName: newTicketType.value }).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    getTypeList();
    cancelInputTicketType();
  }
}
const cancelInputTicketType = () => {
  saveTicketTypeVisible.value = false; 
  newTicketType.value = '';
}

// 工单操作权限
const setOperationPermisVisible = ref(false);
const setOperationPermis = () => {
  setOperationPermisVisible.value = true;
};
const cancelTicketPermiss = () => {
  setOperationPermisVisible.value = false; 
}
onMounted(() => {
  getList();
  getTypeList();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
// 添加/编辑工单
.formItemBox {
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  .ant-form-item {
    margin-bottom: 12px;
    display: flex;
    gap: 10px;
    line-height: 32px;
    .ant-form-item-label {
      flex:1;
      text-align: right;
      label {
        font-weight: 500;
      }
    }
    .ant-form-item-explain {
      flex:2
    }
  }
  .ticketH5ItemBox{
    padding-left: 20px;
    min-height: 200px;
    max-height: 70vh;
    overflow-y: auto;
    .ticketH5Item{
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      .ticketH5Item-label{
        width: 20px;
        text-align: right;
      }
      .ticketH5Item-content{
        width: calc(100% - 30px);
        background-color: #f0eeee;
        padding: 10px;
        border-radius: 4px;
        position: relative;
        .ticketH5Item-input{
          width: 160px;
          margin-bottom: 2px;
        }
        .ticketH5Item-placeholder{
          color: #999;
          border: 1px solid #ccc;
          width: 260px;
          min-height: 24px;
          line-height: 24px;
          margin-bottom: 2px;
        }
        .ticketH5Item-uploadIcon{
          font-size: 28px;
          color: #666;
          margin-bottom: 2px;
        }
        .ticketH5Item-required{
          position: absolute;
          top: 0;
          right: 0;
        }
        .ticketH5Item-delete{
          text-align: right;
        }
      }
    }
  }
  .ticketH5ItemAddBtn {
    margin-top: 10px;
    text-align: center;
  }
  .ticketH5ItemOptions {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid #ccc;
    .ticketH5ItemOptionsItem {
      border: 1px solid #ccc;
      text-align: center;
      padding: 5px 0;
      cursor: pointer;
      background: #fff;
      &:hover {
        background: #f0f0f0;
      }
      &:active {
        background: #1677ff;
        color: #fff;
      }
    }
  }
}

// n960
.ticketTypeBox{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  .ticketTypeItem{
    border: 1px solid #ccc;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 4px;
    padding-right: 30px;
    position: relative;
    .delTicketTypeItem{
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.addTicketTypeItem{
  width: 28px;
  font-size: 28px;
  color: #666;
  margin: 5px;
  cursor: pointer;
  &:hover {
    color: #1677ff;
  }
}
.inputTicketTypeItem{
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  label{
    white-space: nowrap;
  }
}
// 预览
.previewBox{
  width: 338px;
  height: 732px;
  overflow-y: auto;
  .previewItem{
    padding-bottom: 12px;
    .previewLabel{
      padding-left: 2px;
      padding-bottom: 4px;
      .redStart{
        color: red;
        margin-right: 2px;
      }
    }
    .previewNotice{
      color: red;
      font-size: 12px;
    }
    .previewInput{
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      color: #676767;
      margin-bottom: 8px;
      border-radius: 3px;
      background-color: rgb(225, 224, 229);
    }
    .previewUpload{
      width: 80px;
      height: 80px;
      border:1px solid #ccc;
      border-radius: 4px;
      .previewUploadAdd{
        font-size: 28px;
        color: #666;
        margin-top: 15px;
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .previewUploadText{
        text-align: center;
        margin-top: 5px;
        color: #666;
        font-size: 12px;
      }
    }
  }
}
.requiredRed{
  color: red;
  position: relative;
  top:2px;
  right: 2px;
}
</style>
