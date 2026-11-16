<template>
  <div class="config_card_content">
    <h3 style="padding-left: 20px;width: 100%;">{{ $t('n1988') }}</h3>
    <a-form
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      autocomplete="off"
      labelAlign="right"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('n1989')">
            <!-- 配置加载完成前、保存请求进行中禁止编辑，避免输入被随后回显的配置覆盖 -->
            <a-spin :spinning="loading && !config.id">
              <div class="auto-sell-row">
                <a-switch
                  v-model:checked="formState.systemAutoSellEnabled"
                  :checked-value="1"
                  :un-checked-value="0"
                  :disabled="!config.id || saving"
                />
                <!-- 开关关闭时隐藏时间选择，开启后配置执行时间段 -->
                <template v-if="formState.systemAutoSellEnabled == 1">
                  <a-time-picker
                    v-model:value="formState.systemAutoSellStartTime"
                    valueFormat="HH:mm:ss"
                    :placeholder="$t('publicStartTime')"
                    :showNow="false"
                    :disabled="!config.id || saving"
                    class="time-picker"
                  />
                  <span class="range-separator">-</span>
                  <a-time-picker
                    v-model:value="formState.systemAutoSellEndTime"
                    valueFormat="HH:mm:ss"
                    :placeholder="$t('publicEndTime')"
                    :showNow="false"
                    :disabled="!config.id || saving"
                    class="time-picker"
                  />
                </template>
                <tipTemplate :info="[$t('n1990'), $t('n1991')]" />
                <!-- 配置加载失败：提示并提供重试 -->
                <span v-if="loadFailed && !config.id" class="load-failed">
                  {{ $t('n1983') }}
                  <a-button type="link" size="small" @click="emit('reload')">{{ $t('n1984') }}</a-button>
                </span>
              </div>
            </a-spin>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: saveOffset, span: 16 }">
        <a-popconfirm
          :title="$t('m364')"
          :ok-text="$t('yes')"
          :cancel-text="$t('no')"
          :disabled="!config.id"
          @confirm="save"
        >
          <a-button
            type="primary"
            :loading="saving"
            :disabled="!config.id"
            v-permission="'admin:tradeConfigAdmin:updateSell'"
          >
            {{ $t("save") }}
          </a-button>
        </a-popconfirm>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import tipTemplate from "../Other/tipTemplate.vue";
import { updateSellApi } from "@/api/c2cconfig.api";

// 破解APP自动卖出配置：配置详情由卖出参数页统一获取后传入，提交走卖出参数更新接口，
// 只提交本卡片的字段，保存成功后把已提交的字段交给父组件合并（不重新拉取整份配置）；
// 保存按钮与卖出参数 tab 原有保存按钮使用同一权限标识
const props = defineProps({
  // 卖出参数页的配置详情（publicConfig 的 configState），id 为 0 表示尚未加载成功
  config: { type: Object, required: true },
  // 配置详情是否正在请求（尚未拿到配置时展示加载中）
  loading: { type: Boolean, default: false },
  // 最近一次配置详情请求是否失败（尚未拿到配置时展示“加载失败/重试”）
  loadFailed: { type: Boolean, default: false },
  // 与所在页面表单保持一致的栅格，保证标签与上方表单项对齐
  labelCol: { type: Object, default: () => ({ span: 8 }) },
  wrapperCol: { type: Object, default: () => ({ span: 16 }) },
  saveOffset: { type: Number, default: 11 },
});

// saved：保存成功，携带已提交的字段；reload：配置加载失败后点击重试
const emit = defineEmits(["saved", "reload"]);
const { t } = useI18n();
const saving = ref(false);
const formState = ref({
  systemAutoSellEnabled: 0, // 自动开启卖出时间开关 0-关闭 1-开启
  systemAutoSellStartTime: undefined as string | undefined, // 开始时间 HH:mm:ss
  systemAutoSellEndTime: undefined as string | undefined, // 结束时间 HH:mm:ss
});

// 按配置回显本卡片字段，默认取父组件传入的配置
const syncFormState = (source: any = props.config) => {
  const { systemAutoSellEnabled, systemAutoSellStartTime, systemAutoSellEndTime } = source;
  formState.value = {
    systemAutoSellEnabled: systemAutoSellEnabled == 1 ? 1 : 0,
    systemAutoSellStartTime: systemAutoSellStartTime || undefined,
    systemAutoSellEndTime: systemAutoSellEndTime || undefined,
  };
};
// 只在本卡片三个字段的值变化时回显（首次加载、本卡片保存后合并）；
// 主表单保存后会重新拉取整份配置，这三个值不变时不回显，避免冲掉本卡片未保存的修改
watch(
  [
    () => props.config.systemAutoSellEnabled,
    () => props.config.systemAutoSellStartTime,
    () => props.config.systemAutoSellEndTime,
  ],
  () => syncFormState(),
  { immediate: true }
);

// 开启时开始时间、结束时间必填，且开始时间不能大于结束时间（允许相等）；关闭时不校验
const validate = (): boolean => {
  const { systemAutoSellEnabled, systemAutoSellStartTime, systemAutoSellEndTime } = formState.value;
  if (systemAutoSellEnabled != 1) return true;
  if (!systemAutoSellStartTime) {
    message.error(t("t4"));
    return false;
  }
  if (!systemAutoSellEndTime) {
    message.error(t("t5"));
    return false;
  }
  // 时间均为补零的 HH:mm:ss 字符串，可直接按字符串比较先后
  if (systemAutoSellStartTime > systemAutoSellEndTime) {
    message.error(t("n2006"));
    return false;
  }
  return true;
};

const save = async () => {
  // 配置未加载成功时不提交，避免带着默认 id 0 和关闭状态覆盖线上配置
  if (!props.config.id || !validate()) return;
  // 只提交有值的字段：清空后的时间（null/空串）不提交，后台保留原值，也不合并回父组件
  const fields: any = {};
  Object.entries(formState.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") fields[key] = value;
  });
  saving.value = true;
  try {
    const res: any = await updateSellApi({
      id: props.config.id,
      ...fields,
    });
    if (res && res.code === "1") {
      message.success(t("s1"));
      emit("saved", fields);
      // 按“原配置 + 本次提交的字段”回显，不依赖父组件是否合并；未提交的清空时间恢复为后台保留的原值
      syncFormState({ ...props.config, ...fields });
    }
  } finally {
    saving.value = false;
  }
};
</script>

<style lang="less" scoped>
.auto-sell-row {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.time-picker {
  width: 140px;
  margin-left: 16px;
}
.range-separator {
  margin: 0 0 0 16px;
  color: #999;
}
.load-failed {
  margin-left: 12px;
  color: #ff4d4f;
}
// 卖出参数页对 .tipIcon 统一加了 margin-top，这里与开关、时间选择垂直居中对齐
.auto-sell-row :deep(.tipIcon) {
  margin-top: 0;
  margin-left: 12px;
}
</style>
