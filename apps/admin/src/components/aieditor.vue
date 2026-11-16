<template>
  <div class="aiEditor" id="aiEditor" ref="divRef" >
    <div class="aie-container">
        <div class="aie-container-header"></div>
        <div class="aie-container-main"></div>
        <div class="aie-container-footer"></div>
    </div>
  </div> 
</template>

<script setup lang="ts">
import {AiEditor} from "aieditor";
import "aieditor/dist/style.css"
import {onMounted, onUnmounted, ref} from "vue";
import { OssUpload, getOssUrl } from "@/api";

const props = defineProps({
  announcementContent: {
    type: String,
    default: "",
  },
});

const divRef = ref();
let aiEditor: AiEditor | null = null;
const con = ref<any>(props.announcementContent || "");
// 上传逻辑
const uploadFile = async (type: string,file: File) => {
return new Promise((resolve, reject) => {
  emit('start','start');
  const formData = new FormData();
  formData.append(type, file);
  getOssUrl({
    contentType: file.type,
    objectName: file.name,
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
        })
        .finally(()=>{
          emit('finish','finish');
        });
    })
    .catch((err) => {
      reject("Upload failed");
    });
});
};

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    placeholder: "点击输入内容...",
    content: con.value,
    toolbarKeys: ["undo", "redo", "brush", "eraser", 
        "|", "heading", "font-family", "font-size", 
        "|", "bold", "italic", "underline", "strike", "link", "code", "subscript", "superscript", "hr", "todo", "emoji", 
        "|", "highlight", "font-color",
        "|", "align", "line-height", 
        "|", "bullet-list", "ordered-list", "indent-decrease", "indent-increase", "break", 
        "|", "image", "video",  "quote", "code-block", "table", 
    ],
    textSelectionBubbleMenu: {
        enable: true,
        items: ["Bold", "Italic", "Underline", "Strike", "code"],
    },
    onChange:(aiEditor)=>{
        // 监听到用编辑器内容发生变化了，控制台打印编辑器的 html 内容...
        con.value = aiEditor.getHtml();
        //将富文本的内容抛出
        emit("change", con.value);
        // console.log(con.value);
    },
    image: {
      uploader: (file: File) => {
        return new Promise((resolve, reject) => {
          uploadFile("image",file).then((url: any) => {
            // console.log(url);
            resolve(url);
          }).catch(error => {
            reject(error);
          });
        });
      },
      uploaderEvent: {
        onUploadBefore: (file, uploadUrl, headers) => {
          // 监听图片上传之前
        },
        onSuccess: (file, response) => {
          // 监听图片上传成功
            const url = `<img src="${response}"><br/>`;
            aiEditor?.insert(url);
            aiEditor?.focusEnd();
          
        },
        onFailed: (file, response) => {
          // 监听图片上传失败
        },
        onError: (file, error) => {
          // 监听图片上传错误
        },
      },
      bubbleMenuItems: ["AlignLeft", "AlignCenter", "AlignRight", "delete"]
    },
    video: {
      uploader: (file: File) => {
        return new Promise((resolve, reject) => {
          uploadFile("video",file).then((url: any) => {
            resolve(url);
          }).catch(error => {
            reject(error);
          });
        });
      },
      uploaderEvent: {
        onUploadBefore: (file, uploadUrl, headers) => {
          // 监听视频上传之前
        },
        onSuccess: (file, response) => {
          // 监听视频上传成功
          const url =`<video src="${response}"  controls></video><br/>`;
          aiEditor?.insert(url);
          aiEditor?.focusEnd();
        },
        onFailed: (file, response) => {
          // 监听视频上传失败
        },
        onError: (file, error) => {
          // 监听视频上传错误
        },
      },
    },
  });
});

const emit = defineEmits<{
  (e: "change", val: string): void;
  (e: "start", val: string): void;
  (e: "finish", val: string): void;
}>();

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
})
</script>

<style lang="less" scoped>
.aiEditor {
  .aie-container-main{
    min-height: 150px;
    max-height: 500px;
    overflow-y: auto;
  }
  .aie-container-footer{
    display: none;
  }
}
// :deep(.align-undefined>.aie-resize-wrapper)
//   {
//     left: 50%;
//     transform: translateX(-50%);
//   }
</style>