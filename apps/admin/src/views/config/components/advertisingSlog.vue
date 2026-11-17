<template>
  <div class="search">
    <a-button
      type="primary"
      @click="showAddDialog"
      v-permission="'admin:/cashierAdvertisement/create'"
      >{{ $t("add") }}</a-button
    >
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :scroll="{ x: '100%' , y: getTabH + 'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        {{ statusTypeMap[record.status] }}
      </template>
      <template v-if="column.key === 'platformCode'">
        <div v-if="record.platformCode.length" class="toopTipStyle3">
          <span v-for="value in record.platformCode">
            {{ $getMapItem(platformCodeMap, value) }}
            <span v-if="value != record.platformCode[record.platformCode.length - 1]">，</span>
          </span>
        </div>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'imageUrl'">
        <a-image v-if="record.imageUrl" :width="160" :src="record.imageUrl" />
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'operator'">
        {{ record.operator || '-' }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          v-permission="'admin:/cashierAdvertisement/update'"
          @click="editDialog(record)"
          >{{ $t("edit") }}
        </a-tag>

        <a-popconfirm
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
            v-permission="'admin:/cashierAdvertisement/delete'"
            >{{ $t("b11") }}
          </a-tag>
        </a-popconfirm>
        <a-popconfirm
          :title="record.status === 1 ? $t('m936') : $t('m236')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          @confirm="checkenable(record)"
        >
          <a-tag
            :color="
              record.status === 1
                ? 'rgba(253, 11, 26, 1)'
                : 'rgba(22, 155, 213, 1)'
            "
            style="cursor: pointer"
            size="small"
            v-permission="'admin:/cashierAdvertisement/enabled'"
            >{{ record.status === 1 ? $t("m219") : $t("m218") }}
          </a-tag>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="$t('n1661')"
    :footer="null"
    width="600px"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16}"
    >
      <a-form-item :label="$t('n1494')" name="platformCode" :rules="[{ required: true, message: ''}]">
        <a-select
          v-model:value="addFrom.platformCode"
          :placeholder="$t('n1494')"
          mode="multiple"
          :options="Object.entries(platformCodeMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
          @change="handlePlatformCodeChange"
        ></a-select>
      </a-form-item>
      <a-form-item :label="$t('sort')" name="sortOrder" :rules="[{ required: true, message: ''}]">
        <a-select
          v-model:value="addFrom.sortOrder"
          :placeholder="$t('sort')"
        >
          <a-select-option
            v-for="item in sortOrderOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('m105')" name="imageUrl" :rules="[{ required: true, message: ''}]">
          <Upload v-if="addDialog" v-model:value="addFrom.imageUrl"  @startUpload="startUpload"  @finishUpload="finishUpload"/>
      </a-form-item>
      <a-form-item :label="$t('state')" name="status">
        <a-switch v-model:checked="addChecked" @click="changeAddChecked" :checked-children="$t('m218')" :un-checked-children="$t('m219')" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 9 }">
        <a-button type="primary" :loading="loading" @click="addBtn">{{
          isEdit ? $t("b8") : $t("b12")
        }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDalog">{{
          $t("l54")
        }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  cashierAdList,
  cashierAdAdd,
  cashierAdDel,
  cashierAdUpdate,
  cashierAdDetail,
} from "@/api/c2cconfig.api";
import { message } from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import Upload from '@/components/Upload/index.vue'
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
const { getTabH } = useTabHeight(4);
const { t } = useI18n();
const platformCodeMap:any = {
  1: t("n1663"),//彩票平台ARUPI收银台
  2: t("n1664"),//SAAS彩票平台ARUPI收银台
  3: t("n1665"),//钱包内部ARPAY收银台
  4: t("n1666"),//钱包内部代付收银台
  5: t("n1667"),//外部商户快捷UPI收银台
  6: t("n1668"),//外部商户ARPAY转款收银台
}
const statusTypeMap = <any>{
  "0": t("m219"),//禁用
  "1": t("m218"),//启用
};
const query = ref({
  asc:false,
  column:'',
  pageNo: 1,
  pageSize: 100,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
})
const columns:any = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 60,
    align: "center",
  },
  {
    title: t("n1662"),
    dataIndex: "imageUrl",
    key: "imageUrl",
    align: "center",
    width: 160,
  },
  {
    title: t("n1494"),
    dataIndex: "platformCode",
    key: "platformCode",
    align: "center",
    width: 300,
  },
  {
    title: t("sort"),
    dataIndex: "sortOrder",
    key: "sortOrder",
    width: 60,
    align: "center",
  },
  {
    title: t("state"),
    dataIndex: "status",
    key: "status",
    width: 60,
    align: "center",
  },
  {
    title: t("l71"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 80,
  },
  {
    title: t("l48"),
    dataIndex: "operator",
    key: "operator",
    align: "center",
    width: 80,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 80,
    fixed: 'right',
  },
];
const {
  dataSource,
  pagination,
  extendData,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: cashierAdList,
  defaultPageSize: 100,
  filterRules: [],
  afterFetch: (data) =>
  data.map((item: any) => {
    return item;
  }),
  afterGetDataFunc: () =>{
  }
});

const addDialog = ref(false);
const addChecked = ref<boolean>(false);
const selectId = ref<any>(null);
let isEdit = ref(false);
const sortOrderList = [1, 2, 3, 4, 5, 6];
const addFrom = ref<any>({
  sortOrder: undefined,
  imageUrl: "",
  status: 0,
  platformCode: [],
});

const normalizePlatformCodes = (value: any) => {
  const list = Array.isArray(value)
    ? value
    : value === undefined || value === null || value === ""
      ? []
      : [value];

  return list
    .map((item: any) => Number(item))
    .filter((item) => !Number.isNaN(item));
};
const hasPlatformOverlap = (source: any, target: any) => {
  const sourceList = normalizePlatformCodes(source);
  const targetList = normalizePlatformCodes(target);

  return sourceList.some((item) => targetList.includes(item));
};
const formatPlatformCode = (value: any) => {
  const text = normalizePlatformCodes(value)
    .map((item) => platformCodeMap[item])
    .filter(Boolean)
    .join("、");

  return text || "-";
};

const selectedPlatformCodes = computed(() =>
  normalizePlatformCodes(addFrom.value.platformCode)
);
const disabledSortOrderSet = computed(() => {
  const platformCodes = selectedPlatformCodes.value;
  if (!platformCodes.length) {
    return new Set();
  }

  return new Set(
    dataSource.value
      .filter((item: any) => {
        const isCurrentEditRow =
          isEdit.value && String(item.id) === String(selectId.value);
        return (
          Number(item.status) === 1 &&
          hasPlatformOverlap(item.platformCode, platformCodes) &&
          !isCurrentEditRow
        );
      })
      .map((item: any) => Number(item.sortOrder))
  );
});
const sortOrderOptions = computed(() =>
  sortOrderList
    .filter(
      (value) =>
        selectedPlatformCodes.value.length && !disabledSortOrderSet.value.has(value)
    )
    .map((value) => ({
      value,
      label: String(value),
    }))
);
const getFirstAvailableSortOrder = () =>
  sortOrderOptions.value[0]?.value;
const hasSortOrderConflict = (target: any) =>
  dataSource.value.some((item: any) => {
    return (
      String(item.id) !== String(target.id) &&
      Number(item.status) === 1 &&
      hasPlatformOverlap(item.platformCode, target.platformCode) &&
      Number(item.sortOrder) === Number(target.sortOrder)
    );
  });
const handlePlatformCodeChange = () => {
  if (
    !addFrom.value.sortOrder ||
    !sortOrderOptions.value.some(
      (item) => item.value === Number(addFrom.value.sortOrder)
    )
  ) {
    addFrom.value.sortOrder = getFirstAvailableSortOrder();
  }
};

const changeAddChecked = () => {
  addChecked.value ? (addFrom.value.status = 1) : (addFrom.value.status = 0);
};
const showAddDialog = () => {
  isEdit.value = false;
  selectId.value = null;
  addFrom.value = {
    sortOrder: undefined,
    imageUrl: "",
    status: 0,
    platformCode: []
  };
  addChecked.value = false;
  addDialog.value = true;
};
const editDialog = async (value: any) => {
  const { id } = value;
  selectId.value = id;
  loading.value = true;
  const res: any = await cashierAdDetail(id).finally(() => (loading.value = false));
  if (res && res.code == "1") {
    selectedRow();
    isEdit.value = true;
    const { sortOrder,imageUrl,status,platformCode } = res.data;
    addFrom.value = {
      sortOrder,
      imageUrl,
      status,
      platformCode: normalizePlatformCodes(platformCode)
    };
    handlePlatformCodeChange();
    addFrom.value.status == 1
      ? (addChecked.value = true)
      : (addChecked.value = false);
    addDialog.value = true;
  }
};
const del = async (value: any) => {
  const { id } = value;
  const res: any = await cashierAdDel(id);
  if (res && res.code == "1") {
    message.success(t("s9"));
    getList();
  }
};
const checkenable = async (value: any) => {
  const { id,sortOrder,imageUrl,status,platformCode } = value;
  const currentStatus = Number(status);
  const s = currentStatus == 1 ? 0 : 1;
  if (s == 1 && hasSortOrderConflict({ id, sortOrder, platformCode })) {
    message.error(t("n1673"));
    return;
  }
  loading.value = true;
  const res: any = await cashierAdUpdate(id,{ sortOrder,imageUrl,status:s,platformCode }).finally(() => (loading.value = false));
  if (res && res.code == "1") {
    message.success( currentStatus == 1 ? t("m238") : t("m237"));
    getList();
  }
};
const closeAddDalog = () => {
  addFrom.value = {
    sortOrder: undefined,
    imageUrl: "",
    status: 0,
    platformCode: []
  };
  isEdit.value = false;
  addDialog.value = false;
  selectId.value = null;
};
const addBtn = async () => {
  let res: any;
  if(!selectedPlatformCodes.value.length){
    message.error(t('m563')+t('n1494'));
    return
  }
  if(!addFrom.value.sortOrder){
    message.error(t('m563')+t('sort'));
    return
  }
  if(!sortOrderOptions.value.some((item) => item.value === Number(addFrom.value.sortOrder))){
    message.error(t('n1673'));
    return
  }
  if(!addFrom.value.imageUrl){
    message.error(t('m563')+t('m105'));
    return
  }
  if (isEdit.value) {
    const { sortOrder, imageUrl, status, platformCode } =
      addFrom.value;
    const editFrom = {
      sortOrder,
      imageUrl,
      status,
      platformCode
    };
    res = await cashierAdUpdate(selectId.value, editFrom);
  } else {
    res = await cashierAdAdd(addFrom.value);
  }
  if (res && res.code == "1") {
    message.success(isEdit.value ? t("s7") : t("s8"));
    getList();
    closeAddDalog();
  }
};
const startUpload = (val:any) => {
  if(val) loading.value = true;
}
const finishUpload = (val:any) => {
  if(val) loading.value = false;
}
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(4,100).getTabH.value;
});
</script>
<style lang="less" scoped>
</style>
