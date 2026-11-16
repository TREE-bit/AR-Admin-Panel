<template>
  <div class="sell-out-form-wrap">
    <div class="sell-out-template-actions">
      <a-button
        class="template-action-btn template-download-btn"
        :icon="h(DownloadOutlined)"
        :loading="templateDownloadLoading"
        @click="handleDownloadTemplate"
      >
        {{ t("sellOutDownloadTemplate") }}
      </a-button>
      <a-button
        class="template-action-btn template-import-btn"
        :icon="h(UploadOutlined)"
        :loading="templateUploadLoading"
        @click="openTemplateFilePicker"
      >
        {{ t("sellOutImportTemplate") }}
      </a-button>
      <span class="template-import-limit-tip">{{ t("sellOutImportTemplateMaxTip") }}</span>
      <input
        ref="templateFileInputRef"
        class="sell-out-template-input"
        type="file"
        :accept="templateAccept"
        @change="handleTemplateFileChange"
      />
    </div>

    <a-form class="sell-out-form" :model="formState" layout="vertical" @finish="handleSubmit">
      <a-form-item
        :label="t('m374')"
        name="amount"
        :rules="[{ required: true, message: t('sellOutAmountRequired') }]"
      >
        <a-input-number
          v-model:value="formState.amount"
          :min="0"
          :precision="2"
          :placeholder="t('sellOutAmountRequired')"
          style="width: 100%;"
        />
      </a-form-item>

      <a-form-item name="merchantTradeNo" :rules="[{ required: true, message: t('m60') }]">
        <template #label>
          {{ t("l96") }}<span class="order-no-tip">{{ t("sellOutMerchantTradeNoReadonlyTip") }}</span>
        </template>
        <div class="order-no-row">
          <a-input
            class="order-no-input"
            v-model:value="formState.merchantTradeNo"
            readonly
            :placeholder="t('sellOutMerchantTradeNoGenerateTip')"
          />
          <a-button type="primary" html-type="button" @click="generateOrderNo">
            {{ t("sellOutGenerate") }}
          </a-button>
        </div>
      </a-form-item>

      <a-tabs v-model:activeKey="formState.payType">
        <a-tab-pane key="upi" :tab="t('sellOutTabUpi')" />
        <a-tab-pane key="bank" :tab="t('m657')" />
      </a-tabs>

      <a-form-item
        v-if="formState.payType === 'upi'"
        label="UPI ID"
        name="upiId"
        :rules="[
          { required: true, message: t('sellOutUpiIdRequired') },
          { validator: validateUpiId, trigger: ['blur', 'change'] },
        ]"
      >
        <a-input v-model:value="formState.upiId" :placeholder="t('sellOutUpiIdRequired')" />
      </a-form-item>

      <template v-else>
        <a-form-item
          :label="t('m652')"
          name="bankCardNumber"
          :rules="[{ required: true, message: t('sellOutBankCardNumberRequired') }]"
        >
          <a-input
            v-model:value="formState.bankCardNumber"
            :placeholder="t('sellOutBankCardNumberRequired')"
          />
        </a-form-item>

        <a-form-item
          :label="t('m653')"
          name="ownerName"
          :rules="[{ required: true, message: t('sellOutOwnerNameRequired') }]"
        >
          <a-input v-model:value="formState.ownerName" :placeholder="t('sellOutOwnerNameRequired')" />
        </a-form-item>

        <a-form-item
          :label="t('m581')"
          name="bankName"
          :rules="[{ required: true, message: t('sellOutBankNameRequired') }]"
        >
          <a-input v-model:value="formState.bankName" :placeholder="t('sellOutBankNameRequired')" />
        </a-form-item>

        <a-form-item
          :label="t('sellOutIfsc')"
          name="ifsc"
          :rules="[{ required: true, message: t('sellOutIfscRequired') }]"
        >
          <a-input v-model:value="formState.ifsc" :placeholder="t('sellOutIfscRequired')" />
        </a-form-item>
      </template>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="submitLoading">
          {{ t("publicSubmit") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { h, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  createQuickUpiOrBankOrder,
  downloadQuickUpiOrBankOrderTemplate,
  importQuickUpiOrBankOrderTemplate,
} from "@/api/order.api";

type PayType = "upi" | "bank";
type ChannelType = "1" | "3";

const { t } = useI18n();
const submitLoading = ref(false);
const templateDownloadLoading = ref(false);
const templateUploadLoading = ref(false);
const templateFileInputRef = ref<HTMLInputElement | null>(null);
const templateAccept = ".xlsx";

const formState = reactive({
  amount: undefined as number | undefined,
  merchantTradeNo: "",
  payType: "upi" as PayType,
  upiId: "",
  bankCode: "",
  bankCardNumber: "",
  ownerName: "",
  bankName: "",
  ifsc: "",
});

watch(
  () => formState.payType,
  (payType) => {
    if (payType === "upi") {
      formState.bankCardNumber = "";
      formState.ownerName = "";
      formState.bankName = "";
      formState.bankCode = "";
      formState.ifsc = "";
      return;
    }
    formState.upiId = "";
  }
);

const buildMerchantTradeNo = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const timePart = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(
    2,
    "0"
  )}${String(now.getSeconds()).padStart(2, "0")}`;
  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return `WP${datePart}${timePart}${randomDigits}${randomLetter}`;
};

const generateOrderNo = () => {
  formState.merchantTradeNo = buildMerchantTradeNo();
};

const openTemplateFilePicker = () => {
  if (templateUploadLoading.value) return;
  if (!templateFileInputRef.value) return;
  templateFileInputRef.value.value = "";
  templateFileInputRef.value.click();
};

const triggerTemplateDownload = (blob: Blob) => {
  const link = document.createElement("a");
  const downloadUrl = window.URL.createObjectURL(blob);
  link.href = downloadUrl;
  link.download = "manual_sell_order_template.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const tryParseBlobJson = async (blob: Blob) => {
  const contentType = blob.type || "";
  if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
    return null;
  }
  try {
    return JSON.parse(await blob.text());
  } catch (_err) {
    return null;
  }
};

const handleDownloadTemplate = async () => {
  templateDownloadLoading.value = true;
  try {
    const res: any = await downloadQuickUpiOrBankOrderTemplate({});

    if (!(res instanceof Blob)) {
      if (res && (res.code === "1" || res.code === 1) && typeof res.data === "string") {
        window.open(res.data, "_blank");
        message.success(t("sellOutDownloadTemplateSuccess"));
        return;
      }
      message.warning(res?.msg || t("sellOutDownloadTemplateFailed"));
      return;
    }

    const jsonRes = await tryParseBlobJson(res);
    if (jsonRes) {
      if ((jsonRes.code === "1" || jsonRes.code === 1) && typeof jsonRes.data === "string") {
        window.open(jsonRes.data, "_blank");
        message.success(t("sellOutDownloadTemplateSuccess"));
        return;
      }
      message.warning(jsonRes.msg || t("sellOutDownloadTemplateFailed"));
      return;
    }

    if (!res.size) {
      message.warning(t("sellOutDownloadTemplateFailed"));
      return;
    }

    triggerTemplateDownload(res);
    message.success(t("sellOutDownloadTemplateSuccess"));
  } catch (error: any) {
    message.error(error?.message || t("sellOutDownloadTemplateFailed"));
  } finally {
    templateDownloadLoading.value = false;
  }
};

const isTemplateFileTypeValid = (fileName: string) => {
  const suffix = fileName.split(".").pop()?.toLowerCase() || "";
  return suffix === "xlsx";
};

const getTemplateFileMimeType = (file: File) => {
  const suffix = file.name.split(".").pop()?.toLowerCase() || "";
  if (suffix === "xlsx") {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  return file.type || "application/octet-stream";
};

const handleTemplateFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!isTemplateFileTypeValid(file.name)) {
    message.warning(t("n704", { n: "xlsx" }));
    target.value = "";
    return;
  }

  const mime = getTemplateFileMimeType(file);
  const uploadFile = new File([file], file.name, {
    type: mime,
    lastModified: file.lastModified,
  });

  const formData = new FormData();
  formData.append("file", uploadFile, uploadFile.name);

  templateUploadLoading.value = true;
  try {
    const res: any = await importQuickUpiOrBankOrderTemplate(formData);
    if (res && (res.code === "1" || res.code === 1)) {
      message.success(t("sellOutImportTemplateSuccess"));
      return;
    }
    message.warning(res?.msg || t("sellOutImportTemplateFailed"));
  } catch (error: any) {
    message.error(error?.message || t("sellOutImportTemplateFailed"));
  } finally {
    templateUploadLoading.value = false;
    target.value = "";
  }
};

const validateUpiId = (_rule: any, value: string) => {
  if (!value || value.includes("@")) {
    return Promise.resolve();
  }
  return Promise.reject(t("sellOutUpiIdAtRule"));
};

const resetForm = () => {
  formState.amount = undefined;
  formState.merchantTradeNo = "";
  formState.payType = "upi";
  formState.upiId = "";
  formState.bankCode = "";
  formState.bankCardNumber = "";
  formState.ownerName = "";
  formState.bankName = "";
  formState.ifsc = "";
};

const handleSubmit = async () => {
  const channel: ChannelType = formState.payType === "bank" ? "1" : "3";
  const payload: any = {
    amount: String(formState.amount),
    merchantTradeNo: formState.merchantTradeNo,
    channel,
  };

  if (channel === "3") {
    payload.upiId = formState.upiId;
  } else {
    payload.bankCardNumber = formState.bankCardNumber;
    payload.bankName = formState.bankName;
    payload.bankCode = formState.bankCode;
    payload.ownerName = formState.ownerName;
    payload.ifsc = formState.ifsc;
  }

  submitLoading.value = true;
  try {
    const res: any = await createQuickUpiOrBankOrder(payload);
    if (res && (res.code === "1" || res.code === 1)) {
      message.success(t("sellOutSubmitSuccess"));
      resetForm();
    }
  } finally {
    submitLoading.value = false;
  }
};
</script>

<style scoped lang="less">
.sell-out-form {
  width: 100%;
  margin: 0;
}

.sell-out-form-wrap {
  max-width: 620px;
  margin: 0;
  padding: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.sell-out-template-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding: 10px;
  background: linear-gradient(180deg, #fffaf1 0%, #ffffff 100%);
  border: 1px solid #f6e7cb;
  border-radius: 10px;
}

.template-action-btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 9px;
  font-weight: 600;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
}

.template-action-btn :deep(.anticon) {
  font-size: 14px;
}

.template-download-btn {
  color: #8f5900;
  background: #fff4de;
  border-color: #ffd38a;
}

.template-download-btn:hover,
.template-download-btn:focus {
  color: #734700;
  background: #ffecbf;
  border-color: #ffc66b;
}

.template-import-btn {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, #ffb43a 0%, #f08a00 100%);
  box-shadow: 0 6px 14px rgba(240, 138, 0, 0.28);
}

.template-import-btn:hover,
.template-import-btn:focus {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, #ffc04d 0%, #ee940f 100%);
  box-shadow: 0 8px 18px rgba(240, 138, 0, 0.33);
}

.template-action-btn:hover {
  transform: translateY(-1px);
}

.template-action-btn:active {
  transform: translateY(0);
}

.template-action-btn.ant-btn-loading,
.template-action-btn[disabled] {
  transform: none;
}

.template-import-limit-tip {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid #ffccc7;
  background: #fff1f0;
  color: #cf1322;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1px;
  white-space: nowrap;
}

.template-import-limit-tip::before {
  content: "";
  width: 5px;
  height: 5px;
  margin-right: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.85;
}

@media (max-width: 768px) {
  .sell-out-template-actions {
    gap: 8px;
    padding: 8px;
  }

  .template-action-btn {
    height: 34px;
    padding: 0 12px;
    border-radius: 8px;
  }
}

.sell-out-template-input {
  display: none;
}

.order-no-row {
  display: flex;
  gap: 8px;
}

.order-no-input {
  flex: 1;
}

.order-no-tip {
  color: #ff4d4f;
}

.sell-out-form-wrap :deep(input.ant-input),
.sell-out-form-wrap :deep(.ant-input-number) {
  height: 36px;
}
</style>
