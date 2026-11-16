<template>
  <!-- 设置密码时展示密码规则（DEV-957），输入后逐条实时标记是否满足 -->
  <div class="password-rule-tips">
    <div class="password-rule-tips__title">{{ $t("n2007") }}</div>
    <div
      v-for="item in rules"
      :key="item.key"
      class="password-rule-tips__item"
      :class="password ? (item.pass ? 'is-pass' : 'is-fail') : ''"
    >
      <CheckCircleFilled v-if="password && item.pass" />
      <CloseCircleFilled v-else-if="password" />
      <span v-else class="password-rule-tips__dot" />
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { userPwdReg } from "@/utils/publicData";
import { WEAK_PASSWORD_RULES, getWeakPasswordRules, getWeakPasswordRuleText } from "@/utils/weakPassword";

const props = defineProps<{
  password?: string;
  username?: string;
}>();
const { t, locale } = useI18n();

const rules = computed(() => {
  // 依赖 locale，切换语言时文案跟着刷新
  locale.value;
  const pwd = props.password || "";
  const hit = getWeakPasswordRules(pwd, props.username);
  return [
    { key: "format", text: t("m932"), pass: userPwdReg.test(pwd) },
    ...WEAK_PASSWORD_RULES.map((rule) => ({
      key: rule,
      text: getWeakPasswordRuleText(rule),
      pass: !hit.includes(rule),
    })),
  ];
});
</script>

<style scoped lang="less">
.password-rule-tips {
  margin-top: 4px;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
  &__title {
    color: rgba(0, 0, 0, 0.65);
  }
  &__item {
    display: flex;
    align-items: baseline;
    gap: 6px;
    &.is-pass {
      color: #52c41a;
    }
    &.is-fail {
      color: var(--app-color-danger);
    }
  }
  &__dot {
    flex: none;
    width: 4px;
    height: 4px;
    margin: 0 4px;
    border-radius: 50%;
    background: currentColor;
    transform: translateY(-3px);
  }
}
</style>
