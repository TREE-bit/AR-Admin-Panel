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
    <a-button type="primary" @click="showAddDialog" v-permission="'admin:thirdPayChannelConfigAdmin:add'" >{{ $t('add') }}</a-button>
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
      <template v-if="column.key === 'currencyType'">
        {{ $getMapItem(thirdChannelCurrencyMap,record.currencyType) || '-' }}
      </template>
      <template v-if="column.key === 'receiveMethod'">
        {{ $getMapItem(thirdChannelPayTypeMap,record.receiveMethod) || '-' }}
      </template>
      <template v-if="column.key === 'payType'">
        <!-- {{ channerlPayTypeMap[record.payType] }} -->
        {{ record.payType }}
      </template>
      <template v-if="column.key === 'singleAmountMax'">
        {{ record.singleAmountMin }} - {{ record.singleAmountMax }}
      </template>
      <template v-if="column.key === 'dailyAmountLimit'"  >
      {{ record.dailyAmountLimit }}/{{ record.dailyCountLimit }}
      </template>
      <template v-if="column.key === 'dndFlag'"  >
      {{ statusMap[record.dndFlag] }}
      </template>
      <template v-if="column.key === 'singleRate'"  >
      {{ record.singleRate }}%
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
          v-permission="'admin:thirdPayChannelConfigAdmin:update'"
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
          <a-input-number :min="1" :max="addFrom.singleAmountMax-1" v-model:value="addFrom.singleAmountMin" class="width10" >
            <!-- <template #addonAfter>%</template>  -->
          </a-input-number>
          —
          <a-input-number :min="addFrom.singleAmountMin+1" v-model:value="addFrom.singleAmountMax" class="width10" >
            <!-- <template #addonAfter>%</template>  -->
          </a-input-number>
        </a-space>
      </a-form-item>
      <a-form-item :label="$t('m771')" name="dailyAmountLimit">
        <a-input-number class="width20" :min="-1" :step="100000" :precision="0" v-model:value="addFrom.dailyAmountLimit"  :placeholder="$t('m562')+$t('m771')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
        <div class="collAndPay-msg">{{ $t('n952') }}</div>
      </a-form-item>
      <a-form-item :label = "$t('m772')" name="dailyCountLimit">
        <a-input-number class="width20" :min="-1" :step="1000" :precision="0" v-model:value="addFrom.dailyCountLimit"  :placeholder="$t('m562')+$t('m772')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
        <div class="collAndPay-msg">{{ $t('n952') }}</div>
      </a-form-item>
      <a-form-item :label = "$t('m775')"  name="singleRate">
        <a-input-number class="width20" :min="0" v-model:value="addFrom.singleRate"  :placeholder="$t('m562')+$t('m775')">
          <!-- <template #addonAfter>%</template> -->
        </a-input-number>
        <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
      </a-form-item>
      <a-form-item :label="$t('state')" name="dndFlag" :rules="[{ required: true, message: ''}]">
        <a-select
          allowClear
          ref="select"
          class="searchstyle width20"
          v-model:value="addFrom.dndFlag"
          :placeholder="$t('m563')+$t('state')"
          :options="Object.entries(statusMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
        >
        </a-select>
      </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item :label = "$t('userForm1')" name="currencyType" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            class="searchstyle width20"
            v-model:value="addFrom.currencyType"
            :placeholder="$t('m563')+$t('userForm1')"
            :disabled="isEdit"
            :options="Object.entries(thirdChannelCurrencyMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
          ></a-select>
        </a-form-item>
        <a-form-item :label = "$t('m776')" name="receiveMethod" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            class="searchstyle width20"
            v-model:value="addFrom.receiveMethod"
            :placeholder="$t('m563')+$t('m776')"
            :disabled="isEdit"
            :options="Object.entries(thirdChannelPayTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
          ></a-select>
        </a-form-item>
        <a-form-item :label = "$t('m773')"  name="channelCode">
          <a-input v-trim class="width20" :min="0" v-model:value="addFrom.channelCode"  :placeholder="$t('m562')+$t('m773')"/>
        </a-form-item>
        <a-form-item :label = "$t('n373')"  name="cashPageExpireTime">
          <a-input-number class="width20" :min="0" v-model:value="addFrom.cashPageExpireTime"  :placeholder="$t('m562')+$t('n373')">
            <template #addonAfter>{{ $t('s') }}</template>
          </a-input-number>
        </a-form-item>
        <a-form-item :label = "$t('m774')"  name="fixedCost">
          <a-input-number class="width20" :min="0"  v-model:value="addFrom.fixedCost"  :placeholder="$t('m562')+$t('m774')">
            <!-- <template #addonAfter>%</template> -->
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
  thirdPayChannelConfigAdminAdd,
  thirdPayChannelConfigAdminUpdate,
  thirdPayInfoAdminListPage,
} from "@/api/channel.api";
import { message } from "ant-design-vue";
import { onMounted, ref, h, computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import {thirdChannelPayTypeMap,thirdChannelCurrencyMap} from "@/utils/publicData";
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
  pageNo:1,
  pageSize:5,
  thirdCode: props.thirdCode,
})
// const channerlPayTypeMap: any = {//代收/代付类型
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
    title: t('m776'),
    dataIndex: "receiveMethod",
    key: "receiveMethod",
    width:100,
    align:"center",
  },
  {
    title: t('userForm1'),
    dataIndex: "currencyType",
    key: "currencyType",
    width:100,
    align:"center",
  },
  {
    title: t('m770'),
    dataIndex: "singleAmountMax",
    key: "singleAmountMax",
    width:140,
    align:"center"
  },
  {
    title: t('m102'),
    dataIndex: "dailyAmountLimit",
    key: "dailyAmountLimit",
    width:140,
    align:"center"
  },
  {
    title: t('m774'),
    dataIndex: "fixedCost",
    key: "fixedCost",
    width:100,
    align:"center"
  },
  {
    title: t('m775'),
    dataIndex: "singleRate",
    key: "singleRate",
    width:100,
    align:"center"
  },
  {
    title: t('state'),
    dataIndex: "dndFlag",
    key: "dndFlag",
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
  id: undefined,
  weight: undefined,
  dailyAmountLimit: 50000,
  dailyCountLimit: 10,
  singleAmountMin: 1,
  singleAmountMax: 50000,
  dndFlag: 0,
  fixedCost: undefined,
  singleRate: undefined,
  channelCode: undefined,
  channelType: 2,
  currencyType: undefined,
  receiveMethod: undefined,
  thirdCode: undefined,
  cashPageExpireTime: undefined,
});

const countWeight = ref(0);
const getList = async () => {
  loading.value=true;
  countWeight.value = 0;
  const res: any = await thirdPayInfoAdminListPage(query.value).finally(()=>loading.value=false);
  if (res && res.code === "1") {
    if(res.data.list && res.data.list.length && res.data.list[0].channelInfoList && res.data.list[0].channelInfoList.length){
      dataSource.value = res.data.list[0].channelInfoList.filter((item:any)=>item.channelType==2);
    }
    pagination.value.total = res.data.total;
  }
};

// const search = () => {
//   pagination.value.current = 1;
//   query.value.pageNo = 1;
//   getList()
// }
// const resetQuery = () => {
//   query.value = {
//     pageNo:1,
//     pageSize:5,
//     thirdCode: props.thirdCode,
//   };
//   pagination.value.pageSize = 5;
//   pagination.value.current =1;
//   getList();
// };


const showAddDialog = () => {
  isEdit = false;
  addFrom.value = {
    id: undefined,
    weight: undefined,
    dailyAmountLimit: 50000,
    dailyCountLimit: 10,
    singleAmountMin: 1,
    singleAmountMax: 50000,
    dndFlag: 0,
    fixedCost: undefined,
    singleRate: undefined,
    channelCode: undefined,
    channelType: 2,
    currencyType: undefined,
    receiveMethod: undefined,
    thirdCode: undefined,
    cashPageExpireTime: undefined,
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  const { id, weight, dailyAmountLimit, dailyCountLimit, singleAmountMin, singleAmountMax,
    dndFlag, fixedCost, singleRate, channelCode, currencyType, receiveMethod,cashPageExpireTime } = value;
  addFrom.value = {
    id,
    weight,
    dailyAmountLimit,
    dailyCountLimit,
    singleAmountMin,
    singleAmountMax,
    dndFlag,
    fixedCost,
    singleRate,
    channelCode,
    channelType: 2,
    currencyType,
    receiveMethod,
    cashPageExpireTime
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
    dailyAmountLimit: 50000,
    dailyCountLimit: 10,
    singleAmountMin: 1,
    singleAmountMax: 50000,
    dndFlag: '0',
    channelType: 2,
    currencyType: undefined,
    receiveMethod: undefined,
    thirdCode: undefined,
    cashPageExpireTime: undefined,
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
  // addFrom.value.thirdCode=props.thirdCode;
  if(!addFrom.value.weight){
    message.error(t('m562')+t('m749'));
    return;
  }
  // if(Number(addFrom.value.weight)+countWeight.value>10){
  //   message.error(t('m263')+t('n390'));
  //   addFrom.value.weight = null;
  // }
  if(!addFrom.value.singleAmountMin){
    message.error(t('m562')+t('n400'));
    return;
  }
  if(!addFrom.value.singleAmountMax){
    message.error(t('m563')+t('n401'));
    return;
  }
  if(!addFrom.value.currencyType){
    message.error(t('m562')+t('userForm1'));
    return;
  }
  if(!addFrom.value.receiveMethod){
    message.error(t('m563')+t('m776'));
    return;
  }
  // if(!addFrom.value.dailyAmountLimit){
  //   message.error(t('m562')+t('m771'));
  //   return;
  // }
  // if(!addFrom.value.dailyCountLimit){
  //   message.error(t('m562')+t('m772'));
  //   return;
  // }
  if(![0,1].includes(addFrom.value.dndFlag)){
    message.error(t('m563')+t('state'));
    return;
  }
  let res:any;
  loading.value=true;
  if (isEdit) {
    const { id, weight, dailyAmountLimit, dailyCountLimit, singleAmountMin, singleAmountMax,
      dndFlag, fixedCost, singleRate, channelCode,cashPageExpireTime } = addFrom.value;
    const updateData = {
      id, weight, dailyAmountLimit, dailyCountLimit, singleAmountMin, singleAmountMax,
      dndFlag, fixedCost, singleRate, channelCode,cashPageExpireTime
    }
    res = await thirdPayChannelConfigAdminUpdate(updateData).finally(()=>loading.value=false);
  } else {
    addFrom.value.thirdCode=props.thirdCode;
    res = await thirdPayChannelConfigAdminAdd(addFrom.value).finally(()=>loading.value=false);
  }
  if (res && res.code === "1") {
    message.success(isEdit ? t('s7') : t('s8'));
    getList();
    closeAddDalog();
    Bus.emit('isPayChannelManagerGet');
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
.collAndPay-msg{
  color: red;
  font-size: 10px;
}
</style>

