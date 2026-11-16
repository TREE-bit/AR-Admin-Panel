<template>
  <div class="box">
    <div class="box-item">
      <h3 class="box-item-title">{{ $t('m760') }}</h3>
      <div class="box-item-blance">USDT: {{ thousand(dataSource.thirdMerchantBalanceUsdt) }}</div>
      <div class="box-item-blance">INR: {{ thousand(dataSource.thirdMerchantBalance) }}</div>
    </div>
    <div class="box-item">
      <h3 class="box-item-title">{{ $t('m812') }}</h3>
      <span class="box-item-text" v-show="dataSource.updateBy || dataSource.createBy || dataSource.updateTime || dataSource.createTime">({{ $t('m814')}}：
        {{ dataSource.updateBy || dataSource.createBy || "-" }}/
        {{ dataSource.updateTime || dataSource.createTime || "-" }}
        )</span>
      <a-form
       ref="formRef"
      :model="merchantForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      label-align="left"
      >
        <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
          :label="$t('m674')"
          name="thirdName"
          >
            <div class="item-inputBox">
              <a-input class="item-input" v-trim v-model:value="merchantForm.thirdName" :disabled="disabledInputs[0]" />
              <EditOutlined class="edit-icon" v-permission="'admin:payConfigAdmin:update4'" v-show="disabledInputs[0]" @click="editChannel(0)"/>
              <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[0]" @click="showConfirm(1)">{{ $t('save') }}</a-button>
              <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[0]" @click="cancel(1)">{{ $t('b10') }}</a-button>
            </div>
          </a-form-item>
          <a-form-item
          :label="$t('n9')"
          name="merchantNo"
          >
              <div class="item-inputBox">
                <div class="item-input-text">{{ merchantForm.merchantNo }}</div>
                  <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" :disabled="disabledInputs[1]" />
                  <EditOutlined class="edit-icon" v-permission="'admin:payConfigAdmin:update4'" v-show="disabledInputs[1]" @click="editChannel(1)"/>
                  <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[1]" @click="showConfirm(1)">{{ $t('save') }}</a-button>
                  <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[1]" @click="cancel(1)">{{ $t('b10') }}</a-button> -->
              </div>
          </a-form-item>
          <!-- <a-form-item
          :label="$t('m747')"
          name="thirdCode"
          >
              <div class="item-inputBox">
                  <div class="item-input-text">{{ merchantForm.thirdCode }}</div>
                  <a-input class="item-input" v-trim v-model:value="merchantForm.thirdCode" :disabled="disabledInputs[2]" />
                  <EditOutlined class="edit-icon"/>
              </div>
          </a-form-item> -->
          <!-- <a-form-item
          :label="$t('m754')"
          name="domainUrl"
          >
              <div class="item-inputBox">
                  <div class="item-input-text">{{ merchantForm.domainUrl }}</div>
                  <a-input class="item-input" v-trim v-model:value="merchantForm.domainUrl" :disabled="disabledInputs[3]" />
                  <EditOutlined class="edit-icon"/>
              </div>
          </a-form-item> -->
        </a-col>
        <a-col :span="11">
          <!-- <a-form-item
          :label="$t('m755')"
          name="publicKey"
          >
              <div class="item-inputBox">
                <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
                  <template #title>
                    <div style="width: 440px;height: 200px;overflow-y: auto;">
                      {{ merchantForm.publicKey }}
                    </div>
                  </template>
                  <div class="item-input-text toopTipStyle2">{{ merchantForm.publicKey }}</div>
                </a-tooltip>
                  <a-input class="item-input" v-trim v-model:value="merchantForm.publicKey" :disabled="disabledInputs[4]" />
                  <EditOutlined class="edit-icon"/>
              </div>
          </a-form-item> -->
          <!-- <a-form-item
          :label="$t('m756')"
          name="md5Key"
          >
              <div class="item-inputBox">
                <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
                  <template #title>
                    <div style="width: 440px;height: 200px;overflow-y: auto;">
                      {{ merchantForm.md5Key }}
                    </div>
                  </template>
                  <div class="item-input-text toopTipStyle2">{{ merchantForm.md5Key }}</div>
                </a-tooltip>
                  <a-input class="item-input" v-trim v-model:value="merchantForm.md5Key" :disabled="disabledInputs[5]" />
                  <EditOutlined class="edit-icon"/>
              </div>
          </a-form-item> -->
          <!-- <a-form-item
          :label="$t('m757')"
          name="privateKey"
          >
              <div class="item-inputBox">
                <a-tooltip :overlayStyle="{ width: 'auto', maxWidth: 'none' }">
                  <template #title>
                    <div style="width: 440px;height: 200px;overflow-y: auto;">
                      {{ merchantForm.privateKey }}
                    </div>
                  </template>
                  <div class="item-input-text toopTipStyle2">{{ merchantForm.privateKey }}</div>
                </a-tooltip>
                  <a-input class="item-input" v-trim v-model:value="merchantForm.privateKey" :disabled="disabledInputs[6]" />
                  <EditOutlined class="edit-icon"/>
              </div>
          </a-form-item> -->
          <a-form-item
          :label="$t('m758')"
          name="whiteIps"
          >
              <div class="item-inputBox">
                  <a-textarea
                      class="item-input"
                      v-model:value="merchantForm.whiteIps"
                      :disabled="disabledInputs[19]"
                      :rows="2"
                  />
                  <EditOutlined class="edit-icon" v-permission="'admin:payConfigAdmin:update4'" v-show="disabledInputs[19]" @click="editChannel(19)"/>
                  <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[19]" @click="showConfirm(1)">{{ $t('save') }}</a-button>
                  <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[19]" @click="cancel(1)">{{ $t('b10') }}</a-button>
              </div>
          </a-form-item>
        </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="box-item1">
      <h3 class="box-item-title">{{ $t('m761') }}</h3>
      <span class="box-item-text">({{ $t('m814')}}：
        {{ colInfo?.updateBy || colInfo?.createBy || "-" }}/
        {{ colInfo?.updateTime || colInfo?.createTime || "-" }}
        )</span>
      <a-form
        :model="colForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
      >
        <a-row>
          <a-col>
            <h1>INR</h1>
            <a-form-item
              :label="$t('m815')"
            >
              <div class="item-inputBox">
                <a-space class="item-input">
                  <a-input-number :disabled="disabledInputs[7]" :min="1" :max="colForm.maximumAmount-1" v-model:value="colForm.minimumAmount" class="width10" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  —
                  <a-input-number :disabled="disabledInputs[8]" :min="colForm.minimumAmount+1" v-model:value="colForm.maximumAmount" class="width10" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  <span class="item-input-after">INR</span>
                </a-space>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[7]" @click="editChannel(7,8)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[7]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[7]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label="$t('m816')" name="dailyLimitAmount">
              <div class="item-inputBox">
                <a-input-number class="item-input" :disabled="disabledInputs[9]" :min="0" :step="100000" :precision="0" v-model:value="colForm.dailyLimitAmount"  :placeholder="$t('m562')+$t('m771')">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">INR</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[9]" @click="editChannel(9)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[9]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[9]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m818')" name="dailyLimitCount">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number :disabled="disabledInputs[11]" class="item-input" :min="0" v-model:value="colForm.dailyLimitCount" :step="1000" :precision="0">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">{{ $t('m113') }}</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[11]" @click="editChannel(11)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[11]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[11]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m774')"  name="singleOrderCost">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[10]" :min="0"  v-model:value="colForm.singleOrderCost"  :placeholder="$t('m562')+$t('m774')">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">INR</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[10]" @click="editChannel(10)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[10]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[10]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m775')"  name="rate">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[12]" :min="0" v-model:value="colForm.rate">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">%</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[12]" @click="editChannel(12)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[12]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[12]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m817')">
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(colInfo?.todayOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m819')" >
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(colInfo?.allOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
          </a-col>
          <a-col style="margin-left: auto;">
            <h1>USDT</h1>
            <a-form-item
              :label="$t('m815')"
            >
              <div class="item-inputBox">
                <a-space class="item-input">
                  <a-input-number :disabled="disabledInputs[20]" :min="1" :max="colForm.usdtMaximumAmount-1" v-model:value="colForm.usdtMinimumAmount" class="width10" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  —
                  <a-input-number :disabled="disabledInputs[21]" :min="colForm.usdtMinimumAmount+1" v-model:value="colForm.usdtMaximumAmount" class="width10" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  <span class="item-input-after">USDT</span>
                </a-space>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[20]" @click="editChannel(20,21)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[20]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[20]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label="$t('m816')" name="usdtDailyLimitAmount">
              <div class="item-inputBox">
                <a-input-number class="item-input" :disabled="disabledInputs[22]" :min="0" :step="100000" :precision="0" v-model:value="colForm.usdtDailyLimitAmount"  :placeholder="$t('m562')+$t('m771')">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">USDT</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[22]" @click="editChannel(22)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[22]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[22]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m818')" name="usdtDailyLimitCount">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number :disabled="disabledInputs[23]" class="item-input" :min="0" v-model:value="colForm.usdtDailyLimitCount" :step="1000" :precision="0">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">{{ $t('m113') }}</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[23]" @click="editChannel(23)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[23]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[23]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m774')"  name="usdtSingleOrderCost">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[24]" :min="0"  v-model:value="colForm.usdtSingleOrderCost"  :placeholder="$t('m562')+$t('m774')">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">USDT</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[24]" @click="editChannel(24)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[24]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[24]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m775')"  name="usdtRate">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[25]" :min="0" v-model:value="colForm.usdtRate">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">%</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[25]" @click="editChannel(25)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[25]" @click="showConfirm(2)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[25]" @click="cancel(2)">{{ $t('b10') }}</a-button>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m817')">
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(colInfo?.usdtTodayOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m819')" >
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(colInfo?.usdtAllOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="box-item1">
      <h3 class="box-item-title">{{ $t('m762') }}</h3>
      <span class="box-item-text">({{ $t('m814')}}：
        {{ paymentInfo?.updateBy || paymentInfo?.createBy || "-" }}/
        {{ paymentInfo?.updateTime || paymentInfo?.createTime || "-" }}
        )</span>
      <a-form
        :model="paymentForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
      >
        <a-row>
          <a-col>
            <h1>INR</h1>
            <a-form-item
              :label="$t('m815')"
            >
              <div class="item-inputBox">
                  <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.thirdName" disabled /> -->
                <a-space class="item-input">
                  <a-input-number :disabled="disabledInputs[13]" :min="1" :max="paymentForm.maximumAmount-1" v-model:value="paymentForm.minimumAmount" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  —
                  <a-input-number :disabled="disabledInputs[14]" :min="paymentForm.minimumAmount+1" v-model:value="paymentForm.maximumAmount" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  <span class="item-input-after">INR</span>
                </a-space>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[13]" @click="editChannel(13,14)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[13]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[13]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label="$t('m816')" name="dailyLimitAmount">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[15]" :min="0" :step="100000" :precision="0" v-model:value="paymentForm.dailyLimitAmount">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">INR</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[15]" @click="editChannel(15)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[15]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[15]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m818')" name="dailyLimitCount">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number :disabled="disabledInputs[17]" class="item-input" :min="0" v-model:value="paymentForm.dailyLimitCount" :step="1000" :precision="0">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">{{ $t('m113') }}</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[17]" @click="editChannel(17)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[17]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[17]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m774')"  name="singleOrderCost">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
              <a-input-number class="item-input" :disabled="disabledInputs[16]" :min="0"  v-model:value="paymentForm.singleOrderCost" >
                <!-- <template #addonAfter>%</template> -->
              </a-input-number>
              <span class="item-input-after">INR</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[16]" @click="editChannel(16)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[16]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[16]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m775')"  name="rate">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[18]" :min="0" v-model:value="paymentForm.rate">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">%</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[18]" @click="editChannel(18)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[18]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[18]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m817')">
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(paymentInfo?.todayOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m819')">
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(paymentInfo?.allOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
          </a-col>
          <a-col style="margin-left: auto;">
            <h1>USDT</h1>
            <a-form-item
              :label="$t('m815')"
            >
              <div class="item-inputBox">
                  <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.thirdName" disabled /> -->
                <a-space class="item-input">
                  <a-input-number :disabled="disabledInputs[26]" :min="1" :max="paymentForm.usdtMaximumAmount-1" v-model:value="paymentForm.usdtMinimumAmount" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  —
                  <a-input-number :disabled="disabledInputs[27]" :min="paymentForm.usdtMinimumAmount+1" v-model:value="paymentForm.usdtMaximumAmount" >
                    <!-- <template #addonAfter>INR</template>  -->
                  </a-input-number>
                  <span class="item-input-after">USDT</span>
                </a-space>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[26]" @click="editChannel(26,27)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[26]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[26]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label="$t('m816')" name="usdtDailyLimitAmount">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[28]" :min="0" :step="100000" :precision="0" v-model:value="paymentForm.usdtDailyLimitAmount">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">USDT</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[28]" @click="editChannel(28)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[28]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[28]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m818')" name="usdtDailyLimitCount">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number :disabled="disabledInputs[29]" class="item-input" :min="0" v-model:value="paymentForm.usdtDailyLimitCount" :step="1000" :precision="0">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">{{ $t('m113') }}</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[29]" @click="editChannel(29)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[29]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[29]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m774')"  name="usdtSingleOrderCost">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
              <a-input-number class="item-input" :disabled="disabledInputs[30]" :min="0"  v-model:value="paymentForm.usdtSingleOrderCost" >
                <!-- <template #addonAfter>%</template> -->
              </a-input-number>
              <span class="item-input-after">USDT</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[30]" @click="editChannel(30)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[30]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[30]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
            </a-form-item>
            <a-form-item :label = "$t('m775')"  name="usdtRate">
              <div class="item-inputBox">
                <!-- <a-input class="item-input" v-trim v-model:value="merchantForm.merchantNo" disabled /> -->
                <a-input-number class="item-input" :disabled="disabledInputs[31]" :min="0" v-model:value="paymentForm.usdtRate">
                  <!-- <template #addonAfter>%</template> -->
                </a-input-number>
                <span class="item-input-after">%</span>
                <EditOutlined class="edit-icon" v-permission="'admin:paytypeinfo:update'" v-show="disabledInputs[31]" @click="editChannel(31)"/>
                <a-button size="small" class="item-input-save" type="primary" v-show="!disabledInputs[31]" @click="showConfirm(3)">{{ $t('save') }}</a-button>
                <a-button size="small" class="item-input-save" type="default" v-show="!disabledInputs[31]" @click="cancel(3)">{{ $t('b10') }}</a-button>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m817')">
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(paymentInfo?.usdtTodayOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
            <a-form-item :label = "$t('m819')">
              <div class="item-inputBox">
                <div class="item-input-text">{{ thousand(paymentInfo?.usdtAllOrderAmount) }}</div>
              </div>
              <!-- <div class="collAndPay-msg">{{ $t('n349') }}</div> -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
  <a-modal
    v-model:open="confirmVisible"
    :title="$t('m821')"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirm-loading="loading"
  >
</a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref} from "vue";
import { EditOutlined } from "@ant-design/icons-vue";
import settingChannel from "@/components/Payment/settingChannel.vue";
import countPage from "@/components/Payment/countPage.vue";
import { 
  payConfigAdminListConfig,
  updateListConfig,
  paytypeinfoList,
  paytypeinfoUpdate,
 } from "@/api/channel.api";
import { message,Modal } from "ant-design-vue";
import { useMerchantInfo } from "@/hooks/useMerchantInfo.hook";
import UploadFile from '@/components/UploadFile/index.vue'
import { useI18n } from "vue-i18n";
import { currency, thousand } from "@/utils";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import Bus from '@/utils/bus'
const { getTabH } = useTabHeight(3);
const { t } = useI18n();
const dataSource:any = ref({});
const loading = ref(false);
const channelId = ref(0);
const query = ref({
  pageNo: 1,
  pageSize: 20,
  thirdName: undefined,//m674
  thirdCode: undefined,//通道编码
  payStatus: undefined,//代收状态
  paymentStatus: undefined,//代付状态
  status: undefined,//状态
});
// 禁用状态数组
const disabledInputs = ref([
  true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
  true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
  true, true, true, true, true, true, true, true, true, true, true, true, true
]);
const resetDis = () => {
  disabledInputs.value.map((item, index) => disabledInputs.value[index] = true);
}
const merchantForm = ref({});
let merchantOldForm = {};
const getList = async (value: any, isFirst: any = null) => {
  if (isFirst) {
    value.pageNo = 1;
  }
  loading.value = true;
  const res: any = await payConfigAdminListConfig(value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    dataSource.value = res.data[0];
    localStorage.setItem('thirdCode', res.data[0].thirdCode);
    Bus.emit('ChannelThirdCode', res.data[0].thirdCode);
    if(res.data.length > 0){
      const { id, merchantNo, thirdName, thirdCode, md5Key, publicKey, privateKey, domainUrl, whiteIps } = res.data[0];
      merchantForm.value = { id, merchantNo, thirdName, thirdCode, md5Key, publicKey, privateKey, domainUrl, whiteIps };
      merchantOldForm = { id, merchantNo, thirdName, thirdCode, md5Key, publicKey, privateKey, domainUrl, whiteIps };
    }
    resetDis();
  }
};
//编辑通道
const editChannel = (index: any,index2: any=null) => {
  if(disabledInputs.value.includes(false)) {
    message.error(t('m820'));
    return
  }
  disabledInputs.value[index] = false;
  if(index2) disabledInputs.value[index2] = false;
}
const updateChannel = async () => {
  if(!merchantForm.value.thirdName || merchantForm.value.thirdName.trim() == ''){
    return message.error(t('m562')+t('m746'))
  }
  if(!merchantForm.value.merchantNo || merchantForm.value.merchantNo.trim() == ''){
    return message.error(t('m562')+t('n9'))
  }
  loading.value = true;
  const res: any = await updateListConfig(merchantForm.value).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    message.success(t('s10'));
    getList(query.value);
    handleCancel();
  }
}
const queryColPay= ref<any>({
  asc:'',
  column:'',
  pageNo:1,
  pageSize:5,
  configId: undefined,
  channelType: undefined,
})

//代收区间
const colInfo= ref<any>({});
const colForm:any = ref({});
let colOldForm:any = {};
const getColInfo = async () => {
  queryColPay.value.configId = dataSource.value.id;
  queryColPay.value.channelType = 1;
  loading.value = true;
  const res: any = await paytypeinfoList(queryColPay.value).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    colInfo.value = res.data[0];
    if(res.data.length > 0){
      const { id,dailyLimitAmount,dailyLimitCount,singleOrderCost,rate,minimumAmount,maximumAmount,
        usdtDailyLimitAmount,usdtDailyLimitCount,usdtSingleOrderCost,usdtRate,usdtMinimumAmount,usdtMaximumAmount
       } = res.data[0];
      colForm.value = {id,dailyLimitAmount,dailyLimitCount,singleOrderCost,rate,minimumAmount,maximumAmount,
        usdtDailyLimitAmount,usdtDailyLimitCount,usdtSingleOrderCost,usdtRate,usdtMinimumAmount,usdtMaximumAmount
      };
      colOldForm = {id,dailyLimitAmount,dailyLimitCount,singleOrderCost,rate,minimumAmount,maximumAmount,
        usdtDailyLimitAmount,usdtDailyLimitCount,usdtSingleOrderCost,usdtRate,usdtMinimumAmount,usdtMaximumAmount
      };
    }
  }
};
const updateCol = async () => {
  colForm.value.configId = dataSource.value.id;
  colForm.value.channelType = 1;
  if(!colForm.value.minimumAmount){
    message.error(t('m562')+t('n389'));
    return;
  }
  if(!colForm.value.maximumAmount){
    message.error(t('m563')+t('n388'));
    return;
  }
  loading.value = true;
  const res: any = await paytypeinfoUpdate(colForm.value).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t('s10'));
    getColInfo();
    handleCancel();
    resetDis();
  }
}
//代付区间
const paymentInfo=ref<any>({});
const paymentForm:any = ref({});
let paymentOldForm:any = {};
const getPaymentInfo = async () => {
  queryColPay.value.configId = dataSource.value.id;
  queryColPay.value.channelType = 2;
  loading.value = true;
  const res: any = await paytypeinfoList(queryColPay.value).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    paymentInfo.value = res.data[0];
    if(res.data.length > 0){
      const { id,dailyLimitAmount,dailyLimitCount,singleOrderCost,rate,minimumAmount,maximumAmount,
        usdtDailyLimitAmount,usdtDailyLimitCount,usdtSingleOrderCost,usdtRate,usdtMinimumAmount,usdtMaximumAmount
      } = res.data[0];
      paymentForm.value = {id,dailyLimitAmount,dailyLimitCount,singleOrderCost,rate,minimumAmount,maximumAmount,
        usdtDailyLimitAmount,usdtDailyLimitCount,usdtSingleOrderCost,usdtRate,usdtMinimumAmount,usdtMaximumAmount
      };
      paymentOldForm = {id,dailyLimitAmount,dailyLimitCount,singleOrderCost,rate,minimumAmount,maximumAmount,
        usdtDailyLimitAmount,usdtDailyLimitCount,usdtSingleOrderCost,usdtRate,usdtMinimumAmount,usdtMaximumAmount
      };
    }
  }
    
}
const updatePayment = async () => {
  paymentForm.value.configId = dataSource.value.id;
  paymentForm.value.channelType = 2;
  if(!paymentForm.value.minimumAmount){
    message.error(t('m562')+t('n400'));
    return;
  }
  if(!paymentForm.value.maximumAmount){
    message.error(t('m563')+t('n401'));
    return;
  }
  loading.value = true;
  const res: any = await paytypeinfoUpdate(paymentForm.value).finally(() => (loading.value = false));
  if (res && res.code === "1") {
    message.success(t('s10'));
    getPaymentInfo();
    handleCancel();
    resetDis();
  }
}
//取消
const cancel = (t:number) => {
  if(t == 1){
    merchantForm.value = JSON.parse(JSON.stringify(merchantOldForm));
  }else if(t == 2){
    colForm.value = JSON.parse(JSON.stringify(colOldForm));
  }else if(t == 3){
    paymentForm.value = JSON.parse(JSON.stringify(paymentOldForm));
  }
  resetDis();
}
//二次确认弹窗
const confirmVisible = ref(false);
const upType = ref(0);
const showConfirm = (t:number) => {
  upType.value = t;
  confirmVisible.value = true;
}
const handleOk = async () => {
  if(upType.value == 1){
    updateChannel();
  }else if(upType.value == 2){
    updateCol();
  }else if(upType.value == 3){
    updatePayment();
  }
}
const handleCancel = () => {
  confirmVisible.value = false;
}
onMounted(async () => {
  await getList(query.value);
  await getColInfo();
  await getPaymentInfo();
});
</script>
<style lang="less" scoped>
.box{
  width: 100%;
  height:auto;
  .box-item{
    border: 1px solid #d9d9d9;
    padding: 15px;
  }
  .box-item1{
    
    .box-item-title{
      margin-left: 15px;
    }
    .ant-row{
      // display: flex;
      margin-top: 10px;
    }
    .ant-col{
      padding: 20px;
      width: calc((100% - 20px) / 2);
      gap: 10px;
      border-radius: 10PX;
      border: 1px solid #d9d9d9;
    }
  }
  .box-item,.box-item1{
    width: 100%;
    height: auto;
    border-radius: 10PX;
    background-color: #fff;
    margin-bottom: 10px;
    .box-item-title{
      display: inline-block;
      position: relative;
      height: 30px;
      padding-left: 10px;
      &::before{
          content: "";
          display: block;
          height: 30px;
          width: 4px;
          background-color: #fac10c;
          position: absolute;
          top: 0;
          left: 0;
      }
    }
    .box-item-text{
      margin-left: 8px;
    }
    .box-item-blance{
      float: right;
      margin-right: 12%;
      font-size: 20px;
      font-weight: 600;
    }
    .item-inputBox{
      display: flex;
      align-items: center;
      .item-input{
          flex: 0.5;
      }
      .edit-icon{
          margin-left: 8px;
          cursor: pointer;
      }
      .item-input-text{
          word-wrap: break-word; /* 长单词换行 */
          word-break: break-word; /* 适配不同场景，兼容性更好 */
          overflow-wrap: break-word; /* 现代浏览器推荐 */
          white-space: normal; /* 默认换行行为 */
      }
      .item-input-after{
          margin-left: 8px;
      }
      .item-input-save{
          margin-left: 8px;
      }
    }
  }
}
</style>
