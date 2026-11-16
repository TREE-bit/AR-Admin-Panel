<template>
    <div class="search">
        <a-row>
            <a-col :span="3">
                <a-input v-trim class="searchstyle" v-model:value="query.taskName" :placeholder="$t('m340')" />
            </a-col>
            <a-col :span="3">
                <a-select class="searchstyle" allowClear v-model:value="query.taskCycle" 
                :options="Object.entries(taskCycleMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))"
                :placeholder="$t('m344')">
                </a-select>
            </a-col>
            <a-col :span="3">
                <a-select class="searchstyle" allowClear v-model:value="query.taskType"  :options="Object.entries(taskTypeMap).map(([key, value]:[any,any]) => ({ value: key, label: value }))" :placeholder="$t('m345')">
                </a-select>
            </a-col>
            <a-col :span="3">
                <a-select :disabled="isSearch" class="searchstyle" allowClear v-model:value="query.taskTarget" :options="targetList" :placeholder="$t('m376')">
                </a-select>
            </a-col>
            <a-col :span="3">
                <a-select class="searchstyle" allowClear v-model:value="query.taskStatus" :options="statusList" :placeholder="$t('m377')">
                </a-select>
            </a-col>
            <a-col>
                <a-button type="primary" :icon="h(SearchOutlined)" @click="getList">{{ $t("search")
                    }}</a-button>
                <a-button type="primary" @click="reset">{{
                $t("reset")
            }}</a-button>
            </a-col>
        </a-row>
    </div>
    <div class="search">
        <a-button type="primary" @click="showEditPage" v-permission="'admin:task:createTask'">{{ $t('m375') }}</a-button>
    </div>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="paginationConfig" :loading="loading" @change="getChange"
        :scroll="{ x: '100%' ,y : getTabH + 'px'}" bordered :row-key="(record: any) => JSON.stringify(record)">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'taskType'">
                <span :class="colorMap[record.taskType]">
                    {{ taskTypeMap[record.taskType] }}
                </span>
            </template>
            <template v-if="column.key === 'taskCycle'">
                <span :class="colorMap[record.taskCycle]">
                    {{ taskCycleMap[record.taskCycle] }}
                </span>
            </template>
            <template v-if="column.key === 'taskRewardMethod'">
                <a-tooltip>
                    <template #title>
                        {{ $getMapItem(taskRewardMethodMap, record.taskRewardMethod) }}
                    </template>
                    {{ $getMapItem(taskRewardMethodMap, record.taskRewardMethod) }}
                </a-tooltip>
            </template>
            <template v-if="column.key === 'eventFlag'">
                <span v-if="record.eventFlag in taskEventMap" :class="colorMap[Object.keys(taskEventMap).indexOf(record.eventFlag) % 10]">{{ $t(taskEventMap[record.eventFlag].name) }}</span>
                <span v-else>-</span>
            </template>
            <template v-if="column.key === 'exclusiveFlag'">
                <span :class="record.exclusiveFlag == 1 ? 'tag-green' : 'tag-red'">
                    {{ record.exclusiveFlag == 1 ? $t('yes') : $t('no') }}
                </span>
            </template>
            <template v-if="column.key === 'taskTarget'">
                <span :class="record.taskTarget == 1 ? 'tag-blue' : 'tag-orange'">
                    {{ taskTargetMap[record.taskTarget] }}
                </span>
            </template>
            <template v-if="column.key === 'taskReward'">
                {{ currency(record.taskReward, false) }}
            </template>
            <template v-if="column.key === 'taskStatus'">
                <span :class="record.taskStatus == 1 ? 'tag-green' : 'tag-red'">
                    {{ taskStatusMap[record.taskStatus] }}
                </span>
            </template>
            <template v-if="column.key === 'updateBy'">
                {{ record.updateBy ? record.updateBy : record.createBy}}
            </template>
            <template v-if="column.key === 'startTime'">
                {{ record.startTime || '-'}}
            </template>
            <template v-if="column.key === 'endTime'">
                {{ record.endTime || '-'}}
            </template>
            <template v-if="column.key === 'taskTitle'">
                <a-tooltip>
                <template #title>{{ record.taskTitle }}</template>
                <div style="text-overflow: ellipsis;overflow: hidden;">{{ record.taskTitle }}</div>
                </a-tooltip>
            </template>
            <template v-if="column.key === 'action'">
                <a-tag color="rgba(14, 186, 139, 1)" style="cursor: pointer" size="small" v-permission="'admin:task:taskDetail'"
                    @click="checkDetail(record)">{{ $t('b23') }}
                </a-tag>
                <a-tag color="rgba(22, 155, 213, 1)" style="cursor: pointer" size="small" v-permission="'admin:task:updateTask'"
                    @click="showEditPageFun(record)">{{ $t("edit") }}
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
            </template>
        </template>
    </a-table>
    <a-modal v-model:open="showContent" :title="isEdit  ? $t('n675') : isCheck ? $t('n676') : $t('m375')" width="100%" wrap-class-name="full-modal" @cancel="handleCancel" :footer="null">
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('m353') }}：</div>
                <div class="task_info">
                    <a-input v-trim :disabled="isEdit || isCheck" :maxlength="40" v-model:value="addFrom.taskTitle" :placeholder="$t('m405')" >
                        <template #addonAfter>
                            <span style="color: #bbb">{{addFrom.taskTitle?addFrom.taskTitle.length:'0'}}/40 </span>
                        </template>
                    </a-input>
                </div>
            </div>
            <div class="task_item">
                <div class="task_title">{{ $t('m356') }}：</div>
                <div class="task_info">
                    <a-input v-trim :disabled="isCheck" :maxlength="40" v-model:value="addFrom.taskSubTitle" :placeholder="$t('m407')" >
                        <template #addonAfter>
                            <span style="color: #bbb">{{ addFrom.taskSubTitle?addFrom.taskSubTitle.length:'0' }}/40 </span>
                        </template>
                    </a-input>
                </div>
            </div>
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('m355') }}：</div>
                <div class="task_info">
                    <img v-show="isCheck" style="width: 80px;height: 80px;" :src="addFrom.taskIcon" alt="">
                    <Upload v-if="isMountUpload && !isCheck" v-model:value="addFrom.taskIcon"
                        @startUpload="startUpload" @finishUpload="finishUpload" />
                </div>
            </div>
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('n678') }}：</div>
                <div class="task_info" style="width: 200px;">
                    <a-radio-group :disabled="isEdit || isCheck" v-model:value="addFrom.exclusiveFlag">
                        <a-radio :value="1">{{ $t('yes') }}</a-radio>
                        <a-radio :value="0">{{ $t('no') }}</a-radio>
                    </a-radio-group>
                </div>
                <div class="task_title" v-if="addFrom.exclusiveFlag == 1 " style="margin-left: -150px;"><span>*</span>{{ $t('n682') }}：</div>
                <div class="task_info" v-if="addFrom.exclusiveFlag == 1 " style="position: relative;top:5px">
                    <a-input-group compact style="display: inline-block; width: 300px;position: relative;top:-4px">
                    <a-form-item-rest>
                        <a-input
                            style="width: 20%; text-align: center; pointer-events: none"
                            :value="'>='"
                            disabled
                        />
                    </a-form-item-rest>
                    <a-select
                        :disabled="isEdit || isCheck"
                        :placeholder="$t('n683')"
                        style="width: 80%"
                        v-model:value="addFrom.minLevel"
                        :options="Object.entries(levelMap).map(([key, value]) => ({ label: value, value: Number(key) }))"
                    >
                    </a-select>
                </a-input-group>
                </div>
            </div>
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('m354') }}：</div>
                <div class="task_info">
                    <a-input-number :disabled="isCheck" style="width: 100%"  v-model:value="addFrom.taskSort" :min="0" :placeholder="$t('m406')" />
                </div>
            </div>
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('taskCycle') }}：</div>
                <div class="task_info">
                    <a-select :disabled="isEdit || isCheck" :placeholder="$t('m344')" style="width:100%"
                        v-model:value="addFrom.taskCycle">
                        <a-select-option v-for="(item, index) in cycleList" :key="index" :value="item.value">{{
                            item.label
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('taskType') }}：</div>
                <div class="task_info">
                    <a-select :disabled="isEdit || isCheck || addFrom.eventFlag == 'usdt_recharge'" :placeholder="$t('m345')" style="width:100%"
                        v-model:value="addFrom.taskType">
                        <a-select-option v-for="(item, index) in taskTypeMap" :key="index" :value="index">
                            {{ item }}</a-select-option>
                    </a-select>
                </div>
            </div>  
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('n679') }}：</div>
                <div class="task_info">
                    <a-select :disabled="isEdit || isCheck" :placeholder="$t('m563')+$t('n679')" style="width:100%"
                        v-model:value="addFrom.eventFlag">
                        <a-select-option v-if="addFrom.exclusiveFlag == 1 && addFrom.taskCycle != 1" v-for="(item, index) in taskEventMap1" :key="index" :value="index" :disabled="isEventDisabled(index)">
                            {{ eventLabel(index, item) }}</a-select-option>
                        <a-select-option v-if="addFrom.exclusiveFlag == 0 && addFrom.taskCycle != 1" v-for="(item, index) in taskEventMap2" :key="index" :value="index" :disabled="isEventDisabled(index)">
                            {{ eventLabel(index, item) }}</a-select-option>
                        <a-select-option v-if="addFrom.taskCycle == 1" v-for="(item, index) in taskEventMap3" :key="index" :value="index" :disabled="isEventDisabled(index)">
                            {{ eventLabel(index, item) }}</a-select-option>
                    </a-select>
                </div>
            </div> 
            <div class="task_item" v-show="isMoreTaskCycle" v-if="addFrom.eventFlag != 'buy_transaction_volume'">
                <div class="task_title"><span>*</span>{{ $t('n680') }}：</div>
                <div class="task_info" v-if="addFrom.eventFlag == 'invitation_and_success_trade'">
                    <a-input-number :disabled="isEdit || isCheck" v-model:value="addFrom.invitationCount"  :placeholder="$t('n788')" :min="0" >
                        <template #addonBefore>
                            {{ $t('n792') }}
                        </template>
                        <template #addonAfter>
                            {{ $t('n343') }}
                        </template>
                    </a-input-number>
                </div>
                <b style="margin-right: 20px;" v-if="addFrom.eventFlag == 'invitation_and_success_trade'">{{ $t('n791') }}</b>
                <div class="task_info" style="margin-right: 20px;">
                    <a-select :disabled="isEdit || isCheck || addFrom.eventFlag == 'usdt_recharge'" allowClear :placeholder="$t('m376')"
                        style="width:100%"
                        v-model:value="addFrom.taskTarget">
                        <a-select-option v-for="(item, index) in targetList" :key="index" :value="item.value">{{
                            item.label
                        }}</a-select-option>
                    </a-select>
                </div>
                <div class="task_info" v-if="addFrom.eventFlag == 'usdt_recharge'">
                    <a-input-number :disabled="isEdit || isCheck" v-model:value="addFrom.taskTargetNum" :placeholder="$t('m562')+$t('n2031')" :min="1" :precision="0" >
                        <template #addonAfter>
                            {{ 'ARB' }}
                        </template>
                    </a-input-number>
                </div>
                <div class="task_info" v-else>
                    <a-input-number :disabled="isEdit || isCheck" v-model:value="addFrom.taskTargetNum" style="width: 50%" :placeholder="$t('m349')" :min="0" />
                </div>
            </div> 
            <div class="task_item" v-show="isMoreTaskCycle" v-if="addFrom.eventFlag == 'buy_transaction_volume'">
                <div class="task_title"><span>*</span>{{ $t('n680') }}：</div>
                <div class="task_info">
                    <a-input-number :disabled="isEdit || isCheck" v-model:value="addFrom.taskTargetNum" style="width: 90%" :placeholder="$t('m562')+$t('n1319')" :min="1" >
                        <template #addonAfter>
                            {{ 'ARB' }}
                        </template>
                    </a-input-number>
                </div>
                <div class="task_info">
                    <a-input-number :disabled="isEdit || isCheck" v-model:value="addFrom.invitationCount"  :placeholder="$t('m562')+$t('n1320')" :min="1" >
                        <template #addonAfter>
                            {{ $t('天') }}
                        </template>
                    </a-input-number>
                </div>
            </div> 
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('m337') }}：</div>
                <div class="task_info">
                    <a-input-number :disabled="isEdit || isCheck" v-model:value="addFrom.taskReward"  :placeholder="$t('m350')" :min="0" >
                        <template #addonAfter>
                            {{ 'ARB' }}
                        </template>
                    </a-input-number>
                </div>
            </div> 
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('n1648') }}：</div>
                <div class="task_info">
                    <a-select
                        v-model:value="addFrom.taskRewardMethod"
                        :placeholder="$t('m563') + $t('n1648')"
                         style="width:100%"
                         :options="Object.entries(taskRewardMethodMap).map(([key, value]:[any,any]) => ({ value: Number(key), label: value }))"
                    ></a-select>
                </div>
            </div> 
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('m230') }}：</div>
                <div class="task_info">
                    <a-input v-trim :disabled="isCheck"  v-model:value="addFrom.taskJumpLink" :placeholder="$t('m408')" />
                </div>
            </div> 
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('m351') }}：</div>
                <div class="task_info">
                    <a-select :disabled="isCheck" :placeholder="$t('m377')" style="width:100%"
                        v-model:value="addFrom.taskStatus">
                        <a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="task_item">
                <div class="task_title"><span>*</span>{{ $t('n789') }}：</div>
                <div class="task_info" v-if="!isEdit && !isCheck" style="width: 60%;">
                    <timeRange v-model:startTime="addFrom.startDate" v-model:endTime="addFrom.endDate" :disableToday="true" :isBefor="true" :hideFooterBtn="true" :type="2"/>
                </div>
                <div class="task_info" v-if="isEdit || isCheck" style="width: 60%;">
                    {{ addFrom.startDate || '-' }} ~ {{ addFrom.endDate || '-' }}
                </div>
            </div>
            <div class="task_add_btn">
                <a-button @click="closeEdit">{{ $t('m357') }}</a-button>
                <a-button v-if="!isCheck"  :loading="isUpload" style="margin-left: 40px" type="primary" @click="onFinish">{{ $t('m358') }}</a-button>
                <a-button v-if="isCheck" style="margin-left: 40px" type="primary" @click="closeEdit">{{ $t('l54') }}</a-button>
            </div>
    </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, reactive, computed, watch, watchEffect } from "vue";
import { taskManagerAdminIistPage,
    taskManagerAdminCreateTask,
    taskManagerAdminDeleteTask,
    taskManagerAdminUpdateTask,
    taskManagerAdminTaskDetail,
    taskEventConfigAdminList,
 } from "@/api/c2cconfig.api";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useToast } from "@/hooks/useToast.hook";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { usePagination, today } from "@/plugins/dataMap";
import Upload from '@/components/Upload/index.vue'
import { currency } from "@/utils";
import { selectedRow, clearSelected } from "@/hooks/useSelected.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { levelMap,taskEventMap,taskTypeMap, taskCycleMap, colorMap } from "@/utils/publicData";
import { number } from "echarts";
const taskEventMap1:any = computed(() => {
  if (addFrom.value.taskCycle != 3) {
    return Object.fromEntries(
      Object.entries(taskEventMap).filter(([key]) => key !== "buy_transaction_volume")
    );
  }else{
    return {
      ...taskEventMap,
    };
  }
});
const taskEventMap2:any = computed(() => {
    return Object.fromEntries(
        Object.entries(taskEventMap1.value).filter(([key]) => key !== "invitation_and_success_trade")
    );
})
const taskEventMap3:any = Object.fromEntries(
  Object.entries(taskEventMap).slice(0, 4)
);
const { getTabH } = useTabHeight();
const { paginationConfig } = usePagination();
const { t } = useI18n();
const dataSource = ref([]);
const loading = ref(false);
const stepOne = ref(true);
const stepTwo = ref(false);
const isMountUpload = ref(false);
const isMoreTaskCycle = ref(true)
const isUpload = ref(false);
const isCreate = ref(true);
const isEdit = ref(false);
const isCheck = ref(false);
const addFrom: any = ref({
    taskCycle: undefined,
    taskType: undefined,
    taskTarget: undefined,
    taskTargetNum: undefined,
    taskStatus: undefined,
    taskTitle: '',
    taskSort: undefined,
    taskIcon: undefined,
    taskReward: undefined,
    taskRewardMethod: undefined,
    taskSubTitle: '',
    taskJumpLink: undefined,
    exclusiveFlag: 0,
    minLevel: undefined,
    eventFlag: undefined,
    invitationCount: undefined,
    startDate:'',
    endDate: '',
})
const query = ref<any>({
    asc: '',
    column: '',
    taskCycle: null,
    taskName: '',
    taskType: null,
    taskTarget: null,
    taskStatus: null,
    pageNo: 1,
    pageSize: 20,
})
const columns:any = [
    {
        title: t('m363'),
        dataIndex: "id",
        key: "id",
        align: "center",
        width: 100,
    },
    {
        title: t('m354'),
        dataIndex: "taskSort",
        key: "taskSort",
        align: "center",
        width: 100,
    },
    {
        title: t('taskType'),
        dataIndex: "taskType",
        key: "taskType",
        align: "center",
        width: 180,
    },
    {
        title: t('taskCycle'),
        dataIndex: "taskCycle",
        key: "taskCycle",
        align: "center",
        width: 180,
    },
    {
        title: t('n679'),
        dataIndex: "eventFlag",
        key: "eventFlag",
        align: "center",
        width: 180,
    },
    {
        title: t('n678'),
        dataIndex: "exclusiveFlag",
        key: "exclusiveFlag",
        align: "center",
        width: 100,
    },
    {
        title: t('taskName'),
        dataIndex: "taskTitle",
        key: "taskTitle",
        align: "center",
        width: 240,
    },
    {
        title: t('m346'),
        dataIndex: "taskTarget",
        key: "taskTarget",
        align: "center",
        width: 140,
    },
    {
        title: t('m348'),
        dataIndex: "taskTargetNum",
        key: "taskTargetNum",
        align: "center",
        width: 140,
    },
    {
        title: t('m337'),
        dataIndex: "taskReward",
        key: "taskReward",
        align: "center",
        width: 140,
    },
    {
        title: t('n1648'),
        dataIndex: "taskRewardMethod",
        key: "taskRewardMethod",
        align: "center",
        width: 150,
    },
    {
        title: t('m351'),
        dataIndex: "taskStatus",
        key: "taskStatus",
        align: "center",
        width: 140,
    },
    {
        title: t('l48'),
        dataIndex: "updateBy",
        key: "updateBy",
        align: "center",
        width: 140,
    },
    {
        title: t('l50'),
        dataIndex: "createTime",
        key: "createTime",
        align: "center",
        width: 170,
    },
    {
        title: t('m368'),
        dataIndex: "updateTime",
        key: "updateTime",
        align: "center",
        width: 170,
    },
    {
        title: t('publicStartTime'),
        dataIndex: "startTime",
        key: "startTime",
        align: "center",
        width: 170,
    },
    {
        title: t('publicEndTime'),
        dataIndex: "endTime",
        key: "endTime",
        align: "center",
        width: 170,
    },
    {
        title: t("operation"),
        dataIndex: "action",
        key: "action",
        align: "center",
        width: 140,
        fixed: 'right',
    },
];
// const taskCycleMap = ref<any>({
//     1 : t('m361'),
//     2 : t('m362'),
// })
const taskTargetMap = ref<any>({
    1 : t('m347'),//次数
    2 : t('m374'),//金额
})
const taskStatusMap = ref<any>({
    0 : t('disabled'),
    1 : t('enabled'),
})
const isChangeNum = ref(1);
const isSearch = ref(false);
const isSelectType = ref(false)
watch([
    () => addFrom.value.taskCycle,
    () => query.value.taskCycle,
    () => addFrom.value.exclusiveFlag
],
  ([newAddCycle, newQueryCycle,newExclusiveFlag]) => {
    // 针对 addFrom 的逻辑
    if (newAddCycle !== undefined) {
      isMoreTaskCycle.value = newAddCycle != 1;
      if (!isEdit.value) {
        isChangeNum.value += 1;
        if (isChangeNum.value >= 3) {
          addFrom.value.taskType = undefined;
        }
      }
    }
    if(newExclusiveFlag !== undefined){
        if(!isEdit.value && !isCheck.value){
            addFrom.value.eventFlag = undefined;
        }
    }

    // 针对 query 的逻辑
    if (newQueryCycle !== undefined) {
      isSearch.value = newQueryCycle == 1;
      query.value.taskType = null;
      query.value.taskTarget = null;

      isSelectType.value =
        newQueryCycle == 1 || newQueryCycle == 2 ? true : false;
    }
  }
);
watchEffect(() => {
    if(!isCheck.value && !isEdit.value){
        addFrom.value.exclusiveFlag == 1 ? addFrom.value.minLevel = 0 : addFrom.value.minLevel = undefined;
    }
});
// USDT充值固定为买入任务 + 金额目标（累计到账ARB）
watch(() => addFrom.value.eventFlag, (newEventFlag) => {
    if(newEventFlag == 'usdt_recharge' && !isEdit.value && !isCheck.value){
        addFrom.value.taskType = '1';
        addFrom.value.taskTarget = 2;
    }
});
const cycleList = ref([
    { value: 1, label: t('m361'), },//一次性
    { value: 2, label: t('m362'), },//周期性-每天
    { value: 3, label: t('n790'), },//周期性-自定义
]);
const targetList = ref([
    { value: 1, label: t('m347'), },
    { value: 2, label: t('m374'), },
]);
const statusList = ref([
    { value: 1, label: t('enabled'), },
    { value: 0, label: t('disabled'), },
]);
const taskRewardMethodMap: any = {
    1: t('n1646'),//会员手动领取
    2: t('n1647'),//系统自动发放
}
// 事件管理中的事件状态：1 启用 / 0 禁用，未启用的事件不可选
const eventStatusMap = ref<any>(null);
const getEventStatus = async () => {
    const res: any = await taskEventConfigAdminList({ pageNo: 1, pageSize: 999 });
    if (res && res.code === "1") {
        eventStatusMap.value = Object.fromEntries((res.data || []).map((item: any) => [item.eventUniqueFlag, Number(item.eventStatus)]));
    }
}
const isEventDisabled = (key: any) => !!eventStatusMap.value && eventStatusMap.value[key] !== 1;
const eventLabel = (key: any, item: any) => isEventDisabled(key) ? `${t(item.name)} (${t('disabled')})` : t(item.name);
const getList = async () => {
    loading.value = true;
    paginationConfig.current = query.value.pageNo;
    paginationConfig.pageSize = query.value.pageSize;
    const res: any = await taskManagerAdminIistPage(query.value).finally(()=>loading.value=false);
    if (res && res.code === "1") {
        dataSource.value = res.data.map((item: any) => {
            item.startTime = item.startTime ? item.startTime.split(' ')[0] : item.startTime; 
            item.endTime = item.endTime ? item.endTime.split(' ')[0] : item.startTime; 
            return item;
        });
        paginationConfig.total = res.total || 0;
    }
};
const getChange = (value: any) => {
  const { current, pageSize } = value;
  query.value.pageNo = current;
  query.value.pageSize = pageSize;
  paginationConfig.pageSize = pageSize;
  paginationConfig.current = current;
  getList();
};
const reset = () => {
    query.value = {
        taskName: '',
        taskType: null,
        taskCycle: null,
        taskTarget: null,
        taskStatus: null,
        pageNo: 1,
        pageSize: 20,
    }
  paginationConfig.current = 1;
  paginationConfig.pageSize = 20;
  clearSelected();
  getList();
}
/****************Add edit***************/
const showContent = ref(false);
const onFinish = async (values: any) => {
    if(addFrom.value.taskCycle == 1){
        addFrom.value.taskTarget = null;
        addFrom.value.taskTargetNum = '';
    }
    if(addFrom.value.eventFlag == 'buy_transaction_volume'){
        addFrom.value.taskTarget = 2
    }
    if(addFrom.value.eventFlag == 'usdt_recharge' && !isEdit.value){
        addFrom.value.taskType = '1'
        addFrom.value.taskTarget = 2
    }
    const {id,taskCycle,taskType,taskTarget,taskTargetNum,taskStatus,taskTitle,taskSort,taskIcon,taskReward,taskSubTitle,taskJumpLink,exclusiveFlag,minLevel,eventFlag,invitationCount,startDate,endDate,taskRewardMethod } = addFrom.value;
    const addContent={id,taskCycle,taskType,taskTarget,taskTargetNum,taskStatus,taskTitle,taskSort,taskIcon,taskReward,taskSubTitle,taskJumpLink,exclusiveFlag,minLevel,eventFlag,invitationCount,startDate,endDate,taskRewardMethod};
    
    if(!taskTitle){return message.error(t('m562') + t('m353'))};
    if(!taskIcon){return message.error(t('m409'))};
    if(!taskSort){return message.error(t('m406'))};
    if(!isEdit.value){
        if(!taskCycle){return message.error(t('m344'))};
        if(!taskType){return message.error(t('m345'))};
    }
    if(!eventFlag){return message.error(t('m563') + t('n679'))};
    if(!isEdit.value){
        if(eventFlag == 'invitation_and_success_trade' && (!addFrom.value.invitationCount || addFrom.value.invitationCount <=0) && addFrom.value.taskCycle != 1){
            return message.error(t('m562')+t('n788'));
        }
        if(eventFlag == 'buy_transaction_volume'){
            if(!taskTargetNum){return message.error(t('m562')+t('n1319'))};
            if(!addFrom.value.invitationCount || addFrom.value.invitationCount <=0){
                return message.error(t('m562')+t('n1320'));
            }
        }
        if(addFrom.value.taskCycle != 1){ 
            if(!taskTarget){return message.error(t('m376'))};
            if(!taskTargetNum){return message.error(t('m349'))};
        }
        if(!taskReward){return message.error(t('m350'))};
    }
    if(!taskRewardMethod){return message.error(t('m563') + t('n1648'))};
    if(!taskJumpLink){return message.error(t('m408'))};
    if(taskStatus == null){return message.error(t('m377'))};
    if(!isEdit.value){
        if(!startDate || !endDate){return message.error(t('m563') + t('n789'))};
    }
    if(isCreate.value){    
        const res: any = await taskManagerAdminCreateTask(addFrom.value);
        if (res && res.code === "1") {
            message.success(t('s1'));
            getList();
            closeEdit();
        }
    }else{
        const res: any = await taskManagerAdminUpdateTask(addContent); 
        if (res && res.code === "1") {
            message.success(t('s1'));
            getList();
            closeEdit();
        }
    }
};
const onFinishFailed = (errorInfo: any) => {
    // console.log("Failed:", errorInfo);
};
const closeEdit = () => {
    showContent.value = false;
    isMountUpload.value = false;
    stepOne.value = true;
    stepTwo.value = false;
    isEdit.value = false;
    resetAdd()
}
const del = async (value:any) =>{
    const { id } = value;
    const res: any = await taskManagerAdminDeleteTask({id});
    if(res && res.code === '1'){
        message.success(t('s9'))
    }
}
const nextStep = () => {
    stepOne.value = false;
    stepTwo.value = true;
}
const goBack = () =>{
    stepOne.value = true;
    stepTwo.value = false;
}
const resetAdd = () =>{
    addFrom.value = {
        taskCycle: undefined,
        taskType: undefined,
        taskTarget: undefined,
        taskTargetNum: undefined,
        taskStatus: undefined,
        taskTitle: '',
        taskSort: undefined,
        taskIcon: undefined,
        taskReward: undefined,
        taskRewardMethod: undefined,
        taskSubTitle: '',
        taskJumpLink: undefined,
        exclusiveFlag: 0,
        minLevel: undefined,
        eventFlag: undefined,
    }
}
const handleCancel = () => {
    stepOne.value = true;
    stepTwo.value = false;
    isMountUpload.value = false;
    isEdit.value = false;
    isCheck.value = false;
    resetAdd();
}
const showEditPage= () => {
    resetAdd();
    getEventStatus();
    isMountUpload.value = true;
    isEdit.value = false;
    showContent.value = true;
    isCreate.value = true;
    isCheck.value = false;
    isChangeNum.value = 3;
};
const showEditPageFun = async (data: any) => {
    selectedRow();
    const { id } = data;
    addFrom.value.id = id;
    loading.value = true;
    const res: any = await taskManagerAdminTaskDetail({id}).finally(()=>loading.value=false);
    if(res && res.code === '1'){
        addFrom.value = res.data;
        addFrom.value.taskTarget = Number(res.data.taskTarget);
        addFrom.value.taskStatus = Number(res.data.taskStatus);
        addFrom.value.taskCycle = Number(res.data.taskCycle);
        addFrom.value.taskRewardMethod = Number(res.data.taskRewardMethod);
        addFrom.value.startDate = res.data.startTime ? res.data.startTime.split(' ')[0] : res.data.startTime;
        addFrom.value.endDate = res.data.endTime ? res.data.endTime.split(' ')[0] : res.data.startTime;
        isCheck.value = false;
        isEdit.value = true;
        showContent.value = true;
        isCreate.value = false;
        isChangeNum.value = 1;
        isMountUpload.value = true;
    }
};
const checkDetail = async (value: any) => {
    selectedRow();
    loading.value = true;
    const { id } = value;
    const res: any = await taskManagerAdminTaskDetail({id}).finally(()=>loading.value=false);
    if(res && res.code === '1'){
        addFrom.value = res.data;
        addFrom.value.taskTarget = Number(res.data.taskTarget);
        addFrom.value.taskStatus = Number(res.data.taskStatus);
        addFrom.value.taskCycle = Number(res.data.taskCycle);
        addFrom.value.taskRewardMethod = Number(res.data.taskRewardMethod);
        addFrom.value.startDate = res.data.startTime ? res.data.startTime.split(' ')[0] : res.data.startTime;
        addFrom.value.endDate = res.data.endTime ? res.data.endTime.split(' ')[0] : res.data.startTime;
        showContent.value = true;
        isCheck.value = true;
        isCreate.value = false;
        isChangeNum.value = 1;
    }
};
const startUpload = (val:any) => {
    if(val) isUpload.value = true;
}
const finishUpload = (val:any) => {
    if(val) isUpload.value = false;
}
onMounted(() => {
    getList();
    getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
.account_tag {
    height: 60px;
    box-sizing: border-box;
    padding: 12px;
    border-radius: 5px;

    >div {
        float: left;
        line-height: 36px;
        font-size: 16px;
        width: 50%;
        box-sizing: border-box;
        &:nth-child(1){
            padding-right: 30px;
            text-align: right;
        }
        &:nth-child(2){
            padding-left: 30px;
        }
    }
}


:deep(label) {
    font-weight: 600;
}

.activeTitle {
    font-weight: 700;
}

.label-wrapper {
    text-align: left;
    font-weight: 600;
}

.task_item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .task_title {
        width: 250px;
        font-weight: 600;
        color: #333;
        text-align: right;
        padding-right: 10px;
        span {
            color: red;
        }
    }
    .task_info {
        width: 300px;
    }
}
.task_add_btn {
    text-align: center;
    margin-top: 20px;
}
</style>