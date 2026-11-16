<template>
  <div class="config_card_content">
    <h3 style="padding-left: 20px;width: 100%;">{{ tradeType == 'buy' ? t('n1801') : t('n1802') }}</h3>
    <a-form
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      autocomplete="off"
      labelAlign="right"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('n612')">
            <a-spin :spinning="loading">
              <div class="reward-grid">
                <div
                  v-for="row in rewardList"
                  :key="row._key"
                  class="reward-row"
                >
                  <a-input-number
                    v-model:value="row.minAmount"
                    :min="0"
                    :status="conflictKeys.has(row._key) ? 'error' : undefined"
                    class="amount-input"
                    placeholder="Min"
                    @blur="refreshConflicts(true)"
                  />
                  <span class="range-separator">——</span>
                  <a-input-number
                    v-model:value="row.maxAmount"
                    :min="row.minAmount != null ? row.minAmount + 1 : 0"
                    :status="conflictKeys.has(row._key) ? 'error' : undefined"
                    class="amount-input"
                    placeholder="Max"
                    @blur="refreshConflicts(true)"
                  />
                  <a-input-number
                    v-model:value="row.rewardAmount"
                    :min="0"
                    class="reward-input"
                  >
                    <template #addonAfter>INR</template>
                  </a-input-number>
                  <a-button
                    type="primary"
                    danger
                    class="delete-btn"
                    @click="removeRow(row)"
                  >
                    {{ $t("b11") }}
                  </a-button>
                </div>
                <div class="reward-row">
                  <a-button
                    type="dashed"
                    class="add-btn"
                    :disabled="rewardList.length >= MAX_COUNT"
                    @click="addRow"
                  >
                    <template #icon><PlusOutlined /></template>
                  </a-button>
                  <tipTemplate :info="$t('n1783')" />
                </div>
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
          @confirm="save"
        >
          <a-button
            type="primary"
            :loading="saving"
            v-permission="TRADE_CONFIG[tradeType].permission"
          >
            {{ $t("save") }}
          </a-button>
        </a-popconfirm>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type PropType } from "vue";
import { message, Modal } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import tipTemplate from "../Other/tipTemplate.vue";
import { updateBuyApi, updateSellApi } from "@/api/c2cconfig.api";
import { publicConfig } from "@/hooks/usePublicConfig.hook";

// 买入 / 卖出各自维护一份档位：读取统一走公共的参数配置详情接口，
// 提交走各自的更新接口，保存按钮按各自的权限标识控制（与所在 tab 原有保存按钮一致）
const TRADE_CONFIG = {
  buy: {
    field: "buyFixedRewardTiers",
    update: updateBuyApi,
    permission: "admin:tradeConfigAdmin:updateBuy",
  },
  sell: {
    field: "sellFixedRewardTiers",
    update: updateSellApi,
    permission: "admin:tradeConfigAdmin:updateSell",
  },
} as const;
// 最多可配置的金额范围条数
const MAX_COUNT = 10;
// 范围校验提示使用固定 key，多次触发时只更新同一条提示
const RANGE_MESSAGE_KEY = "fixedRewardRangeCheck";

type TradeType = keyof typeof TRADE_CONFIG;
type RewardRow = {
  _key: number;
  minAmount?: number; // 金额下限，含该值
  maxAmount?: number; // 金额上限，不含该值，必须大于下限
  rewardAmount?: number; // 命中该档后每笔成功子单发放的固定奖励
};

const props = defineProps({
  // 买入/卖出参数设置各自维护一份配置
  tradeType: { type: String as PropType<TradeType>, required: true },
  // 与所在页面表单保持一致的栅格，保证“金额范围”标签与上方表单项对齐
  labelCol: { type: Object, default: () => ({ span: 9 }) },
  wrapperCol: { type: Object, default: () => ({ span: 15 }) },
  saveOffset: { type: Number, default: 10 },
});

const { t } = useI18n();
// 加载状态直接使用公共 hook 的 configLoading
const { getConfig, configState, configLoading: loading } = publicConfig();
const saving = ref(false);
const rewardList = ref<RewardRow[]>([]);
// 范围非法或相互重叠的行，用于标红提示；输入完成、删除、保存时刷新
const conflictKeys = ref<Set<number>>(new Set());
let keySeed = 0;

const fetchList = async () => {
  await getConfig();
  const tiers = configState.value[TRADE_CONFIG[props.tradeType].field] || [];
  rewardList.value = tiers.map((item: any) => ({
    _key: keySeed++,
    minAmount: item.minAmount ?? undefined,
    maxAmount: item.maxAmount ?? undefined,
    rewardAmount: item.rewardAmount ?? undefined,
  }));
  conflictKeys.value = new Set();
};

// 找出区间非法（最大值 <= 最小值）以及相互重叠的行，只检查最小值和最大值都已填写的行
const checkRanges = () => {
  const ranges = rewardList.value
    .filter((row) => row.minAmount != null && row.maxAmount != null)
    .map((row) => ({
      key: row._key,
      min: Number(row.minAmount),
      max: Number(row.maxAmount),
    }));
  const invalidKeys = new Set<number>();
  const overlappedKeys = new Set<number>();
  ranges.forEach((range) => {
    if (range.max <= range.min) invalidKeys.add(range.key);
  });
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i];
      const b = ranges[j];
      // 首尾相接（如 100-300 / 300-500）不算重叠
      if (a.min < b.max && b.min < a.max) {
        overlappedKeys.add(a.key);
        overlappedKeys.add(b.key);
      }
    }
  }
  return { invalidKeys, overlappedKeys };
};

// 输入完成（失焦）即调用：刷新标红行；notify 为 true 时同时弹出错误提示
const refreshConflicts = (notify = false): boolean => {
  const { invalidKeys, overlappedKeys } = checkRanges();
  conflictKeys.value = new Set([...invalidKeys, ...overlappedKeys]);
  if (notify && invalidKeys.size) {
    message.error({ content: t("n1787"), key: RANGE_MESSAGE_KEY });
  } else if (notify && overlappedKeys.size) {
    message.error({ content: t("n1784"), key: RANGE_MESSAGE_KEY });
  }
  return conflictKeys.value.size === 0;
};

const addRow = () => {
  if (rewardList.value.length >= MAX_COUNT) {
    message.warning(t("n1785"));
    return;
  }
  const last = rewardList.value[rewardList.value.length - 1];
  // 新行最小值默认衔接上一行最大值，减少范围重叠
  rewardList.value.push({
    _key: keySeed++,
    minAmount: last?.maxAmount,
    maxAmount: undefined,
    rewardAmount: undefined,
  });
};

// 删除需弹框二次确认；删除只作用于本地列表，点击保存后生效
const removeRow = (row: RewardRow) => {
  Modal.confirm({
    title: t("t16"),
    onOk: () => {
      rewardList.value = rewardList.value.filter((item) => item._key !== row._key);
      refreshConflicts();
    },
  });
};

// 保存前校验：条数上限、必填，再复用输入完成时的范围检查（非法区间 / 重叠）
const validate = (): boolean => {
  const list = rewardList.value;
  if (list.length > MAX_COUNT) {
    message.error(t("n1785"));
    return false;
  }
  if (
    list.some(
      (row) => row.minAmount == null || row.maxAmount == null || row.rewardAmount == null
    )
  ) {
    message.error(t("n1786"));
    return false;
  }
  return refreshConflicts(true);
};

// 提交整份档位列表：非空数组覆盖该侧档位，空数组表示清空（无配置则无奖励）
const save = async () => {
  if (!validate()) return;
  const { field, update } = TRADE_CONFIG[props.tradeType];
  // 校验通过后范围互不重叠，提交时按金额下限从小到大排序；页面展示保持录入顺序
  const tiers = rewardList.value
    .map((row) => ({
      minAmount: Number(row.minAmount),
      maxAmount: Number(row.maxAmount),
      rewardAmount: Number(row.rewardAmount),
    }))
    .sort((a, b) => a.minAmount - b.minAmount);
  saving.value = true;
  try {
    const res: any = await update({ id: configState.value.id, [field]: tiers });
    if (res && res.code === "1") {
      message.success(t("s1"));
      fetchList();
    }
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchList();
});
</script>

<style lang="less" scoped>
// 金额范围两列排列：1 2 / 3 4 / ...，加号按钮顺延在最后一格
.reward-grid {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  column-gap: 40px;
  row-gap: 10px;
  align-items: center;
}
.reward-row {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.amount-input {
  width: 90px;
}
.reward-input {
  width: 110px;
  margin-left: 16px;
}
.delete-btn {
  margin-left: 16px;
}
.add-btn {
  width: 90px;
}
.range-separator {
  margin: 0 6px;
  color: #999;
}
</style>
