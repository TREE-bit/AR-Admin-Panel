<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.thirdName"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m746')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.thirdCode"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m747')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          ref="select"
          v-model:value="query.payStatus"
          :placeholder="$t('m563')+$t('n22')"
        >
          <a-select-option value="0">{{ $t("disabled") }}</a-select-option>
          <a-select-option value="1">{{ $t("enabled") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          ref="select"
          v-model:value="query.paymentStatus"
          :placeholder="$t('m563')+$t('n23')"
        >
          <a-select-option value="0">{{ $t("disabled") }}</a-select-option>
          <a-select-option value="1">{{ $t("enabled") }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          class="searchstyle"
          ref="select"
          v-model:value="query.status"
          :placeholder="$t('m563')+$t('state')"
        >
          <a-select-option value="0">{{ $t("disabled") }}</a-select-option>
          <a-select-option value="1">{{ $t("enabled") }}</a-select-option>
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
          @click="addWhite"
          v-permission="'admin:payConfigAdmin:add'"
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
    :scroll="{ x: 'max-content' ,y : getTabH+'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => record.id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'thirdName'">
        <a-tooltip>
          <template #title>
            <div class="thirdInfoBox">
              <div class="thirdInfoItem">
                {{ $t('n878') }}：
              </div>
              <div class="thirdInfoItem toopTipStyle">
                {{ record.thirdCode }}
              </div>
            </div>
            <div class="thirdInfoBox">
              <div class="thirdInfoItem">
                {{ $t('m674') }}：
              </div>
              <div class="thirdInfoItem toopTipStyle">
                {{ record.thirdName }}
              </div>
            </div>
            <div class="thirdInfoBox">
              <div class="thirdInfoItem">
                {{ $t('n9') }}：
              </div>
              <div class="thirdInfoItem toopTipStyle">
                {{ record.merchantNo }}
              </div>
            </div>
          </template>
          <div class="thirdInfoBox">
            <div class="thirdInfoItem">
              {{ $t('n878') }}：
            </div>
            <div class="thirdInfoItem toopTipStyle">
              {{ record.thirdCode }}
            </div>
          </div>
          <div class="thirdInfoBox">
            <div class="thirdInfoItem">
              {{ $t('m674') }}：
            </div>
            <div class="thirdInfoItem toopTipStyle">
              {{ record.thirdName }}
            </div>
          </div>
          <div class="thirdInfoBox">
            <div class="thirdInfoItem">
              {{ $t('n9') }}：
            </div>
            <div class="thirdInfoItem toopTipStyle">
              {{ record.merchantNo }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'balance'">
        <div class="blannceBox">
          <div class="blannceItem">
            <div class="blannceTitle">INR:</div>
            <div class="blannceInfo">
              <b>{{ record.thirdMerchantBalance ? thousand(record.thirdMerchantBalance) : 0 }}</b>
            </div>
          </div>
          <div class="blannceItem">
            <div class="blannceTitle">USDT-TRX:</div>
            <div class="blannceInfo">
              <b>{{ record.thirdMerchantBalanceUsdt ? thousand(record.thirdMerchantBalanceUsdt) : 0 }}</b>
            </div>
          </div>
          <div class="blannceItem">
            <div class="blannceTitle">USDT-BSC:</div>
            <div class="blannceInfo">
              <b>{{ record.thirdMerchantBalanceBepUsdt ? thousand(record.thirdMerchantBalanceBepUsdt) : 0 }}</b>
            </div>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'payTypeInfo'">
        <div class="tableText">
          {{ $t('state') }}：
          <a-switch
            :checked="record.payStatus == '1' ? true : false"
            @change="confirmBy($event,1,record)"
            :disabled="!hasPermission('admin:payConfigAdmin:update2')"
            size="small"
          />
          <div>
            <template v-if="record.payTypeInfo && record.payTypeInfo.length">
              <div class="toopTipStyle informationText" v-for="(item,index) in record.payTypeInfo">
                <div class="table_grids">
                  <div class="table_grids_item">
                    <div>
                      {{ $t("m748") }}:
                      <span class="channel_text">
                        【{{ item.minimumAmount || 0 }} - {{ item.maximumAmount || 0}}】INR
                      </span>
                    </div>
                    <div>
                      {{ $t('m771') }}:
                      <span class="channel_text">
                        {{ item.todayOrderAmount || 0 }}/{{ item.dailyLimitAmount || 0 }}
                      </span>
                    </div>
                    <div>
                      {{ $t('n1049') }}:
                      <span class="channel_text">
                        {{ formatAmountWithUnits(item.allOrderAmount) }}
                      </span>
                    </div>
                  </div>
                  <div class="table_grids_item">
                    <div>
                      {{ $t("m748") }}:
                      <span class="channel_text">
                        【{{ item.usdtMinimumAmount || 0 }} - {{ item.usdtMaximumAmount || 0}}】USDT
                      </span>
                    </div>
                    <div>
                      {{ $t('m771') }}:
                      <span class="channel_text">
                        {{ item.usdtTodayOrderAmount || 0 }}/{{ item.usdtDailyLimitAmount || 0 }}
                      </span>
                    </div>
                    <div>
                      {{ $t('n1049') }}:
                      <span class="channel_text">
                        {{ formatAmountWithUnits(item.usdtAllOrderAmount) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <span v-else>-</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'paymentTypeInfo'">
        <div class="tableText">
          {{ $t('state') }}：
          <a-switch
            :checked="record.paymentStatus == '1' ? true : false"
            @change="confirmBy($event,2,record)"
            :disabled="!hasPermission('admin:payConfigAdmin:update1')"
            size="small"
          />
          <div>
            <template v-if="record.paymentTypeInfo && record.paymentTypeInfo.length">
              <div class="toopTipStyle informationText" v-for="(item,index) in record.paymentTypeInfo">
                <div class="table_grids">
                  <div class="table_grids_item">
                    <div>
                      {{ $t("m748") }}:
                      <span class="channel_text">
                        【{{ item.minimumAmount || 0 }} - {{ item.maximumAmount || 0}}】INR
                      </span>
                    </div>
                    <div>
                      {{ $t('m771') }}:
                      <span class="channel_text">
                        {{ item.todayOrderAmount || 0 }}/{{ item.dailyLimitAmount || 0 }}
                      </span>
                    </div>
                    <div>
                      {{ $t('n1049') }}:
                      <span class="channel_text">
                        {{ formatAmountWithUnits(item.allOrderAmount) }}
                      </span>
                    </div>
                  </div>
                  <div class="table_grids_item">
                    <div>
                      {{ $t("m748") }}:
                      <span class="channel_text">
                        【{{ item.usdtMinimumAmount || 0 }} - {{ item.usdtMaximumAmount || 0}}】USDT
                      </span>
                    </div>
                    <div>
                      {{ $t('m771') }}:
                      <span class="channel_text">
                        {{ item.usdtTodayOrderAmount || 0 }}/{{ item.usdtDailyLimitAmount || 0 }}
                      </span>
                    </div>
                    <div>
                      {{ $t('n1049') }}:
                      <span class="channel_text">
                        {{ formatAmountWithUnits(item.usdtAllOrderAmount) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <span v-else>-</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'status'">
        <a-switch
          :checked="record.status == 1 ? true : false"
          @change="confirmBy($event,3,record)"
          :disabled="!hasPermission('admin:payConfigAdmin:update3')"
        />
      </template>
      <template v-if="column.key === 'action'">
        <a-dropdown :destroyPopupOnHide="true">
          <template #overlay>
            <a-menu>
              <!-- 查看 -->
              <div class="operBtn">
                <a-button
                  color="rgba(14, 186, 139, 1)"
                  style="cursor: pointer"
                  size="small"
                  @click="checkDetail(record)"
                  >{{ $t("b23") }}
                </a-button>
              </div>
              <!-- 编辑 -->
              <div class="operBtn"
              >
                <a-button
                  color="rgba(22, 155, 213, 1)"
                  style="cursor: pointer"
                  size="small"
                  @click="showEditPageFun(record)"
                  v-permission="'admin:payConfigAdmin:update4'"
                  >{{ $t("edit") }}
                </a-button>
              </div>
            </a-menu>
          </template>
          <a-button class="channelBtn" type="primary" size="small">
            {{ $t("operation") }}
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <!-- 代收代付配置 -->
              <div class="operBtn"
              >
                <a-button
                  color="rgba(14, 186, 139, 1)"
                  style="cursor: pointer"
                  size="small"
                  @click="colPayConfig(record)"
                  v-permission="'admin:payConfigAdmin:btn1'"
                  >{{ $t("m751") }}
                </a-button>
              </div>
              <!-- 统计数据 -->
              <div class="operBtn">
                <a-button
                  color="rgba(14, 186, 139, 1)"
                  style="cursor: pointer"
                  size="small"
                  @click="openCount(record)"
                  >{{ $t("m752") }}
                </a-button>
              </div>
            </a-menu>
          </template>
          <a-button class="channelBtn" type="primary" size="small">
            {{ $t("m753") }}
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </template>
    </template>
  </a-table>
  <!-- 新增/编辑/查看 -->
  <a-modal
    v-model:open="addWhiteDialog"
    width="80%"
    :title="!isShow ? isCheck ? $t('b23') : $t('edit') : $t('add')"
    :footer="null"
    @cancel="closeAddWhitedalog"
  >
    <a-form ref="formRef" :model="merchantForm">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            :label="$t('m746')"
            name="thirdName"
            :rules="[{ required: true, message: $t('m562')+$t('m746') }]"
          >
            <a-input v-trim v-model:value="merchantForm.thirdName" :disabled="isCheck" :placeholder="$t('m562')+$t('m746')" />
          </a-form-item>
          <a-form-item
            :label="$t('m747')"
            name="thirdCode"
            :rules="[{ required: true, message: $t('m562')+$t('m747') }]"
          >
            <a-input v-trim v-model:value="merchantForm.thirdCode" :disabled="isCheck || isEdit"
            :placeholder="$t('m562')+$t('m747')" />
          </a-form-item>
          <a-form-item
            :label="$t('m754')"
            name="domainUrl"
            :rules="[{ required: true, message: $t('m562')+$t('m754') }]"
          >
            <a-input v-trim v-model:value="merchantForm.domainUrl" :disabled="isCheck" :placeholder="$t('m562')+$t('m754')" />
          </a-form-item>
          <a-form-item
            :label="$t('m758')"
            name="whiteIps"
          >
            <a-textarea
              v-model:value="merchantForm.whiteIps"
              :placeholder="$t('m562')+$t('m759')"
              :disabled="isCheck"
              :rows="2"
            />
          </a-form-item>
        </a-col>
        <a-col :span="11">
          <a-form-item
            :label="$t('n9')"
            name="merchantNo"
            :rules="[{ required: true, message: $t('m562')+$t('n9') }]"
          >
            <a-input v-trim
              :disabled="isCheck"
              :placeholder="$t('m562')+$t('n9')"
              v-model:value="merchantForm.merchantNo"
              />
          </a-form-item>
          <a-form-item
            label="MD5 Key"
            name="md5Key"
          >
            <a-input v-trim v-model:value="merchantForm.md5Key" :disabled="isCheck" :placeholder="$t('m562')+' MD5 Key'" />
          </a-form-item>
          <a-form-item
            :label="$t('n1052')"
            name="publicKey"
          >
            <a-input v-trim v-model:value="merchantForm.publicKey" :disabled="isCheck" :placeholder="$t('m562')+$t('n1052')" />
          </a-form-item>
          <a-form-item
            :label="$t('n1053')"
            name="privateKey"
          >
            <a-input v-trim v-model:value="merchantForm.privateKey" :disabled="isCheck" :placeholder="$t('m562')+$t('n1053')" />
          </a-form-item>
        </a-col>
      </a-row>
      <h3 v-if="isCheck">{{ $t('m760') }}</h3>
      <a-row v-if="isCheck" class="mb-10">
        <a-col :span="8">
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">INR：</div>
            <div class="operateBlannceMoney">{{ blannceForm.thirdMerchantBalance ? thousand(blannceForm.thirdMerchantBalance) : 0 }}</div>
          </div>
        </a-col>
        <a-col :span="8" style="margin-left: auto;">
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">USDT-TRX：</div>
            <div class="operateBlannceMoney">{{ blannceForm.thirdMerchantBalanceUsdt ? thousand(blannceForm.thirdMerchantBalanceUsdt) : 0 }}</div>
          </div>
        </a-col>
        <a-col :span="8" style="margin-left: auto;">
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">USDT-TSC：</div>
            <div class="operateBlannceMoney">{{ blannceForm.thirdMerchantBalanceBepUsdt ? thousand(blannceForm.thirdMerchantBalanceBepUsdt) : 0 }}</div>
          </div>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 20, offset:10 }">
        <a-button v-if="!isCheck" type="primary" :loading="loading" @click="addBtn">{{
          isEdit ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddWhitedalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 统计数据 -->
  <a-modal
    v-model:open="countMod"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <countPage v-if="countMod" :thirdCode="thirdCodeS" />
  </a-modal>
  <!-- 代收代付配置 -->
  <a-modal
    v-model:open="openSetting"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <settingChannel v-if="openSetting" :id="channelId" :thirdCode="thirdCode" />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, reactive, watch } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";
import settingChannel from "@/components/Payment/settingChannel.vue";
import countPage from "@/components/Payment/countPage.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useToast } from "@/hooks/useToast.hook";
import { usePermission } from "@/hooks";
import {
  payConfigAdminListConfig,
  addListConfig,
  updateListConfig,
 } from "@/api/channel.api";
import { message,Modal } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import Bus from '@/utils/bus'
import { thousand,formatAmountWithUnits } from "@/utils";
const { hasPermission }=usePermission()
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const toast = useToast();
const dataSource = ref<any[]>([]);
const loading = ref(false);
const channelId = ref(0);
const query = ref({
  pageNo: 1,
  pageSize: 20,
  thirdName: undefined,//通道名称
  thirdCode: undefined,//通道编码
  payStatus: undefined,//代收状态
  paymentStatus: undefined,//代付状态
  status: undefined,//状态
});
const columns = ref([
  {
    title: t("n879"),
    dataIndex: "thirdName",
    key: "thirdName",
    align: "center",
    width: 140,
    fixed: 'left',
  },
  {
    title: t("m760"),
    dataIndex: "balance",
    key: "balance",
    align: "center",
    width: 140,
  },
  {
    title: t("m761"),
    dataIndex: "payTypeInfo",
    key: "payTypeInfo",
    align: "center",
    width: 300,
  },
  {
    title: t("m762"),
    dataIndex: "paymentTypeInfo",
    key: "paymentTypeInfo",
    align: "center",
    width: 300,
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 90,
    fixed: 'right',
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 130,
    fixed: 'right',
  },
]);
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const getList = async (isFirst: any = null) => {
  if (isFirst) {
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  loading.value = true;
  const res: any = await payConfigAdminListConfig(query.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data || [];
    pagination.total = res.total || 0;
    if (dataSource.value.length > 0) {
      localStorage.setItem('thirdCode', dataSource.value[0].thirdCode);
      Bus.emit('ChannelThirdCode', dataSource.value[0].thirdCode);
    }
  }
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  pagination.current = current;
  if (pageSize != query.value.pageSize) {
    query.value.pageSize = pageSize;
    pagination.pageSize = pageSize;
    query.value.pageNo = 1;
    pagination.current = 1;
  }
  getList();
};
const resetQuery = () => {
  query.value = {
    pageNo: 1,
    pageSize: 20,
    thirdName: undefined,//通道名称
    thirdCode: undefined,//通道编码
    payStatus: undefined,//代收状态
    paymentStatus: undefined,//代付状态
    status: undefined,//状态
  };
  pagination.current = 1;
  pagination.pageSize = 20;
  clearSelected();
  getList();
};
/****************Add edit***************/
const isShow = ref(false);
const addWhiteDialog = ref(false);
const isEdit = ref(false);
const merchantForm = ref<any>({
    id: undefined,
    thirdName: '',//通道名称
    thirdCode: undefined,//通道编码
    merchantNo: undefined,//商户号
    md5Key: '',//三方密钥
    publicKey: '',//三方公钥
    privateKey: '',//三方私钥
    domainUrl: '',//域名地址
    whiteIps: '',//白名单
    payStatus: undefined,//代收状态
    paymentStatus: undefined,//代付状态
    status: undefined,//状态
});
const addWhite = () => {
  merchantForm.value = {
    id: undefined,
    thirdName: '',//通道名称
    thirdCode: undefined,//通道编码
    merchantNo: undefined,//商户号
    md5Key: '',//三方密钥
    publicKey: '',//三方公钥
    privateKey: '',//三方私钥
    domainUrl: '',//域名地址
    whiteIps: '',//白名单
    payStatus: undefined,//代收状态
    paymentStatus: undefined,//代付状态
    status: undefined,//状态
  };
  addWhiteDialog.value = true;
  isShow.value = true;
  isCheck.value = false;
  isEdit.value = false;
};
//查看
const isCheck = ref(false);
const blannceForm=ref<any>({
  thirdMerchantBalance:'',//INR余额
  thirdMerchantBalanceUsdt:'',//USDT余额
  thirdCode:undefined,//通道编码
  thirdMerchantBalanceBepUsdt: '',
})
const checkDetail = (data: any) => {
  selectedRow();
  const { id, thirdName, thirdCode, merchantNo, md5Key, publicKey, privateKey,
    domainUrl, whiteIps, payStatus, paymentStatus, status,
    thirdMerchantBalance, thirdMerchantBalanceUsdt, thirdMerchantBalanceBepUsdt } = data;
  merchantForm.value = {
    id,
    thirdName,
    thirdCode,
    merchantNo,
    md5Key,
    publicKey,
    privateKey,
    domainUrl,
    whiteIps,
    payStatus,
    paymentStatus,
    status,
  }
  blannceForm.value = {
    thirdMerchantBalance,//INR余额
    thirdMerchantBalanceUsdt,//USDT余额
    thirdCode,//通道编码
    thirdMerchantBalanceBepUsdt,
  }
  isShow.value = false;
  isEdit.value = false;
  isCheck.value = true;
  addWhiteDialog.value = true;
};
//编辑
const showEditPageFun = (data: any) => {
  selectedRow();
  const { id, thirdName, thirdCode, merchantNo, md5Key, publicKey, privateKey,
    domainUrl, whiteIps, payStatus, paymentStatus, status } = data;
  merchantForm.value = {
    id,
    thirdName,
    thirdCode,
    merchantNo,
    md5Key,
    publicKey,
    privateKey,
    domainUrl,
    whiteIps,
    payStatus,
    paymentStatus,
    status,
  }
  isEdit.value = true;
  isShow.value = false;
  isCheck.value = false;
  addWhiteDialog.value = true;
};
const closeAddWhitedalog = () => {
  isEdit.value = false;
  addWhiteDialog.value = false;
  blannceForm.value = {
    thirdMerchantBalance:'',//INR余额
    thirdMerchantBalanceUsdt:'',//USDT余额
    thirdCode:blannceForm.value.thirdCode,//通道编码
    thirdMerchantBalanceBepUsdt: '',
  }
};
//开关确认
const confirmBy = async (e: any, type: any, data: any) => {
  const { id, merchantNo, thirdName, thirdCode, md5Key, publicKey, privateKey,
    domainUrl, whiteIps, payStatus, paymentStatus, status } = data || {};
  let updataForm = {
    id,
    merchantNo,
    thirdName,
    thirdCode,
    md5Key,
    publicKey,
    privateKey,
    domainUrl,
    whiteIps,
    payStatus,
    paymentStatus,
    status,
  }
  const s = e ? 1 : 0;
  Modal.confirm({
    title: type == 1 ? e ? t("m763") : t("m764") : type == 2 ? e ? t("m765") : t("m766") : type == 3 ? e ? t("m767") : t("m768") : t("m763"),
    onOk: async () => {
      let res: any;
      loading.value = true;
      if (type === 1) {
        updataForm.payStatus = s
        res = await updateListConfig(updataForm).finally(()=>loading.value = false);
      } else if (type === 2) {
        updataForm.paymentStatus = s
        res = await updateListConfig(updataForm).finally(()=>loading.value = false);
      } else if (type === 3) {
        updataForm.status = s
        res = await updateListConfig(updataForm).finally(()=>loading.value = false);
      }

      if (res && res.code === "1") {
        message.success(t("s10"));
        getList();
      }
    },
    onCancel() {
    },
  });
}
//统计数据
const countMod = ref(false);
const thirdCodeS = ref('');
const openCount = (values: any) => {
  selectedRow();
  const { thirdCode } = values;
  thirdCodeS.value = thirdCode
  countMod.value = true;
}
//代收/代付配置
const openSetting = ref(false);
const thirdCode = ref('');
const colPayConfig = (values: any) => {
  selectedRow();
  openSetting.value = true;
  channelId.value = values.id
  thirdCode.value = values.thirdCode
}
//代收代付配置弹窗关闭时刷新列表
watch(openSetting, (val, oldVal) => {
  if (oldVal && !val) {
    getList();
  }
})
// 新增-修改
const addBtn = async () => {
  let res: any;
  if(!merchantForm.value.thirdName || merchantForm.value.thirdName == ''){
    return message.error(t('m562')+t('m746'))
  }
  if(!merchantForm.value.thirdCode || merchantForm.value.thirdCode == ''){
    return message.error(t('m562')+t('m747'))
  }
  if(!merchantForm.value.merchantNo || merchantForm.value.merchantNo == ''){
    return message.error(t('m562')+t('n9'))
  }
  if(!merchantForm.value.domainUrl || merchantForm.value.domainUrl == ''){
    return message.error(t('m562')+t('m754'))
  }
  loading.value = true;
  if (isEdit.value) {
    res = await updateListConfig(merchantForm.value).finally(()=>loading.value = false);
  } else {
    res = await addListConfig(merchantForm.value).finally(()=>loading.value = false);
  }
  if (res && res.code === "1") {
    toast.success(isEdit.value ? t("s14") : t("s15"));
    closeAddWhitedalog();
    resetQuery();
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
:deep(.operBtn button) {
  width: 100%;
  height: 20px;
  font-size: 12px;
  text-align: center;
}
:deep(.ant-form-item-control-input-content) {
  display: flex;
  & > input,
  & > .ant-input-number {
    flex: 1;
  }
}
:deep(.windActive){
  font-weight: 600;
  color: red;
}
:deep(.ant-input-number-group-wrapper) {
  width: 100%;
}
.arform {
  gap: 10px;
  justify-content: space-between;
  & > div {
    width: calc((100% - 120px) / 2);
  }
}
.wrap-text{
  white-space: normal;
  word-break: break-word;
}
:deep(.showLink){
  display: none;
}
.toopTipStyle{
  font-weight: 500;
}
.channel_text{
  color:rgb(5, 188, 21);
  font-weight: 800;
}
.informationText{
  .bottom-line{
    margin: 3px 0;
    border-bottom: 1px solid rgb(5, 188, 21);
  }
}
.table_grids{
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 3px;
}
.channelBtn{
  min-width: 80px;
  margin: 5px;
}
.blannceBox{
  .blannceItem{
    display: grid;
    grid-template-columns: 2fr 4fr;
    .blannceTitle{
      display: flex;
      text-align: left;
      align-items: center;
    }
    .blannceInfo{
      text-align: left;
    }
  }
}
.operateBlannceBox{
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  .operateBlannceTitle{
    text-align: right;
    font-weight: 600;
    padding-right: 20px;
  }
  .operateBlannceMoney{
    text-align: left;
    padding-left: 20px;
  }
  .operateBlannceBtn{
    text-align: left;
    padding-left: 20px;
  }
}
.thirdInfoBox{
  display: grid;
  grid-template-columns: 1fr 2fr;
  .thirdInfoItem{
    display: flex;
    align-items: center;
  }
}
</style>
