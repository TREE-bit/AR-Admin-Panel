<template>
    <h2 v-if="title">{{ title }}</h2>
    <QuestionCircleOutlined class="tipIcon" ref="questionIcon" @mouseover="showInfo" @mouseleave="hideInfo" />
    <transition name="tip-box-transition">
      <div
        class="tipInfoBox"
        v-show="visible"
        ref="tipInfoBox"
        :style="{ left: questionIconLeft + 'px', top: questionIconTop + 'px', width: width + 'px' }"
        @mouseover="showInfo"
        @mouseleave="hideInfo"
      >
        <div class="tipInfoText" v-if="typeof(info) != 'object'">{{ info }}</div>
        <div class="tipInfoText" v-else v-for="(item, index) in info" :key="index">{{ item }}</div>
        <slot />
        <LeftOutlined class="leftOutlined" />
      </div>
    </transition>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, nextTick, onUnmounted } from "vue";
import { QuestionCircleOutlined, LeftOutlined } from "@ant-design/icons-vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  info: {
    type: [Object, String],
    default: [],
  },
  width: {
    type: Number,
    default: 280,
  },
  left: {
    type: Number,
    default: -26,
  },
  top: {
    type: Number,
    default: 14,
  },
});
const tipInfoBox = ref<HTMLElement | null>(null);
const questionIcon = ref<HTMLElement | null>(null);
const questionIconLeft = ref(0);
const questionIconTop = ref(0);

const updateQuestionIconLeft = () => {
  if (questionIcon.value) {
    const rect = questionIcon.value.getBoundingClientRect();
    questionIconLeft.value = rect.left - props.left;
    questionIconTop.value = rect.top - props.top;
  }
};

const visible = ref(false);

const showInfo = () => {
  updateQuestionIconLeft();
  visible.value = true;
};

const hideInfo = () => {
  visible.value = false;
};

onMounted(() => {
  nextTick(updateQuestionIconLeft);
  window.addEventListener("resize", updateQuestionIconLeft);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateQuestionIconLeft);
});

</script>
<style scoped lang="less">
h2{
  display: inline-block;
}
.tipIcon{
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
}
.tipInfoBox{
  position: fixed;
  font-weight: normal;
  font-size: 12px;
  z-index: 10;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  animation: none;
}
.tipInfoText{
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: normal;

}

.leftOutlined{
  position: absolute;
  left: -9px;
  top: 16px;
  background-color: rgba(0, 0, 0,0);
  color: #999;
}
.tip-box-transition-enter-active,
.tip-box-transition-leave-active {
  transition: transform 0.2s cubic-bezier(0.2, 0, 0.1, 1), opacity 0.2s ease;
  transform-origin: left; /* 以左上角为动画原点 */
}

.tip-box-transition-enter-from,
.tip-box-transition-leave-to {
  opacity: 0;
  transform: scale(0);
}

.tip-box-transition-enter-to,
.tip-box-transition-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>