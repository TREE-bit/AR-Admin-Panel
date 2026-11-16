<template>
  <div class="search">
    <a-button type="primary" @click="showAddDialog" v-permission="'admin:frontPageConfig:saveInfo'">{{ $t("add") }}</a-button>
  </div>
  <a-table :dataSource="dataSource" :columns="columns" :pagination="false"
    :scroll="{ x: 'max-content', y: getTabH + 'px' }" :loading="loading" @change="handleTableChange" bordered
    :row-key="(record: any) => JSON.stringify(record)">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'frequency'">
        <div class="toopTipStyle3">
          {{ $getMapItem(frequencyMap,record.frequency) || '-' }}
        </div>
      </template>
      <template v-if="column.key === 'platformType'">
        {{ $getMapItem(contentPlantTypeMap,record.platformType) || '-' }}
      </template>
      <template v-if="column.key === 'windowStyle'">
        <div class="toopTipStyle3">
          {{ $getMapItem(windowStyleMap,record.windowStyle) || '-' }}
        </div>
      </template>
      <template v-if="column.key === 'status'">
        <span class="arbListTag">
          <span class="pointTag" :style="record.status == 1 ? 'background-color:#52c41a' : 'background-color:#f5222d'" ></span>
          {{ $getMapItem(statusTypeMap,record.status) }}
        </span>
      </template>
      <template v-if="column.key === 'titleEn'">
        <div class="toopTipStyle3">
          {{ record.titleEn || '-' }}
        </div>
      </template>
      <template v-if="column.key === 'titleHi'">
        <div class="toopTipStyle3">
          {{ record.titleHi || '-' }}
        </div>
      </template>
      <template v-if="column.key === 'contentEn'">
        <div class="limit-content toopTipStyle3" v-html="record.contentEn || '-'"></div>
      </template>
      <template v-if="column.key === 'contentHi'">
        <div class="limit-content toopTipStyle3" v-html="record.contentHi || '-'"></div>
      </template>
      <template v-if="column.key === 'createBy'">
        <a-tooltip>
          <template #title>{{ record.createBy || record.updateBy || '-' }}</template>
          <div class="toopTipStyle">{{ record.createBy || record.updateBy || '-' }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || record.updateTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag color="rgba(22, 155, 213, 1)" class="pointer" size="small" @click="editDialog(record)"
          v-permission="'admin:frontPageConfig:update'">{{ $t("edit") }}
        </a-tag>
        <a-popconfirm :title="record.status == 1 ? $t('m936') : $t('m236')" :ok-text="$t('yes')" :cancel-text="$t('no')"
          @confirm="checkenable(record)">
          <a-tag :color="record.status == 1
              ? 'rgba(253, 11, 26, 1)'
              : 'rgba(22, 155, 213, 1)'
            " 
            class="pointer" size="small" v-permission="'admin:frontPageConfig:update'"
            >
            {{ record.status == 1 ? $t("m219") : $t("m218") }}
          </a-tag>
        </a-popconfirm>
        <a-popconfirm
          :title="$t('t16')"
          :description="$t('t17')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="del(record.id)"
        >
          <a-tag
            color="rgba(253, 11, 26, 1)"
            class="pointer"
            size="small"
            v-permission="'admin:frontPageConfig:delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="addDialog" :title="isEdit ? $t('edit') : $t('add') " 
  :footer="null" width="80%">
    <a-form :model="addFrom" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-row>
        <a-col :span="10">
          <a-form-item :label="$t('m749')" name="sort" :rules="[{ required: true, message: '' }]">
            <a-input-number v-model:value="addFrom.sort" style="width: 40%" :min="0" />
          </a-form-item>
          <!-- <a-form-item :label="$t('state')" name="status" :rules="[{ required: true, message: '' }]">
            <a-radio-group v-model:value="addFrom.status"
              :options="Object.keys(statusTypeMap).map(key => ({ label: statusTypeMap[key], value: Number(key) }))"
            >
            </a-radio-group>
          </a-form-item> -->
          <a-form-item :label="$t('n934')" name="frequency" :rules="[{ required: true, message: '' }]">
            <a-radio-group v-model:value="addFrom.frequency"
              :options="Object.keys(frequencyMap).map(key => ({ label: frequencyMap[key], value: Number(key) }))"
            >
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n935')" name="windowStyle" :rules="[{ required: true, message: '' }]">
            <a-radio-group v-model:value="addFrom.windowStyle"
              :options="Object.keys(windowStyleMap).map(key => ({ label: windowStyleMap[key], value: Number(key) }))"
            >
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('n1494')" name="platformType" :rules="[{ required: true, message: ''}]">
            <a-select
              v-model:value="addFrom.platformType"
              :placeholder="$t('n1494')"
              :options="Object.entries(contentPlantTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="13">
          <div style="text-align: center;margin-bottom: 10px;">
            <a-button @click="changeLang(1)" :type="defaultLang == 1 ? 'primary' : 'default'">{{ $t('m579') }}</a-button>
            <a-button @click="changeLang(2)" :type="defaultLang == 2 ? 'primary' : 'default'" style="margin-left: 10px">{{ $t('m580') }}</a-button>
          </div>
          <a-form-item v-show="defaultLang == 1" :label="$t('n936')" name="titleEn" :rules="[{ required: true, message: '' }]">
            <a-input v-trim v-model:value="addFrom.titleEn" style="width: 40%"
            :maxlength="50" :placeholder="$t('m562') + $t('n936')" />
          </a-form-item>
          <a-form-item v-show="defaultLang == 1" :label="$t('n937')" name="contentEn" :rules="[{ required: true, message: '' }]">
            <!-- <AiEditor v-if="addDialog" :announcementContent="addFrom.contentEn" @change="setAnnouncementContentEn"
              @start="startUpload" @finish="finishUpload" /> -->
            <quillEditor v-if="addDialog" :announcementContent="addFrom.contentEn" @change="setAnnouncementContentEn"
              @start="startUpload" @finish="finishUpload" />
          </a-form-item>
          <a-form-item v-if="defaultLang == 2" :label="$t('n936')" name="titleHi" :rules="[{ required: true, message: '' }]">
            <a-input v-trim v-model:value="addFrom.titleHi" style="width: 40%"
              :maxlength="50" :placeholder="$t('m562') + $t('n936')" />
          </a-form-item>
          <a-form-item v-show="defaultLang == 2" :label="$t('n937')" name="contentHi" :rules="[{ required: true, message: '' }]">
            <!-- <AiEditor v-if="addDialog" :announcementContent="addFrom.contentHi" @change="setAnnouncementContentHi"
              @start="startUpload" @finish="finishUpload" /> -->
              <quillEditor v-if="addDialog" :announcementContent="addFrom.contentHi" @change="setAnnouncementContentHi"
              @start="startUpload" @finish="finishUpload" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button type="primary" :loading="loading" @click="addBtn">{{
          isEdit ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button class="ml-10"  @click="closeAddDalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { frontPageConfigList, frontPageConfigUpdate, frontPageConfigSave, frontPageConfigDelete } from "@/api/c2cconfig.api";
// import aieditor from "@/components/aieditor.vue";
import { message } from "ant-design-vue";
import { onMounted, ref, reactive, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import quillEditor from "@/components/quillEditor.vue";
// const AiEditor = defineAsyncComponent(() => import('@/components/aieditor.vue'));
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { contentPlantTypeMap } from "@/utils/publicData";
const { getTabH } = useTabHeight(4, 60);
const { t } = useI18n();
const frequencyMap = <any>{
  1: t("n938"),//每天一次
  2: t("n939"),//每次登陆弹出
  3: t("n940"),//用户每次返回首页
};
const windowStyleMap = <any>{
  1: t("n941"),//活动弹框
  2: t("n942"),//用户提醒
}
const defaultLang = ref(1);//1英文 2印地文
const columns: any = [
  {
    title: t("m749"),
    dataIndex: "sort",
    key: "sort",
    width: 60,
    align: "center",
  },
  {
    title: t("n936")+"(EN)",
    dataIndex: "titleEn",
    key: "titleEn",
    width: 140,
    align: "center",
  },
  {
    title: t("n937")+"(EN)",
    dataIndex: "contentEn",
    key: "contentEn",
    width: 240,
    align: "center",
  },
  // {
  //   title: t("n936")+"(HI)",
  //   dataIndex: "titleHi",
  //   key: "titleHi",
  //   align: "center",
  //   width: 140,
  // },
  // {
  //   title: t("n937")+"(HI)",
  //   dataIndex: "contentHi",
  //   key: "contentHi",
  //   width: 240,
  //   align: "center",
  // },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
  },
  {
    title: t("n1494"),
    dataIndex: "platformType",
    key: "platformType",
    width: 120,
    align: "center",
  },
  {
    title: t("n934"),
    dataIndex: "frequency",
    key: "frequency",
    align: "center",
    width: 120,
  },
  {
    title: t("n935"),
    dataIndex: "windowStyle",
    key: "windowStyle",
    align: "center",
    width: 120,
  },
  {
    title: t("l48"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 100,
  },
  {
    title: t("l67"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 140,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 100,
    fixed: 'right',
  },
];
const loading = ref(false);
const addDialog = ref(false);
const dataSource = ref([]);
const addChecked = ref<boolean>(false);
const statusTypeMap = <any>{
  1: t("l53"),//开启
  2: t("l54"),//关闭
};
let isEdit = ref(false);
const pagination = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20,
  showSizeChanger: false,
  showTotal: (total: any) => t("total", [total]),
});
const addFrom = ref({
  id: undefined,
  sort: 0,
  status: 2,
  frequency: 1,
  windowStyle: 1,
  titleEn: undefined,
  contentEn: undefined,
  titleHi: undefined,
  contentHi: undefined,
  platformType: undefined,
});
const changeLang = (val: number) => {
  defaultLang.value = val;
}
const getList = async () => {
  loading.value = true;
  const res: any = await frontPageConfigList().finally(() => { loading.value = false });
  if (res && res.code === "1") {
    dataSource.value = res.data;
    clearSelected();
  }
};
const showAddDialog = () => {
  addFrom.value = {
    sort: 1,
    titleEn: undefined,
    contentEn: undefined,
    titleHi: undefined,
    contentHi: undefined,
    status: 2,
    frequency: 1,
    windowStyle: 1,
    id: undefined,
    platformType: undefined,
  };
  defaultLang.value = 1;
  isEdit.value = false;
  addDialog.value = true;
};
const editDialog = (value: any) => {
  selectedRow();
  isEdit.value = true;
  const { id, sort, titleEn, titleHi, contentEn, contentHi, status, frequency, windowStyle, platformType } = value;
  addFrom.value = { id, sort, titleEn, titleHi, contentEn, contentHi, status, frequency, windowStyle, platformType };
  // addFrom.value.status == 1
  //   ? (addChecked.value = true)
  //   : (addChecked.value = false);
  defaultLang.value = 1;
  addDialog.value = true;
};
const checkenable = async (value: any) => {
  const { id, sort, titleEn, titleHi, contentEn, contentHi, status, frequency, windowStyle, platformType } = value;
  addFrom.value = { id, sort, titleEn, titleHi, contentEn, contentHi, frequency, windowStyle, status: Number(status) == 1 ? 2 : 1, platformType };
  let res:any = await frontPageConfigUpdate(addFrom.value);
  if (res && res.code === "1") {
    message.success(t("s10"));
    getList();
  }
};
const closeAddDalog = () => {
  addFrom.value = {
    sort: 0,
    titleEn: undefined,
    contentEn: undefined,
    titleHi: undefined,
    contentHi: undefined,
    status: 1,
    frequency: 1,
    windowStyle: 1,
    id: undefined,
    platformType: undefined,
  };
  isEdit.value = false;
  addDialog.value = false;
};
const handleTableChange: any = (value: {
  pageSize: number;
  current: number;
}) => {
  const { current, pageSize } = value;
  pagination.pageNo = current;
  pagination.pageSize = pageSize;
  getList();
};
const addBtn = async () => {
  if (addFrom.value.sort == null) {
    message.error(t('m562') + t('m749'));
    return;
  }
  if (!addFrom.value.titleEn) {
    message.error(t('m562') + t('n936'));
    return;
  }
  if (!addFrom.value.contentEn ) {
    message.error(t('m562') + t('n937'));
    return;
  }
  if(!addFrom.value.platformType){
    message.error(t('m563')+t('n1494'));
    return
  }
  let res: any;
  if (isEdit.value) {
    res = await frontPageConfigUpdate(addFrom.value);
  } else {
    res = await frontPageConfigSave(addFrom.value);
  }
  if (res && res.code === "1") {
    message.success(isEdit.value ? t("s7") : t("s8"));
    getList();
    closeAddDalog();
  }
};
const setAnnouncementContentEn = (value: any) => {
  addFrom.value.contentEn = value;
};
const setAnnouncementContentHi = (value: any) => {
  addFrom.value.contentHi = value;
};
const startUpload = (val: any) => {
  if (val) loading.value = true;
}
const finishUpload = (val: any) => {
  if (val) loading.value = false;
}

const del = async (id: any) => {
  loading.value = true;
  let res: any = await frontPageConfigDelete(id).finally(() => { loading.value = false });
  if (res && res.code === "1") {
    message.success(t("s9"));
    getList();
  }
};
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(4,60).getTabH.value;
});
</script>
<style lang="less" scoped>
.pointer {
  margin:6px
}
// 列表中弹窗内容的图片按缩略图展示，与 Banner 配置列表一致
:deep(.limit-content img) {
  max-width: 120px;
  max-height: 60px;
  object-fit: contain;
  vertical-align: middle;
}
</style>