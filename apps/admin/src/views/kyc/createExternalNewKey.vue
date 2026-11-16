<template>
  <div class="keyCont">
    <div class="item">
      <div class="title-C">
        <h2 class="title">publicKey:</h2>
        <a-button @click="copyFun(publicKey)" type="primary">{{ $t('m974') }}</a-button>
      </div>
      <div class="key">{{ publicKey }}</div>
    </div>
    <div class="item">
      <div class="title-C">
        <h2 class="title">privateKey:</h2>
        <a-button @click="copyFun(privateKey)" type="primary">{{ $t('m974') }}</a-button>
      </div>
      <div class="key">{{ privateKey }}</div>
    </div>
    <div class="keyBtn">
      <a-button @click="getKey" type="primary">{{ $t('m973') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { extChannelAdminGenerateKeyPair } from '@/api'
import { message } from 'ant-design-vue';
import { useClipboard } from "@vueuse/core";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { copy } = useClipboard();
const publicKey = ref('');
const privateKey = ref('');
const getKey = async () => {
  const res: any = await extChannelAdminGenerateKeyPair();
  if (res && res.code === '1') {
    publicKey.value = res.data.publicKey;
    privateKey.value = res.data.privateKey;
  }
}
const copyFun = (value: string) => {
  copy(value);
  message.success(t('m173'));
}
onMounted(() => {
  getKey();
})
</script>

<style lang="less" scoped>
.keyCont {
  padding: 20px;
  .item {
    margin-bottom: 20px;
    .title-C {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .title {
        text-align: right;
        margin-right: 20px;
      }
    }
    .key {
      width: 100%;
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 10px;
    }
  }
  .keyBtn {
    text-align: center;
  }
}
</style>