import { defineComponent, reactive, ref } from "vue";
import { Button, Card, Form, InputNumber, message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { useRequest } from "vue-request";
import {
  earlyWarningConfigAdminDetail,
  earlyWarningConfigAdminUpdate,
} from "@/api/c2cconfig.api";
export default defineComponent({
  name: "alertParams",
  components: {
    Card,
    Form,
  },
  setup() {
    const { t } = useI18n();
    const useForm = Form.useForm;
    const tabList = ref<any[]>([
      {
        key: "recharge",
        tab: t("m457"),
      },
    ]);
    const model = reactive({
      warningBalance: 0,
      warningConfirmOvertimeNotOperated: 0,
      id: 1,
    });
    const rules = reactive({
      warningBalance: [{ required: true, message: t("m458") }],
      warningConfirmOvertimeNotOperated: [
        { required: true, message: t("m459") },
      ],
    });
    const { validate, validateInfos } = useForm(model, rules, {});
    const { run: getConfig } = useRequest(
      () => earlyWarningConfigAdminDetail({ id: 1 }),
      {
        onSuccess(res: any) {
          if (res && res.code === "1") {
            model.warningBalance = res.data?.warningBalance || 0;
            model.warningConfirmOvertimeNotOperated =
              res.data?.warningConfirmOvertimeNotOperated || 0;
          }
        },
      }
    );

    const { run } = useRequest(
      () => earlyWarningConfigAdminUpdate({ ...model }),
      {
        manual: true,
        onSuccess(res: any) {
          if (res && res.code === "1") {
            message.success(t("s1"));
            getConfig();
          }
        },
      }
    );
    const onClick = async () => {
      await validate();
      run();
    };
    return () => (
      <>
        <Card
          class="!w-full !h-full !shadow-none"
          tabList={tabList.value}
          bordered={false}
          hoverable={false}
        >
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            name="basic"
          >
            <div class="config_card_content">
              <Form.Item label={t("m460")} {...validateInfos.warningBalance}>
                <InputNumber
                  class="w-240"
                  v-model:value={model.warningBalance}
                  v-slots={{
                    addonAfter: () => <>{t("m462")}</>,
                  }}
                />
              </Form.Item>
              <div class="mb-16 text-blue-500">{t("m464")}</div>
              <Form.Item
                label={t("m461")}
                {...validateInfos.warningConfirmOvertimeNotOperated}
              >
                <InputNumber
                  class="w-240"
                  v-model:value={model.warningConfirmOvertimeNotOperated}
                  v-slots={{
                    addonAfter: () => <>{t("minute")}</>,
                  }}
                />
              </Form.Item>
              <div class="mb-16 text-blue-500">{t("m465")}</div>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  onClick={onClick}
                  type="primary"
                  v-permission="admin:tradeConfigAdmin:updateWarningConfig"
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </>
    );
  },
});
