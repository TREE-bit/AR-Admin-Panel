<template>
    <FullscreenOutlined class="iframeFull" @click="toggleFullScreen"/>
    <iframe 
        :src="url"
        ref="iframeContainer"
        frameborder="0"
        width="100%" 
        height="100%">
    </iframe>
  </template>
  
  <script setup lang="ts">
    import { ref } from "vue"
    import { FullscreenOutlined } from '@ant-design/icons-vue';
    defineProps({
        url: {
        type: String,
        required: true
        }
    })

    const iframeContainer = ref<HTMLElement | null>(null)
    const isFullScreen = ref(false)

    const toggleFullScreen = () => {
    if (!document.fullscreenElement && iframeContainer.value) {
        iframeContainer.value.requestFullscreen()
        isFullScreen.value = true
    } else if (document.exitFullscreen) {
        document.exitFullscreen()
        isFullScreen.value = false
    }
    }
  </script>
  
  <style scoped>
  .iframeFull{
    position: absolute;
    right: 0px;
    top: -24px;
    font-size: 20px;
    cursor: pointer;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
  }
  </style>
  