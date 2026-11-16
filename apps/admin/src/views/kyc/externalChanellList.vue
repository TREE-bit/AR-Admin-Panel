<template>
    <div class="search">
      <h2>{{ $getMenuName() }}</h2>
      <a-row style="margin: 0 0 15px 0">
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.name"
            class="searchstyle"
            :placeholder="$t('n1276')"
          />
        </a-col>
        <a-col :span="3">
          <a-input v-trim
            v-model:value="query.code"
            class="searchstyle"
            :placeholder="$t('n1278')"
          />
        </a-col>
        <a-col :span="3">
          <a-select
            allowClear
            ref="select"
            class="searchstyle"
            v-model:value="query.status"
            :placeholder="$t('state')"
          >
            <a-select-option :value="1">{{ $t('enabled') }}</a-select-option>
            <a-select-option :value="0">{{ $t('disabled') }}</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <timeRange v-model:startTime="query.createTimeStart" v-model:endTime="query.createTimeEnd"  :title="$t('l70')" :type="1"/>
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
          <a-button type="primary" @click="add" v-permission="'admin:extChannelAdmin:createMerchantInfo'">{{
            $t("add")
          }}</a-button>
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
      <template v-if="column.key === 'name'">
        <a-tooltip v-if="record.name">
          <template #title>
            {{ record.name }}
            <CopyOutlined v-if="record.name" class="copyId"  @click="$copyId(record.name)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.name }}
            <CopyOutlined v-if="record.name" class="copyId"  @click="$copyId(record.name)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'code'">
        <a-tooltip v-if="record.code">
          <template #title>
            {{ record.code }}
            <CopyOutlined v-if="record.code" class="copyId"  @click="$copyId(record.code)" />
          </template>
          <div style="text-overflow: ellipsis;overflow: hidden;">
            {{ record.code }}
            <CopyOutlined v-if="record.code" class="copyId"  @click="$copyId(record.code)" />
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'status'">
        <span :class="record.status == 0 ? 'tag-red' : record.status == 1 ? 'tag-green': ''">
          {{ record.status == 0 ? $t('disabled') : $t('enabled') }}
        </span>
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'createBy'">
        {{ record.createBy || '-' }}
      </template>
      <template v-if="column.key === 'operate'">
        <a-button type="link" @click="showCheck(record.id)">{{ $t('b23') }}</a-button>
        
        <a-popconfirm
          :title="record.status == 1 ? $t('m768') : $t('m767')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="updateStatus(record)"
          :confirm-loading="loading"
        >
          <a-button type="link" :danger="record.status == 0 ? false : true"
            v-permission="'admin:extChannelAdmin:updateStatus'">
            {{ record.status == 0 ? $t('enabled') : $t('disabled') }}
          </a-button>
        </a-popconfirm>
      </template>
      </template>
    </a-table>
    <!-- 新增 -->
    <a-modal
      v-model:open="showAddModal"
      :footer="null"
      width="50%"
      :title="$t('n1281')"
      @cancel="cancelModal"
    >
      <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :model="extChannelForm"
        layout="horizontal"
        >
        <a-form-item
          :label="$t('n1276')"
          name="name"
          required
        >
          <a-input v-model:value="extChannelForm.name" />
        </a-form-item>
        <a-form-item
          :label="$t('n1278')"
          name="code"
          required
        >
          <a-input v-model:value="extChannelForm.code" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
          <a-button type="primary" @click="submitAdd">{{ $t('publicSubmit') }}</a-button>
          <a-button style="margin-left: 8px" @click="cancelModal">{{ $t('b10') }}</a-button>
        </a-form-item
      >
      </a-form>
    </a-modal>
    <!-- 详情 -->
    <a-modal
      v-model:open="detailModel"
      :footer="null"
      wrap-class-name="full-modal"
      width="100%"
      :title="$t('n1282')"
      @cancel="cancelCheck"
    >
      <div class="detailBox">
        <div class="detailBox-item">
          <div class="detailBox-title">{{ $t('n1276') }}</div>
          <div class="detailBox-content">{{ detailForm.name }}</div>
        </div>
        <div class="detailBox-item">
          <div class="detailBox-title">{{ $t('n1278') }}</div>
          <div class="detailBox-content">{{ detailForm.code }}</div>
        </div>
        <div class="detailBox-item">
          <div class="detailBox-title">{{ $t('state') }}</div>
          <div class="detailBox-content">
            <span :class="detailForm.status == 1 ? 'tag-green' : 'tag-red'">
              {{ detailForm.status == 1 ? $t('enabled') : $t('disabled') }}
            </span>
          </div>
        </div>
      </div>
      <div class="detailKey">
        <b>{{ $t('n1283') }}</b>
        <a-button type="primary" size="small" class="ml-10 mt-10" v-permission="'admin:extChannelAdmin:generateKeyPair'"  @click="getNewKey">
          {{ $t('m972') }}</a-button>
        <a-textarea class="mt-10" v-model:value="detailForm.channelPublicKey" :rows="6" />
        <a-popconfirm
          :title="$t('m364')"
          :ok-text="$t('b9')"
          :cancel-text="$t('b10')"
          @confirm="seveKey()"
          :confirm-loading="loading"
        >
          <a-button type="primary" size="small" class=" mt-10" v-permission="'admin:extChannelAdmin:updatePublicKey'">
            {{ $t('n1277') }}</a-button>
        </a-popconfirm>
      </div>
    </a-modal>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref, h } from "vue";
  import { SearchOutlined } from "@ant-design/icons-vue";
  import {
    extChannelAdminListPage,
    extChannelAdminCreateMerchantInfo,
    extChannelAdminUpdateStatus,
    extChannelAdminGetInfo,
    extChannelAdminGenerateKeyPair,
    extChannelAdminUpdatePublicKey,
  } from "@/api";
  import { useI18n } from "vue-i18n";
  import { getStartAndEndOfDay } from "@/plugins/dataMap";
  import { useTabHeight } from "@/hooks/useTabHeight.hooks";
  import { useTableData } from "@/hooks/useTableData.hook";
  import { message } from "ant-design-vue";
  const { getTabH } = useTabHeight();
  const [startIndiaTime,endIndiaTime,,time] = getStartAndEndOfDay()
  const { t } = useI18n();
  const query = ref({
    asc: false,
    column: "",
    pageNo: 1,
    pageSize: 20,
    code: undefined,
    name: undefined,
    status: undefined,
    // createTimeStart: startIndiaTime,
    // createTimeEnd: endIndiaTime,
    createTimeStart: '',
    createTimeEnd: '',
    firstPage: true,
    lastPage:false,
    direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
    nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
    nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
    prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
    prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
  });
  const columns:any = [
    {
      title: 'ID',
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
    },
    {
      title: t("n1276"),
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 140,
    },
    {
      title: t("n1278"), 
      dataIndex: "code",
      key: "code",
      align: "center",
      width: 140,
    },
    {
      title: t("state"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
    },
    {
      title: t("l70"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 150,
    },
    {
      title: t("l66"),
      dataIndex: "createBy",
      key: "createBy",
      align: "center",
      width: 150,
    },
    {
      title: t("operation"),
      dataIndex: "operate",
      key: "operate",
      align: "center",
      width: 120,
      fixed: 'right',
    },
  ];
  const {
    dataSource,
    pagination,
    loading,
    handleTableChange,
    getList,
    resetQuery,
  } = useTableData({
    query,
    api: extChannelAdminListPage,
    defaultPageSize: 20,
    filterRules: [],
  });

  const showAddModal = ref(false);
  const extChannelForm = ref({
    name: '',
    code: '',
  });
  const add = () => {
    extChannelForm.value = {
      name: '',
      code: '',
    };
    showAddModal.value = true;
  };
  const submitAdd = async () => {
    loading.value = true;
    const res: any = await extChannelAdminCreateMerchantInfo(extChannelForm.value).finally(() => {
      loading.value = false;
    });
    if (res && res.code === "1") {
      cancelModal();
      getList(1);
    }
  };
  const cancelModal = () => {
    showAddModal.value = false;
    extChannelForm.value = {
      name: '',
      code: '',
    };
  };
  // 查看
  const detailModel = ref(false);
  const detailId: any = ref(null);
  const detailForm = ref({
    name: '',
    code: '',
    channelPublicKey: '',
    platformPublicKey: '',
    status: null,
  });
  const showCheck = async (id: number) => {
    detailModel.value = true;
    detailId.value = id;
    loading.value = true;
    const res: any = await extChannelAdminGetInfo({ id }).finally(() => {
      loading.value = false;
    });
    if (res && res.code === "1") {
      detailForm.value = res.data || {};
    }
  };
  const cancelCheck = () => {
    detailModel.value = false;
    detailForm.value = {
      name: '',
      code: '',
      channelPublicKey: '',
      platformPublicKey: '',
      status: null,
    };
    detailId.value = null;
  }

  // 生成密钥对
  const getNewKey = () => {
    window.open('#/createExternalNewKey', '_blank');
  }
  // 保存公钥
  const seveKey = async () => {
    loading.value = true;
    const res: any = await extChannelAdminUpdatePublicKey({
      id: detailId.value ,
      channelPublicKey: detailForm.value.channelPublicKey,
    }).finally(() => {
      loading.value = false;
    });
    if (res && res.code === "1") {
      message.success(t('s10'));
      showCheck(detailId.value);
    }
  };
  // const merchantKey = ref({
  //   privateKey: '',
  //   publicKey: '',
  // });
  // const generateKeyPair = async () => {
  //   loading.value = true;
  //   const res: any = await extChannelAdminGenerateKeyPair().finally(() => {
  //     loading.value = false;
  //   });
  //   if (res && res.code === "1") {
  //     merchantKey.value = res.data || {};
  //     message.success(t('s10'));
  //   }
  // };
  // 启用禁用
  const updateStatus = async (val: any) => {
    const {id, status} = val
    loading.value = true;
    const res: any = await extChannelAdminUpdateStatus({ id,status: status == 1 ? 0 : 1 }).finally(() => {
      loading.value = false;
    });
    if (res && res.code === "1") {
      message.success(t('s10'));
      getList();
    }
  };
  onMounted(() => {
    getList();
    getTabH.value = useTabHeight(3,40).getTabH.value;
  });
</script>
<style lang="less" scoped>
.detailBox{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  .detailBox-item{
    display: flex;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    height: 40px;
    line-height: 40px;
    text-align: center;
    .detailBox-title{
      width: 120px;
      text-align: right;
      padding-right: 10px;
      border-right: 1px solid #ddd;
      font-weight: bold;
      background-color: #f0f0f0;
    }
    .detailBox-content{
      flex: 1;
    }
  }
}
</style>
  