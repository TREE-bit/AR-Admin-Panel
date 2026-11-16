<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, reactive, ref, watch, inject, watchEffect ,nextTick } from "vue";
import { MenuUnfoldOutlined, DownOutlined, MailTwoTone,LoadingOutlined,ExclamationCircleOutlined,CloseOutlined  } from "@ant-design/icons-vue";
import { useLayoutCtx } from "./useLayout.hook";
import { useStorage } from "../../../core/hooks/useStorage.hook";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { locale, t } = useI18n();
const { onSwitch, collapsed } = useLayoutCtx();
const { localStore } = useStorage();
import { useMerchantStore } from '../../../../apps/admin/src/stores/useMerchantStore'
// import { useThirdCode } from '../../../../apps/admin/src/stores/useThirdCode'
import { logout } from "../../../../apps/admin/src/api/user.api";
// import { getOnlineCount } from "../../../../apps/admin/src/api/login.api";
import { LOGIN_AUTH_KEY } from "../../../../apps/admin/src/hooks/constants";
import { useLanguage } from "../../../../apps/admin/src/hooks/useLanguage.hook";
// import { useAnimatedNumber } from "../../../../apps/admin/src/hooks/useAnimatedNumber";
import { useSocket } from '../../../../apps/admin/src/hooks/useSocket.hook';
import { exportTypeMap,exportStatusMap,tgMsgTypeMap } from '../../../../apps/admin/src/utils/publicData';
import { getSysMessageList } from '../../../../apps/admin/src/api/serverMessage.api';
import { getIndiaLocalTime } from '../../../../apps/admin/src/plugins/dataMap';
import Bus from '../../../../apps/admin/src/utils/bus.ts';
const { changeLanguage } = useLanguage();
import changePassWord from './component/changePassWord.tsx'
import { WEAK_PASSWORD_STORAGE_KEY } from '../../../../apps/admin/src/utils/weakPassword';
import { set } from "@vueuse/shared";
// import { Modal } from "ant-design-vue";
const token = localStorage.getItem("token");
const userid = JSON.parse(localStorage.getItem("userInfo") as string).userId;
const isOpen = ref(false);
// 登录返回弱密码：进入主界面后自动打开修改密码弹窗引导改密（每次登录提示一次，可关闭）
const isWeakPwd = ref(false);
watch(isOpen, (open) => {
  if (!open) isWeakPwd.value = false;
});
const tgMsgList:any = ref([]);
const { OnlineRes ,close} = useSocket({type:1,token,userid});
// const OnlineRes = ref<any>({});
const online = useSocket({type:2,token,userid});
const exportType = useSocket({type:3,token,userid});
const msgCouont= ref(0);

// let onlineTimer: any = null;
// const getOnlineCountData = async () => {
//   try {
//     const res: any = await getOnlineCount();
//     if (res && res.code == "1") {
//       OnlineRes.value = res.data;
//       localStorage.setItem('serverTime', OnlineRes.value.currentDateTime || 'null');
//       Bus.emit('containerTypeChange', OnlineRes.value.currentDateTime);
//     }
//   } catch (error) {
//     // console.error("Error fetching online count:", error);
//   }
// };


// const { valueRef: memberOnlineCount, animateTo } = useAnimatedNumber(0);
const onlineMemberCount = ref(0);
const onlineServerTime = ref(getIndiaLocalTime().slice(0, 16));
watchEffect(() => {
  onlineMemberCount.value = OnlineRes.value.onlineMemberCount || onlineMemberCount.value;
  onlineServerTime.value = OnlineRes.value.currentDateTime || onlineServerTime.value;
  localStorage.setItem('serverTime', onlineServerTime.value || 'null');
  Bus.emit('containerTypeChange', onlineServerTime.value);
  // animateTo(newVal)
})
watch(()=>online,()=>{
  msgCouont.value = online.OnlineRes.value.unReadMessageCount;
  // if(online.OnlineRes.value.telegramCode && !online.OnlineRes.value.code){
  //   tgMsgList.value=[...online.OnlineRes.value.telegramCode];
  // }
  if(online.OnlineRes.value.code){
    getMsgList();
  }
  // Bus.emit('unReadCount', online.OnlineRes.value.unReadMessageCount);
  if(online.OnlineRes.value.status == '0' && online.OnlineRes.value.userId == userid){
    handleLogout().then(()=>{
      online.close();
    });
  }
}, { deep: true });
// watch(()=>OnlineRes.value.currentDateTime,()=>{
//     localStorage.setItem('serverTime',OnlineRes.value.currentDateTime || 'null');
//     Bus.emit('containerTypeChange', OnlineRes.value.currentDateTime)
//   }, { deep: true });
Bus.on('changeMsgCount',(val:any)=>{
  msgCouont.value = Number(val) || 0;
})
const exportShow = ref(false);
const exportInfo = ref<any>({
  exportType: "",
  exportName: "",
  status: "",
});
const QUICK_WITHDRAW_IMPORT_BIZ_TYPE = "quick_withdraw_import";
const SELL_OUT_ROUTE_FALLBACK_PATH = "/order/sellOut/index";
const SELL_OUT_IMPORT_TAB_SESSION_KEY = "sellOutPreferredTab";
const isQuickWithdrawImport = computed(() => {
  return String(exportInfo.value?.bizType || "") === QUICK_WITHDRAW_IMPORT_BIZ_TYPE;
});
const modalTitleKey = computed(() => {
  return isQuickWithdrawImport.value ? "headerImportContent" : "n570";
});
const taskTypeTitleKey = computed(() => {
  return isQuickWithdrawImport.value ? "headerImportType" : "n567";
});
const taskStatusTitleKey = computed(() => {
  return isQuickWithdrawImport.value ? "headerImportStatus" : "n549";
});
const taskListTitleKey = computed(() => {
  return isQuickWithdrawImport.value ? "headerImportList" : "n546";
});
const taskTypeText = computed(() => {
  if (isQuickWithdrawImport.value) {
    return t("headerQuickWithdrawImportType");
  }
  return t(exportTypeMap[exportInfo.value.exportType] || "");
});
const taskFileName = computed(() => {
  const fileName = exportInfo.value.fileName || exportInfo.value.exportName || "";
  if (!fileName) return "";
  return String(fileName).includes(".") ? fileName : `${fileName}.xlsx`;
});
const jumpDisabled = computed(() => {
  if (isQuickWithdrawImport.value) return false;
  return exportInfo.value.status == 2;
});
const closeExportMod = () => {
  exportShow.value = false;
  exportInfo.value = {
    exportType: '',
    exportName: '',
    status: '',
  };
};
watch(()=>exportType.data.value,()=>{
 if(exportType.data.value){
    exportInfo.value = JSON.parse(exportType.data.value);
    Bus.emit('exportInfo', exportInfo.value);
    exportShow.value = true;
  }else{
    exportShow.value = false;
  }
});
const router = useRouter();
const localeList = reactive([
  {
    key: "zh",
    name: "中文",
  },
  {
    key: "en",
    name: "English",
  },
]);
// const name = localStore.get("userInfo") && JSON.parse(localStore.get("userInfo")).username;
const name = JSON.parse(window.localStorage.getItem("userInfo") || '').username;
const onLang = (item: any) => {
  changeLanguage(item.key);
  localStore.set("locale", item.key);
  locale.value = item.key;
};

const handleLogout = async () => {
  const res: any = await logout();
  if (res && res.code === "1") {
    router.replace({
      path: "/login",
    });
    close();
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }
};

// 右下角弹窗
const isActive = ref(false);
const isDrawerOpen = ref(false);
const knowTGMsg = () => {
  if(tgMsgList.value.length > 0) {
    tgMsgList.value.pop();
  }
  if(tgMsgList.value.length <= 0) {
    isDrawerOpen.value = true
    nextTick(() => {
      isActive.value = true
    })
  }
}
const showDrawer = () => {
  isDrawerOpen.value = false;
  isActive.value = false
  tgMsgList.value = [];
  Bus.emit('isShow', true)
};
const closeDrawer = () => {
  isActive.value = false;
  setTimeout(() => {
    if(tgMsgList.value.length > 0) {
      isActive.value = true
    }else{
      isDrawerOpen.value = false;
      isActive.value = false;
    }
  }, 10000);
}

const resolveSellOutRoutePath = () => {
  const exactRoute = router.getRoutes().find((item) => {
    return item.path === "/order/sellOut/index" || item.path === "/order/sellOut";
  });
  if (exactRoute?.path) return exactRoute.path;
  const fuzzyRoute = router.getRoutes().find((item) => item.path.includes("/order/sellOut"));
  return fuzzyRoute?.path || SELL_OUT_ROUTE_FALLBACK_PATH;
};
	
const goExportDown = (name: any) => {
  const shouldGoImportLog =
    String(exportInfo.value?.bizType || "") === QUICK_WITHDRAW_IMPORT_BIZ_TYPE;
  closeExportMod();
  if (shouldGoImportLog) {
    sessionStorage.setItem(SELL_OUT_IMPORT_TAB_SESSION_KEY, "importLog");
    router.push({ path: resolveSellOutRoutePath(), query: { tab: "importLog" } });
    return;
  }
  router.push({name:'_config_exportList', query: {exportName: name}});
};
const loadMsg = ref(false);
const getMsgList = async () => {
  const query = {
    pageNo: 1,
    pageSize: 9999,
    messageType: 3,
  }
  if(loadMsg.value) return;
  loadMsg.value = true;
  tgMsgList.value = [];
  const res:any = await getSysMessageList(query).finally(()=>loadMsg.value=false);
  if(res && res.code == 1 && res.data.length > 0){
    tgMsgList.value = res.data.filter((item:any)=>item.messageType == 3 && item.messageStatus == 0) || [];
  }
  if(tgMsgList.value.length > 0) {
    isDrawerOpen.value = true;
    nextTick(() => {
      isActive.value = true
    });
  }
}
onMounted(() => {
  if (localStorage.getItem(WEAK_PASSWORD_STORAGE_KEY) === "1") {
    localStorage.removeItem(WEAK_PASSWORD_STORAGE_KEY);
    isWeakPwd.value = true;
    isOpen.value = true;
  }
  // getOnlineCountData();
  useMerchantStore().fetchMerchantData();
  getMsgList();
  // useThirdCode().fetchThirdCodeData();
  // onlineTimer = setInterval(getOnlineCountData, 10000);
});
onBeforeUnmount(() => {
  close();
  isDrawerOpen.value = false;
  isActive.value = false;
  tgMsgList.value = [];
//   clearInterval(onlineTimer);
});
</script>

<template>
  <a-layout-header class="layout-header">
    <div class="layout-header-layout">
      <div class="layout-header-side" :class="collapsed ? 'collapsed' : ''">
        <div class="layout-header-inner">
          <div class="layout-header-left">
            <a-button
              type="text"
              :icon="h(MenuUnfoldOutlined)"
              @click="onSwitch"
            />
          </div>

          <div class="layout-center">

          </div>
          <div class="layout-operations">
            <div class="severTime">
              {{ onlineServerTime }}
            </div>
            <div>
              {{ $t("e46")
              }}<span style="color: red">{{
                // memberOnlineCount
                onlineMemberCount
              }}</span>
            </div>
            <slot></slot>
            <a-dropdown placement="bottom">
              <a-button
                type="text"
                class="ant-dropdown-link"
                @click.prevent
                style="display: flex; align-items: center"
              >
                {{ t("lang") }}
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="(item, index) in localeList" :key="index">
                    <div @click="onLang(item)">{{ item.name }}</div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

          <a-badge @click="showDrawer" style="cursor:pointer" :count="msgCouont">
            <MailTwoTone style="font-size:24px;" />
          </a-badge>
            <a-dropdown placement="bottom">
              <a-button type="text" class="ant-dropdown-link" @click.prevent>
                <span>
                  {{ name }}
                </span>
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <span
                      href="javascript:;"
                      @click="isOpen = true"
                      style="white-space: nowrap"
                      >{{ t("userResetPwd") }}</span
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleLogout">{{
                      t("n77")
                    }}</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </div>
  </a-layout-header>
  
  <changePassWord v-model="isOpen" :weak="isWeakPwd" />
  <a-modal
    v-model:open="exportShow"
    width="800px"
    :title="$t(modalTitleKey)"
    @cancel="closeExportMod"
    > 
      <div class="export-info">
        <div style="flex:2">
          <div class="export-title">{{ $t(taskTypeTitleKey) }}</div>
          <div class="export-text">
            {{ taskTypeText }}
          </div>
        </div>
        <div style="flex:3">
          <div class="export-title">{{ $t('n568') }}</div>
          <div class="export-text">
            {{ taskFileName }}
          </div>
        </div>
        <div style="flex:1">
          <div class="export-title">{{ $t(taskStatusTitleKey) }}</div>
          <div class="export-text">
            <span :style="{ color: exportInfo.status == 2 ? 'red' : 'green' }">
              {{ $t(exportStatusMap[exportInfo.status] || '') }}
            </span>
            &nbsp;
            <LoadingOutlined v-if="exportInfo.status == 0" />
          </div>
        </div>
        <div style="flex:1">
          <div class="export-title">{{ $t(taskListTitleKey) }}</div>
          <div class="export-text">
            <a-button type="link" :disabled="jumpDisabled" @click="goExportDown(exportInfo.exportName)">
              {{ $t('n569') }}
            </a-button>
          </div>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="closeExportMod">
          {{ $t("l54") }}
        </a-button>
      </template>
    </a-modal>
  <!-- 右下角弹窗 -->
  <div class="bottom-right-corner" :class="{ active: isActive }" v-if="isDrawerOpen && tgMsgList.length > 0">
    <CloseOutlined class="close-icon" @click="closeDrawer"/>
    <div style="text-align: center;">
      <div class="tipIcon">
        <ExclamationCircleOutlined />
      </div>
      <h2>{{ $t(tgMsgTypeMap[tgMsgList[tgMsgList.length-1].messageContent.split('|')[0]]) }}</h2>
      <h5>{{ tgMsgList[tgMsgList.length-1].createTime }}</h5>
    </div>
    <div style="text-align: center; margin-top: 10px;">
      <a-button size="small" type="primary"  @click="showDrawer">{{ $t('n1084') }}</a-button>
      <a-button size="small" style="margin-left: 20px;" @click="knowTGMsg">{{ $t('n1085') }}</a-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.layout {
  .severTime {
    margin-right: 20px;
  }
  &-center {
    flex: 1;
    display: flex;
    align-items: center;
    width: 0;
    padding: 0 16px;
  }
  &-operations {
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding-right: 28px;
    // button + button {
    //   // margin-left: 15px;
    // }
  }
  &-carousel {
    height: 22px;
    width: 100%;
  }
}
.export-info{
  display: flex;
  border:1px solid #ddd;
  >div {
    align-items: center;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    border-right: #ddd solid 1px;
    &:last-child {
      border-right: none;
    }
    .export-title{
      background-color: #ddd;
    }
  }
}
.bottom-right-corner {
  width: 300px;
  min-height: 150px;
  position: fixed;
  bottom: -400px;
  left: 50%;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 16px;
  transition: bottom 0.6s ease;
  .tipIcon{
    font-size: 24px;
    color: #f71111;
    text-align: center;
  }
  h2{
    color: #f71111;
  }
}

.bottom-right-corner.active {
  bottom: 14px;
}
.close-icon{
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  cursor: pointer;
  &:hover{
    transform: scale(1.2);
  }
}
</style>
