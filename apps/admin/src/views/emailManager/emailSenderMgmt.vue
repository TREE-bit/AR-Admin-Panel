<template>
  <div class="search">
    <h2>{{ $t("n120") }}</h2>
    <a-row>
      <a-col>
        <a-button type="primary" @click="showAddModal"
          v-permission="'admin:mailAccountConfigAdmin:add'"
        >{{ $t('add') }}</a-button>
        <a-button type="primary" @click="showExport"
          v-permission="'admin:mailAccountConfigAdmin:emailExport'"
        >{{ $t('n207') }}</a-button>
      </a-col>
    </a-row>
    </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' }"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'accountName'">
        <a-tooltip>
          <template #title>{{ record.accountName }}</template>
          <div class="toopTipStyle">{{ record.accountName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'platformType'">
        {{ platformTypeMap[Number(record.platformType)] }}
      </template>
      <template v-if="column.key === 'accountType'">
        {{ accountTypeMap[Number(record.accountType)] }}
      </template>
      <template v-if="column.key === 'fromAlias'">
        <a-tooltip v-if="record.fromAlias">
          <template #title>{{ record.fromAlias }}</template>
          <div class="toopTipStyle">{{ record.fromAlias }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'addressType'">
        {{ addressTypeMap[Number(record.addressType)] }}
      </template>
      <template v-if="column.key === 'retryAddress'">
        <a-tooltip v-if="record.retryAddress">
          <template #title>{{ record.retryAddress }}</template>
          <div class="toopTipStyle">{{ record.retryAddress }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'retryAliasName'">
        <a-tooltip v-if="record.retryAliasName">
          <template #title>{{ record.retryAliasName }}</template>
          <div class="toopTipStyle">{{ record.retryAliasName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'tagName'">
        <a-tooltip v-if="record.tagName">
          <template #title>{{ record.tagName }}</template>
          <div class="toopTipStyle">{{ record.tagName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'unSubscribeFilterLevel'">
        <a-tooltip>
          <template #title>{{ record.unSubscribeFilterLevel }}</template>
          <div class="toopTipStyle">{{ record.unSubscribeFilterLevel }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'unSubscribeLinkType'">
        <a-tooltip>
          <template #title>{{ record.unSubscribeLinkType }}</template>
          <div class="toopTipStyle">{{ record.unSubscribeLinkType }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status == 1 ? 'green' : 'red'">{{ record.status == 1 ? $t('enabled') : $t('disabled') }}</a-tag>
      </template>
      <template v-if="column.key === 'replyToAddress'">
        {{ record.replyToAddress ? $t('enabled') : $t('disabled') }}
      </template>
      <template v-if="column.key === 'clickTrace'">
        {{ record.clickTrace == '1' ? $t('enabled') : $t('disabled') }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:mailAccountConfigAdmin:edit'"
          >{{ $t("edit") }}
        </a-tag>
        <a-popconfirm
          :title=" record.status ? $t('m768') : $t('m767') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="updateStatus(record)"
        >
          <a-tag
            :color="record.status ? 'red' : 'green'"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:mailAccountConfigAdmin:enable'"
            >{{ record.status ? $t("disabled") : $t("enabled") }}
          </a-tag>
        </a-popconfirm>
        <a-popconfirm
          :title=" $t('t7') "
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="deleteEmail(record.id)"
        >
          <a-tag
            color="red"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:mailAccountConfigAdmin:remove'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showContent"
    :footer="null"
    :width="1200"
    :title="isEdit?$t('edit')+ $t('n135') : $t('add')+$t('n135')"
    @cancel="closeEdit"
  > 
    <a-form
      name="basic"
      autocomplete="off"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      style="text-align: left;"
    >
      <a-row style="margin-top: 30px;margin-bottom: 40px;">
        <a-col :span="11">
          <a-form-item :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n121') }}</span>
              </div>
            </template>
            <a-input v-trim
              v-model:value="planForm.accountName"
              class="w200"
              :placeholder= "$t('m562') + $t('n121')"
            >
            </a-input>
          </a-form-item>
        <a-form-item :rules="[{ required: true }]"><!-- :rules="[{ required: true }]" -->
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n179') }}</span>
              </div>
            </template>
          <a-select
            class="w200"
            :placeholder= "$t('m563') + $t('n179')"
            v-model:value="planForm.platformType"
            :options="Object.entries(platformTypeMap).map(([value, label]) => ({ value: Number(value), label }))"
          >
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{ required: true }]"><!-- :rules="[{ required: true }]" -->
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n122') }}</span>
              </div>
            </template>
          <a-select
            allowClear
            class="w200"
            :placeholder= "$t('m563') + $t('n122')"
            v-model:value="planForm.accountType"
            :options="Object.entries(accountTypeMap).map(([value, label]) => ({ value: Number(value), label }))"
          >
          </a-select>
        </a-form-item>
        <a-form-item>
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n123') }}</span>
            </div>
          </template>
          <a-input v-trim
            v-model:value="planForm.fromAlias"
            class="w200"
            :placeholder= "$t('m562') + $t('n123')"
          >
          </a-input>
        </a-form-item>
        <a-form-item :rules="[{ required: true }]">
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n124') }}</span>
            </div>
          </template>
          <a-input-number
            v-model:value="planForm.dailyQuota"
            :min="0"
            class="w200"
            :placeholder= "$t('m562') + $t('n124')"
          />
        </a-form-item>
        <a-form-item :rules="[{ required: true }]">
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n125') }}</span>
            </div>
          </template>
          <a-input-number 
            v-model:value="planForm.maxEmailPerSecond"
            :min="0"
            :max="100"
            class="w200"
            :placeholder= "$t('m562') + $t('n125')"
          />
        </a-form-item>
        <a-form-item :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n126') }}</span>
              </div>
            </template>
          <a-select
            allowClear
            class="w200"
            :placeholder= "$t('m563') + $t('n126')"
            v-model:value="planForm.addressType"
            :options="Object.entries(addressTypeMap).map(([value, label]) => ({ value, label }))"
          >
          </a-select>
        </a-form-item>
        <!-- <a-form-item>
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('状态') }}</span>
            </div>
          </template>
          <a-switch
            v-model:checked="planForm.status"
            :checked-children="$t('open')"
            :un-checked-children="$t('close')"
            :checkedValue="true"
            :unCheckedValue="false"
          />
        </a-form-item> -->
        <a-form-item :rules="[{ required: true }]">
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n127') }}</span>
            </div>
          </template>
          <a-input-number
            v-model:value="planForm.weight"
            :min="1"
            :max="100"
            class="w200"
            :placeholder= "$t('m562') + $t('n127')"
          />
        </a-form-item>
        </a-col>
        <a-col :span="11">
        <a-form-item>
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n128') }}</span>
            </div>
          </template>
          <a-switch
            v-model:checked="planForm.replyToAddress"
            :checked-children="$t('enabled')"
            :un-checked-children="$t('disabled')"
            :checkedValue="true"
            :unCheckedValue="false"
          />
        </a-form-item>
        <a-form-item v-if="planForm.replyToAddress" :rules="[{ required: true }]">
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n129') }}</span>
            </div>
          </template>
          <a-input-number v-trim
            v-model:value="planForm.retryAddress"
            class="w200"
            :placeholder= "$t('m562') + $t('n129')"
          />
        </a-form-item>
        <a-form-item v-if="planForm.replyToAddress" :rules="[{ required: true }]">
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n130') }}</span>
            </div>
          </template>
          <a-input-number v-trim
            v-model:value="planForm.retryAliasName"
            class="w200"
            :placeholder= "$t('m562') + $t('n130')"
          />
        </a-form-item>
        <a-form-item>
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n131') }}</span>
            </div>
          </template>
          <a-switch
            v-model:checked="planForm.clickTrace"
            :checked-children="$t('enabled')"
            :un-checked-children="$t('disabled')"
            :checkedValue="'1'"
            :unCheckedValue="'0'"
          />
        </a-form-item>
        <a-form-item v-if="planForm.clickTrace == '1'" :rules="[{ required: true }]">
          <template #label>
            <div class="label-wrapper">
              <span>{{ $t('n132') }}</span>
            </div>
          </template>
          <a-input v-trim
            v-model:value="planForm.tagName"
            class="w200"
            :placeholder= "$t('m562') + $t('n132')"
          />
        </a-form-item>
        <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n133') }}</span>
              </div>
            </template>
          <a-select
            allowClear
            class="w200"
            :placeholder= "$t('m563') + $t('n133')"
            v-model:value="planForm.unSubscribeFilterLevel"
            :options="Object.entries(unSubscribeFilterLevelMap).map(([value, label]) => ({ value, label }))"
          >
          </a-select>
        </a-form-item>
        <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('n134') }}</span>
              </div>
            </template>
          <a-select
            allowClear
            class="w200"
            :placeholder= "$t('m563') + $t('n134')"
            v-model:value="planForm.unSubscribeLinkType"
            :options="Object.entries(unSubscribeLinkTypeMap).map(([value, label]) => ({ value, label }))"
          >
          </a-select>
        </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 9 }">
        <!-- <a-popconfirm
          :title="$t('m364')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="updateContent"
        > -->
          <a-button :loading="loading" style="margin-right: 14px;" @click="add" type="primary">{{ $t('save') }}</a-button>
        <!-- </a-popconfirm> -->
        <a-button type="primary" html-type="close" @click="closeEdit">{{ $t('b10') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- <div class="description">
    <h3>{{ $t('m564') }}</h3>
    <ul>
      <ol>{{ $t('m565') }}</ol>
      <ol>{{ $t('m566') }}
        <div>{{ $t('m567') }}</div>
        <div>{{ $t('m568') }}</div>
      </ol>
      <ol>{{ $t('m569') }}</ol>
    </ul>
  </div> -->
  <a-modal
    v-model:open="showExportModal"
    :footer="null"
    :width="400"
    :title="$t('n207')"
    @cancel="closeExport"
  > 
    <h3>{{ $t('n164') }}:</h3>
    <a-select
    style="width: 100%;margin: 10px 0;"
    :placeholder="$t('m563')+$t('n164')"
    v-model:value="sendType"
    @change="getMemberNo"
    :disabled="changeLoading"
    :options="Object.entries(memberNumMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value, }))"
    >
    </a-select>
    <div>{{ $t('n163',{m:memberNo}) }}</div>
    <a-row style="margin-top: 15px;">
      <a-col :span="14" offset="7">
        <a-button type="default" @click="closeExport">{{ $t('取消') }}</a-button>
        <a-button type="primary" :loading="changeLoading" style="margin-left: 15px;" @click="exportEmail">{{ $t('export') }}</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script lang="ts" setup>
import { 
  mailAccountConfigAdminPage,
  mailAccountConfigAdminSave,
  mailAccountConfigAdminUpdate,
  mailAccountConfigAdminRemove,
  getMailAccountConfigAdminCount
} from "@/api/email.api";
import { mailAccountConfigAdminEmailExport } from "@/api/export";
import { onMounted, ref, computed,h} from "vue";
import { message } from "ant-design-vue";
import { emailReg } from "@/utils/publicData";
import { useI18n } from "vue-i18n";
import { SearchOutlined } from '@ant-design/icons-vue';
// import{levelMap } from '@/utils/publicData'
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const changeLoading = ref(false);
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 24};
const isEdit = ref(false);
const query = ref<any>({
  asc: undefined,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
})
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const platformTypeMap = <any>{
  1: t("n178"),//阿里云
  2: 'AWS',//aws
}
const accountTypeMap = <any>{
  0: t("n136"),//验证码
  1: t("n137"),//通知型
  2: t("n138"),//群发型
}
const addressTypeMap = <any>{
  0: t("n139"),//随机发信地址
  1: t("n140"),//使用账号地址
  2: t("n141"),//使用全球域名
}
const unSubscribeFilterLevelMap = <any>{
  disabled: t("n142"),//不过滤
  default: t("n143"),//采用默认策略，批量地址采用发信地址级别过滤
  mailfrom: t("n144"),//发信地址级别过滤
  mailfrom_domain: t("n145"),//发信域名级别过滤
  edm_id: t("n146"),//账号级别过滤
}
const unSubscribeLinkTypeMap = <any>{
  disabled: t("n147"),//不生成
  default: t("n148"),//采用默认策略：对批量类型的发信地址发给特定域名时会生成退订链接，如带有关键字'gmail', 'yahoo', 'google', 'aol.com', 'hotmail', 'outlook', 'ymail.com'等
  // zh_cn: t("生成，给将来埋点到内容准备"),//生成，给将来埋点到内容准备
  // en_us: t("生成，给将来埋点到内容准备"),//生成，给将来埋点到内容准备
}

const fourceCheck = ref<boolean>(false);
const columns:any = [
  // {
  //   title: t("e47"),
  //   align: "center",
  //   width: 60,
  //   customRender: ({ index }: { index: number }) => index + 1,
  // },
  {
    title: t('n121'),
    dataIndex: "accountName",
    key: "accountName",
    align: "center",
    width: 180,
  },
  {
    title: t('n179'),
    dataIndex: "platformType",
    key: "platformType",
    align: "center",
    width: 180,
  },
  {
    title: t('n122'),
    dataIndex: "accountType",
    key: "accountType",
    align: "center",
    width: 120,
  },
  {
    title: t("n123"),
    dataIndex: "fromAlias",
    key: "fromAlias",
    align: "center",
    width: 140,
  },
  {
    title: t("n124"),
    dataIndex: "dailyQuota",
    key: "dailyQuota",
    align: "center",
    width: 140,
  },
  {
    title: t('n125'),
    dataIndex: "maxEmailPerSecond",
    key: "maxEmailPerSecond",
    align: "center",
    width: 140,
  },
  {
    title: t('n126'),
    dataIndex: "addressType",
    key: "addressType",
    align: "center",
    width: 160,
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 140,
  },
  {
    title: t('n127'),
    dataIndex: "weight",
    key: "weight",
    align: "center",
    width: 120,
  },
  {
    title: t("n128"),
    dataIndex: "replyToAddress",
    key: "replyToAddress",
    align: "center",
    width: 160,
  },
  {
    title: t("n129"),
    dataIndex: "retryAddress",
    key: "retryAddress",
    align: "center",
    width: 160,
  },
  {
    title: t("n130"),
    dataIndex: "retryAliasName",
    key: "retryAliasName",
    align: "center",
    width: 160,
  },
  {
    title: t('n131'),
    dataIndex: "clickTrace",
    key: "clickTrace",
    align: "center",
    width: 120,
  },
  {
    title: t('n132'),
    dataIndex: "tagName",
    key: "tagName",
    align: "center",
    width: 140,
  },
  {
    title: t('n133'),
    dataIndex: "unSubscribeFilterLevel",
    key: "unSubscribeFilterLevel",
    align: "center",
    width: 180,
  },
  {
    title: t('n134'),
    dataIndex: "unSubscribeLinkType",
    key: "unSubscribeLinkType",
    align: "center",
    width: 180,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed:'right',
    width: 160,
  },
];

const getList = async (isFirst: any = null) => {
  if(isFirst){
    query.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  pagination.value.current = query.value.pageNo;
  pagination.value.pageSize = query.value.pageSize;
  const res: any = await mailAccountConfigAdminPage(query.value).finally(()=> loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data;
    pagination.value.total = res.total;
  }
};
/****************Add edit***************/
const showContent = ref(false);
const planForm = ref({
  id: undefined,
  accountName: undefined,//邮箱账号
  platformType: 1,//平台账号类型
  accountType: undefined,//邮箱类型
  fromAlias: undefined,//邮箱别名
  dailyQuota: 2000,//每日配额
  maxEmailPerSecond: 20,//每秒发送量
  addressType: '1',//发件地址类型
  status: 0,//状态
  weight: 1,//邮箱权重
  replyToAddress: false,//启用回信地址
  retryAddress: undefined,//回信地址
  retryAliasName: undefined,//回信地址别名
  clickTrace: '0',//启用数据跟踪
  tagName: undefined,//邮件标签
  unSubscribeFilterLevel: 'default',//过滤级别
  unSubscribeLinkType: 'default'//退订链接类型
});
const showAddModal = () => {
  showContent.value = true;
  planForm.value = {
    id: undefined,
    accountName: undefined,//邮箱账号
    platformType: 1,//平台账号类型
    accountType: undefined,//邮箱类型
    fromAlias: undefined,//邮箱别名
    dailyQuota: 2000,//每日配额
    maxEmailPerSecond: 20,//每秒发送量
    addressType: '1',//发件地址类型
    status: 0,//状态
    weight: 1,//邮箱权重
    replyToAddress: false,//启用回信地址
    retryAddress: undefined,//回信地址
    retryAliasName: undefined,//回信地址别名
    clickTrace: '0',//启用数据跟踪
    tagName: undefined,//邮件标签
    unSubscribeFilterLevel: 'default',//过滤级别
    unSubscribeLinkType: 'default'//退订链接类型
  }
  fourceCheck.value = false;
  isEdit.value = false;
}
const showEditPageFun = (data: any) => {
  const {id, accountName, platformType, accountType, fromAlias, dailyQuota, maxEmailPerSecond, addressType, status, weight, replyToAddress, retryAddress, retryAliasName, clickTrace, tagName, unSubscribeFilterLevel, unSubscribeLinkType } = data;
  planForm.value=  {id, accountName, platformType: Number(platformType), accountType, fromAlias, dailyQuota, maxEmailPerSecond, addressType, status, weight, replyToAddress, retryAddress, retryAliasName, clickTrace, tagName, unSubscribeFilterLevel, unSubscribeLinkType};
  isEdit.value = true;
  showContent.value = true;
};
const add = async () => {
  if(!planForm.value.accountName){
    message.error(t('m562')+t('n121'));
    return;
  }
  if(!emailReg.test(planForm.value.accountName)){
    message.error(t('n156'));
    return;
  }
  if(![1,2].includes(Number(planForm.value.platformType))){
    message.error(t('m563')+t('n179'));
    return;
  }
  if(![0,1,2].includes(Number(planForm.value.accountType))){
    message.error(t('m563')+t('n122'));
    return;
  }
  if(!planForm.value.dailyQuota || planForm.value.dailyQuota < 0){
    message.error(t('m562')+t('n124'));
    return;
  }
  if(!planForm.value.maxEmailPerSecond || planForm.value.maxEmailPerSecond < 0){
    message.error(t('m562')+t('n125'));
    return;
  }
  if(!planForm.value.addressType){
    message.error(t('m563')+t('n126'));
    return;
  }
  if(!planForm.value.weight){
    message.error(t('m562')+t('n127'));
    return;
  }
  if(planForm.value.replyToAddress){
    if(!planForm.value.replyToAddress){
      message.error(t('m562')+t('n129'));
      return;
    }
    if(!planForm.value.replyToAddress){
      message.error(t('m562')+t('n130'));
      return;
    }
  }
  if(planForm.value.clickTrace == '1'){
    if(!planForm.value.tagName){
      message.error(t('m562')+t('n132'));
      return;
    }
  }
  loading.value = true;
  let res;
  if (!isEdit.value) {
    res = await mailAccountConfigAdminSave(planForm.value).finally(()=> {
      loading.value = false;
    });
  }else{
    res = await mailAccountConfigAdminUpdate(planForm.value).finally(()=> {
      loading.value = false;
    });
  }
  if (res && res.code === '1') {
    message.success(t('s14'));
    showContent.value = false;
    getList();
  }
};
const closeEdit = () =>{
  isEdit.value = false;
  showContent.value = false;
}

const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  query.value.pageSize = pag.pageSize;
  query.value.pageNo = pag?.current;
  getList(
    Object.assign({}, query.value, {
      pageSize: pag.pageSize,
      pageNo: pag?.current,
    })
  );
};
const resetQuery = () => {
  query.value = {
    pageSize: 20,
    pageNo: 1,
    createTimeEnd: '',
    createTimeStart: '',
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
}

const updateStatus = async (val: any) => {
  const { status } = val;
  loading.value = true;
  const res: any = await mailAccountConfigAdminUpdate(Object.assign({}, val, { status: status == 1 ? 0 : 1 })).finally(()=> loading.value = false);
  if (res && res.code == '1') {
    message.success(t('s10'));
    getList();
  }
}
const deleteEmail = async (id: any) => {
  const res: any = await mailAccountConfigAdminRemove(id);
  if (res && res.code == '1') {
    message.success(t('s10'));
    getList();
  }
}
//导出群发对象
const showExportModal = ref(false);
const sendType = ref(1);
const memberNo = ref(0);
const memberNumMap = <any>{
  1: t("n165"),//今日登陆过会员
  3: t("n166"),//3天内登陆过会员
  7: t("n167"),//7天内登陆过会员
  30: t("n168"),//30天内登陆过会员
  0: t("n169"),//所有会员
}
const showExport = () => {
  showExportModal.value = true;
}
const closeExport = () => {
  showExportModal.value = false;
}
const getMemberNo = async () => {
  changeLoading.value = true;
  const res: any = await getMailAccountConfigAdminCount(sendType.value).finally(()=> changeLoading.value = false);
  if (res && res.code == "1") {
    memberNo.value = res.data;
  }
}
const exportEmail = async () => {
  loading.value = true;
  const res: any = await mailAccountConfigAdminEmailExport({days: sendType.value}).finally(()=> {
    loading.value = false;
    closeExport();
  });
}
onMounted(() => {
  getList();
  getMemberNo();
});
</script>

<style lang="less" scoped>
:deep(label){
width: 100%;
height: 100%;
padding-left: 12px;
}
.label-wrapper{
  font-weight: 600;
}
.description{
  margin-top: 30px;
  ul{
    text-indent: 20px;
    div{
      list-style: none;
      text-indent: 40px;
    }
  }
}
.limit-content {
  width: 380px;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
:deep(.limit-content img) {
  width: 200px;
}

.ant-table-cell {
  word-wrap: break-word; /* 适用于旧版本的浏览器 */
  overflow-wrap: break-word; /* 适用于现代浏览器 */
}
.w200{
  width: 300px;
}
</style>
