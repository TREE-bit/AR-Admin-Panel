<template>
  <div class="editor-con">
    <QuillEditor
      ref="quillEditorRef"
      :toolbar="['bold', 'italic', 'underline', 'strike', 'link', 'image']"
      :modules="modules"
      v-model:content="content"
      contentType="html"
      @textChange="textChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { QuillEditor } from "@vueup/vue-quill";
import ImageUploader from "quill-image-uploader";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import axios from "axios";
import { ref } from "vue";
import { OssUpload, getOssUrl } from "@/api";

const props = defineProps({
  announcementContent: {
    type: String,
    default: "",
  },
});
// console.log("props.announcementContent", props.announcementContent);
const quillEditorRef = ref();
const content = ref<any>(props.announcementContent || ""); //富文本绑定的值

const modules = {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: (file: any) => {
      emit('start','start');
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);
        // console.log("file", file);
        // 不能直接用原文件名，同名文件会在 OSS 上冲突导致上传失败；与其他上传组件一样生成唯一文件名
        const dotIndex = file.name.lastIndexOf(".");
        const ext = dotIndex > -1 ? file.name.slice(dotIndex) : "." + file.type.replace("image/", "");
        const objectName = `${Date.now()}${Math.random().toString(36).slice(2, 8)}${ext}`;
        getOssUrl({
          contentType: file.type,
          objectName,
        })
          .then((res) => {
            // console.log(res);
            const signedUrl = res.data.signedUrl;
            OssUpload({ signedUrl, file })
              .then((up: any) => {
                resolve(res.data.signedUrl.match(/([^?]+)\?Expires=/)[1]);
              })
              .catch((err2) => {
                reject("Upload failed");
                // console.error("Error:", err2);
              })
              .finally(()=>{
                emit('finish','finish');
              });
          })
          .catch((err) => {
            reject("Upload failed");
            emit('finish','finish');
            // console.error("Error:", err);
          });
        // axios
        //   .post("/upload-image", formData)
        //   .then((res) => {
        //     console.log(res);
        //     resolve(res.data.url);
        //   })
        //   .catch((err) => {
        //     reject("Upload failed");
        //     console.error("Error:", err);
        //   });
      });
    },
  },
};
const emit = defineEmits<{
  (e: "change", val: string): void;
  (e: "start", val: string): void;
  (e: "finish", val: string): void;
}>();

//将富文本的内容抛出
const textChange = (value: any) => {
  emit("change", content.value);
};
</script>
<style lang="less">
// 编辑器内图片限制显示尺寸，避免大图撑满富文本；只影响编辑时的显示，不改保存的内容
.editor-con .ql-editor img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}
</style>
