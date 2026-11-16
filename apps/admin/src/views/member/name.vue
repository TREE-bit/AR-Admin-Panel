<template>
  <div class="search">
    <h2>{{ $t("c17") }}</h2>
    <a-row>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.memberId"
          class="searchstyle"
          :placeholder="$t('p4')"
        />
      </a-col>
      <a-col :span="4">
        <a-input v-trim
          v-model:value="query.idCardNumber"
          class="searchstyle"
          :placeholder="$t('e45')"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          allowClear
          class="searchstyle"
          v-model:value="query.authenticationStatus"
          :options="
            Object.entries(certificateStatus).map(([key, value]:[any,any]) => ({
              value: key,
              label: $t(value),
            }))
          "
          :placeholder="$t('p41')"
        >
        </a-select>
      </a-col>
      <a-button
        class="ml15"
        type="primary"
        :icon="h(SearchOutlined)"
        @click="getList(1)"
        >{{ $t("search") }}</a-button
      >
      <a-button type="primary" danger @click="resetQuery">{{
        $t("reset")
      }}</a-button>
    </a-row>
  </div>
  <a-table
    size="middle"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    bordered
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'id'">
        <a-button
          style="padding: 0px"
          type="link"
          @click="showDetail(record)"
          >{{ record.id }}</a-button
        >
        <CopyOutlined v-if="record.id" class="copyId"  @click="$copyId(record.id)" />
      </template>
      <template v-if="column.key === 'authenticationStatus'">
        {{ $t(memberTypeList[record.authenticationStatus]) }}
      </template>
      <template v-if="column.key === 'realName'">
        <a-tooltip>
          <template #title>{{ record.realName }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.realName }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'idCardNumber'">
        <a-tooltip>
          <template #title>{{ record.idCardNumber }}</template>
          <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.idCardNumber }}</div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operation'">
        <a-tag
          color="rgba(14, 186, 139, 1)"
          style="cursor: pointer"
          size="small"
          @click="checkDetail(record)"
          v-permission="'admin:noHttp:no1'"
          >{{ $t("b23") }}
        </a-tag>
        <a-button
          size="small"
          @click="editDialog(record)"
          type="primary"
          v-permission="'admin:memberInfoAdmin:update'"
          :disabled="record.authenticationStatus != '2'"
          >{{ $t("edit") }}
        </a-button>
        <a-popconfirm
          :title="$t('t16')"
          ok-text="Yes"
          cancel-text="No"
          @confirm="clearRelName(record)"
        >
          <a-button
            size="small"
            danger
            type="primary"
            v-permission="'admin:memberInfoAdmin:clearRealNameAuth'"
          >
            {{ $t('n1189') }}
          </a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="addDialog"
    :title="$t('edit')"
    :footer="null"
    destroyOnClose
  >
    <a-divider />
    <div>
      <div class="member-edit-modal">
        <span><i>*</i> {{ $t("p41") }}</span>
        <div>
          <a-select
            class="searchstyle"
            allowClear
            v-model:value="editForm.authenticationStatus"  
            :options="
              Object.entries(certificateStatus).map(([key, value]:[any,any]) => ({
                value: key,
                label: $t(value),
                disabled: key !== '3',
              }))
            "
            :placeholder="$t('p41')"
          >
          </a-select>
        </div>
      </div>
      <div class="member-edit-modal">
        <span> <i class="mr-4">*</i>{{ $t("c20") }}</span>
        <div>
          <a-input v-trim
            class="searchstyle"
            v-model:value="editForm.realName"
            :placeholder="$t('c20')"
          />
        </div>
      </div>
      <div class="member-edit-modal">
        <span><i>*</i> {{ $t("c14") }}</span>
        <div>
          <a-input v-trim
            class="searchstyle"
            v-model:value="editForm.idCardNumber"
            :placeholder="$t('c14')"
          />
        </div>
      </div>
      <div class="flex pt-8 gap-2.5">
        <span class="flex-1"
          ><i class="mr-4 text-red-500">*</i> {{ $t("c21") }}</span
        >
        <div class="pt-4 flex-[2_2_0%]">
          <NewUpload
            v-model="editForm.idCardImage"
            img-class="w-343 h-170"     
          />
        </div>
      </div>
      <div class="flex pt-8 gap-2.5">
        <span class="flex-1"
          ><i class="mr-4 text-red-500">*</i> {{ $t("c22") }}</span
        >
        <div class="pt-4 flex-[2_2_0%]">
          <NewUpload
            v-model="editForm.facePhoto"
            img-class="w-343 h-377"        
          />
        </div>
      </div>
    </div>
    <br />
    <div style="display: flex; justify-content: flex-end; color: #9d9d9d">
      <a-button type="primary" @click="edit()" :disabled="isDisable">{{
        $t("save")
      }}</a-button>
      <a-button style="margin-left: 10px" @click="closedalog">{{
        $t("b10")
      }}</a-button>
    </div>
  </a-modal>
  <!-- 查看 -->
  <a-modal
    v-model:open="openDetail"
    :title="$t('c33')"
    width="900px"
    height="400px"
    :footer="null"
  >
    <a-col :span="32" class="pr15">
      <div class="Temp_C-info">
        <!-- <h4>{{ $t("user.mPayCheck") }}</h4> -->
        <div class="Temp_C-box">
          <div class="item">
            <div class="lab">{{ $t("c20") }}</div>
            <span class="data">{{ detailObj.realName }}</span>
          </div>
          <div class="item">
            <div class="lab">{{ $t("c14") }}</div>
            <span class="data">{{ detailObj.idCardNumber }}</span>
          </div>
          <div class="item">
            <div class="lab">{{ $t("c15") }}</div>
            <span class="data">{{ detailObj.realNameVerificationTime }}</span>
          </div>
        </div>
      </div>
      <div class="pictures_container" v-if="detailObj.idCardImage">
        <h2>{{ $t("c21") }}</h2>
        <a-col :span="24" class="pr15">
          <a-row>
            <a-col :span="6">
              <a-image
                :width="343"
                :height="170"
                :src="detailObj.idCardImage"
                fallback="data:image/png;base64,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"
              />
            </a-col>
            <a-col :span="18"></a-col>
          </a-row>
          <br />
          <h2>{{ $t("c22") }}</h2>
          <a-row>
            <a-col :span="6">
              <a-image
                :width="343"
                :height="377"
                :src="detailObj.facePhoto"
                fallback="data:image/png;base64,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"
              />
            </a-col>
            <a-col :span="18"></a-col>
          </a-row>
        </a-col>
      </div>
    </a-col>
  </a-modal>
  <a-modal
    v-model:open="detailModel"
    :footer="null"
    wrap-class-name="full-modal"
    width="100%"
    >
    <MemberDetail 
    v-if="detailModel"
      :memberID="detailId.memberId"
      :id="detailId.id"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, h, computed } from "vue";
import { usePagination } from "@/plugins/dataMap";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { SearchOutlined } from "@ant-design/icons-vue";
import { certificateStatus } from "@/utils/publicData";
import { getRealNameList, editRealName, clearRealNameAuth } from "@/api/menber";
import NewUpload from "@/components/NewUpload/index.vue";
import message from "ant-design-vue/es/message";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import MemberDetail from "@/components/Member/memberDetail.vue";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const { paginationConfig } = usePagination();
// const loading = ref(false);
const detailModel = ref(false);
const detailId = ref<any>({});
const memberTypeList = <any>{
  "0": "",
  "1": "c18",
  "2": "c19",
  "3": "c100",
};

const query = ref({
  asc: false,
  idCardNumber: "",
  memberId: "",
  pageNo: 1,
  pageSize: 20,
  authenticationStatus: undefined,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});

const addDialog = ref(false);
// const dataSource = ref([]);
const columns:any = [
  {
    title: t("c9"),
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: t("c12"),
    dataIndex: "authenticationStatus",
    key: "authenticationStatus",
    align: "center",
  },
  {
    title: t("c13"),
    dataIndex: "realName",
    key: "realName",
    align: "center",
  },
  {
    title: t("c14"),
    dataIndex: "idCardNumber",
    key: "idCardNumber",
    align: "center",
  },
  {
    title: t("c15"),
    dataIndex: "realNameVerificationTime",
    key: "realNameVerificationTime",
    align: "center",
  },
  {
    title: t("c16"),
    dataIndex: "verificationBy",
    key: "verificationBy",
    align: "center",
  },
  {
    title: t("operation"),
    dataIndex: "operation",
    key: "operation",
    align: "center",
    // fixed: 'right',
    // width: 200,
  },
];

const showDetail = async (value: any) => {
  const { id, memberId } = value;
  detailId.value = { id, memberId };
  detailModel.value = true;
};
const editForm = ref({
  authenticationStatus: undefined,
  facePhoto: undefined,
  idCardImage: undefined,
  idCardNumber: undefined,
  memberId: undefined,
  realName: undefined,
});
const isDisable = computed(
  () =>
    !(
      editForm.value.authenticationStatus &&
      editForm.value.facePhoto &&
      editForm.value.idCardImage &&
      editForm.value.idCardNumber &&
      editForm.value.realName
    )
);
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: getRealNameList,
  defaultPageSize: 20,
  filterRules: [],
});
// const extendData = ref<any>({});
// const oldPageNo = ref(0);
// const pageCurrent = ref(0);
// let queryCount = ref(0);
// const getList = async (type?: number) => {
//   if (type == 1) {
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }
//   loading.value=true;
  
//     const queryPageNo = query.value.pageNo;
//     queryCount.value = queryPageNo - oldPageNo.value;
//     if(query.value.pageNo == 1){
//       query.value.firstPage = true;
//       query.value.lastPage = false;
//       resetPageQuery();
//     }else if(query.value.pageNo == pageCurrent.value){
//       query.value.firstPage = false;
//       query.value.lastPage = true;
//       resetPageQuery();
//     }else if(queryCount.value > 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'next';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }else if(queryCount.value <= 0){
//       query.value.firstPage = false;
//       query.value.lastPage = false;
//       query.value.direction = 'prev';
//       for (let i = 0; i < Math.abs(queryCount.value)-1; i++) {
//         await getforData();
//       }
//     }
//   const res:any = await getRealNameList(query.value).finally(()=>loading.value=false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data || [];
//     extendData.value = res.extend;
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//     paginationConfig.current = query.value.pageNo;
//     paginationConfig.pageSize = query.value.pageSize;
//     paginationConfig.total = res.total;
//     oldPageNo.value = query.value.pageNo;
//     pageCurrent.value = Math.ceil(res.total/query.value.pageSize);
//   }
// };
// const getforData = async ()=>{
//   const res: any = await getRealNameList(query.value);
//   if(res.code == 1){
//     query.value.nextColValue = res.extend?.nextColValue;
//     query.value.nextCursorId = res.extend?.nextCursorId;
//     query.value.prevColValue = res.extend?.prevColValue;
//     query.value.prevCursorId = res.extend?.prevCursorId;
//   }
// }
// const resetPageQuery = ()=>{
//     query.value.direction = '';
//     query.value.nextColValue = '';
//     query.value.nextCursorId = '';
//     query.value.prevColValue = '';
//     query.value.prevCursorId = '';
// }
// const resetquery = () => {
//   query.value = {
//     asc: false,
//     idCardNumber: "",
//     memberId: "",
//     pageNo: 1,
//     pageSize: 10,
//     authenticationStatus: undefined,
//     firstPage: true,
//     lastPage:false,
//     direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
//     nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
//     nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
//     prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
//     prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
//   };
//   paginationConfig.current = 1;
//   paginationConfig.pageSize = 10;
//   clearSelected();
//   getList();
// };

const detailObj = ref<any>({});

const editDialog = async (record: any) => {
  selectedRow();
  // 未认证编辑：表单置空，提交后由接口落成「手动认证」
  const isUnauth = String(record.authenticationStatus) === '2'
  editForm.value = {
    authenticationStatus: isUnauth ? undefined : record.authenticationStatus,
    facePhoto: isUnauth ? undefined : record.facePhoto,
    idCardImage: isUnauth ? undefined : record.idCardImage,
    idCardNumber: isUnauth ? undefined : record.idCardNumber,
    memberId: record.id,
    realName: isUnauth ? undefined : record.realName,
  };
  addDialog.value = true;
};
const edit = async () => {
  const res:any = await editRealName(editForm.value);
  if (res && res.code === "1") {
    message.success(t("s10"));
    addDialog.value = false;
    getList();
  }
};

const closedalog = () => {
  addDialog.value = false;
};
// const getChange = async (value: any) => {
//   const { current, pageSize } = value;
//   if(pageSize != paginationConfig.pageSize){
//     query.value.pageNo = 1;
//     paginationConfig.current = 1;
//   }else{
//     query.value.pageNo = current;
//     paginationConfig.current = current;
//   }
//   query.value.pageSize = pageSize;
//   paginationConfig.pageSize = pageSize;
//   await getList();
// };

const openDetail = ref(false);

/***** 查看 *****/
const checkDetail = (value: any) => {
  selectedRow();
  openDetail.value = true;
  detailObj.value = value;
};

// 删除
const clearRelName = async (val:any) => {
  loading.value = true;
  const res:any = await clearRealNameAuth({id:val.id,memberId:val.memberId}).finally(()=>loading.value=false)
  if(res && res.code == 1){
    message.success(t('s10'));
    getList()
  }
}
onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
.member-edit-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 10px;
  margin: 10px 0;

  & > span {
    flex: 1;
    text-align: left;
    i {
      color: red;
      padding-right: 5px;
    }
  }

  & > div {
    flex: 2;
  }
}

.pictures_container {
  margin: 1rem 0;
  h2 {
    padding: 1rem 0;
  }
}
.Temp_C-info {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  gap: 3rem;

  .Temp_C-box2 {
    flex: 1;
    background-color: #fff;
    height: auto;
    overflow: auto;
    width: 100%;
    .item-img {
      padding-left: 15px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      :deep(.ant-image) {
        width: 100%;
      }
    }
  }
  .Temp_C-box {
    flex: 1;
    .item-remark {
      display: flex;
      flex-direction: column;
      margin: 0 0 0 1rem;
      .lab {
        border-width: 0px;
        font-size: 12px;
        color: #979595;
      }
      .data {
        border-width: 0px;
        font-size: 12px;
        color: #151515;
      }
    }
    .item {
      height: 30px;
      padding: 0 15px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      &:nth-child(odd) {
        background-color: #eee;
      }

      .lab {
        flex: 1;
        border-width: 0px;
        display: flex;
        font-size: 12px;
        color: #979595;
      }
      .data {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        border-width: 0px;
        display: flex;
        font-size: 12px;
        color: #151515;
      }
    }
  }
  h4 {
    font-size: 16px;
    height: 20px;
    line-height: 18px;
    position: relative;
    border-left: 5px solid #108ee9;
    padding-left: 10px;
  }
}
</style>
