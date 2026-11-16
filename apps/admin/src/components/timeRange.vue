<template>
  <label v-if="title">{{ title }}：</label>
  <a-date-picker
    :open="openDate1"
    v-model:value="start"
    :size="props.size || 'default'"
    :valueFormat="type == 1 ? 'YYYY-MM-DD HH:mm:ss' : type == 2 ? 'YYYY-MM-DD' : 'YYYY-MM'"
    :show-time="type == 1 ? { defaultValue: dayjs('00:00:00', 'HH:mm:ss') } : false"
    :showNow="false"
    :showToday="false"
    :style="{ width: props.width ? props.width+'px' : '' }"
    :picker="type == 1 ? undefined : type == 2 ? 'date' : 'month'"
    :placeholder="$t('publicStartTime')"
    @openChange="openChange1"
    :disabledDate="disabledStartDate"
  >
    <template v-if="(type == 1 || type == 2) && !hideFooterBtn" #renderExtraFooter>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(0)">{{ $t('m735') }}</a-button>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(3)">{{ $t('m736') }}</a-button>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(7)">{{ $t('m737') }}</a-button>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(30)">{{ $t('m738') }}</a-button>
    </template>
  </a-date-picker>
  ~
  <a-date-picker
    :open="openDate2"
    v-model:value="end"
    :size="props.size || 'default'"
    :valueFormat="type == 1 ? 'YYYY-MM-DD HH:mm:ss' : type == 2 ? 'YYYY-MM-DD' : 'YYYY-MM'"
    :show-time="type == 1 ? { defaultValue: dayjs('23:59:59', 'HH:mm:ss') } : false"
    :showNow="false"
    :showToday="false"
    :style="{ width: props.width ? props.width+'px' : '' }"
    :picker="type == 1 ? undefined : type == 2 ? 'date' : 'month'"
    :placeholder="$t('publicEndTime')"
    @openChange="openChange2"
    :disabledDate="disabledEndDate"
  >
    <template v-if="(type == 1 || type == 2) && !hideFooterBtn" #renderExtraFooter>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(0)">{{ $t('m735') }}</a-button>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(3)">{{ $t('m736') }}</a-button>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(7)">{{ $t('m737') }}</a-button>
      <a-button class="time-footer-btn" size="small" @click="setDefaultData(30)">{{ $t('m738') }}</a-button>
    </template>
  </a-date-picker>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 使用示例
// <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('p22')" :type="1" :num="30" />

// type：1 可选择时分秒 2 可选择日期 3 可选择月份
// num：默认查询天数，0为今天
const props = defineProps([
  'startTime',
  'endTime',
  'title',
  'type',
  'num',
  'size',
  'width',
  'hideFooterBtn',
  'disableToday',
  'isBefor',
  'isAfter'
]);

const emit = defineEmits(['update:startTime', 'update:endTime']);
const start = ref(props.startTime);
const end = ref(props.endTime);

// 父组件值更新监听
watch(() => props.startTime, (newValue) => {
  start.value = newValue;
});
watch(() => props.endTime, (newValue) => {
  end.value = newValue;
});

// 快捷选择时间
const openDate1 = ref<any>(false);
const openDate2 = ref<any>(false);
const openChange1 = () => {
  openDate1.value = !openDate1.value;
}
const openChange2 = () => {
  openDate2.value = !openDate2.value;
}
const setDefaultData = (num:any) => {
  let s,e;
  if(props.type == 1){
    s = dayjs().subtract(num, 'day').format('YYYY-MM-DD')+' 00:00:00';
    e = dayjs().subtract(0, 'day').format('YYYY-MM-DD')+' 00:00:00';
    if(num == 0){
      e = dayjs().subtract(0, 'day').format('YYYY-MM-DD')+' 23:59:59';
    }
  }else if(props.type == 2){
    s = dayjs().subtract(num, 'day').format('YYYY-MM-DD');
    e = dayjs().subtract(0, 'day').format('YYYY-MM-DD');
  } else if(props.type == 3){
    s = dayjs().subtract(num, 'month').format('YYYY-MM');
    e = dayjs().subtract(0, 'month').format('YYYY-MM');
  }
  start.value = s;
  end.value = e;
  openDate1.value = false;
  openDate2.value = false;
}

// 自组件值更新传递到父组件
watch(()=>start.value, () => {
  emit('update:startTime', start.value);
});
watch(()=>end.value, () => {
  emit('update:endTime', end.value);
});

onBeforeMount(() => {
  if(props.num != undefined){
    setDefaultData(props.num);
  }
  // === 新增运行时校验 ===
  if (props.isBefor && props.isAfter) {
    console.warn('[timeRange] ⚠️ isBefor 和 isAfter 不能同时传！');
  }
  if ((props.isBefor || props.isAfter) && !props.disableToday) {
    console.warn('[timeRange] ⚠️ isBefor/isAfter 需配合 disableToday 使用！');
  }
})
onMounted(() => {})

// ===== 新增统一封装的禁用规则 =====
const checkDisableToday = (current: any) => {
  if (!props.disableToday) return false;
  const today = dayjs().startOf('day');
  if (props.isBefor) {
    return current.isSame(today, 'day') || current.isBefore(today, 'day');
  }
  if (props.isAfter) {
    return current.isSame(today, 'day') || current.isAfter(today, 'day');
  }
  return false;
};

// 禁用开始日期的范围
const disabledStartDate = (current: any) => {
  if (!current) return false;
  if (checkDisableToday(current)) return true;
  if (!end.value) return false;
  return props.type == 1
    ? current.isAfter(dayjs(end.value))
    : current.isAfter(dayjs(end.value), 'day');
};

// 禁用结束日期的范围
const disabledEndDate = (current: any) => {
  if (!current) return false;
  if (checkDisableToday(current)) return true;
  if (!start.value) return false;
  return props.type == 1
    ? current.isBefore(dayjs(start.value))
    : current.isBefore(dayjs(start.value), 'day');
};
</script>
