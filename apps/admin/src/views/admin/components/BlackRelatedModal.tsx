import { defineComponent, ref } from "vue";
import { Modal, Menu, Button } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { useVModel } from "@vueuse/core";
import RelatedOrder from "@/views/admin/components/RelatedOrder";
import RelatedMember from "@/views/admin/components/RelatedMember";
export default defineComponent({
  name: "BlackRelatedModal",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
    },
    ip: {
      type: String,
    },
  },
  components: {
    Modal,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const isDrawerOpen = useVModel(props, "modelValue", emit);
    const current = ref<string[]>(["member"]);
    const items = [
      {
        key: "member",
        label: t("m470"),
      },
      {
        key: "order",
        label: t("m471"),
      },
    ];
    return () => (
      <>
        <Modal
          v-model:open={isDrawerOpen.value}
          wrapClassName="full-modal"
          width="100%"
          v-slots={{
            footer: () => (
              <div class="w-full flex justify-center">
                <Button class={" text-center"} type="primary" size="large" onClick={()=>{
                  isDrawerOpen.value=false
                }}>
                  {t("l54")}
                </Button>
              </div>
            ),
          }}
          destroyOnClose
        >
          <Menu
            mode="horizontal"
            items={items}
            v-model:selectedKeys={current.value}
          ></Menu>
          <div class="pt-16">
            {current.value[0] === "member" ? (
              <RelatedMember ip={props.ip} />
            ) : (
              <RelatedOrder ip={props.ip} />
            )}
          </div>
        </Modal>
      </>
    );
  },
});
