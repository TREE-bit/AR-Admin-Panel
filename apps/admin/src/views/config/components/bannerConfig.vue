<template>
    <div class="search">
      <a-button type="primary" @click="showAddDialog"   v-permission="'admin:banner:createBanner'">{{ $t('add') }}</a-button>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :scroll="{ x: 'max-content' , y : getTabH + 'px' }"
      :loading="loading"
      @change="handleTableChange"
      bordered
      :row-key="(record: any) => JSON.stringify(record)"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'bannerType'"  >
          {{ checkedTypeMap1[record.bannerType] }}
        </template>
        <template v-if="column.key === 'bannerImageUrl'"  >
          <a-image :width="160" :src="record.bannerImageUrl" />
        </template>
        <template v-if="column.key === 'status'"  >
        {{ checkedTypeMap[record.status] }}
        </template>
        <template v-if="column.key === 'platformType'">
          {{ $getMapItem(contentPlantTypeMap,record.platformType) || '-' }}
        </template>
        <template v-if="column.key === 'linkType'"  >
        {{ checkedLinkTypeMap[record.linkType] }}
        </template>
        <template v-if="column.key === 'action'">
          <a-tag
            color="rgba(22, 155, 213, 1)"
            style="cursor: pointer"
            size="small"
            @click="editDialog(record)"
            v-permission="'admin:banner:updateBanner'"
            >{{ $t("edit") }}
          </a-tag> 
          
          <!-- <a-popconfirm
            :title="$t('t16')"
            :description="$t('t17')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="del(record)"
          >
           <a-tag
            color="rgba(253, 11, 26, 1)"
            style="cursor: pointer"
            size="small"
            >{{ $t("b11") }}
          </a-tag>
          </a-popconfirm> -->
          <a-popconfirm
            :title="record.status=== 1? $t('m232'): $t('m233') "
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="checkenable(record)"
          >
           <a-tag
            :color="record.status=== 1? 'rgba(253, 11, 26, 1)' : 'rgba(22, 155, 213, 1)'"
            style="cursor: pointer"
            size="small"
            v-permission="'admin:banner:disable'"
            >{{ record.status=== 1? $t('m219'):$t('m218') }}
          </a-tag>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="addDialog" :title="isEdit? $t('m234'): $t('m235')" @cancel="closeAddDalog" :footer="null">
      <a-form
        :model="addFrom"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 22 }"
      >
        <a-form-item :label = "$t('m228')" name="bannerType" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            class="searchstyle"
            :placeholder= "$t('m231')"
            show-search
            style="width:50%"
            v-model:value="addFrom.bannerType"
          >
            <a-select-option
              v-for="(item, index) in bannerTypeList"
              :key="index"
              :value="item.index"
              >{{ checkedTypeMap1[item.index] }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('sort')" name="sortOrder">
          <a-input-number
            v-model:value="addFrom.sortOrder"
            style="width: 50%"
            :min="0"
          />
        </a-form-item>
        <a-form-item :label = "$t('m243')" name="linkType" :rules="[{ required: true, message: ''}]">
          <a-select
            allowClear
            class="searchstyle"
            :placeholder= "$t('m243')"
            show-search
            style="width:50%"
            v-model:value="addFrom.linkType"
          >
            <a-select-option
              v-for="(item, index) in linkType"
              :key="index"
              :value="item.index"
              >{{ checkedLinkTypeMap[item.index] }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('m230')" name="redirectUrl" :rules="[{ required: true, message: ''}]">
          <a-input v-trim v-model:value="addFrom.redirectUrl" :placeholder="$t('m230')" />
        </a-form-item>
        <a-form-item :label="$t('n1494')" name="platformType" :rules="[{ required: true, message: ''}]">
          <a-select
            v-model:value="addFrom.platformType"
            :placeholder="$t('n1494')"
            :options="Object.entries(contentPlantTypeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
          ></a-select>
        </a-form-item>
        <a-form-item :label="$t('m105')" name="bannerImageUrl" :rules="[{ required: true, message: ''}]">
            <!-- <a-input v-trim v-model:value="addFrom.bannerImageUrl" /> -->
            <Upload v-if="isMountUpload" v-model:value="addFrom.bannerImageUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
        </a-form-item>
        <a-form-item :label="$t('m236')" name="status">
            <a-switch v-model:checked="addChecked" @click="changeAddChecked"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button :loading="isUpload" type="primary" @click="addBtn">{{
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
    getBannerLit,
    disableBanner,
    enableBanner,
    addBanner,
    editBanner,
    delBanner,
  } from "@/api/c2cconfig.api";
  import { message } from "ant-design-vue";
  import { onMounted, ref, reactive } from "vue";
  import Upload from '@/components/Upload/index.vue'
  import { useI18n } from "vue-i18n";
  import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { contentPlantTypeMap } from "@/utils/publicData";
const { getTabH } = useTabHeight();
  const { t } = useI18n();
  const columns:any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width:100,
      align:"center"
    },
    {
      title: t('m228'),
      dataIndex: "bannerType",
      key: "bannerType",
      width: 140,
      align:"center"
    },
    {
      title: t('m229'),
      dataIndex: "bannerImageUrl",
      key: "bannerImageUrl",
      width: 200,
      align:"center",
    },
    {
      title: t('m230'),
      dataIndex: "redirectUrl",
      key: "redirectUrl",
      ellipsis: true,
      width:300,
      align:"center",
    },
    {
      title: t('m243'),
      dataIndex: "linkType",
      key: "linkType",
      align:"center"
    },
    {
      title: t("n1494"),
      dataIndex: "platformType",
      key: "platformType",
      width: 120,
      align: "center",
    },
    {
      title: t('sort'),
      dataIndex: "sortOrder",
      key: "sortOrder",
      align:"center"
    },
    {
      title: t('state'),
      dataIndex: "status",
      key: "status",
      align:"center",
    },
    {
      title: t("l71"),
      dataIndex: "updateTime",
      key: "updateTime",
      align:"center",
      width:200,
    },
    {
      title: t("l48"),
      dataIndex: "updateBy",
      key: "updateBy",
      align:"center",
    },
    {
      title: t('operation'),
      dataIndex: "action",
      key: "action",
      align:"center",
      width:200,
    },
  ];
  const loading = ref(false);
  const isUpload = ref(false);
  const addDialog = ref(false);
  const dataSource = ref([]);
  const isMountUpload = ref(false);
  const addChecked = ref<boolean>(false);
  const bannerTypeList = ref([{index:'01',type: t('m246')},{index:'02',type: t('m247')}]);
  const linkType = ref([{index:1,type: t("m244")},{index:2,type: t("m245")}]);
  const checkedLinkTypeMap = <any>{
    "1": t("m244"),
    "2": t("m245"),
    };
  const checkedTypeMap = <any>{
    "0": t("m219"),
    "1": t("m218"),
    };
  const checkedTypeMap1 = <any>{
    "01": t("m246"),
    "02": t("m247"),
    };
  let isEdit = false;
  const pagination = reactive({
    total: 0,
    pageNo: 1,
    pageSize: 10,
    showSizeChanger: false,
    showTotal: (total: any) => t('total', [total]),
  });
  const addFrom = ref<any>({
    bannerType: null,
    sortOrder: 0,
    bannerImageUrl: "",
    status: '0',
    redirectUrl: "",
    linkType:null,
    platformType: undefined,
  });

  const changeAddChecked = () => {
    addChecked.value?addFrom.value.status= 1 : addFrom.value.status= 0;
  }
  const getList = async () => {
    const { pageNo, pageSize } = pagination;
    const res: any = await getBannerLit({
      pageNo,
      pageSize,
    });
    if (res && res.code === "1") {
      dataSource.value = res.data.list;
      pagination.total = res.data.total;
    }
  };
  const showAddDialog = () => {
    isEdit = false;
    isMountUpload.value = true;
    addFrom.value = {
        bannerType: null,
        sortOrder: 0,
        bannerImageUrl: "",
        status: '0',
        redirectUrl: "",
        linkType:null,
        platformType: undefined,
    };
    addChecked.value = false;
    addDialog.value = true;
  };
  const editDialog = (value: any) => {
    selectedRow();
    isEdit = true;
    const { id, bannerType, sortOrder, bannerImageUrl ,status, redirectUrl, linkType, platformType} = value;
    addFrom.value = {
        id,
        bannerType,
        sortOrder,
        bannerImageUrl,
        status,
        redirectUrl,
        linkType,
        platformType,
    };
    addFrom.value.status === 1?addChecked.value= true : addChecked.value= false;
    addDialog.value = true;
    isMountUpload.value = true;
  };
  const del = async (value: any) => {
    const { id } = value;
    const res: any = await delBanner({ id });
    if (res && res.code === "1") {
      message.success(t('s9'));
      getList();
    }
  };
  const checkenable = async (value: any) =>{
    const { id } = value;
    let res:any;
    if(value.status === 1){
        res = await disableBanner({id})
    }else{
        res = await enableBanner({id})
    }
    if (res && res.code === "1") {
      message.success(isEdit ? t('m238') : t('m237'));
      getList();
    }
  }

  const startUpload = (val:any) => {
    if(val) isUpload.value = true;
  }
  const finishUpload = (val:any) => {
    if(val) isUpload.value = false;
  }
  const closeAddDalog = () => {
    addFrom.value = {
        bannerType: "",
        sortOrder: 0,
        bannerImageUrl: "",
        status: null,
        redirectUrl: "",
        linkType:null,
        platformType: undefined,
    };
    isEdit = false;
    addDialog.value = false;
    isMountUpload.value = false;
    isUpload.value = false;
  };
  const handleTableChange: any = (value: {
    pageSize: number;
    current: number;
  }) => {
  const { current ,pageSize} = value;
  pagination.pageNo = current;
  pagination.pageSize = pageSize;
    getList();
  };
  const addBtn = async () => {
    if(!addFrom.value.bannerType){
      message.error(t('m563')+t('m231'))
      return;
    }
    if(!addFrom.value.linkType){
      message.error(t('m563')+t('m243'))
      return;
    }
    if(!addFrom.value.redirectUrl){
      message.error(t('m562')+t('m230'))
      return;
    }
    if(!addFrom.value.platformType){
      message.error(t('m563')+t('n1494'))
      return;
    }
    if(!addFrom.value.bannerImageUrl){
      message.error(t('m563')+t('m105'))
      return;
    }
    let res: any;
    if (isEdit) {
      const {bannerImageUrl, bannerType, linkType,redirectUrl, sortOrder, status, platformType} = addFrom.value
      const editFrom={bannerImageUrl, bannerType, linkType,redirectUrl, sortOrder, status, platformType}
      res = await editBanner(addFrom.value.id,editFrom);
    } else {
      res = await addBanner(addFrom.value);
    }
    if (res && res.code === "1") {
      message.success(isEdit ? t('s7') : t('s8'));
      getList();
      closeAddDalog();
    }
  };
  onMounted(() => {
    getList();
    getTabH.value = useTabHeight(3,80).getTabH.value;
  });
  </script>
  
