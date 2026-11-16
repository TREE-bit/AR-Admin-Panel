<script setup lang="ts">
import { Login } from '@ar/components'
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons-vue'
import { useLogin } from '@/hooks'
const { onLogin, form, disabled,loading } = useLogin()
</script>

<template>
  <Login>
    <a-form :model="form" name="normal_login" class="login-form" @finish="onLogin">
      <a-form-item name="username" :rules="[{ required: true, message: $t('t19') }]">
        <a-input v-trim :placeholder="$t('p1')" v-model:value="form.username" size="large">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="password" :rules="[{ required: true, message: $t('t20')  }]">
        <a-input-password :placeholder="$t('p2')" v-model:value="form.password" size="large">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="totpCode">
        <a-input v-trim :placeholder="$t('p3')" autocomplete="new-password" v-model:value="form.totpCode" size="large">
          <template #prefix>
            <GoogleOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox size="large">{{ $t('b13') }}</a-checkbox>
        </a-form-item>
        <!-- <a class="login-form-forgot" href="">{{ $t('b14') }}</a> -->
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          size="large"
          html-type="submit"
          class="login-form-button"
          :loading="loading"
        >
          {{ $t('b15') }}
        </a-button>
      </a-form-item>
    </a-form>
  </Login>
</template>

<style lang="less">
.login-form {
  width: 300px;
  margin-top: 38px;
  &-forgot {
    float: right;
  }
  &-button {
    width: 100%;
  }
  .anticon {
    color: rgba(0, 0, 0, 0.25);
  }
}
.login-form-button {
  background-color: #FFC107; /* 黄色 */
  border-color: #FFC107; /* 边框颜色 */
  color: #fff; /* 文字颜色 */
}
.login-form-button:not(:disabled):hover {
  background-color: #FFE082; /* 浅黄色 */
  border-color: #FFE082;
  color: #fff;
}

.login-form-button[disabled] {
  background-color: #FFD54F; /* 禁用状态浅黄 */
  border-color: #FFD54F;
  color: #cac8c8;
}
</style>
