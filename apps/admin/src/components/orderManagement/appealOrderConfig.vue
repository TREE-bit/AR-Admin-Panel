<template>
  <div class="search">
    <!-- <h2>{{ $t('m20') }}</h2> -->
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.username"
          class="searchstyle"
          :placeholder="$t('m562')+$t('l60')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          v-model:value="query.status"
          class="searchstyle"
          :placeholder="$t('m563')+$t('state')"
          :allow-clear="true"
          :options="Object.keys(statusMap).map(key => ({ label: statusMap[key], value: key }))"
        />
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          :loading="loading"
          >{{ $t('search') }}</a-button
        >
        <a-button type="primary" :loading="loading" @click="resetQuery">{{ $t('reset') }}</a-button>
        <a-button type="primary" :loading="loading" @click="distribute"
          v-permission="'admin:appealOrderHandlerAdmin:add'">{{ $t('n1419') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%' ,y : getTabH+'px'}"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record:any) => JSON.stringify(record)"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'username'">
        <a-tooltip>
          <template #title>{{ record.username }}</template>
          <div class="toopTipStyle">
            {{ record.username }}
            <CopyOutlined v-if="record.username" class="copyId"  @click="$copyId(record.username)" />
          </div>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'status'">
        <span :class="record.status == 1 ? 'tag-green' : 'tag-red'">
          {{ $getMapItem(statusMap,record.status) }}
        </span>
        <span v-if="record.status != 1 && isAdminAndMe(record)" @click="startOrders(record)" class="tag-green pointer ml-10">{{ $t('n80') }}</span>
        <span v-if="record.status == 1 && isAdminAndMe(record)" @click="stopOrders(record)" class="tag-blue pointer ml-10">{{ $t('n81') }}</span>
      </template>
      <template v-if="column.key === 'userId'">
            {{ record.userId }}
            <CopyOutlined v-if="record.userId" class="copyId"  @click="$copyId(record.userId)" />
      </template>
    </template>
  </a-table>
  <!-- 分配 -->
  <a-modal
  v-model:open="distributeModal"
  :title="$t('n1420')"
  width="1400px"
  :footer="null"
  @cancel="closeDistributeModal"
>
  <div class="transfer-wrapper">
    <!-- 左侧 -->
    <div class="panel">
      <div class="panel-title">
        {{ $t('n1421') }}
        <!-- <a-select
          v-model:value="userRole"
          style="width: 200px; margin-left: 16px;"
          :placeholder="$t('m563')+$t('角色')"
          :allow-clear="true"
          @change="getUserList"
          >
          <a-select-option
            v-for="(item, index) in roleList"
            :key="index"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select> -->
      </div>

      <a-input
        v-model:value="leftKeyword"
        :placeholder="$t('n1422')"
        allow-clear
      />

      <a-checkbox-group v-model:value="leftChecked">
        <div
          v-for="item in leftList"
          :key="item.userId"
          class="item"
        >
          <a-checkbox :value="item.userId">
            {{ item.username }}
          </a-checkbox>
        </div>
      </a-checkbox-group>
    </div>

    <!-- 中间按钮 -->
    <div class="middle">
      <a-popconfirm
        :title=" $t('m364') "
        :ok-text="$t('yes')"
        :cancel-text="$t('no')"
        @confirm="onFinish(1)"
      >
        <!-- 添加接单 -->
        <a-button
          type="primary"
          circle
          :disabled="!leftChecked.length"
        >
          →
        </a-button>
      </a-popconfirm>
      <!-- 移除接单 -->
      <a-button
        circle
        type="primary"
        @click="showRemoveConfirm"
        style="margin-top: 16px"
        :disabled="!rightChecked.length"
      >
        ←
      </a-button>
    </div>

    <!-- 右侧 -->
    <div class="panel">
      <div class="panel-title">{{ $t('n1423') }}</div>

      <a-input
        v-model:value="rightKeyword"
        :placeholder="$t('n1422')"
        allow-clear
      />

      <a-checkbox-group v-model:value="rightChecked">
        <div
          v-for="item in rightList"
          :key="item.userId"
          class="item"
        >
          <a-checkbox :value="item.userId" :disabled="isRightDisabled(item.userId)">
            {{ item.username }}
          </a-checkbox>
        </div>
      </a-checkbox-group>
    </div>
  </div>
</a-modal>
<!-- 移除确认 -->
<a-modal
  v-model:open="removeMoadal"
  width="800px"
  :footer="null"
>
  <template #title>
    <h3 style="text-align: center;">{{ $t('n1424') }}</h3>
  </template>
  <h3>
    {{ removeCon }}
  </h3>
  <div style="text-align: center;">
    <a-button
      @click="onFinish(2)"
      style="margin-right: 16px;"
    >
      {{ $t('n1426') }}
    </a-button>
    <a-button type="primary" @click="onFinish(3)">
      {{ $t('n1427') }}
    </a-button>
  </div>
</a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed } from "vue";
import { adminRole } from "@/hooks/adminRole.hook";
import { SearchOutlined,RightCircleOutlined,LeftCircleOutlined } from "@ant-design/icons-vue";
import { 
  appealOrderHandlerListPage,
  getUserListPage,
  appealOrderHandlerAdd,
  appealOrderHandlerRemove,
 } from "@/api";
import { useI18n } from "vue-i18n";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { Item } from "ant-design-vue/es/menu";
import { message } from "ant-design-vue";
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
// const dataSource = ref([])
// const loading = ref(false)
const [startIndiaTime,endIndiaTime] = getStartAndEndOfDay()
const adminRoleHook = adminRole();
const query = ref({
  asc:false,
  pageNo: 1,
  pageSize: 20,
  userId: undefined,
  username: undefined,
  status: undefined,
  queryType: 1,
  firstPage: true,
  lastPage:false,
  direction: '', //翻页方向："next" 下一页，"prev" 上一页。首页/尾页请求时应为空
  nextColValue: '',//下一页所需列值（上次 extent 中返回的 nextColValue）。仅在 direction="next" 时需要 
  nextCursorId: '',//下一页所需主键 ID（上次 extent 中返回的 nextCursorId）。仅在 direction="next" 时需要 
  prevColValue: '',//上一页所需列值（上次 extent 中返回的 prevColValue）。仅在 direction="prev" 时需要
  prevCursorId: '',//上一页所需主键 ID（上次 extent 中返回的 prevCursorId）。仅在 direction="prev" 时需要
});
const statusMap:any = {
  '1': t('n1428'),
  '0': t('n1429'),
}
const columns:any = 
  [{
    title: t("e47"),
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 90,
    customRender: ({ index }:{index:any}) => index + 1,
  },
  {
    title: t('l60'),
    dataIndex: "username",
    key: "username",
    align:"center",
    width: 160,
  },
  {
    title: t('m184'),
    dataIndex: "userId",
    key: "userId",
    align:"center",
    width: 160,
  },
  {
    title: t('state'),
    dataIndex: "status",
    key: "status",
    align:"center",
    width: 160,
  },
  {
    title: t('n1430'),
    dataIndex: "totalAssignedCount",
    key: "totalAssignedCount",
    align:"center",
    width: 160,
  },
  {
    title:  t("n1431"),
    dataIndex: "todayAssignedCount",
    key: "todayAssignedCount",
    align:"center",
    width: 160,
  },
  {
    title:  t("n1432"),
    dataIndex: "manualHandledCount",
    key: "manualHandledCount",
    align:"center",
    width: 160,
  },
  {
    title: t("n1433"),
    dataIndex: "systemHandledCount",
    key: "systemHandledCount",
    align:"center",
    width: 160,
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
  api: appealOrderHandlerListPage,
  defaultPageSize: 20,
  filterRules: [],
});
const {
  dataSource:orderReceivingUsers,
  getList:getOrderReceivingUsers,
} = useTableData({
  query,
  handleQueryFields: (q) => ({
    ...q,
    pageNo: 1,
    pageSize: 9999,
    queryType: 2,
  }),
  api: appealOrderHandlerListPage,
  afterGetDataFunc:()=>{
    selectedUser.value = orderReceivingUsers.value.map((item:any)=>{
      return {
        userId: item.userId,
        username: item.username
      }
    }) || [];
  }
});
// 分配
interface User {
  userId: number
  username: string
}

/* ===== 弹窗 ===== */
const distributeModal = ref(false)
/* ===== 数据源（唯一可信） ===== */
const assignedList = ref<User[]>([])   // 未接单用户
const selectedUser = ref<User[]>([])   // 已接单用户

/* ===== 搜索关键字 ===== */
const leftKeyword = ref('')
const rightKeyword = ref('')

/* ===== 勾选 ===== */
const leftChecked = ref<number[]>([])
const rightChecked = ref<number[]>([])

/* ===== 左侧列表（未接单 + 搜索 + 排除右侧） ===== */
const leftList = computed<User[]>(() => {
  const key = leftKeyword.value.trim().toLowerCase()
  return assignedList.value.filter(item => {
    // 排除已接单
    if (selectedUser.value.some(u => u.userId === item.userId)) {
      return false
    }

    if (!key) return true

    return (
      item.username.toLowerCase().includes(key) ||
      String(item.userId).includes(key)
    )
  })
})

/* ===== 右侧列表（已接单 + 搜索） ===== */
const rightList = computed<User[]>(() => {
  const key = rightKeyword.value.trim().toLowerCase()

  if (!key) return selectedUser.value

  return selectedUser.value.filter(item =>
    item.username.toLowerCase().includes(key) ||
    String(item.userId).includes(key)
  )
})
// 右侧必须有一个
const isRightDisabled = (userId: number) => {
  // 当前是否已勾选
  const checked = rightChecked.value.includes(userId)

  // 总数
  const total = rightList.value.length

  // 已勾选数量
  const checkedCount = rightChecked.value.length

  /**
   * 禁用条件：
   * 1️⃣ 只有 1 个
   * 2️⃣ 当前未勾选，但勾选后会变成全选
   */
  if (total <= 1) return true

  if (!checked && checkedCount >= total - 1) return true

  return false
}
/* ===== 右侧勾选用户名（用于确认框） ===== */
const rightCheckedNames = computed(() => {
  return selectedUser.value
    .filter(i => rightChecked.value.includes(i.userId))
    .map(i => i.username)
    .join(', ')
})

/* ===== 打开弹窗 ===== */
const distribute = async () => {
  await getOrderReceivingUsers()

  selectedUser.value = [...selectedUser.value]

  assignedList.value =
    JSON.parse(localStorage.getItem('allUserList') || '[]').map(
      (item: any) => ({
        userId: item.id,
        username: item.username,
      })
    )

  distributeModal.value = true
}

/* ===== 左 → 右 ===== */
const toRight = () => {
  const moveItems = leftList.value.filter(i =>
    leftChecked.value.includes(i.userId)
  )

  selectedUser.value.push(...moveItems)
  leftChecked.value = []
}

/* ===== 右 → 左 ===== */
const toLeft = () => {
  selectedUser.value = selectedUser.value.filter(
    i => !rightChecked.value.includes(i.userId)
  )

  rightChecked.value = []
}

/* ===== 移动后重置 ===== */
const resetAfterMove = () => {
  leftChecked.value = []
  rightChecked.value = []
}

/* ===== 关闭弹窗 ===== */
const closeDistributeModal = () => {
  leftChecked.value = []
  rightChecked.value = []
  leftKeyword.value = ''
  rightKeyword.value = ''
  distributeModal.value = false
  removeMoadal.value = false
}
/* ===== 移除确认 ===== */
const removeMoadal = ref(false)
const removeCon = ref('')

const showRemoveConfirm = () => {
  removeCon.value = t('n1425', { n: rightCheckedNames.value })
  removeMoadal.value = true
}
// 提交分配
const userListAdd = computed<User[]>(() => {
  return assignedList.value.filter(user =>
    leftChecked.value.includes(user.userId)
  )
})

const userListRemove = computed<User[]>(() => {
  return selectedUser.value.filter(user =>
    rightChecked.value.includes(user.userId)
  )
})
const onFinish = async (type: number) => {// type: 1 添加接单用户，2 移除接单用户且不随机分配，3 移除接单用户且随机分配
  loading.value = true
  let res: any

  try {
    if (type === 1) {
      // 添加接单用户
      res = await appealOrderHandlerAdd({
        userList: userListAdd.value,
      })
    } else {
      // 移除接单用户
      res = await appealOrderHandlerRemove({
        userList: userListRemove.value,
        isRandomAssign: type === 2 ? 0 : 1,
      })
    }

    if (res?.code === '1') {
      type === 1 ? toRight() : toLeft()
      getList()
      message.success(t('s10'))
    }
  } finally {
    loading.value = false
    resetAfterMove()
    removeMoadal.value = false
  }
}
// 获取用户列表
const userRole = ref<any>(undefined);
const getUserList = async () => {
  loading.value = true;
  const res: any = await getUserListPage({
    pageNo: 1,
    pageSize: 1000,
    role: userRole.value,
    status: 1,
  }).finally(() => {
    loading.value = false;
  });
  if (res && res.code == "1") {
    localStorage.setItem('allUserList',JSON.stringify(res.data));
    assignedList.value = res.data.map((item:any)=>{
      return {
        userId: item.id,
        username: item.username
      }
    }) || [];
  }
};
const roleList = ref<any[]>([]);
const getRoleList = async () => {
  roleList.value = await adminRoleHook.getList();
};
// 开始接单
const startOrders = async (record:any) => {
  loading.value = true;
  try {
    const res: any = await appealOrderHandlerAdd({
      userList: [{
        userId: record.userId,
        username: record.username
      }],
    });
    if (res && res.code === "1") {
      message.success(t('s10'));
      getOrderReceivingUsers();
      getList();
    }
  } finally {
    loading.value = false;
  }
};
// 停止接单
const stopOrders = async (record:any) => {
  rightChecked.value = [record.userId];
  showRemoveConfirm();
};
//获取当前用户
const currentUser =JSON.parse(localStorage.getItem("userInfo") || "{}");
const isAdminAndMe = (value:any)=> {
  return currentUser.isAdmin || value.userId == currentUser.userId;
};
onMounted(() => {
  getUserList();
  // getRoleList();
  getOrderReceivingUsers();
  getList()
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>
<style lang="less" scoped>
.transfer-wrapper {
  display: flex;
}

.panel {
  width: 650px;
  border: 1px solid #eee;
  padding: 12px;
}

.panel-title {
  font-weight: 650;
  margin-bottom: 8px;
}

.item {
  margin: 6px 0;
}

.middle {
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
