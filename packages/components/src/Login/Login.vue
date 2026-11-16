<script setup lang="ts">
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons-vue'
interface FormState {
  username: string
  password: string
  remember: boolean
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const disabled = computed(() => {
  return !(formState.username && formState.password)
})
</script>

<template>
  <a-form
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-trim :placeholder="$t('t19')" v-model:value="formState.username" size="large">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password
        :placeholder="$t('t20')"
        v-model:value="formState.password"
        size="large"
      >
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item
      name="password"
    >
      <a-input v-trim :placeholder="$t('t21')" v-model:value="formState.password" size="large">
        <template #prefix>
          <GoogleOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item>
      <a-form-item name="remember" no-style>
        <a-checkbox v-model:checked="formState.remember" size="large">{{ $t('b13') }}</a-checkbox>
      </a-form-item>
      <a class="login-form-forgot" href="">{{ $t('b14') }}</a>
    </a-form-item>

    <a-form-item>
      <a-button
        :disabled="disabled"
        type="primary"
        size="large"
        html-type="submit"
        class="login-form-button"
      >
        {{ $t('b15') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="less">
.login-form {
  width: 300px;
  margin-top: 48px;
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
</style>
