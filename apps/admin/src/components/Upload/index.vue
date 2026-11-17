<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import {onBeforeUnmount, ref, watch} from 'vue';
import {useVModel} from '@vueuse/core'
import {getOssUrl, OssUpload} from "@/api";
import { message } from 'ant-design-vue';
const props=defineProps({
  value:String
})
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

const previewImage = ref('');
previewImage.value = props.value?props.value : '';
const fileList = ref<any[]>([
]);

const customRequest=async (request:any)=>{
  const file=request.file;
  const typeList = ['image/jpeg', 'image/gif', 'image/jpg', 'image/png', 'image/webp']
  if(!typeList.includes(file.type)){
    return message.error(' Please upload pictures in png/jpg/jpeg/gif/webp format');
  }
  emit('startUpload','startUpload');
  try {
    let ext='.png';
    if (file.type=='image/jpeg') {
      ext='.jpg';
    }else {
      ext=file.type.replace('image/','.')
    }
    const objectName=file.uid+ext;
    const {data,code}=await getOssUrl({
      contentType:file.type,
      objectName,
    });
    if (String(code) !== '1'){
      return
    };
    const signedUrl=data.signedUrl;
    // 原型没有真实对象存储，预签名地址不能拿去上传，否则完成按钮会一直转圈
    if (String(signedUrl || '').startsWith('prototype-oss://')) {
      const preview = (await getBase64(file)) as string;
      image.value = preview;
      previewImage.value = preview;
      return;
    }
    const baseUrl = data.baseUrl;
    await OssUpload({signedUrl,file});
    image.value=objectName;
    previewImage.value = baseUrl+objectName;
  } finally {
    emit('finishUpload', image.value || 'finish');
  }
}

watch(fileList,async ()=>{
  if (!fileList.value.length)return;
  const file=fileList.value[0];
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
})
onBeforeUnmount(()=>{
  fileList.value=[];
})
</script>

<template>
  <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :accept="'image/*'"
      :show-upload-list="false"
      :multiple="false"
      :custom-request="customRequest"
      class="a-upload"
  >
    <img v-if="previewImage" :src="previewImage" class="a-preview" alt="">
    <div style="margin-top: 8px">
      <p><plus-outlined /></p>
      <p>Upload</p>
    </div>
  </a-upload>
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
</style>