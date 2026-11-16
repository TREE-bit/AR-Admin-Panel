<template>
  <a-drawer
    v-model:open="openMsgList"
    class="custom-class"
    placement="right"
    width='500'
    height="80vh"
  >
    <template #title>
      <span>{{ $t('m627') }}</span>
      <a-button type="primary" size="small" :disabled="!canAllRead" style="float: right;margin-left: 15px;" @click="clickReading">{{ $t('n1197') }}</a-button>
      <a-button type="primary" size="small" :disabled="!data.length" style="float: right;" @click="clearAll">{{ $t('n1196') }}</a-button>
    </template>
    <div class="list-container" ref="listContainer" @scroll="handleScroll" style="width: 100%;height: 100%;overflow: hidden;overflow-y: auto;">
      <a-list class="msgListBox" item-layout="horizontal" :data-source="data" :bordered="false" :loading = "loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta @click="showMsgContent(item)"
            >
              <template #description>
                <span v-if="[1,2].includes(item.messageType)" :style="item.messageStatus? '' : 'color:red'" >
                  {{ getMsgType(item.messageType,JSON.parse(item.messageContent)) }}
                </span>
                <span v-if="item.messageType == 3" :style="item.messageStatus? '' : 'color:red'" >
                  {{ $t($getMapItem(tgMsgTypeMap,item.messageContent.split('|')[0])) }}
                </span>
                <div class="msgTime">{{ item.createTime }}</div>
              </template>
            </a-list-item-meta>
            <DeleteOutlined class="delMsg" @click="delMsg(item.id)"  />
          </a-list-item>
        </template>
      </a-list>
      <div v-if="data.length != 0" class="more">{{ nowMsgnum < msgTotal ? $t('m628') : $t('m629') }}</div>
    </div>
  </a-drawer>
   
  <a-modal
    v-model:open="showContent"
    :footer="null"
    :closable="false"
    class="msgDetails"
    :style="{ fontFamily: 'Arial', fontSize: '26px' ,height: '400px' }"
  >
    <h2 v-if="showMsg.messageType == 3" style="text-align: center; margin-bottom: 10px;">
      {{ $t($getMapItem(tgMsgTypeMap,showMsg.messageContent.split('|')[0])) }}
    </h2>
    <div class="msgContent">
      <p v-if="[1,2].includes(Number(showMsg.messageType))" style="font-size: 18px;text-indent:24px">
        {{ getMsgType(showMsg.messageType,JSON.parse(showMsg.messageContent)) }}
      </p>
      <div v-if="showMsg.messageType == 3">
        <p style="font-size: 14px;text-indent: 14px;">
          {{ showMsg.messageContent.split('|')[1] }}
        </p>
      </div>
    </div>
    <p style="text-align: right;margin-top: 10px;">{{ msgContentTime }}</p>
    <!-- <div class="msgLoad" v-if="msgLoading">
      <a-spin size="large" />
    </div> -->
    <div>
      <a-button :loading="msgLoading" style="margin-left: 50%;translate: -50%;margin-top: 20px;" @click="()=>{showContent=false;}" type="primary">{{ $t('b28') }}</a-button>
    </div>
    </a-modal>
</template>

<script setup lang="ts">
import {onMounted, ref, watch } from "vue";
import Bus from '@/utils/bus';
import { CloseCircleOutlined,DeleteOutlined } from '@ant-design/icons-vue';
import { getSysMessageList, delSysMessage, readSysMessage, readAllSysMessage,clearAllSysMessage } from "@/api/serverMessage.api"
import { tgMsgTypeMap } from '@/utils/publicData';
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const showContent = ref(false);
const loading = ref(false);
const msgLoading = ref(false);
const showMsg = ref<any>('');
const msgContentTime = ref('');
const listContainer = ref<any>(null);
const openMsgList = ref<boolean>(false);
const nowMsgnum = ref(0);
const isGetMore = ref(true);
const msgTotal = ref(0);
const getMsgType = (type:any,m:any) => {
  // console.log(m)
  let msg;
  if(type == 1){
    msg = t('m473',{
            count: m.threshold,
            num: m.value,
          })
  }else if(type == 2){
    msg = t("m603", {
            name: m.value,
            time: m.threshold,
          })
  }
  return msg
}
Bus.on("isShow",(value:any)=>{
  openMsgList.value = value;
})
const query = ref({
  pageNo: 1,
  pageSize: 20
})
const data:any = ref([]);

watch(()=>openMsgList,()=>{
  if(openMsgList){
    reset();
    getList();
  }
},{deep:true})
const canAllRead = ref(false);
const getList = async () => {
  loading.value = true;
  const res:any = await getSysMessageList(query.value).finally(()=>loading.value=false);
  if(res && res.code == 1){
    res.data.map((item:any) => {
      data.value.push(item);
    });
    canAllRead.value = false;
    canAllRead.value = data.value.some((item: any) => item.messageStatus == 0)
    nowMsgnum.value += res.data.length;
    msgTotal.value = res.total;
    if(nowMsgnum.value<msgTotal.value){
      isGetMore.value=true;
    }else{
      isGetMore.value=false;
    }
  }
}

const showMsgContent = async (msg:any) => {
  // msgTitle.value = '';
  showMsg.value = '';
  msgContentTime.value = ';'
  showContent.value = true;
  showMsg.value = msg;
  msgContentTime.value = msg.createTime;
  if(msg.messageStatus){
    return
  }
  msgLoading.value = true;
  const res: any = await readSysMessage({id:msg.id}).finally(()=>{
    msgLoading.value = false;
  });
  if(res && res.code == '1'){
    msg.messageStatus = 1;
  }
}
const handleScroll = () => {
  const container = listContainer.value;
  if (!container) return;

  const { scrollTop, clientHeight, scrollHeight } = container;
  const bottomThreshold = 100;

  if (scrollTop + clientHeight >= scrollHeight - bottomThreshold) {
    loadMoreData();
  }
};
const loadMoreData = () => {
  if(isGetMore.value){
    query.value.pageNo += 1;
    isGetMore.value = false;
    getList();
  }
};
const reset = () => {
    data.value =[];
    nowMsgnum.value = 0;
    isGetMore.value=true;
    query.value.pageNo = 1;
    query.value.pageSize = 20;
}
const delMsg = async (id:number) => {
  loading.value = true;
  const res: any = await delSysMessage({id:id}).finally(()=>{loading.value=false});
  if(res && res.code == '1'){
    message.success(t('s9'));
    reset();
    getList();
  }
}
const clickReading = async () => {
  loading.value = true;
  const res: any = await readAllSysMessage().finally(()=>{loading.value=false});
  if(res && res.code == '1'){
    message.success(t('s10'));
    data.value.map((item:any)=>{
      item.messageStatus = 1;
    })
    canAllRead.value = false;
    Bus.emit('changeMsgCount', 0);
  }
}
const clearAll = async () => {
  loading.value = true;
  const res: any = await clearAllSysMessage().finally(()=>{loading.value=false});
  if(res && res.code == '1'){
    message.success(t('s10'));
    reset();
    getList();
    openMsgList.value = false;
    Bus.emit('changeMsgCount', 0);
  }
}
onMounted(()=>{
  // getList();
})
</script>

<style lang="less" scoped>
.custom-class{
  .list-container{
    .msgListBox{
      ul>li{
        height: 100px;
        background-color: #f5f5f5;
        margin: 5px 0;
        cursor: pointer;
        padding-bottom: 0;
        &:hover{
          background-color: #dedada;
        }
        .msgTime{
          margin-top: 15px;
          text-align: right;
        }
        :deep(h4){
          font-size: 18px;
          width: 60%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        :deep(.ant-list-item-meta-description){
          font-size: 16px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover{
            color:blur;
          }
        }
        .delMsg{
          font-size: 16px;
          &:hover{
            color: red;
          }
        }
      }
    }
    .more{
      font-size: 12px;
      text-align: center;
      color:rgba(0, 0, 0, 0.45)
    }
  }
}
.msgDetails{
  font-size: 22px;
  .msgContent{
    max-height: 60vh;
    overflow-y: auto;
    p{
      margin-bottom: 16px;
    }
  }
  .msgLoad{
    div{
      margin-left: 50%;
      translate: -50%;
    }
  }
}
:deep(.ant-modal-title){
  font-size: 18px;
}
.ant-modal-title{
  font-size: 18px;
}
</style>
