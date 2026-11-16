<script setup>
import LoginHeader from './LoginHeader.vue'
</script>

<template>
  <div class="login-wrapper">
    <LoginHeader />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">ARB{{ $t('登录') }}</h1>
      </div>
      <slot />
    </div>

    <!-- <footer class="copyright">Copyright @ 2021-2022 Tencent. All Rights Reserved</footer> -->
  </div>
</template>

<style lang="less">
.login-wrapper {
  background-color: white;
  background-image: url('./assets/bg1.png');
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: 100%;
  position: relative;
  .login-container {
    position: absolute;
    top: 22%;
    left: 5%;
    min-height: 440px;
    line-height: 22px;
    padding: 30px 40px;
    background-color: white;
    border-radius: 15px;
  }
  .title-container {
    .title {
      font-size: 32px;
      line-height: 44px;
      color: rgba(0, 0, 0, 0.9);
      margin-top: 4px;

      &.margin-no {
        margin-top: 0;
      }
    }
  }
  .item-container {
    width: 400px;
    margin-top: 48px;
  }
  .copyright {
    font-size: 12px;
    position: absolute;
    left: 5%;
    bottom: 56px;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
