<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row style="margin: 0 0 15px 0">
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
        <a-input v-trim
          v-model:value="query.bankName"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m581')"
        />
      </a-col> -->
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.bankCode"
          class="searchstyle"
          :placeholder="$t('m562')+$t('m651')"
        />
      </a-col> -->
      <!-- <a-col :span="3">
        <a-input v-trim
          v-model:value="query.ifscCode"
          class="searchstyle"
          :placeholder="$t('m562')+'ifscCode'"
        />
      </a-col> -->
      <a-col>
        <!-- <a-range-picker
          show-time
          v-model:value="createTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :placeholder="[$t('m65'), $t('m172')]"
        /> -->
        <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd" :title="$t('l50')" :type="1"/>
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
        <a-button type="primary" @click="showAddModal"
          v-permission="'admin:appVersionInfoAdmin:addAuto'"
        >{{ $t('add') }}</a-button>
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
      <template v-if="column.key === 'device'">
        {{ appList1[Number(record.device)] }}
      </template>
      <template v-if="column.key === 'isForcedUpdate'">
       <span :style="record.isForcedUpdate == 0 ? 'color:red':'color:#1777FF'"> {{ $t(statusList1[record.isForcedUpdate]) }} </span>
      </template>
      <!-- <template v-if="column.key === 'updateBy'">
        {{ record.updateBy ? record.updateBy : record.createBy }}
      </template> -->
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime ? record.updateTime : record.createTime }}
      </template>
      <template v-if="column.key === 'bankCode'">
        <a-tooltip v-if="record.bankCode">
          <template #title>{{ record.bankCode }}</template>
          <div class="toopTipStyle">{{ record.bankCode }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'description'">
        <a-tooltip>
          <template #title>{{ record.description }}</template>
          <div class="toopTipStyle">{{ record.description }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'downloadUrl'">
        <a-tooltip>
          <template #title>{{ record.downloadUrl }}</template>
          <div class="toopTipStyle">{{ record.downloadUrl }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showEditPageFun(record)"
          v-permission="'admin:appVersionManager:updateAuto'"
          >{{ $t("edit") }}
        </a-tag>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="showContent"
    :footer="null"
    :width="800"
    :title="isEdit?$t('edit')+ $t('m553') : $t('add')+$t('m553')"
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
        <a-col :span="24">
          <a-form-item :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m413') }}</span>
              </div>
            </template>
            <a-input v-trim
              v-model:value="planForm.appName"
              class="w200"
              :placeholder= "$t('m562') + $t('m413')"
            >
            </a-input>
          </a-form-item>
        <a-form-item :rules="[{ required: true }]"><!-- :rules="[{ required: true }]" -->
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m554') }}</span>
              </div>
            </template>
          <a-select
            allowClear
            class="w200"
            :placeholder= "$t('m563') + $t('m554')"
            show-search
            v-model:value="planForm.device"
            @change="changeDevice"
          >
            <a-select-option
              v-for="(item) in appList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :rules="[{ required: true }]"><!-- :rules="[{ required: true }]" -->
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m582') }}</span>
              </div>
            </template>
          <a-select
            allowClear
            class="w200"
            :placeholder= "$t('m563') + $t('m582')"
            show-search
            v-model:value="planForm.bankCode"
            @change="changeDevice"
          >
            <a-select-option
              v-for="(item) in groupList"
              :value="item"
              :key="item"
              >{{ item }}</a-select-option
            >
          </a-select>
        </a-form-item>
          <a-form-item :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m919') }}</span>
              </div>
            </template>
            <a-input v-trim
              v-model:value="planForm.appVersion"
              class="w200"
              :placeholder= "$t('m562') + $t('m919')"
            >
            </a-input>
          </a-form-item>
          <a-form-item  :rules="[{ required: true }]">
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m559') }}</span>
              </div>
            </template>
            <a-input v-trim
            v-if="planForm.device == 2"
              class="w200"
              v-model:value="planForm.downloadUrl"
              :placeholder= "$t('m562') + $t('m559')"
            >
            </a-input>
            <UploadFile v-if="isMountUpload && planForm.device == 1" v-model:value="planForm.downloadUrl" :fileType="['apk']"  @startUpload="startUpload"  @finishUpload="finishUpload" />
          </a-form-item>
          <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m918') }}</span>
              </div>
            </template>
            <a-switch
              v-model:checked="fourceCheck"
              @click="changeFours"
            />
          </a-form-item>
        <!-- </a-col>
        <a-col> -->
          <a-form-item>
            <template #label>
              <div class="label-wrapper">
                <span>{{ $t('m561') }}</span>
              </div>
            </template>
            <a-textarea
              v-model:value="planForm.description"
              :placeholder="$t('m562')+$t('remark')"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
            <!-- <quillEditor v-if="haveTask" style="width: 900px;height: 300px;" @start="imgStart" @finish="imgFinish" :announcementContent="planForm.updateDescription" @change="setAnnouncementContent"/> -->
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
          <a-button :loading="isUpload" style="margin-right: 14px;" @click="add" type="primary">{{ $t('save') }}</a-button>
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
</template>
<script lang="ts" setup>
import { getAppInfoPage , addAppInfo,updateAppInfo, getKycBankCodeList} from "@/api";
import { onMounted, ref, computed,h} from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { SearchOutlined } from '@ant-design/icons-vue';
import UploadFile from '@/components/UploadFile/index.vue'
import quillEditor from "@/components/quillEditor.vue";
// import{levelMap } from '@/utils/publicData'
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 24};
const haveTask = ref(false);
const isImgUpload = ref(false);
const isMountUpload = ref(false);
const isUpload = ref(false);
const isEdit = ref(false);
const query = ref<any>({
  asc: undefined,
  column: undefined,
  pageNo: 1,
  pageSize: 20,
  appType: 2,
  bankCode: undefined,
  createTimeEnd: '',
  createTimeStart: '',
})
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showTotal: (total: any) => t("total", [total]),
});
const fourceCheck = ref<boolean>(false);
const columns:any = [
  {
    title: t("e47"),
    align: "center",
    width: 60,
    customRender: ({ index }) => index + 1,
  },
  // {
  //   title: t('id'),
  //   dataIndex: "id",
  //   key: "id",
  //   align: "center",
  //   width: 80,
  // },
  {
    title: t('m413'),
    dataIndex: "appName",
    key: "appName",
    align: "center",
    width: 120,
  },
  {
    title: t("m919"),
    dataIndex: "appVersion",
    key: "appVersion",
    align: "center",
    width: 120,
  },
  {
    title: t("m561"),
    dataIndex: "description",
    key: "description",
    align: "center",
    width: 200,
  },
  {
    title: t('m554'),
    dataIndex: "device",
    key: "device",
    align: "center",
    width: 190,
  },
  {
    title: t('m582'),
    dataIndex: "bankCode",
    key: "bankCode",
    align: "center",
    width: 190,
  },
  {
    title: t('m559'),
    dataIndex: "downloadUrl",
    key: "downloadUrl",
    align: "center",
    width: 200,
  },
  {
    title: t('m918'),
    dataIndex: "isForcedUpdate",
    key: "isForcedUpdate",
    align: "center",
    width: 210,
  },
  // {
  //   title: t("l48"),
  //   dataIndex: "updateBy",
  //   key: "updateBy",
  //   align: "center",
  //   width: 160,
  // },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
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
const appList = <any>([
    {value:2,label:'ios'},
    {value:1,label:'android'},
  ]);
const statusList = <any>([
    {value:1,label:t('l53')},
    {value:0,label:t('l54')},
  ]);
const appList1 = <any>{
  2:'ios',
  1:'android'
};
const statusList1 = <any>{
  1:('yes'),
  0:('no')
};

const getList = async (isFirst: any = null) => {
  if(isFirst){
    query.pageNo = 1;
    pagination.value.current = 1;
  }
  loading.value = true;
  const res: any = await getAppInfoPage(query.value).finally(()=> loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data.list;
    pagination.value.total = res.data.total;
    pagination.value.current = query.value.pageNo;
    pagination.value.pageSize = query.value.pageSize;
  }
};
/****************Add edit***************/
const showContent = ref(false);
const planForm = ref({
  id: undefined,
  appName: undefined,
  appVersion: undefined,
  description: undefined,
  device: 1,
  downloadUrl: undefined,
  isForcedUpdate: undefined as any,
  appType: 2,
  bankCode: undefined,
});
const changeDevice = () => {
  planForm.value.downloadUrl = undefined;
}
const changeFours = () => {
  fourceCheck.value ? (planForm.value.isForcedUpdate = 1) : (planForm.value.isForcedUpdate = 0);
};
const showAddModal = () => {
  showContent.value = true;
  planForm.value = {
    id: undefined,
    appName: undefined,
    appVersion: undefined,
    description: undefined,
    device: 1,
    downloadUrl: undefined,
    isForcedUpdate: undefined,
    appType: 2,
    bankCode: undefined,
  }
  fourceCheck.value = false;
  isEdit.value = false;
  isMountUpload.value = true;
}
const showEditPageFun = (data: any) => {
  const {id, appName, appVersion, description, device, downloadUrl, isForcedUpdate, appType, bankCode } = data;
  planForm.value=  {id, appName, appVersion, description, device, downloadUrl, isForcedUpdate, appType, bankCode};
  planForm.value.isForcedUpdate === 1
    ? (fourceCheck.value = true)
    : (fourceCheck.value = false);
  isEdit.value = true;
  showContent.value = true;
  haveTask.value = true;
  isMountUpload.value = true;
};
const add = async () => {
  if(!planForm.value.appName){
    message.error(t('m562')+t('m413'));
    return;
  }
  if(!planForm.value.device){
    message.error(t('m563')+t('m554'));
    return;
  }
  if(!planForm.value.bankCode){
    message.error(t('m563')+t('m582'));
    return;
  }
  if(!planForm.value.appVersion){
    message.error(t('m562')+t('m919'));
    return;
  }
  if(!planForm.value.downloadUrl){
    if(planForm.value.device == 1){
      message.error(t('m921'));
    }else{
      message.error(t('m562')+t('m559'));
    }
    return;
  }
  loading.value = true;
  let res;
  if (!isEdit.value) {
    res = await addAppInfo(planForm.value).finally(()=> {
      loading.value = false;
    });
  }else{
    res = await updateAppInfo(planForm.value).finally(()=> {
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
  haveTask.value = false;
  isMountUpload.value = false;
  isUpload.value = false;
}

const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
  if(pag.pageSize != pagination.value.pageSize){
    query.value.pageNo = 1;
    pagination.value.current = 1;
  }else{
    query.value.pageNo = pag.current;
    pagination.value.current = pag.current;
  }
  pagination.value.pageSize = pag.pageSize;
  query.value.pageSize = pag.pageSize;
  getList();
};
const createTime = computed({
  get: () => {
    return [query.value.createTimeEnd, query.value.createTimeStart];
  },
  set: (val) => {
    query.value.createTimeEnd = val ? val[1] : "";
    query.value.createTimeStart = val ? val[0] : "";
  },
});
const resetQuery = () => {
  query.value = {
    pageSize: 20,
    pageNo: 1,
    appType: 2,
    bankCode: undefined,
    createTimeEnd: '',
    createTimeStart: '',
  };
  pagination.value.pageSize = 20;
  pagination.value.current = 1;
  getList();
}
const startUpload = (val:any) => {
  if(val) isUpload.value = true;
}
const finishUpload = (val:any) => {
  if(val) isUpload.value = false;
}
// const setAnnouncementContent = (value: any)=> {
//   planForm.value.updateDescription = value;
//   }
// const imgStart = (value:any) => {
//   isImgUpload.value = true;
// }
// const imgFinish = (value:any) => {
//   isImgUpload.value = false;
// }
const groupList = ref([])
const getGroupList = async () => {
  const res: any = await getKycBankCodeList();
  if (res && res.code === "1") {
    groupList.value =res.data|| [];
  }
};
onMounted(() => {
  getList();
  getGroupList();
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
