<template>
  <div class="search">
    <h2>{{ $t("m776") }}</h2>
    <!-- <a-row style="margin: 0 0 15px 0">
      <a-col :span="3">
        <a-select
          allowClear
          ref="select"
          class="searchstyle"
          v-model:value="query.bankCode"
          :placeholder="$t('m563')+$t('m776')"
        >
          <a-select-option
            v-for="(item) in groupList"
            :value="item"
            :key="item"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-col>
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
      </a-col>
    </a-row> -->
    <!-- v-permission="'admin:paytypeinfo:add'" -->
    <a-button type="primary" v-if="!dataSource.length" @click="showAddDialog" v-permission="'admin:paytypeinfo:add'" >{{ $t('add') }}</a-button>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' , y : getTabH+'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'channelCode'">
        <a-tooltip>
          <template #title>
            {{ record.channelCode }}
          </template>
          <div class="toopTipStyle">{{ record.channelCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'thirdCode'">
        <a-tooltip>
          <template #title>
            {{ record.thirdCode }}
          </template>
          <div class="toopTipStyle">{{ record.thirdCode }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'payType'">
        <!-- {{ channerlPayTypeMap[record.payType] }} -->
        {{ record.payType }}
      </template>
      <template v-if="column.key === 'maximumAmount'">
        <div>INR: {{ record.minimumAmount || 0 }} - {{ record.maximumAmount || 0 }}</div>
        <div>USDT: {{ record.usdtMinimumAmount || 0 }} - {{ record.usdtMaximumAmount || 0 }}</div>
      </template>
      <template v-if="column.key === 'dailyLimitAmount'"  >
        <div>INR: {{ record.dailyLimitAmount || 0 }}/{{ record.dailyLimitCount || 0 }}</div>
        <div>USDT: {{ record.usdtDailyLimitAmount || 0 }}/{{ record.usdtDailyLimitCount || 0 }}</div>
      </template>
      <template v-if="column.key === 'singleOrderCost'"  >
        <div>INR: {{ record.singleOrderCost || 0 }}</div>
        <!-- <div>USDT: {{ record.usdtSingleOrderCost || 0 }}</div> -->
      </template>
      <template v-if="column.key === 'status'"  >
      {{ statusMap[record.status] }}
      </template>
      <template v-if="column.key === 'rate'"  >
        <div>INR: {{ record.rate || 0 }}%</div>
        <!-- <div>USDT: {{ record.usdtRate || 0 }}%</div> -->
      </template>
      <template v-if="column.key === 'updateBy'"  >
      {{ record.updateBy || record.createBy }}
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
          v-permission="'admin:paytypeinfo:update'"
          >{{ $t("b8") }}
        </a-tag> 
        
        <!-- <a-popconfirm
          :title=" $t('t16') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record)"
        >
         <a-tag
          :color="'rgba(253, 11, 26, 1)'"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:paytypeinfo:del'"
          >{{ $t('b11') }}
        </a-tag>
        </a-popconfirm> -->
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" width="70%" :title="isEdit? $t('b8'): $t('add')" @cancel="closeAddDalog" :footer="null">
    <a-form
      :model="addFrom"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 16 }"
    >
    <a-row>
      <a-col :span="11">
      <a-form-item :label = "$t('m749')" :rules="[{ required: true, message: ''}]" name="weight">
        <a-input-number class="width20" :min="0" v-model:value="addFrom.weight"  :placeholder="$t('m562')+$t('m749')">
          <!-- <template #addonAfter>%</template> @blur="checkWeight" -->
        </a-input-number>
      </a-form-item>
      <a-form-item
        :label="$t('m770')"
        :rules="[{ required: true, message: ''}]"
      >
        <a-space>
          <a-input-number :min="1" :max="addFrom.maximumAmount-1" v-model:value="addFrom.minimumAmount" class="width10" >
            <!-- <template #addonAfter>%</template>  -->
          </a-input-number>
          —
          <a-input-number :min="addFrom.minimumAmount+1" v-model:value="addFrom.maximumAmount" class="width10" >
            <!-- <template #addonAfter>%</template>  -->
          </a-input-number>
        </a-space>
      </a-form-item>
      <a-form-item :label="$t('m771')" name="dailyLimitAmount">
        <a-input-number class="width20" :min="0" :step="100000" :precision="0" v-model:value="addFrom.dailyLimitAmount"  :placeholder="$t('m562')+$t('m771')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
      </a-form-item>
      <a-form-item :label = "$t('m772')" name="dailyLimitCount">
        <a-input-number class="width20" :min="0" :step="1000" :precision="0" v-model:value="addFrom.dailyLimitCount"  :placeholder="$t('m562')+$t('m772')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
      </a-form-item>
      </a-col>
      <a-col :span="11">
      <a-form-item :label = "$t('m773')"  name="channelCode">
        <a-input v-trim class="width20" :min="0" v-model:value="addFrom.channelCode"  :placeholder="$t('m562')+$t('m773')"/>
      </a-form-item>
      <a-form-item :label = "$t('m774')"  name="singleOrderCost">
        <a-input-number class="width20" :min="0"  v-model:value="addFrom.singleOrderCost"  :placeholder="$t('m562')+$t('m774')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
      </a-form-item>
      <a-form-item :label = "$t('m775')"  name="rate">
        <a-input-number class="width20" :min="0" v-model:value="addFrom.rate"  :placeholder="$t('m562')+$t('m775')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
        <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
      </a-form-item>
      <a-form-item :label="$t('state')" name="status" :rules="[{ required: true, message: ''}]">
        <a-select
          allowClear
          ref="select"
          class="searchstyle width20"
          v-model:value="addFrom.status"
          :placeholder="$t('m563')+$t('state')"
          :options="Object.entries(statusMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        >
        </a-select>
      </a-form-item>
      </a-col>
    </a-row>
    <h3>USDT</h3>
    <a-row>
      <a-col :span="11">
        <a-form-item :label="$t('n1776')" name="networkProtocol" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            mode="multiple"
            ref="select"
            class="searchstyle width20"
            v-model:value="addFrom.networkProtocol"
            :placeholder="$t('m563')+$t('n1776')"
          >
            <a-select-option
              v-for="(value, key) in networkProtocolMap"
              :key="key"
              :value="key"
              >{{ value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('m770')">
          <a-space>
            <a-input-number :min="1" :max="addFrom.usdtMaximumAmount-1" v-model:value="addFrom.usdtMinimumAmount" class="width10" >
            </a-input-number>
            —
            <a-input-number :min="addFrom.usdtMinimumAmount+1" v-model:value="addFrom.usdtMaximumAmount" class="width10" >
            </a-input-number>
          </a-space>
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item :label="$t('m771')" name="usdtDailyLimitAmount">
          <a-input-number class="width20" :min="0" :precision="0" v-model:value="addFrom.usdtDailyLimitAmount"  :placeholder="$t('m562')+$t('m771')">
          </a-input-number>
        </a-form-item>
        <a-form-item :label = "$t('m772')" name="usdtDailyLimitCount">
          <a-input-number class="width20" :min="0" :precision="0" v-model:value="addFrom.usdtDailyLimitCount"  :placeholder="$t('m562')+$t('m772')">
          </a-input-number>
        </a-form-item>
      </a-col>
    </a-row>
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button :loading="loading" type="primary" @click="addBtn">{{
          isEdit? $t('b8') : $t('add')
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog"
          >{{ $t('l54') }}</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  paytypeinfoList,
  paytypeinfoAdd,
  paytypeinfoUpdate,
} from "@/api/channel.api";
import { message } from "ant-design-vue";
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useI18n } from "vue-i18n";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
// import { channerlPayTypeMap } from "@/utils/publicData";
import Bus from '@/utils/bus';
// import { useCurrencyStore } from '@/stores/useCurrencyStore';
// const currencyStore = useCurrencyStore();
// const currencyList = computed(() => currencyStore.currencyList);
// const currencyList = computed(() => currencyStore.currencyList.filter((item:any) => !filutrCurrency.includes(item.currencyName)));
const { getTabH } = useTabHeight();
const props = defineProps(['id','type','thirdCode'])
const { t } = useI18n();
const query= ref<any>({
  asc:'',
  column:'',
  pageNo:1,
  pageSize:5,
  configId:props.id,
  channelType: props.type,
})
// const channerlPayTypeMap: any = {//代收/m776
//   1:t('m657'),//银行卡
//   2:'USDT',
//   3:'UPI',
//   6:'TRX',
// }
const columns:any = [
  {
    title: 'ID',
    dataIndex: "id",
    key: "id",
    width:60,
    align:"center"
  },
  {
    title: t('m773'),
    dataIndex: "channelCode",
    key: "channelCode",
    width:120,
    align:"center"
  },
  {
    title: t('m747'),
    dataIndex: "thirdCode",
    key: "thirdCode",
    width:120,
    align:"center"
  },
  {
    title: t('m749'),
    dataIndex: "weight",
    key: "weight",
    width:100,
    align:"center",
  },
  {
    title: t('m770'),
    dataIndex: "maximumAmount",
    key: "maximumAmount",
    width:170,
    align:"center"
  },
  {
    title: t('m102'),
    dataIndex: "dailyLimitAmount",
    key: "dailyLimitAmount",
    width:170,
    align:"center"
  },
  {
    title: t('m774'),
    dataIndex: "singleOrderCost",
    key: "singleOrderCost",
    width:120,
    align:"center"
  },
  {
    title: t('m775'),
    dataIndex: "rate",
    key: "rate",
    width:120,
    align:"center"
  },
  {
    title: t('state'),
    dataIndex: "status",
    key: "status",
    width:100,
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
    title: t("l67"),
    dataIndex: "updateTime",
    key: "updateTime",
    width: 140,
    align:"center",
  },
  {
    title: t('operation'),
    dataIndex: "action",
    key: "action",
    width:140,
    align:"center",
    fixed: 'right',
  },
];
const statusMap = <any>{
  0:t('l54'),
  1:t('l53'),
}
//网络协议枚举 key为协议编码 value为主网名称
const networkProtocolMap: any = {
  TRC20: 'TRON',
  ERC20: 'Ethereum',
  BEP20: 'BNB Smart Chain',
};
const linkTypeMap = <any>{
  1:t('m588'),
  2:t('m589'),
}
const peymentStatus = ref({
  3: "UPI",
  1: t("m657"),
})
const loading = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
let isEdit = false;
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 5,
  showSizeChanger: false,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref<any>({
  id: null,
  weight: null,
  dailyLimitAmount: 0,
  dailyLimitCount: 0,
  minimumAmount: 1,
  maximumAmount: 50000,
  status: 1,
  configId: props.id,
  singleOrderCost: undefined,
  rate: undefined,
  channelCode: undefined,
  usdtMinimumAmount: undefined,
  usdtMaximumAmount: undefined,
  usdtDailyLimitAmount: 0,
  usdtDailyLimitCount: 0,
  // usdtSingleOrderCost: undefined,
  // usdtRate: undefined,
  networkProtocol: [],
  channelType: 2,
});

const countWeight = ref(0);
const getList = async () => {
  loading.value=true;
  countWeight.value = 0;
  const res: any = await paytypeinfoList(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    dataSource.value = res.data.map((item:any) => {
      countWeight.value += item.weight;
      return item;
    });
    pagination.value.total = res.total || 0;
  }
};

const search = () => {
  pagination.value.current = 1;
  query.value.pageNo = 1;
  getList()
}
const resetQuery = () => {
  query.value = {
    asc:'',
    column:'',
    pageNo:1,
    pageSize:5,
    configId:props.id,
    channelType: props.type,
  };
  pagination.value.pageSize = 5;
  pagination.value.current =1;
  getList();
};


const showAddDialog = () => {
  isEdit = false;
  addFrom.value = {
    id: null,
    weight: null,
    dailyLimitAmount: 0,
    dailyLimitCount: 0,
    minimumAmount: 1,
    maximumAmount: 50000,
    status: 1,
    configId: props.id,
    singleOrderCost: undefined,
    rate: undefined,
    channelCode: undefined,
    usdtMinimumAmount: undefined,
    usdtMaximumAmount: undefined,
    usdtDailyLimitAmount: 0,
    usdtDailyLimitCount: 0,
    // usdtSingleOrderCost: undefined,
    // usdtRate: undefined,
    networkProtocol: [],
    channelType: 2,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  const { id, weight, dailyLimitAmount, dailyLimitCount, minimumAmount, maximumAmount, status, configId, singleOrderCost, rate, channelCode,
    usdtMinimumAmount, usdtMaximumAmount, usdtDailyLimitAmount, usdtDailyLimitCount, networkProtocol } = value;
  addFrom.value = {
    id,
    weight,
    dailyLimitAmount,
    dailyLimitCount,
    minimumAmount,
    maximumAmount,
    status,
    configId,
    singleOrderCost,
    rate,
    channelCode,
    usdtMinimumAmount,
    usdtMaximumAmount,
    usdtDailyLimitAmount,
    usdtDailyLimitCount,
    // usdtSingleOrderCost,
    // usdtRate,
    //返回为英文逗号分隔字符串，回填转为数组
    networkProtocol: networkProtocol ? String(networkProtocol).split(',') : [],
    channelType: 2,
  };
  isEdit = true;
  addDialog.value = true;
};
// const del = async (value: any) => {
//   const { id } = value;
//   loading.value = true;
//   const res: any = await deleteMerchantRatesConfig(id).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     message.success(t('s9'));
//     getList();
//   }
// };
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
    payType: null,
    weight: null,
    dailyLimitAmount: 0,
    dailyLimitCount: 0,
    minimumAmount: 1,
    maximumAmount: 50000,
    status: '1',
    configId: props.id,
    channelType: props.type,
  };
  isEdit = false;
  addDialog.value = false;
};
const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageNo = pag.current;
  query.value.pageSize = pag.pageSize;
  getList()
};


const checkWeight = (e:any) => {
  if(Number(e.target.value)+countWeight.value>10){
    message.error(t('m263')+t('n390'));
    addFrom.value.weight = null;
  }
}

const addBtn = async () => {
  addFrom.value.thirdCode=props.thirdCode;
  if(!addFrom.value.weight){
    message.error(t('m562')+t('m749'));
    return;
  }
  // if(Number(addFrom.value.weight)+countWeight.value>10){
  //   message.error(t('m263')+t('n390'));
  //   addFrom.value.weight = null;
  // }
  if(!addFrom.value.minimumAmount){
    message.error(t('m562')+t('n400'));
    return;
  }
  if(!addFrom.value.maximumAmount){
    message.error(t('m563')+t('n401'));
    return;
  }
  // if(!addFrom.value.dailyLimitAmount){
  //   message.error(t('m562')+t('m771'));
  //   return;
  // }
  // if(!addFrom.value.dailyLimitCount){
  //   message.error(t('m562')+t('m772'));
  //   return;
  // }
  if(!addFrom.value.networkProtocol || !addFrom.value.networkProtocol.length){
    message.error(t('m563')+t('n1776'));
    return;
  }
  if(![0,1].includes(addFrom.value.status)){
    message.error(t('m563')+t('state'));
    return;
  }
  let res;
  loading.value=true;
  //接口文档：configId/status 为字符串类型
  const payload = {
    ...addFrom.value,
    configId: String(addFrom.value.configId ?? props.id),
    status: String(addFrom.value.status),
    //提交为英文逗号分隔字符串
    networkProtocol: Array.isArray(addFrom.value.networkProtocol) ? addFrom.value.networkProtocol.join(',') : addFrom.value.networkProtocol,
  };
  if (isEdit) {
    res = await paytypeinfoUpdate(payload).finally(()=>loading.value=false);
  } else {
    res = await paytypeinfoAdd(payload).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
    Bus.emit('isPayChannelGet');
  }
};
// const currencyPayType = ref([])
// const getCurrencyPayType = async () => {
//   loading.value = true;
//   const res: any = await currencyPayTypeListById({
//     currencyId: props.id,type: props.type}).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     currencyPayType.value =res.data|| [];
//   }
// };
onMounted(() => {
  // getCurrencyPayType();
  getList();
  // getTabH.value = useTabHeight().getTabH.value;
});
</script>
<style lang="less" scoped>
.width10{
  width: 100px;
}
.width20{
  width: 330px;
}
.ant-btn {
    margin-left: 10px;
}
</style>

