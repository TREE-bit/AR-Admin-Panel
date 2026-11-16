<script setup lang="ts">
import { HTMLAttributes, onBeforeUnmount, ref } from "vue";
import { useVModel } from "@vueuse/core";
import { getOssUrl, OssUpload } from "@/api";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import no_up from "@/assets/no_up.png";
import { isPrototype } from "@/prototype/env";
const { t } = useI18n();
const props = defineProps({
  modelValue: String,
  imgClass: {
    type: String as HTMLAttributes["class"],
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
const imageLink = useVModel(props, "modelValue", emit);
const fileList = ref<any[]>([]);
const customRequest = async (request: any) => {
  const file = request.file;
  const typeList = [
    "image/jpeg",
    "image/gif",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  if (!typeList.includes(file.type)) {
    return message.error(
      " Please upload pictures in png/jpg/jpeg/gif/webp format"
    );
  }
  // 原型不连 OSS：本地读成 DataURL，保证预览和表单可保存
  if (isPrototype) {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      imageLink.value = dataUrl;
      request.onSuccess?.(dataUrl);
    } catch (error) {
      imageLink.value = undefined;
      message.error(t("m463"));
      request.onError?.(error);
    }
    return;
  }
  let ext = ".png";
  if (file.type == "image/jpeg") {
    ext = ".jpg";
  } else {
    ext = file.type.replace("image/", ".");
  }
  const objectName = file.uid + ext;
  try {
    const { data, code } = await getOssUrl({
      contentType: file.type,
      objectName,
    });
    if (code != 1) {
      return;
    }
    const baseUrl = data.baseUrl;
    const signedUrl = data.signedUrl;
    await OssUpload({ signedUrl, file });
    imageLink.value = baseUrl + objectName;
  } catch (error) {
    imageLink.value= undefined
    message.error(t('m463'))
  }
};

onBeforeUnmount(() => {
  fileList.value = [];
});
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :accept="'image/*'"
    :show-upload-list="false"
    :multiple="false"
    :custom-request="customRequest"
    class="h-fit w-fit"
  >
    <img v-if="imageLink" :src="imageLink" :class="imgClass" alt="" />

   <img v-else :src="no_up" alt="" class=" w-100 h-100">
  </a-upload>
</template>

<style scoped lang="less">
:deep(.ant-upload) {
  &.ant-upload-select.ant-upload {
    width: fit-content;
    height: fit-content;
  }
}
</style>
