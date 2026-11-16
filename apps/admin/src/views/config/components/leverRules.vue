<template>
  <a-empty :description="$t('n336')" v-if="!haveTask" />
  <a-form
    :model="addFrom"
    :wrapper-col="{ span: 12 ,offset: 4}"
  >
     <a-form-item  name="levelRulesContent">
        <AiEditor
          v-if="haveTask"
          :announcementContent="addFrom.levelRulesContent"
          @change="setAnnouncementContent"
          @start="startUpload"
          @finish="finishUpload"
        />
    </a-form-item>
    <a-form-item style="margin-top: 80px;" :wrapper-col="{ span: 12, offset: 10 }">
      <a-popconfirm
            :title="$t('m369')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="save"
          >
      <a-button  v-permission="'admin:taskRulesContentAdmin:updateContent'" type="primary">{{ $t('save') }}</a-button>
      </a-popconfirm>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { levelContentAdminDetail, levelContentAdminUpdate } from "@/api/c2cconfig.api";
import {ref, onMounted, defineAsyncComponent} from 'vue'
import { message } from "ant-design-vue";
const AiEditor = defineAsyncComponent(() => import('@/components/aieditor.vue'));
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const haveTask = ref(false)
const loading = ref(false);
const addFrom = ref<any>({
  levelRulesContent: '',
})
const getContent = async () => {
  const res: any = await levelContentAdminDetail();
  if(res && res.code == 1) {
    const levelRulesContent = res.data ? res.data.levelRulesContent : '';

    addFrom.value = {
      levelRulesContent: levelRulesContent,
    };
    haveTask.value = true;
    // console.log(addFrom.value.levelRulesContent)
  }
}
const setAnnouncementContent = (value: any)=> {
    addFrom.value.levelRulesContent = value;
  }
const save = async () => {
  const res: any = await levelContentAdminUpdate(addFrom.value);
  if(res && res.code == 1){
    message.success(t('s10'));
  }
}
  const startUpload = (val:any) => {
    if(val) loading.value = true;
  }
  const finishUpload = (val:any) => {
    if(val) loading.value = false;
  }
onMounted(() => {
  getContent();
});
</script>