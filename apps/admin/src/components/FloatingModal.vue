<template>
  <Teleport to="body">
    <div
      v-for="window in floatingWindows"
      :key="window.floadtingId"
      :style="{ top: `${window.top}px`, left: `${window.left}px`, width: `${window.width}px`, height: `${window.height}px`, zIndex: `${window.zIndex}` }"
      class="floating-window"
      ref="floatingBox"
      v-show="window.visible"
      @mousedown="startDrag(window, $event)"
    >
      <LineOutlined @click="showFloatM(window)" class="floating-window-icon" />
      <CloseOutlined class="close" @click="closeWindow(window.floadtingId)" />
      <kycLog :data="window"/>
      <!-- <div class="float_content_box">
        <kycLog :data="window" :h="childHeight"/>
      </div> -->

      <!-- 右下角缩放手柄 -->
      <div class="resize-handle" @mousedown.stop="startResize(window, $event)"></div>
    </div>
    <div
      v-for="(window,index) in floatingWindowM"
      :key="window.floadtingId"
      :style="{ left: `${window.mLeft*index+2*index}px`,zIndex: `${window.zIndex}` }"
      class="floating-window-m"
      ref="floatingBoxM"
      @click="showFloatingWindow(window.floadtingId)" 
    >
      <ExpandAltOutlined  class="floating-window-icon" />
      <CloseOutlined class="close" @click="closeWindow(window.floadtingId)" />
      <div class="content-m">{{ window.memberId }}</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFloatingStore } from '@/stores/floatModal';
import kycLog from '@/components/Kyc/kycLog.vue';
import { CloseOutlined, LineOutlined, ExpandAltOutlined } from '@ant-design/icons-vue';

const floatingWindows = computed(() => useFloatingStore().floatingWindows);
const floatingWindowM = computed(() => useFloatingStore().floatingWindowM);
const floatingBox = ref<HTMLElement | null>(null);
let dragData = { offsetX: 0, offsetY: 0 };
let resizeData = { startX: 0, startY: 0, startWidth: 0, startHeight: 0 };
const defauleZindex = ref(1000);
let l, t, r, b;

const startDrag = (window: any, event: MouseEvent) => {
  defauleZindex.value +=1;
  window.zIndex = defauleZindex.value;

  l = -(floatingBox.value[0].offsetWidth - 30);
  t = -(floatingBox.value[0].offsetHeight - 30);
  r = document.documentElement.clientWidth - 30;
  b = document.documentElement.clientHeight - 30;

  dragData.offsetX = event.clientX - window.left;
  dragData.offsetY = event.clientY - window.top;

  const moveHandler = (e: MouseEvent) => {
    window.left = Math.min(r, Math.max(l, e.clientX - dragData.offsetX));
    window.top = Math.min(b, Math.max(t, e.clientY - dragData.offsetY));
  };

  const stopDrag = () => {
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', stopDrag);
  };

  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', stopDrag);
};
// 窗口缩放逻辑
const startResize = (window: any, event: MouseEvent) => {
  resizeData.startX = event.clientX;
  resizeData.startY = event.clientY;
  resizeData.startWidth = window.width || floatingBox.value[0].offsetWidth;
  resizeData.startHeight = window.height || floatingBox.value[0].offsetHeight;

  const resizeHandler = (e: MouseEvent) => {
    const newWidth = resizeData.startWidth + (e.clientX - resizeData.startX);
    const newHeight = resizeData.startHeight + (e.clientY - resizeData.startY);
    // 最小宽高限制
    window.width = Math.max(470, newWidth);
    window.height = Math.max(240, newHeight);
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', resizeHandler);
    document.removeEventListener('mouseup', stopResize);
  };

  document.addEventListener('mousemove', resizeHandler);
  document.addEventListener('mouseup', stopResize);
};

const closeWindow = (id: number) => {
  useFloatingStore().removeWindow(id);
  useFloatingStore().removeWindowM(id);
};

const showFloatM = (window: any) => {
  window.visible = !window.visible;
  useFloatingStore().addWindowM(window);
}
const showFloatingWindow = (id: number) => {
  useFloatingStore().showFloatingWindow(id);
}
</script>

<style lang="less" scoped>
.floating-window {
  position: fixed;
  width: 50%;
  min-width: 200px;
  min-height: 200px;
  overflow: hidden;
  z-index: 1000;
  cursor: move;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  .float_content_box{
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}
.close {
  position: absolute;
  right: 4px;
  top: 4px;
  cursor: pointer;
  z-index: 1010;
}

/* 右下角缩放区域 */
.resize-handle {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 0;
  bottom: 0;
  cursor: nwse-resize;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0 0 8px 0;
}

.floating-window-m{
  position: absolute;
  width: 100px;
  height: 20px;
  bottom: 0;
  cursor: nwse-resize;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #999;
}
.floating-window-icon{
  position: absolute;
  right: 24px;
  top: 4px;
  cursor: pointer;
  z-index: 1010;
}
.content-m{
  font-size: 12px;
  line-height: 24px;
  padding-left: 5px;
}
</style>
