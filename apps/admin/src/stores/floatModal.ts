import { defineStore } from 'pinia';
import { h, ref } from 'vue';
import { message } from 'ant-design-vue';
import i18n from '@/i18n';

let maxWindow = 10;//最大弹窗数
const left= ref(300);
const zIndex = ref(900);

export const useFloatingStore = defineStore('floatingStore', () => {
  const floatingWindows = ref<any[]>([]);
  const floatingWindowM = ref<any[]>([]);

  const addWindow = (data: any) => {
    if(floatingWindows.value.length >= maxWindow) {
      message.warning(i18n.global.t('m884', { n: maxWindow }));
      return;
    }
    if(floatingWindows.value.some((win) => win.floadtingId === data.id)) {
      message.warning(i18n.global.t('m885'));
      return;
    }
    left.value += 20
    zIndex.value += 10
    floatingWindows.value.push({
      ...data,
      floadtingId: data.id,
      height: 600,
      top: 140,
      left: left.value,
      mLeft: 100,
      zIndex: zIndex.value,
      visible: true
    });
  };
  const removeWindow = (id: number) => {
    floatingWindows.value = floatingWindows.value.filter((win) => win.floadtingId !== id);
  };

  const addWindowM = (data: any) => {
    floatingWindowM.value.push({
      ...data,
      floadtingId: data.id,
      mLeft: 100,
      zIndex: 1000,
    });
  }
  const showFloatingWindow = (id: number) => {
    floatingWindows.value.forEach((win) => {
      if(win.floadtingId === id) {
        win.visible = true;
      }
    })
    removeWindowM(id);
  }
  const removeWindowM = (id: number) => {
    floatingWindowM.value = floatingWindowM.value.filter((win) => win.floadtingId !== id);
  }
  return { floatingWindows, addWindow, removeWindow, floatingWindowM, addWindowM, removeWindowM, showFloatingWindow };
});
