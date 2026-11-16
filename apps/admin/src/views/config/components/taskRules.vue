<template>
  <a-empty :description="$t('n336')" v-if="!haveTask" />
  <a-form
    :model="addFrom"
  >
      <div class="taskContent">
        <div class="taskContentItem">
          <a-form-item label="H5"  name="taskContent">
            <quillEditor v-if="haveTask" style="height: 400px;" :announcementContent="addFrom.taskRulesContent" @change="setAnnouncementContent"/>
          </a-form-item>
        </div>
        <div class="taskContentItem">
          <a-form-item label="APP" name="taskContentApp">
            <quillEditor v-if="haveTask" style="height: 400px;" :announcementContent="addFrom.taskRulesContentApp" @change="setAnnouncementContentApp"/>
          </a-form-item>
        </div>
      </div>
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
import { taskRulesContentAdminCon, taskRulesContentAdminUpdate } from "@/api/c2cconfig.api";
import {ref, onMounted} from 'vue'
import quillEditor from "@/components/quillEditor.vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const haveTask = ref(false)
const addFrom = ref<any>({
  id: '',
  taskRulesContent: '',
  taskRulesContentApp: '',
})
const getContent = async () => {
  const res: any = await taskRulesContentAdminCon();
  if(res && res.code == 1){
    const {id,taskRulesContent,taskRulesContentApp} = res.data;

    addFrom.value = {
      id,
      taskRulesContent,
      taskRulesContentApp
    };
    haveTask.value = true;
    // console.log(addFrom.value.taskRulesContent)
  }
}
const setAnnouncementContent = (value: any)=> {
    addFrom.value.taskRulesContent = value;
  }
const setAnnouncementContentApp = (value: any)=> {
    addFrom.value.taskRulesContentApp = value;
  }
const save = async () => {
  const res: any = await taskRulesContentAdminUpdate(addFrom.value);
  if(res && res.code == 1){
    message.success(t("s10"))
  }
}
onMounted(() => {
  getContent();
});
</script>
<style lang="less" scoped>
.taskContent{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>