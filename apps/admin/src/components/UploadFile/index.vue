<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue';
import {onBeforeUnmount, ref, watch, watchEffect} from 'vue';
import {useVModel} from '@vueuse/core'
import {getOssUrl, OssUpload} from "@/api";
  import { MessageOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { set } from 'nprogress';
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props=defineProps({
  value:String,
  fileType:Array,//限制文件类型
})
const uploadPercent = ref(0);
// let timer: any = null;
//console.log(props.value)
const emit = defineEmits(['update:value','startUpload','finishUpload']);
const image = useVModel(props, 'value', emit)
function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewFile = ref('');
previewFile.value = props.value?props.value : '';
const fileList = ref<any[]>([
]);

const customRequest=async (request:any)=>{
  const file=request.file;
  let ext=file.name.split('.');
  let extName = ext[ext.length - 1];
  const objectName=file.uid+'.'+extName;
  const {data,code}=await getOssUrl({
  contentType:file.type,
    objectName,
  });
  if (code!=1){
    return
  };
  const baseUrl = data.baseUrl;
  const signedUrl=data.signedUrl;
  await OssUpload({
    signedUrl,
    file,
    onProgress: (percent) => {
    uploadPercent.value = percent;
  }});
  // console.log(objectName,'objectName')
  image.value=objectName;
  previewFile.value = baseUrl+objectName;
  emit('finishUpload',objectName);
  // clearInterval(timer);
  // uploadPercent.value = 100;
  setTimeout(() => {
    uploadPercent.value = 0;
  }, 500);
  fileList.value = [];
}

// 限制文件类型为 xls 和 xlsx
const noUploat = ref(false);
const beforeUpload = async (file: File) => {
  if(!props.fileType) return true
  let ext=file.name.split('.');
  let extName = ext[ext.length - 1];
  if (!props.fileType.includes(extName)) {
    let fileStr = props.fileType.join('，');
    message.error(t('n704',{ n: fileStr }));
    previewFile.value = '';
    noUploat.value = true;
    return false;
  }else{
    noUploat.value = false;
    getFile();
  }
  return true;
}
const getFile = async () => {
    // console.log(fileList.value)
    if(noUploat.value) return;
    emit('startUpload','startUpload');
    uploadPercent.value = 0;
    // timer = setInterval(() => {
    //   if (uploadPercent.value < 90) {
    //     uploadPercent.value += 5;
    //   } else {
    //     clearInterval(timer);
    //   }
    // }, 500);
    if (!fileList.value.length)return;
    const file=fileList.value[0];
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewFile.value = file.url || file.preview;
}
// watch(fileList,async ()=>{
//   if(noUploat.value) return;
// })
// watchEffect(()=>{
//   if (start.value) {
//   }
// })
onBeforeUnmount(()=>{
  fileList.value=[];
  // clearInterval(timer);
})
</script>

<template>
  <a-upload
      v-model:file-list="fileList"
      list-type="picture"
      :show-upload-list="false"
      :multiple="false"
      :custom-request="customRequest"
      :before-upload="beforeUpload"
      action="//jsonplaceholder.typicode.com/posts/"
  >
    <!-- <img v-if="previewFile" :src="previewFile" class="a-preview" alt=""> -->
    <!-- <div style="margin-top: 8px">
      <p><plus-outlined /></p>
      <p>Upload</p>
    </div> -->
    <!-- <span v-if="previewFile">{{ previewFile }}</span> -->
      <a-button>
        <upload-outlined></upload-outlined>
        Upload
      </a-button>
  </a-upload>
  <a-progress
    v-if="uploadPercent > 0"
    :percent="uploadPercent"
    size="small"
    :stroke-color="{ from: '#108ee9', to: '#87d068' }"
    style="margin-top: 10px;"
  />
  <div class = 'showLink' v-if="previewFile">{{ previewFile }}</div>
</template>

<style scoped lang="less">
.a-upload{
  .a-preview{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  :global(.ant-upload){
    position: relative;
  }
}
.showLink{
  width: 100%;
  margin-top: 10px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #d9d9d9;
  padding: 0 5px;
  border-radius: 4px;
  color: #828282;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
}
</style>
