<template>
  <div class="search">
    <a-row>
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.bankCode"
          :placeholder="$t('m563')+$t('m582')"
        >
          <a-select-option
            v-for="(item) in groupList"
            :value="item"
            :key="item"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-col>
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.buyStatus"
          :placeholder="$t('m563')+$t('memberListC15')"
        >
          <a-select-option :value="0">{{ $t('l54') }}</a-select-option>
          <a-select-option :value="1">{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.sellStatus"
          :placeholder="$t('m563')+$t('memberListC16')"
        >
          <a-select-option :value="0">{{ $t('l54') }}</a-select-option>
          <a-select-option :value="1">{{ $t('l53') }}</a-select-option>
        </a-select>
      </a-col> -->
      <!-- <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.supportsBuyAppeal"
          :placeholder="$t('m563')+$t('n1389')"
        >
        <a-select-option :value="1">{{ $t('yes') }}</a-select-option>
        <a-select-option :value="0">{{ $t('no') }}</a-select-option>
        </a-select>
      </a-col> -->
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary" @click="showAddDialog"   v-permission="'admin:kycBankAdmin:addKycBank'">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="paginationConfig"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'iconUrl'">
        <a-image :width="60" style="max-height: 60px;" :src="record.iconUrl" alt=""/>
      </template>
      <template v-if="column.key === 'sourceType'"  >
        {{ sourceMap[record.sourceType] }}
      </template>
      <template v-if="column.key === 'bankName'">
        <a-tooltip>
          <template #title>{{ record.bankName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.bankName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip>
          <template #title>{{ record.bankCode }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;padding: 6px 0;">{{ record.bankCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'linkUrl'">
        <a-tooltip>
          <template #title>{{ record.linkUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.linkUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'apiUrl'">
        <a-tooltip>
          <template #title>{{ record.apiUrl }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.apiUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'sellStatus'"  >
        <a-switch
          class="light-green-switch"
          :checked="record.sellStatus == 1 ? true : false"
          @change="confirmBy($event,'sellStatus',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.sellStatus == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'sellStatus')"
          />
      </template>
      <template v-if="column.key === 'supportsBuyAppeal'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsBuyAppeal == 1 ? true : false"
          @change="confirmBy($event,'supportsBuyAppeal',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsBuyAppeal == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsBuyAppeal')"
          />
      </template>
      <template v-if="column.key === 'supportsQuickWithdraw'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsQuickWithdraw == 1 ? true : false"
          @change="confirmBy($event,'supportsQuickWithdraw',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
            size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsQuickWithdraw == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsQuickWithdraw')"
          />
      </template>
      <template v-if="column.key === 'supportsQuickWithdrawBank'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsQuickWithdrawBank == 1 ? true : false"
          @change="confirmBy($event,'supportsQuickWithdrawBank',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsQuickWithdrawBank == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsQuickWithdrawBank')"
          />
      </template>
      <template v-if="column.key === 'supportPhonepeWakeUp'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportPhonepeWakeUp == 1 ? true : false"
          @change="confirmBy($event,'supportPhonepeWakeUp',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportPhonepeWakeUp == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportPhonepeWakeUp')"
          />
      </template>
      <template v-if="column.key === 'supportsExternalAppeal'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsExternalAppeal == 1 ? true : false"
          @change="confirmBy($event,'supportsExternalAppeal',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsExternalAppeal == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsExternalAppeal')"
          />
      </template>
      <template v-if="column.key === 'supportsExternalSell'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsExternalSell == 1 ? true : false"
          @change="confirmBy($event,'supportsExternalSell',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsExternalSell == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsExternalSell')"
          />
      </template>
      <template v-if="column.key === 'supportLotteryTicket'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportLotteryTicket == 1 ? true : false"
          @change="confirmBy($event,'supportLotteryTicket',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportLotteryTicket == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportLotteryTicket')"
          />
      </template>
      <template v-if="column.key === 'supportsAutoTrade'">
        <a-switch
          class="light-green-switch"
          :checked="record.supportsAutoTrade == 1 ? true : false"
          @change="confirmBy($event,'supportsAutoTrade',record)"
          :disabled="!hasPermission('admin:kycBankAdmin:updateKycBank')"
          :checked-children="$t('yes')"
          :un-checked-children="$t('no')"
          size="small"
        />
        <AuditOutlined  class="showLogIcon"
         :style="record.supportsAutoTrade == 1 ? 'color:rgba(82, 196, 26, 0.65)' : 'color:gray'"
          @click="viewLog(record.bankCode,'supportsAutoTrade')"
          />
      </template>
      <template v-if="column.key === 'allowMultiLogin'">
        <span :class="record.allowMultiLogin == 1 ? 'tag-orange' : 'tag-blue'">
          {{ record.allowMultiLogin == 1 ? $t('n1385') : $t('n1386') }}
        </span>
      </template>
      <template v-if="column.key === 'updateBy'">
        <a-tooltip>
          <template #title>{{ record.updateBy }}</template>
          <div class="toopTipStyle2">{{ record.updateBy }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'updateTime'"  >
      {{ record.updateTime || record.createTime }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:kycBankAdmin:updateKycBank'"
          >{{ $t("b8") }}
        </a-tag> 
        
        <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:kycBankAdmin:deleteKycBank'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit? $t('b8'): $t('add')"
  @cancel="closeAddDalog" :footer="null" width="1200px">
    <a-form
      :model="addFrom"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-row :gutter="30">
        <a-col :span="12">
          <a-form-item :label ="$t('m581')" name="bankName"  :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.bankName"  :placeholder="$t('m562')+$t('m581')"/>
          </a-form-item>
          <a-form-item :label="$t('m582')" name="bankCode" :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.bankCode" :disabled="isEdit" :placeholder="$t('m562')+$t('m582')"/>
          </a-form-item>
          <a-form-item :label="$t('sort')" name="sort" :rules="[{ required: true, message: ''}]">
            <a-input-number v-model:value="addFrom.sort" :min="1" style="width: 100%" :placeholder="$t('m562')+$t('sort')"/>
          </a-form-item>
          <a-form-item :label="$t('m583')" name="iconUrl" :rules="[{ required: true, message: ''}]">
            <Upload v-if="isMountUpload" v-model:value="addFrom.iconUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
          </a-form-item>
          <a-form-item :label="$t('m701')" name="apiUrl" :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.apiUrl"  :placeholder="$t('m562')+$t('m701')"/>
          </a-form-item>
          <a-form-item :label="$t('m702')" name="linkUrl" :rules="[{ required: true, message: ''}]">
            <a-input v-trim v-model:value="addFrom.linkUrl" :placeholder="$t('m562')+$t('m702')"/>
          </a-form-item>
        </a-col>
        <a-col class="content-box-gray" :span="12">
          <!-- <a-form-item :label="$t('memberListC15')" name="buyStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.buyStatus">
              <a-radio :value="1"> {{  $t('l53') }} </a-radio>
              <a-radio :value="0"> {{  $t('l54') }} </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item :label="$t('memberListC16')" name="sellStatus" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.sellStatus" :disabled="isEdit">
              <a-radio :value="1"> {{  $t('l53') }} </a-radio>
              <a-radio :value="0"> {{  $t('l54') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('m703')" name="sourceType" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.sourceType">
              <a-radio v-for="(item, index) in sourceMap" :key="index" :value="Number(index)">
                {{ item }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1384')" name="allowMultiLogin" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.allowMultiLogin">
              <a-radio :value="1"> {{ $t('n1385') }} </a-radio>
              <a-radio :value="0"> {{ $t('n1386') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1389')" name="supportsBuyAppeal" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsBuyAppeal" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1390')" name="supportsQuickWithdraw" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsQuickWithdraw" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1391')" name="supportsQuickWithdrawBank" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsQuickWithdrawBank" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1392')" name="supportPhonepeWakeUp" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportPhonepeWakeUp" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1393')" name="supportsExternalAppeal" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsExternalAppeal" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1394')" name="supportsExternalSell" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsExternalSell" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1468')" name="supportLotteryTicket" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportLotteryTicket" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1500')" name="supportsAutoTrade" :rules="[{ required: true, message: ''}]">
            <a-radio-group v-model:value="addFrom.supportsAutoTrade" :disabled="isEdit">
              <a-radio :value="1"> {{ $t('yes') }} </a-radio>
              <a-radio :value="0"> {{ $t('no') }} </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <br />
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button :loading="isUpload || loading" type="primary" @click="addBtn">{{
          isEdit? $t('b8') : $t('add')
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog"
          >{{ $t('l54') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 查看日志 -->
   <a-modal
    v-model:open="showLogDialog"
    :title="$t('n1368')"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
   >
    <kycBankOnOffLog v-if="showLogDialog" :bankRecord="bankRecord" />
   </a-modal>
</template>
<script lang="ts" setup>
import {
  getKycBankCodeList,
  kycBankAdminList,
  addKycBank,
  updateKycBank,
  deleteKycBank,
  kycBankAdminKycBankUpdateControlSwitch,
} from "@/api/kycConfig.api";
import { message, Modal, Input } from "ant-design-vue";
import { onMounted, ref, h } from "vue";
import Upload from '@/components/Upload/index.vue'
import kycBankOnOffLog from "./appBankOnOffLog.vue";
import { SearchOutlined, AuditOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { usePagination } from "@/plugins/dataMap";
import { usePermission } from "@/hooks";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { color } from "echarts";
const { paginationConfig } = usePagination();
const { getTabH } = useTabHeight(340);
const { t } = useI18n();
const { hasPermission }=usePermission()
const query= ref({
  asc:true,
  column:'sort',
  pageNo:1,
  pageSize:20,
  bankCode:undefined,
  // buyStatus:undefined,
  sellStatus:undefined,
  supportsBuyAppeal:undefined,
})
const columns:any = [
  // {
  //   title: t("e47"),
  //   align: "center",
  //   width: 90,
  //   customRender: ({ index }) => index + 1,
  // },
  {
    title: t('sort'),
    dataIndex: "sort",
    key: "sort",
    width:80,
    align:"center"
  },
  // {
  //   title: t('m581'),
  //   dataIndex: "bankName",
  //   key: "bankName",
  //   width:160,
  //   align:"center"
  // },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    width:120,
    align:"center",
  },
  {
    title: t('m583'),
    dataIndex: "iconUrl",
    key: "iconUrl",
    width:140,
    // ellipsis: true,
    align:"center",
  },
  // {
  //   title: t('m584'),
  //   dataIndex: "linkType",
  //   key: "linkType",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m701'),
  //   dataIndex: "apiUrl",
  //   key: "apiUrl",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m586'),
  //   dataIndex: "serviceCode",
  //   key: "serviceCode",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m702'),
  //   dataIndex: "linkUrl",
  //   key: "linkUrl",
  //   width:200,
  //   align:"center"
  // },
  // {
  //   title: t('m703'),
  //   dataIndex: "sourceType",
  //   key: "sourceType",
  //   width:120,
  //   align:"center"
  // },
  // {
  //   title: t('memberListC15'),
  //   dataIndex: "buyStatus",
  //   key: "buyStatus",
  //   width:120,
  //   align:"center"
  // },
  {
    title: t('memberListC16'),
    dataIndex: "sellStatus",
    key: "sellStatus",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1389")),
    dataIndex: "supportsBuyAppeal",
    key: "supportsBuyAppeal",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1390")),
    dataIndex: "supportsQuickWithdraw",
    key: "supportsQuickWithdraw",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1391")),
    dataIndex: "supportsQuickWithdrawBank",
    key: "supportsQuickWithdrawBank",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1392")),
    dataIndex: "supportPhonepeWakeUp",
    key: "supportPhonepeWakeUp",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1393")),
    dataIndex: "supportsExternalAppeal",
    key: "supportsExternalAppeal",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1394")),
    dataIndex: "supportsExternalSell",
    key: "supportsExternalSell",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1468")),
    dataIndex: "supportLotteryTicket",
    key: "supportLotteryTicket",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1500")),
    dataIndex: "supportsAutoTrade",
    key: "supportsAutoTrade",
    width:120,
    align:"center"
  },
  {
    title: h("div", {class:"toopTipStyle2"}, t("n1384")),
    dataIndex: "allowMultiLogin",
    key: "allowMultiLogin",
    width:120,
    align:"center"
  },
  {
    title: t("l48"),
    dataIndex: "updateBy",
    key: "updateBy",
    width:100,
    align:"center",
  },
  {
    title: t("updateTime"),
    dataIndex: "updateTime",
    key: "updateTime",
    width: 140,
    align:"center",
  },
  // {
  //   title: t("remark"),
  //   dataIndex: "remark",
  //   key: "remark",
  //   width:200,
  //   align:"center",
  // },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:120,
    align:"center",
    fixed: 'right',
  },
];
const statusMap = <any>{
  0:t('l54'),
  1:t('l53'),
}
const sourceMap = <any>{
  0:t('m704'),
  1:'app',
  2:'H5',
}
const linkTypeMap = <any>{
  1:t('m588'),
  2:t('m589'),
}
const loading = ref(false);
const isUpload = ref(false);
const addDialog = ref(false);
const isMountUpload = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref<any>({
  bankName: undefined,
  bankCode: undefined,
  iconUrl: undefined,
  apiUrl: undefined,
  linkUrl: undefined,
  // buyStatus: undefined,
  sellStatus: undefined,
  sourceType: undefined,
  sort:undefined,
  supportsBuyAppeal:0,
  allowMultiLogin: 0, // 是否支持多点登陆
  supportsQuickWithdraw:0, // 是否支持快捷体现-UPI
  supportsQuickWithdrawBank:0, // 是否支持快捷体现-BANK
  supportPhonepeWakeUp:0, // 是否支持phonepe唤醒
  supportsExternalSell:0, // 是否支持外部卖出
  supportsExternalAppeal:0, // 是否支持外部申诉
  supportLotteryTicket:0, // 是否支持彩票工单
  supportsAutoTrade:0, // 是否支持自动交易
});

const getList = async () => {
  loading.value=true;
  paginationConfig.current = query.value.pageNo;
  paginationConfig.pageSize = query.value.pageSize;
  const res: any = await kycBankAdminList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    paginationConfig.total = res.data.total;
    clearSelected();
  }
};

const search = () => {
  paginationConfig.current = 1;
  query.value.pageNo = 1;
  getList()
}
const resetQuery = () => {
  query.value = {
    asc:true,
    column:'',
    pageNo:1,
    pageSize:20,
    bankCode:undefined,
    // buyStatus:undefined,
    sellStatus:undefined,
    supportsBuyAppeal:undefined,
  };
  paginationConfig.pageSize = 20;
  paginationConfig.current =1;
  getList();
};


const showAddDialog = () => {
  isMountUpload.value = true;
  isEdit = false;
  addFrom.value = {
    id:undefined,
    bankName: undefined,
    bankCode: undefined,
    iconUrl: undefined,
    apiUrl: undefined,
    linkUrl: undefined,
    // buyStatus: undefined,
    sellStatus: undefined,
    sourceType: undefined,
    sort:undefined,
    supportsBuyAppeal:0,
    allowMultiLogin: 0,
    supportsQuickWithdraw:1,
    supportsQuickWithdrawBank:1,
    supportPhonepeWakeUp:0,
    supportsExternalSell:0,
    supportsExternalAppeal:0,
    supportLotteryTicket:0,
    supportsAutoTrade: 0,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit = true;
  isMountUpload.value = true;
  addFrom.value = JSON.parse(JSON.stringify(value));
  addDialog.value = true;
};
const del = async (value: any) => {
  const { id } = value;
  loading.value = true;
  const res: any = await deleteKycBank({id}).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    message.success(t('s9'));
    getList();
  }
};
// const checkenable = async (value: any) =>{
//   const { id } = value;
//   let res;
//   loading.value=true;
//   if(value.active === '1'){
//       res = await enableCustomerServiceSystems(id).finally(()=>loading.value=false);
//   }else{
//       res = await disableCustomerServiceSystems(id).finally(()=>loading.value=false);
//   }
//   if (res && res.code === "1") {
//     message.success(value.active ==='0' ? t('m238') : t('m237'));
//     getList();
//   }
// }

const closeAddDalog = () => {
  addFrom.value = {
    id:undefined,
    bankName: undefined,
    bankCode: undefined,
    iconUrl: undefined,
    apiUrl: undefined,
    linkUrl: undefined,
    // buyStatus: undefined,
    sellStatus: undefined,
    sourceType: undefined,
    sort:undefined,
    supportsBuyAppeal:0,
    allowMultiLogin: 0,
    supportsQuickWithdraw:1,
    supportsQuickWithdrawBank:1,
    supportPhonepeWakeUp:0,
    supportsExternalSell:0,
    supportsExternalAppeal:0,
    supportLotteryTicket:0,
    supportsAutoTrade: 0,
  };
  isEdit = false;
  addDialog.value = false;
  isMountUpload.value = false;
  isUpload.value = false;
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  paginationConfig.current = pag.current;
  paginationConfig.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};
const addBtn = async () => {
  if(!addFrom.value.bankName){
    message.error(t('m562')+t('m581'));
    return;
  }
  if(!addFrom.value.bankCode){
    message.error(t('m562')+t('m582'));
    return;
  }
  if(!addFrom.value.sort){
    message.error(t('m562')+t('sort'));
    return;
  }
  if(!addFrom.value.iconUrl){
    message.error(t('m563')+t('m583'));
    return;
  }
  if(!addFrom.value.apiUrl){
    message.error(t('m562')+t('m701'));
    return;
  }
  if(!addFrom.value.linkUrl){
    message.error(t('m562')+t('m702'));
    return;
  }
  // if(![0,1].includes(Number(addFrom.value.buyStatus)) || addFrom.value.buyStatus === null){
  //   message.error(t('m563')+t('memberListC15'));
  //   return;
  // }
  if(![0,1].includes(Number(addFrom.value.sellStatus)) || addFrom.value.sellStatus === null){
    message.error(t('m563')+t('memberListC16'));
    return;
  }
  if(![0,1,2].includes(Number(addFrom.value.sourceType))){
    message.error(t('m563')+t('m703'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportsExternalAppeal)) || addFrom.value.supportsExternalAppeal === null){
    message.error(t('m563')+t('n1393'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportsExternalSell)) || addFrom.value.supportsExternalSell === null){
    message.error(t('m563')+t('n1394'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportLotteryTicket)) || addFrom.value.supportLotteryTicket === null){
    message.error(t('m563')+t('n1468'));
    return;
  }
  if(![0,1].includes(Number(addFrom.value.supportsAutoTrade)) || addFrom.value.supportsAutoTrade === null){
    message.error(t('m563')+t('n1500'));
    return;
  }
  let res:any;
  loading.value=true;
  if (isEdit) {
    const {id, apiUrl ,bankCode, sort, bankName,  sourceType, iconUrl, linkUrl, sellStatus, supportsBuyAppeal,allowMultiLogin, supportsQuickWithdraw,
      supportsQuickWithdrawBank,supportPhonepeWakeUp, supportsExternalAppeal, supportsExternalSell, supportLotteryTicket, supportsAutoTrade } = addFrom.value
    const editFrom={id, apiUrl, sort, bankCode, bankName, sourceType:Number(sourceType), iconUrl, linkUrl, sellStatus:Number(sellStatus), supportsBuyAppeal,
      allowMultiLogin, supportsQuickWithdraw, supportsQuickWithdrawBank,supportPhonepeWakeUp, supportsExternalAppeal, supportsExternalSell, supportLotteryTicket, supportsAutoTrade }
    res = await updateKycBank(editFrom).finally(()=>loading.value=false);
  } else {
    res = await addKycBank(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
  }
};
const kycBankCode=ref<any>('');
const allStatusMap: any = {
  sellStatus: {
    key: 1,
    title: (s: number) =>
      s
        ? t('n1371', { n: kycBankCode.value })
        : t('n1370', { n: kycBankCode.value }),
  },
  supportsBuyAppeal: {
    key: 3,
    title: (s: number) =>
      s
        ? t('n1373', { n: kycBankCode.value })
        : t('n1372', { n: kycBankCode.value }),
  },
  supportsQuickWithdraw: {
    key: 4,
    title: (s: number) =>
      s
        ? t('n1375', { n: kycBankCode.value })
        : t('n1374', { n: kycBankCode.value }),
  },
  supportsQuickWithdrawBank: {
    key: 5,
    title: (s: number) =>
      s
        ? t('n1377', { n: kycBankCode.value })
        : t('n1376', { n: kycBankCode.value }),
  },
  supportPhonepeWakeUp: {
    key: 6,
    title: (s: number) =>
      s
        ? t('n1379', { n: kycBankCode.value })
        : t('n1378', { n: kycBankCode.value }),
  },
  supportsExternalAppeal: {
    key: 7,
    title: (s: number) =>
      s
        ? t('n1381', { n: kycBankCode.value })
        : t('n1380', { n: kycBankCode.value }),
  },
  supportsExternalSell: {
    key: 8,
    title: (s: number) =>
      s
        ? t('n1383', { n: kycBankCode.value })
        : t('n1382', { n: kycBankCode.value }),
  },
  supportLotteryTicket: {
    key: 9,
    title: (s: number) =>
      s
        ? t('n1467', { n: kycBankCode.value })
        : t('n1466', { n: kycBankCode.value }),
  },
  supportsAutoTrade: {
    key: 9,
    title: (s: number) =>
      s
        ? t('n1498', { n: kycBankCode.value })
        : t('n1499', { n: kycBankCode.value }),
  },
} as const;
const remark = ref<string>('');
//开关确认
const confirmBy = async (e: any, type: any, data: any) => {
  remark.value = '';
  const {id, bankCode } = data;
  kycBankCode.value = bankCode;
  const s = e ? 1 : 0;
  Modal.confirm({
    title: allStatusMap[type].title(s), 
  content: () =>
    h(
      'div',
      { style: { marginTop: '12px' } },
      [
        h(
          'span',
          {
            style: {
              marginRight: '4px',
              color: 'red',
            },
          },
          '*' // 备注
        ),
        h(
          'span',
          {
            style: {
              fontWeight: '500',
            },
          },
          t('remark') // 备注
        ),
        h(Input.TextArea, {
          value: remark.value,
          placeholder: t('m562')+t('remark'),
          rows: 4,
          maxLength: 200,
          showCount: true,
          onInput: (e: Event) => {
            remark.value = (e.target as HTMLTextAreaElement).value;
          },
        }),
      ]
    ),
    onOk: async () => {
      if(!remark.value?.trim()){
        message.error(t('m562')+t('remark'));
        return Promise.reject();
      }
      const key = type+'Remark';
      let res: any;
      loading.value = true;
      let updataForm = {
        id,
        controlSwitchType: allStatusMap[type]?.key,
        remark: remark.value,
        status: e ? 1 : 0,
      };
      res = await kycBankAdminKycBankUpdateControlSwitch(updataForm).finally(()=>loading.value=false);
      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
    },
  });
}
//查看日志
const showLogDialog = ref(false);
const bankRecord = ref<any>({
  bankCode: undefined,
  controlSwitchType: undefined,
});
const viewLog = (bankCode:any,type: any) => {
  bankRecord.value = {
    bankCode: bankCode,
    controlSwitchType: allStatusMap[type]?.key,
  };
  showLogDialog.value = true;
}
const startUpload = (val:any) => {
  if(val) isUpload.value = true;
}
const finishUpload = (val:any) => {
  if(val) isUpload.value = false;
}
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
onMounted(() => {
  getGroupList();
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style scoped lang="less">
:deep(.light-green-switch) {
  &.ant-switch-checked {
    background-color: rgba(82, 196, 26, 0.65);
    &:hover {
      background-color: #3fcf57;
    }
  }
  .ant-switch-inner-checked,.ant-switch-inner-unchecked {
    font-size: 11px;
  }
}
.showLogIcon{
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
  vertical-align: middle;
}
</style>
