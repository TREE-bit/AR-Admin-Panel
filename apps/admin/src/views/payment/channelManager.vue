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
          v-model:value="query.collectionStatus"
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
          v-model:value="query.dndFlag"
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
          v-permission="'admin:thirdPayInfoAdmin:add'"
          >{{ $t("add") }}</a-button
        >
      </a-col>
    </a-row>
  </div>
  <!-- @resizeColumn="handleResizeColumn" -->
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: 'max-content' ,y : getTabH+'px' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
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
                {{ record.merchantCode }}
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
              {{ record.merchantCode }}
            </div>
          </div>
        </a-tooltip>
      </template>
      <!-- <template v-if="column.key === 'merchantCode'">
        <a-tooltip v-if="record.merchantCode">
          <template #title>
            {{ record.merchantCode }}
          </template>
          <div class="toopTipStyle">
            {{ record.merchantCode }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template> -->
      <template v-if="column.key === 'innerInrBalance'">
        <div class="blannceBox">
          <div class="blannceItem">
            <div class="blannceTitle">INR:</div>
            <div class="blannceInfo">
              <div>{{ $t('n855') }}&nbsp;&nbsp;{{ record.innerInrBalance ? thousand(record.innerInrBalance) : 0 }}</div>
              <div>{{ $t('n856') }}&nbsp;&nbsp;{{ record.inrBalance ? thousand(record.inrBalance) : 0 }}</div>
            </div>
          </div>
          <div class="blannceItem">
            <div class="blannceTitle">USDT:</div>
            <div class="blannceInfo">
              <div>{{ $t('n855') }}&nbsp;&nbsp;{{ record.innerUsdtBalance ? thousand(record.innerUsdtBalance) : 0 }}</div>
              <div>{{ $t('n856') }}&nbsp;&nbsp;{{ record.usdtBalance ? thousand(record.usdtBalance) : 0 }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'payTypeInfo'">
          <div class="tableText">
              {{ $t('state') }}：
              <!-- @click="switchBy($event, record.id,1)" -->
              <a-switch
                :checked="record.collectionStatus == '1' ? true : false"
                @change="confirmBy($event,1,record)"
                :disabled="!hasPermission('admin:thirdPayInfoAdmin:update')"
                size="small"
              />
              <!-- <span :style="record.payStatus === '1' ? 'color:#52c41a' : 'color:red'">{{ record.payStatus === '1' ? $t('enabled') : $t('disabled') }}</span> -->
              <div v-if="record.channelInfoList">
                <div class="toopTipStyle informationText" v-for="(item,index) in record.channelInfoList">
                  <div class="table_grids" v-if="item.channelType == 1">
                    <div class="table_grids_item">
                      <div>
                        {{ $t("m748") }}:
                        <span class="channel_text">
                          【{{ item.singleAmountMin || 0 }} - {{ item.singleAmountMax || 0}}】
                        </span>
                      </div>
                      <div>
                        {{ $t('m771') }}:
                        <span class="channel_text">
                          {{ item.todayTradeAmount || 0 }}/{{ item.dailyAmountLimit || 0 }}
                        </span>
                      </div>
                      <div>
                        {{ $t('n1050') }}:
                        <span class="channel_text">
                          {{ item.todayTradeAmount || 0 }}
                        </span>
                      </div>
                    </div>
                    <div class="table_grids_item">
                      <div>
                        {{ $t('m749') }}:
                        <span class="channel_text">{{ item.weight }}</span>
                      </div>
                      <div>
                        {{ $t('m772') }}:
                        <span class="channel_text">
                          {{ item.todayTradeCount || 0 }}/{{ item.dailyCountLimit || 0 }}
                        </span>
                      </div>
                      <div>
                        {{ $t('n1049') }}:
                        <span class="channel_text">
                          {{ formatAmountWithUnits(item.totalTradeAmount) }}
                        </span>
                      </div>
                    </div>
                    <div v-if="index>=0&&index<record.channelInfoList.length-1" class="bottom-line"></div>
                  </div>
                </div>
              </div>
          </div>
      </template>
      <template v-if="column.key === 'paymentTypeInfo'">
          <div class="tableText">
            {{ $t('state') }}：
            <a-switch
             :checked="record.paymentStatus == '1' ? true : false"
              @change="confirmBy($event,2,record)"
              :disabled="!hasPermission('admin:thirdPayInfoAdmin:update')"
              size="small"
            />
            <div v-if="record.channelInfoList">
              <div class="toopTipStyle informationText" v-for="(item,index) in record.channelInfoList">
                  <div class="table_grids" v-if="item.channelType == 2">
                    <div class="table_grids_item">
                      <div>
                        {{ $t("m748") }}:
                        <span class="channel_text">
                          【{{ item.singleAmountMin || 0 }} - {{ item.singleAmountMax || 0}}】
                        </span>
                      </div>
                      <div>
                        {{ $t('m771') }}:
                        <span class="channel_text">
                          {{ item.todayTradeAmount || 0 }}/{{ item.dailyAmountLimit || 0 }}
                        </span>
                      </div>
                      <div>
                        {{ $t('n1050') }}:
                        <span class="channel_text">
                          {{ item.todayTradeAmount || 0 }}
                        </span>
                      </div>
                    </div>
                    <div class="table_grids_item">
                      <div>
                        {{ $t('m749') }}:
                        <span class="channel_text">{{ item.weight }}</span>
                      </div>
                      <div>
                        {{ $t('m772') }}:
                        <span class="channel_text">
                          {{ item.todayTradeCount || 0 }}/{{ item.dailyCountLimit || 0 }}
                        </span>
                      </div>
                      <div>
                        {{ $t('n1049') }}:
                        <span class="channel_text">
                          {{ formatAmountWithUnits(item.totalTradeAmount) }}
                        </span>
                      </div>
                    </div>
                    <div v-if="Number(index)>=0&&Number(index)<record.channelInfoList.length-1" class="bottom-line"></div>
                  </div>
              </div>
            </div>
          </div>
      </template>
      <!-- <template v-if="column.key === 'supportNoUtr'">
        <span :class="record.supportNoUtr == '1' ? 'tag-green' : record.supportNoUtr == '0' ? 'tag-red' : ''">
          {{ record.supportNoUtr == '1' ? $t('n1244') : record.supportNoUtr == '0' ? $t('n1243') : '-' }}
        </span>
      </template> -->
      <template v-if="column.key === 'dndFlag'">
        <a-switch
          :checked="record.dndFlag == 1 ? true : false"
          @change="confirmBy($event,3,record)"
          :disabled="!hasPermission('admin:thirdPayInfoAdmin:update')"
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
                  v-permission="'admin:thirdPayInfoAdmin:update'"
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
                  v-permission="'admin:thirdPayInfoAdmin:btn1'"
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
            name="apiDomain"
            :rules="[{ required: true, message: $t('m562')+$t('m754') }]"
          >
            <a-input v-trim v-model:value="merchantForm.apiDomain" :disabled="isCheck" :placeholder="$t('m562')+$t('m754')" />
          </a-form-item>
          <!-- <a-form-item
            :label="$t('n1242')"
            name="supportNoUtr"
            :rules="[{ required: true, message: $t('m563')+$t('n1242') }]"
          >
            <a-select
              allowClear
              style="width: 100%; margin-top: 5px;"
              ref="select"
              v-model:value="merchantForm.supportNoUtr"
              :placeholder="$t('m563')+$t('n1242')"
            >
              <a-select-option :value="0">{{ $t("n1243") }}</a-select-option>
              <a-select-option :value="1">{{ $t("n1244") }}</a-select-option>
            </a-select>
          </a-form-item> -->
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
            name="merchantCode"
            :rules="[{ required: true, message: $t('m562')+$t('n9') }]"
          >
            <a-input v=-trim
              :disabled="isCheck"
              :placeholder="$t('m562')+$t('n9')"
              v-model:value="merchantForm.merchantCode"
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
      <a-row v-if="isCheck">
        <a-col :span="11">
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">{{ $t('m523') }}：</div>
            <div class="operateBlannceMoney">INR&nbsp;&nbsp;&nbsp;&nbsp;{{ blannceForm.innerInrBalance }}</div>
            <div class="operateBlannceBtn">
              <a-button type="primary" size="small" :loading="loading"
              v-permission="'admin:thirdPayInfoAdmin:adjustThirdPartyBalance1'" @click="operateMoney(1,1)">{{ $t('b3') }}</a-button>
              <a-button type="primary" size="small" :loading="loading"
              v-permission="'admin:thirdPayInfoAdmin:adjustThirdPartyBalance2'" @click="operateMoney(2,1)" style="margin-left: 20px;">
                {{ $t('m836') }}</a-button>
            </div>
          </div>
          <div v-if="adjustBalance.currencyType == 1" class="operateBlannceInputBox">
            <div class="operateBlannceInput">
              <a-input-number v-model:value="adjustBalance.amount"
              :min="0"
              style="width: 100%;"
              :placeholder="adjustBalance.adjustType=='1'?$t('m562')+$t('l34'):$t('m562')+$t('n857')" />
            </div>
            <div class="operateBlannceRemark">
              <a-input v-model:value="adjustBalance.remark" :placeholder="$t('m562')+$t('remark')" />
            </div>
          </div>
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">{{ $t('n858') }}：</div>
            <div class="operateBlannceMoney">INR&nbsp;&nbsp;&nbsp;&nbsp;{{ blannceForm.inrBalance }}</div>
            <div class="operateBlannceBtn"></div>
          </div>
        </a-col>
        <a-col :span="11" style="margin-left: auto;">
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">{{ $t('m523') }}：</div>
            <div class="operateBlannceMoney">USDT&nbsp;&nbsp;&nbsp;&nbsp;{{ blannceForm.innerUsdtBalance }}</div>
            <div class="operateBlannceBtn">
              <a-button type="primary" size="small" :loading="loading"
              v-permission="'admin:thirdPayInfoAdmin:adjustThirdPartyBalance1'" @click="operateMoney(1,2)">{{ $t('b3') }}</a-button>
              <a-button type="primary" size="small" :loading="loading"
              v-permission="'admin:thirdPayInfoAdmin:adjustThirdPartyBalance2'" @click="operateMoney(2,2)" style="margin-left: 20px;">
                {{ $t('m836') }}</a-button>
            </div>
          </div>
          <div v-if="adjustBalance.currencyType == 2" class="operateBlannceInputBox">
            <div class="operateBlannceInput">
              <a-input-number v-model:value="adjustBalance.amount"
              :min="0"
              style="width: 100%;"
              :placeholder="adjustBalance.adjustType=='1'?$t('m562')+$t('l34'):$t('m562')+$t('n857')" />
            </div>
            <div class="operateBlannceRemark">
              <a-input v-model:value="adjustBalance.remark" :placeholder="$t('m562')+$t('remark')" />
            </div>
          </div>
          <div class="operateBlannceBox">
            <div class="operateBlannceTitle">{{ $t('n858') }}：</div>
            <div class="operateBlannceMoney">USDT&nbsp;&nbsp;&nbsp;&nbsp;{{ blannceForm.usdtBalance }}</div>
            <div class="operateBlannceBtn"></div>
          </div>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 20, offset:10 }">
        <a-button v-if="adjustBalance.adjustType" @click="saveAdjustBalance" :loading="loading" type="primary">{{ $t("save") }}</a-button>
        <a-button :loading="isCollUpload || isPaymentUpload" v-if="!isCheck" type="primary" @click="addBtn">{{
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
    <countPageAll v-if="countMod" :thirdCode="thirdCodeS" :typeList="typeList" />
  </a-modal>
  <!-- 代收代付配置 -->
  <a-modal
    v-model:open="openSetting"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <settingChannelAll v-if="openSetting" :id="channelId" :thirdCode="thirdCode" />
  </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, reactive, watch, toRefs, computed } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";
import settingChannelAll from "@/components/Payment/settingChannelAll.vue";
import countPageAll from "@/components/Payment/countPageAll.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useToast } from "@/hooks/useToast.hook";
import { usePermission } from "@/hooks";
import { 
  thirdPayInfoAdminListPage,
  thirdPayInfoAdminAdd,
  thirdPayInfoAdminUpdate,
  adjustThirdPartyBalance,
 } from "@/api/channel.api";
import { message,Modal } from "ant-design-vue";
// import { useMerchantInfo } from "@/hooks/useMerchantInfo.hook";
// import UploadFile from '@/components/UploadFile/index.vue'
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useThirdCode } from "@/stores/useThirdCode";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import Bus from '@/utils/bus'
import { thousand,formatAmountWithUnits } from "@/utils";
import { useMerchantStore } from "@/stores/useMerchantStore";
// const merchantList = computed(() => useMerchantStore().merchantList);
// const { thirdCodeList } = toRefs(useThirdCode());
const { hasPermission }=usePermission()
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
// const { getDetail } = useMerchantInfo();
const toast = useToast();
const dataSource = ref([]);
// const extendData = ref({});
const loading = ref(false);
// const selPayType = ref(1);
const channelId = ref(0);
const query = ref({
  pageNo: 1,
  pageSize: 20,
  thirdName: undefined,//通道名称
  thirdCode: undefined,//通道编码
  collectionStatus: undefined,//代收状态
  paymentStatus: undefined,//代付状态
  dndFlag: undefined,//状态
});
const columns = ref([
  {
    title: t("n879"),
    dataIndex: "thirdName",
    key: "thirdName",
    align: "center",
    // resizable: true,
    width: 140,
    fixed: 'left',
  },
  // {
  //   title: t("n9"),
  //   dataIndex: "merchantCode",
  //   key: "merchantCode",
  //   align: "center",
  //   width: 100,
  // },
  {
    title: t("m760"),
    dataIndex: "innerInrBalance",
    key: "innerInrBalance",
    align: "center",
    width: 140,
  },
  {
    title: t("m761"),
    dataIndex: "payTypeInfo",
    key: "payTypeInfo",
    align: "center",
    resizable: true,
    width: 300,
  },
  {
    title: t("m762"),
    dataIndex: "paymentTypeInfo",
    key: "paymentTypeInfo",
    align: "center",
    // resizable: true,
    width: 300,
  },
  // {
  //   title: t("n1242"),
  //   dataIndex: "supportNoUtr",
  //   key: "supportNoUtr",
  //   align: "center",
  //   width: 140,
  //   fixed: 'right',
  // },
  {
    title: t("state"),
    dataIndex: "dndFlag",
    key: "dndFlag",
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
  const res: any = await thirdPayInfoAdminListPage(query.value).finally(()=>loading.value = false);
  if (res.code === "1") {
    dataSource.value = res.data.list;
    // extendData.value = res.extend
    pagination.total = res.data.total;
  }
};
Bus.on('isPayChannelManagerGet',() => {
  getList();
})
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
    collectionStatus: undefined,//代收状态
    paymentStatus: undefined,//代付状态
    dndFlag: undefined,//状态
  };
  pagination.current = 1;
  pagination.pageSize = 20;
  clearSelected();
  getList();
};
/****************Add edit***************/
const isShow = ref(false);
const addWhiteDialog = ref(false);
const uploadMounted = ref(false);
const isCollUpload = ref(false);
const isPaymentUpload = ref(false);
// const startUploadColl = (val:any) => {
//   if(val) isCollUpload.value = true;
// }
// const finishUploadColl = (val:any) => {
//   if(val) isCollUpload.value = false;
// }
const isEdit = ref(false);
const merchantForm = ref({
    thirdName: '',//通道名称
    thirdCode: undefined,//通道编码
    merchantCode: undefined,//商户号
    md5Key: '',//三方密钥
    publicKey: '',//三方公钥
    privateKey: '',//三方私钥
    apiDomain: '',//域名地址
    whiteIps: '',//白名单
    collectionStatus: undefined,//代收状态
    paymentStatus: undefined,//代付状态
    dndFlag: undefined,//状态
    // supportNoUtr: undefined,//n1242
});
const addWhite = () => {
  merchantForm.value = {
    thirdName: '',//通道名称
    thirdCode: undefined,//通道编码
    merchantCode: undefined,//商户号
    md5Key: '',//三方密钥
    publicKey: '',//三方公钥
    privateKey: '',//三方私钥
    apiDomain: '',//域名地址
    whiteIps: '',//白名单
    collectionStatus: undefined,//代收状态
    paymentStatus: undefined,//代付状态
    dndFlag: undefined,//状态
    // supportNoUtr: undefined as any,//n1242
  };
  addWhiteDialog.value = true;
  uploadMounted.value = true;
  isShow.value = true;
  isCheck.value = false;
  isEdit.value = false;
};
//查看
const isCheck = ref(false);
const blannceForm=ref({
  innerInrBalance:'',//我方INR余额
  inrBalance:'',//回传INR余额
  innerUsdtBalance:'',//我方USDT余额
  usdtBalance:'',//回传USDT余额
  thirdCode:undefined,//三方编码
})
const checkDetail = (data: any) => {
  selectedRow();
  const { id, thirdName, thirdCode, merchantCode, md5Key, publicKey, privateKey,
    apiDomain, whiteIps, collectionStatus, paymentStatus, dndFlag,
    innerInrBalance, inrBalance, innerUsdtBalance, usdtBalance } = data;
  merchantForm.value = {
    thirdName,
    thirdCode,
    merchantCode,
    md5Key,
    publicKey,
    privateKey,
    apiDomain,
    whiteIps,
    collectionStatus,
    paymentStatus,
    dndFlag,
  }
  blannceForm.value = {
    innerInrBalance,//我方INR余额
    inrBalance,//回传INR余额
    innerUsdtBalance,//我方USDT余额
    usdtBalance,//回传USDT余额
    thirdCode,//三方编码
  }
  isShow.value = false;
  isEdit.value = false;
  isCheck.value = true;
  addWhiteDialog.value = true;
  uploadMounted.value = false;
};
//编辑
const showEditPageFun = (data: any) => {
  selectedRow();
  const { id,thirdName, thirdCode,merchantCode, md5Key, publicKey, privateKey, apiDomain,
     whiteIps, collectionStatus, paymentStatus, dndFlag } = data;
  merchantForm.value = {
    // id,
    thirdName,
    thirdCode,
    merchantCode,
    md5Key,
    publicKey,
    privateKey,
    apiDomain,
    whiteIps,
    collectionStatus,
    paymentStatus,
    dndFlag,
  }
  isEdit.value = true;
  isShow.value = false;
  isCheck.value = false;
  addWhiteDialog.value = true;
  uploadMounted.value = true;
};
watch(() => addWhiteDialog.value, () => {
  if(!addWhiteDialog.value){
    uploadMounted.value = false;
  }
})
//手动上分下分
const adjustBalance = ref({
  adjustType: undefined,//调整类型 1-增加 2-减少
  amount: undefined,//金额
  currencyType: undefined,//币种 1-INR 2-USDT
  thirdCode: undefined,//三方编码
  remark: undefined,//备注
})
const operateMoney = (type:any,currency:any) => {
  adjustBalance.value.adjustType = type;
  adjustBalance.value.currencyType = currency;
  adjustBalance.value.thirdCode = blannceForm.value.thirdCode;
}
const saveAdjustBalance = async () => {
  if(!adjustBalance.value.amount || adjustBalance.value.amount <= 0){
    return message.error(t('m562')+(adjustBalance.value.adjustType=='1'?t('l34'):t('n857')))
  }
  if(!adjustBalance.value.remark || adjustBalance.value.remark == ''){
    return message.error(t('m562')+t('remark'))
  }
  loading.value = true;
  let res: any = await adjustThirdPartyBalance(adjustBalance.value).finally(()=>loading.value = false);
  if (res.code === "1") {
    toast.success(t("s10"));
    getList();
    closeAddWhitedalog();
  }
}
const closeAddWhitedalog = () => {
  isEdit.value = false;
  addWhiteDialog.value = false;
  adjustBalance.value = {
    adjustType: undefined,//调整类型 1-增加 2-减少
    amount: undefined,//金额
    currencyType: undefined,//币种 1-INR 2-USDT
    thirdCode: undefined,//三方编码
    remark: undefined,//备注
  }
  blannceForm.value = {
    innerInrBalance:'',//我方INR余额
    inrBalance:'',//回传INR余额
    innerUsdtBalance:'',//我方USDT余额
    usdtBalance:'',//回传USDT余额
    thirdCode:blannceForm.value.thirdCode,//三方编码
  }
};
//开关确认
const confirmBy = async (e: any, type: any, data: any) => {
  const { thirdCode, md5Key, publicKey, privateKey, apiDomain, whiteIps, collectionStatus, paymentStatus, dndFlag } = data || {};
  let updataForm = {
    // id,
    // thirdName,
    thirdCode,
    md5Key,
    publicKey,
    privateKey,
    apiDomain,
    whiteIps,
    collectionStatus,
    paymentStatus,
    dndFlag,
  }
  const s = e ? 1 : 0;
  Modal.confirm({
    title: type == 1 ? e ? t("m763") : t("m764") : type == 2 ? e ? t("m765") : t("m766") : type == 3 ? e ? t("m767") : t("m768") : t("m763"), 
    onOk: async () => {
      let res: any;
      loading.value = true;
      if (type === 1) {
        updataForm.collectionStatus = s
        res = await thirdPayInfoAdminUpdate(updataForm).finally(()=>loading.value = false);
      } else if (type === 2) {
        updataForm.paymentStatus = s
        res = await thirdPayInfoAdminUpdate(updataForm).finally(()=>loading.value = false);
      } else if (type === 3) {
        updataForm.dndFlag = s
        res = await thirdPayInfoAdminUpdate(updataForm).finally(()=>loading.value = false);
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

//状态更新
// const switchBy = async (e: any, id: any, type: any) => {
//   let res: any;
//   if(type == 1){
//     res = await thirdPayInfoAdminUpdate({ payStatus:e, id })
//   }else if(type == 2){
//     res = await thirdPayInfoAdminUpdate({ paymentStatus:e, id })
//   }else if(type == 3){
//     res = await thirdPayInfoAdminUpdate({ dndFlag:e, id })
//   }
//   if (res.code === "1") {
//     message.success(t("s10"));
//     getList();
//   }
// }

//统计数据
const countMod = ref(false);
const thirdCodeS = ref('');
const typeList: any = ref([]);
const openCount = (values: any) => {
  selectedRow();
  // let list1 = values.payTypeInfo?.map((item: any) => item.payType) || [];
  // let list2 = values.paymentTypeInfo?.map((item: any) => item.payType) || [];
  // typeList.value = [...new Set([...list1, ...list2])];
  const { thirdCode } = values;
  thirdCodeS.value = thirdCode
  countMod.value = true;
}
//代收/代付配置
const openSetting = ref(false);
const thirdCode = ref('');
const currencyId = ref(0);
const colPayConfig = (values: any) => {
  selectedRow();
  // merchantCode.value = values.code;
  // currencyId.value = values.currencyId
  openSetting.value = true;
  channelId.value = values.id
  thirdCode.value = values.thirdCode
}
// 新增-修改-查看
const addBtn = async () => {
  let res: any;
  if(!merchantForm.value.thirdName || merchantForm.value.thirdName == ''){
    return message.error(t('m562')+t('m746'))
  }
  if(!merchantForm.value.thirdCode || merchantForm.value.thirdCode == ''){
    return message.error(t('m562')+t('m747'))
  }
  if(!merchantForm.value.merchantCode || merchantForm.value.merchantCode == ''){
    return message.error(t('m562')+t('n9'))
  }
  // if(merchantForm.value.md5Key.trim() == ''){
  //   return message.error(t('m562')+t('m755'))
  // }
  // if(merchantForm.value.publicKey.trim() == ''){
  //   return message.error(t('m562')+t('m756'))
  // }
  // if(!merchantForm.value.privateKey || merchantForm.value.privateKey.trim() == ''){
  //   return message.error(t('m562')+t('m757'))
  // }
  if(!merchantForm.value.apiDomain || merchantForm.value.apiDomain == ''){
    return message.error(t('m562')+t('m754'))
  }
  // if(![0,1].includes(merchantForm.value.supportNoUtr)){
  //   return message.error(t('m563')+t('n1242'))
  // }
  if (isEdit.value) {
    res = await thirdPayInfoAdminUpdate(merchantForm.value);
  } else {
    res = await thirdPayInfoAdminAdd(merchantForm.value);
  }
  if (res.code === "1") {
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
// :deep(.fastMoney>div>div){
//   float: left;
//   .ant-input-number-group-wrapper{
//     margin-right: 10px;
//   }
// }
// :deep(.fastMoney){
//   .ant-form-item-control{
//     width: 450px;
//   }
// }
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
.jarUrl{
  font-size: 12px;
  line-height: 30px;
  margin-left: 10px;
  width: 350px;
  overflow: hidden;
  height: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.channel_type{
  width: 50px;
  display: inline-block;
}
.informationText{
  .bottom-line{
    margin: 3px 0;
    border-bottom: 1px solid rgb(5, 188, 21);
  }
}
.channelBtn{
  min-width: 80px;
  margin: 5px;
}
.blannceBox{
  .blannceItem{
    display: grid;
    grid-template-columns: 1fr 3fr;
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
.operateBlannceInputBox{
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 10px;
  .operateBlannceInput{
    padding-right: 10px;
    padding-left: 4vw;
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
.table_grids{
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 3px;
}
</style>
