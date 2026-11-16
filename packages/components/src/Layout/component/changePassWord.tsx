import { computed, defineComponent, reactive, ref } from "vue";
import { Alert, Form, Input, InputPassword, Modal, message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { updateCurrentUserPwd } from "../../../../../apps/admin/src/api/user.api";
import { userPwdReg } from "../../../../../apps/admin/src/utils/publicData";
import { getWeakPasswordError } from "../../../../../apps/admin/src/utils/weakPassword";
import PasswordRuleTips from "../../../../../apps/admin/src/components/PasswordRuleTips.vue";
import { useRouter } from "vue-router";
import { Rule } from "ant-design-vue/es/form";
export default defineComponent({
  name: "changePassWord",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
    },
    // 登录返回弱密码时打开，顶部展示改密引导提示
    weak: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Modal,
    Form,
    InputPassword,
    Input,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const useForm = Form.useForm;
    const router = useRouter();
    const username = JSON.parse(localStorage.getItem("userInfo") || "{}")?.username || "";
    const modelRef = reactive({
      newPwd: "",
      confirmNewPwd: "",
      pwdTips: "",
      id: JSON.parse(localStorage.getItem("userInfo") || "{}")?.userId,
    });
    const confirmLoading = ref<boolean>(false);
    const rulesRef = reactive({
      newPwd: [
        { required: true, message: t("t13") },
        {
          validator: async (_rule: Rule, value: string) => {
            const weakError = getWeakPasswordError(value, username);
            return weakError ? Promise.reject(weakError) : Promise.resolve();
          },
          trigger: "change",
        },
      ],
      confirmNewPwd: [
        {
          validator: async (_rule: Rule, value: string) => {
            if (!value) {
              return Promise.reject(t("t14"));
            } else if (value !== modelRef.newPwd) {
              return Promise.reject(t("userRule6"));
            } else {
              return Promise.resolve();
            }
          },
          trigger: "change",
        },
      ],
      pwdTips: [],
    });
    const { resetFields, validate, validateInfos } = useForm(
      modelRef,
      rulesRef,
      {}
    );
    const isOpen = computed({
      get() {
        return props.modelValue || false;
      },
      set(v) {
        emit("update:modelValue", v);
      },
    });

    const onSubmit = async () => {
      try {
        await validate();
        confirmLoading.value = true;
        if(!userPwdReg.test(modelRef.newPwd)){
          message.error(t('m562')+t('m932'));
          return;
        }
        const res: any = await updateCurrentUserPwd(modelRef);
        if (res && res.code === "1") {
          message.success(t("s7"));
          resetFields();
          localStorage.removeItem("token");
          router.replace("/login");
          return Promise.resolve();
        }
      } catch (error) {
      } finally {
        confirmLoading.value = false;
      }
    };
    return () => (
      <>
        <Modal
          v-model={[isOpen.value, "open"]}
          closable
          destroyOnClose
          title={t("userResetPwd")}
          maskClosable={!props.weak}
          onOk={onSubmit}
          afterClose={resetFields}
          ok-text={t("b28")}
          cancel-text={t("b10")}
          confirmLoading={confirmLoading.value}
        >
          <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            labelAlign="right"
            style={{ marginTop: "16px" }}
          >
            {props.weak && (
              <Alert type="warning" showIcon message={t("n2014")} style={{ marginBottom: "16px" }} />
            )}
            <Form.Item label={t("userNewPwd")} {...validateInfos.newPwd}>
              <InputPassword
                placeholder={t("userRule3")}
                v-model={[modelRef.newPwd, "value"]}
              />
              <PasswordRuleTips password={modelRef.newPwd} username={username} />
            </Form.Item>
            <Form.Item
              label={t("userCPwd")}
              {...validateInfos.confirmNewPwd}
              required
            >
              <InputPassword
                placeholder={t("t14")}
                v-model={[modelRef.confirmNewPwd, "value"]}
              />
            </Form.Item>
            <Form.Item label={t("l64")} {...validateInfos.pwdTips}>
              <Input
                placeholder={t("t15")}
                v-model={[modelRef.pwdTips, "value"]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  },
});
