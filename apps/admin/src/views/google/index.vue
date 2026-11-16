<template>
  <div class="container">
    <div class="head">{{ $t("e15") }}</div>
    <div class="t1">{{ $t("e16") }}</div>
    <div class="t2">{{ $t("e17") }}</div>
    <div class="t2">{{ $t("e18") }}</div>
    <div class="t1">{{ $t("e19") }}</div>
    <div class="t2">
      {{ $t("e20") }}
    </div>
    <div class="lr">
      <div>
        <a-qrcode
          :value="`otpauth://totp/${time}?secret=${userInfo.googlesecret}&issuer=AR-Admin(${userInfo.username})`"
        />
      </div>
      <div>
        <div class="bold">
          {{ userInfo.googlesecret }}
        </div>
        <a-button type="link" @click="copyGoogle"><CopyOutlined />{{ $t("e21") }}</a-button>
        <div class="t2">
          {{ $t("e22") }}
        </div>
        <div class="t2">{{ $t("e23") }}</div>
        <div class="t2">
          {{ $t("e24") }}
          <span class="yellow">{{ userInfo.username || "--" }}</span>
        </div>
      </div>
    </div>
    <div class="t1">{{ $t("e25") }}</div>
    <div class="t2">{{ $t("e26") }}</div>
    <div class="lr">
      <a-input v-trim v-model:value="formData.totpCode" />
      <a-button type="primary" :disabled="!formData.totpCode" :loading="binding" @click="bindGoogle">{{ $t("e27") }}</a-button>
    </div>
    <div class="t2 red">
      {{ $t("e28") }}
    </div>
    <!-- <a-button type="primary" @click="handleLogout">{{ $t("n77") }}</a-button> -->
  </div>
</template>

<script setup lang="ts">
import { logout, setValidGoogle } from "@/api/user.api";
import { CopyOutlined } from "@ant-design/icons-vue";
import { useNow, useDateFormat, useClipboard } from "@vueuse/core";
import { message } from "ant-design-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useBindGoogleLogin } from "@/hooks";
const { t } = useI18n();
const router = useRouter();
const { loginAfterBindGoogle } = useBindGoogleLogin();
const binding = ref(false);
const { copy } = useClipboard();
const time = useDateFormat(useNow(), "YYYY-MM-DD");
const formData = ref({
  totpCode: "",
  type: 1,
});
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const bindGoogle = async () => {
  if (binding.value) return;
  binding.value = true;
  try {
    const res: any = await setValidGoogle(formData.value);
    if (res && res.code === '1') {
      localStorage.setItem('isBindGoogle', '1');
      // 绑定成功后用登录时的账号密码重新登录，自动进入系统
      await loginAfterBindGoogle(formData.value.totpCode);
    }
  } finally {
    binding.value = false;
  }
};
const handleLogout = async () => {
  const res: any = await logout()
  if (res && res.code === '1') {
    router.replace({
      path: '/login'
    })
    localStorage.removeItem('token')
  }
}
const copyGoogle = ()=> {
  copy(userInfo.googlesecret)
  message.success(t('s10'))
}
</script>
<style lang="less" scoped>
.container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 800px;
  height: fit-content;
  padding: 24px;
  .head {
    font-size: 24px;
    text-align: center;
    line-height: 26px;
    margin-bottom: 10px;
    font-weight: 900;
  }
  .lr {
    display: flex;
    gap: 10px;
  }
  .t1 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    margin: 10px 0;
  }
  .t2 {
    font-size: 12px;
    line-height: 24px;
    text-indent: 24px;
  }
  .bold {
    font-size: 18px;
    font-weight: 700;
  }
  .yellow {
    color: rgb(196, 115, 9);
  }
  .red {
    color: red;
  }
}
</style>
