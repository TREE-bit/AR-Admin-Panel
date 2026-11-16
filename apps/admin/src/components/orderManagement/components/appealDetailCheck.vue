<template>
  <a-empty  v-if="!usdtBOrderInfo?.orderSubmitAmount"></a-empty>
  <a-row  class="pr15" v-if="usdtBOrderInfo?.orderSubmitAmount">
    <a-col :span="8">
      <div class="Temp_C-info">
        <!-- <h4>{{ $t("user.usdtBOrderInfo") }}</h4> -->
        <div class="Temp_C-box">
          <div class="item" v-if="usdtBOrderInfo?.orderSubmitAmount">
            <div class="lab">{{ $t("n42") }}：</div>
            <span class="data">{{ usdtBOrderInfo?.orderSubmitAmount }}</span>
          </div>
          <div class="item" v-if="usdtBOrderInfo?.orderActualAmount">
            <div class="lab">{{ $t("n105") }}：</div>
            <span class="data" style="color: red">{{ usdtBOrderInfo?.orderActualAmount }}</span>
          </div>
          <div class="item" v-if="usdtBOrderInfo?.utr">
            <div class="lab">UTR：</div>
            <span class="data" style="color: red">{{ usdtBOrderInfo?.utr }}</span>
            <CopyOutlined v-if="usdtBOrderInfo?.utr" class="copyId"  @click="$copyId(usdtBOrderInfo?.utr)" />
          </div>
          <div class="item" v-if="usdtBOrderInfo?.collectionPlatformOrder">
            <div class="lab">{{ $t("l90") }}：</div>
            <span class="data">{{
              usdtBOrderInfo?.collectionPlatformOrder
            }}</span>
            <CopyOutlined v-if="usdtBOrderInfo?.collectionPlatformOrder" class="copyId"  @click="$copyId(usdtBOrderInfo?.collectionPlatformOrder)" />
          </div>
          <div class="item_line"></div>
          <div class="item" v-if="usdtBOrderInfo?.createTime">
            <div class="lab">{{ $t("l95") }}：</div>
            <span class="data">{{ usdtBOrderInfo?.createTime }}</span>
          </div>
          <div class="item" v-if="usdtBOrderInfo?.paymentTime">
            <div class="lab">{{ $t("l38") }}：</div>
            <span class="data">{{ usdtBOrderInfo?.paymentTime }}</span>
          </div>
          <div class="item" v-if="usdtBOrderInfo?.submitTime">
            <div class="lab">{{ $t("n106") }}：</div>
            <span class="data">{{ usdtBOrderInfo?.submitTime }}</span>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="14">
      <div class="pictures_container" >
        <div class="appealInfo">
          <span class="title">{{ $t("m723") }}：</span>
          <span class="reason">{{ usdtBOrderInfo?.reason }}</span>
        </div>
        <div class="appealData">
          <div class="appealData_box1">
            <div class="title">{{ $t("m724") }}：</div>
            <div class="pic">
              <a-image v-if="usdtBOrderInfo?.picInfo" style="padding: 2px;" v-for="(item, index) in usdtBOrderInfo?.picInfo" :key="index" :width="80" :height="80" :src="item" />
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
          <div class="appealData_box2">
            <div class="title">{{ $t("m725") }}：</div>
            <div class="pic">
              <div class="playVideo" v-if="usdtBOrderInfo?.videoUrl" @click="openVideo(usdtBOrderInfo.videoUrl)">
                <PlayCircleOutlined class="playIcon" />
              </div>
              <video v-if="usdtBOrderInfo?.videoUrl" controls width="160" height="100" :src="usdtBOrderInfo.videoUrl"></video>
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
        </div>
      </div>
      <div class="pictures_container" >
        <div class="appealInfo">
          <span class="title">{{ $t("m726") }}：</span>
          <span class="reason">{{ usdtBOrderInfo?.sellerReason }}</span>
        </div>
        <div class="appealData">
          <div class="appealData_box1">
            <div class="title">{{ $t("m724") }}：</div>
            <div class="pic">
              <a-image v-if="usdtBOrderInfo?.sellerPics" style="margin: 2px;" v-for="(item, index) in usdtBOrderInfo?.sellerPics" :key="index" :width="80" :height="80" :src="item" />
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
          <div class="appealData_box2">
            <div class="title">{{ $t("m725") }}：</div>
            <div class="pic">
              <div class="playVideo" v-if="usdtBOrderInfo?.sellerVideo"  @click="openVideo(usdtBOrderInfo.sellerVideo)">
                <PlayCircleOutlined class="playIcon"  />
              </div>
              <video v-if="usdtBOrderInfo?.sellerVideo" controls width="160" height="100" :src="usdtBOrderInfo.sellerVideo"></video>
              <img v-else :src="no_up" alt="" style="width: 80px;height: 80px;">
            </div>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
  <!-- 弹窗 -->
  <a-modal
      v-model:open="videoMod"
      :footer="null"
      :centered="true"
      :title="$t('m725')"
      width="800"
      @cancel="handleCancel"
    >
      <video
        controls
        autoplay
        width="600"
        height="600"
        :src="videoUrl"
        style="margin: auto;"
      ></video>
    </a-modal>
</template>
<script setup lang="ts">
import { getUsdtBuyOrderInfo } from "@/hooks/userOrderInfo.hook";
import { PlayCircleOutlined } from "@ant-design/icons-vue";
import { currency } from "@/utils";
import no_up from "@/assets/no_up.png";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { usdtBOrderInfo } = getUsdtBuyOrderInfo();
const videoUrl = ref('');
const videoMod = ref(false);
const openVideo = (url:any) => {
  videoUrl.value = url;
  videoMod.value = true;
}
const handleCancel = () => {
  videoMod.value = false;
  videoUrl.value = '';
};
</script>

<style scoped lang="less">
.Temp_C-box {
  .item {
    height: 30px;
    width: 100%;
    .lab {
      float: left;
      font-size: 12px;
      color: #979595;
    }
    .data {
      float: left;
      font-size: 12px;
      color: #151515;
    }
  }
  .item_line {
    width: 140px;
    height: 1px;
    border-bottom: 1px solid #999;
    margin-bottom: 10px;
  }
  h4 {
    font-size: 16px;
    height: 20px;
    line-height: 18px;
    position: relative;
    border-left: 5px solid #108ee9;
    padding-left: 10px;
  }
}
.pictures_container {
  overflow: auto;
  .appealInfo{
    line-height: 30px;
  }
  .appealData{
    min-height: 200px;
    .appealData_box1{
      min-width: 30%;
      max-width: 50%;
    }
    .appealData_box1,.appealData_box2{
      float: left;
      .title{
        height: 30px;
        line-height: 30px;
      }
    }
    .pic{
      position: relative;
      .playVideo{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        .playIcon{
          width: 40px;
          height: 40px;
          font-size: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          &:hover{
            color: #108ee9;
          }
        }
      }
    }
  }
}
</style>
