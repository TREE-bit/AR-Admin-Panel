<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.bankName"
          class="searchstyle"
          :placeholder="$t('m562') + $t('m581')"
          @pressEnter="getList(1)"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.ifsc"
          class="searchstyle"
          :placeholder="$t('m562') + 'IFSC'"
          @pressEnter="getList(1)"
        />
      </a-col>
      <a-col :span="8">
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="getList(1)"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery">{{
          $t("reset")
        }}</a-button>
        <a-button type="primary" @click="showAddDialog" v-permission="'admin:ifscBankNameAdmin:add'">{{ $t('add') }}</a-button>
        <a-button type="primary" :icon="h(UploadOutlined)" @click="showImportDialog" v-permission="'admin:ifscBankNameAdmin:confirmImport'">{{ $t('n1824') }}</a-button>
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :scroll="{ x: '100%', y: getTabH + 'px' }"
    :loading="loading"
    @change="handleTableChange"
    bordered
    :row-key="(record: any) => record.id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'bankName'">
        <a-tooltip v-if="record.bankName">
          <template #title><span class="upper">{{ record.bankName }}</span></template>
          <div class="toopTipStyle upper">{{ record.bankName }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'createBy'">
        {{ record.createBy || '-' }}
      </template>
      <template v-if="column.key === 'createTime'">
        {{ record.createTime || '-' }}
      </template>
      <template v-if="column.key === 'updateBy'">
        {{ record.updateBy || '-' }}
      </template>
      <template v-if="column.key === 'updateTime'">
        {{ record.updateTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="editDialog(record)"
          v-permission="'admin:ifscBankNameAdmin:update'"
          >{{ $t("edit") }}
        </a-tag>
        <a-tag
          color="rgba(253, 11, 26, 1)"
          style="cursor: pointer"
          size="small"
          @click="showDeleteDialog(record)"
          v-permission="'admin:ifscBankNameAdmin:delete'"
          >{{ $t("b11") }}
        </a-tag>
      </template>
    </template>
  </a-table>

  <!-- 新增 / 编辑 -->
  <a-modal
    v-model:open="addDialog"
    :title="(isEdit ? $t('edit') : $t('add')) + ' IFSC'"
    @cancel="closeAddDialog"
    :footer="null"
  >
    <a-form
      :model="addFrom"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item :label="$t('m581')" name="bankName" :rules="[{ required: true, message: '' }]">
        <a-input
          v-trim
          v-model:value="addFrom.bankName"
          :placeholder="$t('m562') + $t('m581')"
        />
      </a-form-item>
      <a-form-item
        label="IFSC"
        name="ifsc"
        :rules="[{ required: true, message: '' }]"
        :extra="$t('n1817')"
      >
        <a-input
          v-trim
          v-model:value="addFrom.ifsc"
          :maxlength="11"
          @input="onIfscInput"
          :placeholder="$t('m562') + 'IFSC'"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" :loading="saving" @click="addBtn">{{ $t('save') }}</a-button>
        <a-button style="margin-left: 10px" @click="closeAddDialog">{{ $t('b10') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 删除二次确认 -->
  <a-modal
    v-model:open="deleteDialog"
    :title="$t('n1819')"
    :width="480"
    @cancel="closeDeleteDialog"
    :footer="null"
  >
    <div class="del-body">
      <ExclamationCircleFilled class="del-icon" />
      <div class="del-title">{{ $t('n1820') }}</div>
      <div class="del-desc">{{ $t('n1821') }}</div>
      <div class="del-record">
        <span>{{ $t('m581') }}: <b class="upper">{{ deleteRow.bankName }}</b></span>
        <span class="del-sep">/</span>
        <span>IFSC: <b>{{ deleteRow.ifsc }}</b></span>
      </div>
      <a-checkbox v-model:checked="deleteChecked">{{ $t('n1822') }}</a-checkbox>
    </div>
    <div class="dlg-footer">
      <a-button @click="closeDeleteDialog">{{ $t('b10') }}</a-button>
      <a-button type="primary" danger :disabled="!deleteChecked" :loading="deleting" @click="confirmDelete">{{ $t('n1823') }}</a-button>
    </div>
  </a-modal>

  <!-- 批量上传 -->
  <a-modal
    v-model:open="importDialog"
    :title="$t('n1824') + ' IFSC'"
    :width="640"
    :maskClosable="false"
    @cancel="closeImportDialog"
    :footer="null"
  >
    <div class="imp-steps">
      <div class="imp-steps-title">{{ $t('n1825') }}</div>
      <div class="imp-steps-desc">{{ $t('n1826') }}</div>
    </div>
    <a-button :icon="h(DownloadOutlined)" :loading="templateDownloading" @click="downloadTemplate">{{ $t('sellOutDownloadTemplate') }}</a-button>
    <div class="imp-drop">
      <div class="imp-drop-title">{{ $t('n1827') }}</div>
      <div class="imp-drop-desc">{{ $t('n1828') }}</div>
      <div class="imp-drop-file">
        <a-button :loading="importValidating" @click="openImportFilePicker">{{ $t('n1839') }}</a-button>
        <span class="imp-file-name">{{ importFile ? importFile.name : $t('n1829') }}</span>
      </div>
      <input
        ref="importFileInputRef"
        class="imp-file-input"
        type="file"
        accept=".csv,.xlsx,.xls"
        @change="handleImportFileChange"
      />
    </div>
    <div v-if="importResult" :class="['imp-result', importResult.valid ? 'ok' : 'bad']">
      <template v-if="importResult.valid">{{ $t('n1833', [importResult.validCount]) }}</template>
      <template v-else>{{ $t('n1834', [importResult.errors.length]) }}</template>
    </div>
    <a-table
      v-if="importResult && !importResult.valid && importResult.errors.length"
      class="imp-errors"
      size="small"
      bordered
      :dataSource="importResult.errors"
      :columns="importErrorColumns"
      :pagination="false"
      :scroll="{ y: 200 }"
      :row-key="(r: any) => `${r.rowNumber}-${r.field}-${r.message}`"
    />
    <div class="imp-tip">{{ $t('n1830') }}</div>
    <div class="dlg-footer">
      <a-button @click="closeImportDialog">{{ $t('b10') }}</a-button>
      <a-button type="primary" :disabled="!canConfirmImport" :loading="importing" @click="confirmImport">
        {{ canConfirmImport ? $t('n1832', [importResult.validCount]) : $t('n1831') }}
      </a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  ifscBankNameAdminListPage,
  ifscBankNameAdminAdd,
  ifscBankNameAdminUpdate,
  ifscBankNameAdminDelete,
  ifscBankNameAdminExportTemplate,
  ifscBankNameAdminValidateImport,
  ifscBankNameAdminConfirmImport,
} from "@/api/c2cconfig.api";
import { SearchOutlined, ExclamationCircleFilled, DownloadOutlined, UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { onMounted, ref, h, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { IFSC_REG, normalizeIfsc, upperCaseInput } from "@/utils/ifsc";
const { t } = useI18n();
const { getTabH } = useTabHeight(3);
const IMPORT_MAX_SIZE = 2 * 1024 * 1024;
// 批量上传支持的文件类型及对应 MIME（部分浏览器选中 xls/xlsx 时 file.type 为空，上传前补齐）
const IMPORT_FILE_TYPES: Record<string, string> = {
  csv: "text/csv",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const query = ref<any>({
  pageNo: 1,
  pageSize: 20,
  ifsc: undefined,
  bankName: undefined,
});
const columns: any = [
  {
    title: t("e47"),
    align: "center",
    width: 60,
    // 序号：优先用服务端返回的跨分页累计序号 serialNumber，缺省时本地计算
    customRender: ({ record, index }: any) =>
      record?.serialNumber ?? (query.value.pageNo - 1) * query.value.pageSize + index + 1,
  },
  {
    title: t("m581"),
    dataIndex: "bankName",
    key: "bankName",
    align: "center",
    width: 220,
  },
  {
    title: "IFSC",
    dataIndex: "ifsc",
    key: "ifsc",
    align: "center",
    width: 140,
  },
  {
    title: t("l66"),
    dataIndex: "createBy",
    key: "createBy",
    align: "center",
    width: 120,
  },
  {
    title: t("l50"),
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 160,
  },
  {
    title: t("updateBy"),
    dataIndex: "updateBy",
    key: "updateBy",
    align: "center",
    width: 120,
  },
  {
    title: t("updateTime"),
    dataIndex: "updateTime",
    key: "updateTime",
    align: "center",
    width: 160,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed: "right",
    width: 120,
  },
];
const {
  dataSource,
  pagination,
  loading,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  api: ifscBankNameAdminListPage,
  fetchType: 2,
  resDataType: 1,
  defaultPageSize: 20,
});

/**************** 新增 / 编辑 ***************/
const addDialog = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const selectId = ref<any>(null);
const addFrom = ref<any>({
  ifsc: undefined,
  bankName: undefined,
});
// IFSC 输入自动转大写（保持光标位置）
const onIfscInput = (e: Event) => upperCaseInput(e, (v) => { addFrom.value.ifsc = v; });
const showAddDialog = () => {
  isEdit.value = false;
  selectId.value = null;
  addFrom.value = { ifsc: undefined, bankName: undefined };
  addDialog.value = true;
};
// 编辑：回填银行名称和 IFSC，两者均可改
const editDialog = (record: any) => {
  isEdit.value = true;
  selectId.value = record.id;
  addFrom.value = { ifsc: typeof record.ifsc === "string" ? record.ifsc.toUpperCase() : record.ifsc, bankName: record.bankName };
  addDialog.value = true;
};
// 表单与 isEdit 在打开弹窗时重置，关闭时不动，避免关闭动画期间标题闪成「新增」
const closeAddDialog = () => {
  addDialog.value = false;
  saving.value = false;
};
const addBtn = async () => {
  const ifsc = normalizeIfsc(addFrom.value.ifsc);
  const bankName = String(addFrom.value.bankName ?? "").trim();
  if (!bankName) {
    message.error(t("m562") + t("m581"));
    return;
  }
  if (!ifsc) {
    message.error(t("m562") + "IFSC");
    return;
  }
  if (!IFSC_REG.test(ifsc)) {
    message.error(t("n1817"));
    return;
  }
  saving.value = true;
  try {
    // 唯一校验：按 IFSC 精确查询，编辑时排除当前记录；重复则提示、不提交（后端重复码仍由拦截器兜底）
    const check: any = await ifscBankNameAdminListPage({ ifsc, pageNo: 1, pageSize: 1 });
    if (!check || check.code !== "1") return;
    const dup = (check.data || []).some(
      (r: any) => r.ifsc === ifsc && (!isEdit.value || r.id !== selectId.value)
    );
    if (dup) {
      message.error(t("n1818"));
      return;
    }
    const res: any = isEdit.value
      ? await ifscBankNameAdminUpdate({ id: selectId.value, bankName, ifsc })
      : await ifscBankNameAdminAdd({ ifsc, bankName });
    if (res && res.code === "1") {
      message.success(isEdit.value ? t("s7") : t("s8"));
      closeAddDialog();
      // 新增成功回到第一页（列表按添加时间倒序，新记录在最前）；编辑停留在当前页
      getList(isEdit.value ? null : 1);
    }
  } finally {
    saving.value = false;
  }
};

/**************** 删除（二次确认 + 勾选核对） ***************/
const deleteDialog = ref(false);
const deleteChecked = ref(false);
const deleting = ref(false);
const deleteRow = ref<any>({});
const showDeleteDialog = (record: any) => {
  deleteRow.value = record;
  deleteChecked.value = false;
  deleteDialog.value = true;
};
const closeDeleteDialog = () => {
  deleteDialog.value = false;
  deleting.value = false;
};
const confirmDelete = async () => {
  if (!deleteChecked.value) return;
  deleting.value = true;
  const res: any = await ifscBankNameAdminDelete({ id: deleteRow.value.id }).finally(() => (deleting.value = false));
  if (res && res.code === "1") {
    message.success(t("s9"));
    closeDeleteDialog();
    // 删除的是当前页最后一条且不在第一页时，回退一页
    if (dataSource.value.length === 1 && query.value.pageNo > 1) {
      query.value.pageNo -= 1;
    }
    getList();
  }
};

/**************** 批量上传：下载模板 → 上传预校验 → 确认导入 ***************/
const importDialog = ref(false);
const importFileInputRef = ref<HTMLInputElement | null>(null);
const importFile = ref<File | null>(null);
const importValidating = ref(false);
const importing = ref(false);
const templateDownloading = ref(false);
// { valid, validCount, validationToken, errors: [{ rowNumber, field, value, message }] }
const importResult = ref<any>(null);
const canConfirmImport = computed(
  () => !!(importResult.value?.valid && importResult.value?.validationToken) && !importValidating.value
);
const importErrorColumns: any = [
  { title: t("sellOutImportRowNo"), dataIndex: "rowNumber", key: "rowNumber", width: 80, align: "center" },
  { title: t("n1837"), dataIndex: "field", key: "field", width: 120, align: "center" },
  { title: t("n1838"), dataIndex: "value", key: "value", ellipsis: true },
  { title: t("n862"), dataIndex: "message", key: "message", ellipsis: true },
];
const showImportDialog = () => {
  importFile.value = null;
  importResult.value = null;
  importDialog.value = true;
};
// 取消 / 关闭 / Esc：不调用导入接口
const closeImportDialog = () => {
  importDialog.value = false;
  importValidating.value = false;
  importing.value = false;
};
const openImportFilePicker = () => {
  if (importValidating.value || !importFileInputRef.value) return;
  importFileInputRef.value.value = "";
  importFileInputRef.value.click();
};
const tryParseBlobJson = async (blob: Blob) => {
  const type = blob.type || "";
  if (!type.includes("application/json")) return null;
  try {
    return JSON.parse(await blob.text());
  } catch (_err) {
    return null;
  }
};
const downloadTemplate = async () => {
  templateDownloading.value = true;
  try {
    const res: any = await ifscBankNameAdminExportTemplate();
    if (!(res instanceof Blob)) {
      message.warning(res?.msg || t("sellOutDownloadTemplateFailed"));
      return;
    }
    // 后端出错时可能以 JSON 形式返回在 blob 里
    const jsonRes = await tryParseBlobJson(res);
    if (jsonRes) {
      message.warning(jsonRes.msg || t("sellOutDownloadTemplateFailed"));
      return;
    }
    if (!res.size) {
      message.warning(t("sellOutDownloadTemplateFailed"));
      return;
    }
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(res);
    link.href = url;
    link.download = "ifsc_import_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    message.success(t("sellOutDownloadTemplateSuccess"));
  } catch (error: any) {
    message.error(error?.message || t("sellOutDownloadTemplateFailed"));
  } finally {
    templateDownloading.value = false;
  }
};
// 选择文件后立即上传预校验
const handleImportFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  target.value = "";
  if (!file) return;
  const suffix = file.name.split(".").pop()?.toLowerCase() || "";
  if (!IMPORT_FILE_TYPES[suffix]) {
    message.warning(t("n704", { n: Object.keys(IMPORT_FILE_TYPES).join("/") }));
    return;
  }
  if (file.size > IMPORT_MAX_SIZE) {
    message.warning(t("n1836"));
    return;
  }
  importFile.value = file;
  importResult.value = null;
  const uploadFile = new File([file], file.name, {
    type: file.type || IMPORT_FILE_TYPES[suffix],
    lastModified: file.lastModified,
  });
  const formData = new FormData();
  formData.append("file", uploadFile, uploadFile.name);
  importValidating.value = true;
  try {
    const res: any = await ifscBankNameAdminValidateImport(formData);
    if (res && res.code === "1" && res.data) {
      importResult.value = { ...res.data, errors: res.data.errors || [] };
    } else {
      // 非成功码由拦截器提示
      importFile.value = null;
    }
  } catch (error: any) {
    importFile.value = null;
    message.error(error?.message || t("sellOutImportTemplateFailed"));
  } finally {
    importValidating.value = false;
  }
};
const confirmImport = async () => {
  if (!canConfirmImport.value) return;
  importing.value = true;
  try {
    const res: any = await ifscBankNameAdminConfirmImport({ validationToken: importResult.value.validationToken });
    if (res && res.code === "1") {
      message.success(t("n1835", [res.data?.addedCount ?? importResult.value.validCount]));
      closeImportDialog();
      getList(1);
    } else {
      // 令牌失效或已有数据变化：要求重新上传校验
      importFile.value = null;
      importResult.value = null;
    }
  } catch (error: any) {
    message.error(error?.message || t("sellOutImportTemplateFailed"));
  } finally {
    importing.value = false;
  }
};

onMounted(() => {
  getList();
  getTabH.value = useTabHeight(3).getTabH.value;
});
</script>

<style lang="less" scoped>
.upper {
  text-transform: uppercase;
}
.del-body {
  padding: 8px 0 4px;
}
.del-icon {
  font-size: 28px;
  color: #faad14;
  margin-bottom: 12px;
}
.del-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.del-desc {
  color: #888;
  margin-bottom: 12px;
}
.del-record {
  background: #f5f6f8;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 14px;
  font-size: 14px;
  word-break: break-all;
  .del-sep {
    margin: 0 14px;
    color: #bbb;
  }
}
.dlg-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
.imp-steps {
  background: #eef4ff;
  border: 1px solid #d6e4ff;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 14px;
  .imp-steps-title {
    font-weight: 600;
    margin-bottom: 4px;
  }
  .imp-steps-desc {
    color: #666;
    font-size: 12px;
  }
}
.imp-drop {
  margin-top: 14px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 18px 16px;
  text-align: center;
  .imp-drop-title {
    font-weight: 600;
    margin-bottom: 4px;
  }
  .imp-drop-desc {
    color: #888;
    font-size: 12px;
    margin-bottom: 12px;
  }
  .imp-drop-file {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .imp-file-name {
    color: #666;
    word-break: break-all;
  }
  .imp-file-input {
    display: none;
  }
}
.imp-result {
  margin-top: 12px;
  font-weight: 600;
  &.ok {
    color: #52c41a;
  }
  &.bad {
    color: #ff4d4f;
  }
}
.imp-errors {
  margin-top: 8px;
}
.imp-tip {
  margin-top: 10px;
  color: #888;
  font-size: 12px;
}
</style>
