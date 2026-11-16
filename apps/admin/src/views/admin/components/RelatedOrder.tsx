import { defineComponent, reactive, ref } from "vue";
import { Button, Col, Input, Row, Select, Table, Tag } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { TableColumnsType, TableProps } from "ant-design-vue";
import { usePagination } from "vue-request";
import { relationOrderList } from "@/api/log.api";
import router from "@/router";
export default defineComponent({
  name: "RelatedOrder",
  props: {
    ip: {
      type: String,
    },
  },
  components: {
    Table,
  },
  setup(props) {
    const { t } = useI18n();
    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total: any) => t("total", [total]),
    });
    const query = ref({
      asc: false,
      column: "",
      idSet: undefined,
      orderSet: undefined,
      orderStatus: undefined,
    });
    const orderStatusMap = {
      3: "n85",
      4: "n86",
      5: "n87",
      6: "n88",
      7: "n82",
      8: "n56",
      10: "n90",
      11: "n91",
      13: "n92",
      15: "n107",
    };
    const inputArr = reactive([
      {
        placeholder: `${t("pleaseEnter")}${t("c9")}/${t("l92")}/${t("l92")}`,
        name: "idSet",
      },
      {
        placeholder: `${t("pleaseEnter")}${t("n41")}/${t("p37")}/${t("m472")}`,
        name: "orderSet",
      },
      {
        placeholder: t("p27"),
        name: "orderStatus",
        options: Object.entries(orderStatusMap).map(([key, value]:[any,any]) => ({
          value: key,
          label: t(value),
        })),
      },
    ]);
    const columns: TableColumnsType = [
      {
        title: t("e47"),
        dataIndex: "index",
        key: "index",
        align: "center",
        width: 50,
        customRender: ({ index }) => `${index + 1}`,
      },
      {
        title: t("c9"),
        dataIndex: "id",
        key: "id",
        align: "center",
        customRender({ text }) {
          return text ? (
            <Button
              type="link"
              onClick={() => {
                router.push({
                  path: "/member/list",
                  query: {
                    memberId: text,
                  },
                });
              }}
            >
              {text}
            </Button>
          ) : (
            "-"
          );
        },
      },
      {
        title: t("l92"),
        dataIndex: "merchantName",
        key: "merchantName",
        align: "center",
        customRender({ text }) {
          return text || "-";
        },
      },
      {
        title: t("m207"),
        dataIndex: "memberId",
        key: "memberId",
        align: "center",
        customRender({ text }) {
          return text || "-";
        },
      },
      {
        title: t("n41"),
        dataIndex: "buyOrderNo",
        key: "buyOrderNo",
        align: "center",
        customRender({ text }) {
          return text ? (
            <Button
              type="link"
              onClick={() => {
                router.push({
                  path: "/order/buyOrder/index",
                  query: {
                    platformOrder: text,
                  },
                });
              }}
            >
              {text}
            </Button>
          ) : (
            "-"
          );
        },
      },
      {
        title: t("p37"),
        dataIndex: "matchOrder",
        key: "matchOrder",
        align: "center",
        customRender({ text }) {
          return text ? (
            <Button
              type="link"
              onClick={() => {
                router.push({
                  path: "/order/matchingPool/index",
                  query: {
                    id: text,
                  },
                });
              }}
            >
              {text}
            </Button>
          ) : (
            "-"
          );
        },
      },
      {
        title: t("m472"),
        dataIndex: "sellOrderNo",
        key: "sellOrderNo",
        align: "center",
        customRender({ text }) {
          return text ? (
            <Button
              type="link"
              onClick={() => {
                router.push({
                  path: "/order/sale/index",
                  query: {
                    platformOrder: text,
                  },
                });
              }}
            >
              {text}
            </Button>
          ) : (
            "-"
          );
        },
      },
      {
        title: t("n42"),
        dataIndex: "amount",
        key: "amount",
        align: "center",
        customRender({ text }) {
          return text || "-";
        },
      },
      {
        title: t("n43"),
        dataIndex: "actualAmount",
        key: "actualAmount",
        align: "center",
        customRender({ text }) {
          return text || "-";
        },
      },
      {
        title: t("n51"),
        dataIndex: "orderStatus",
        key: "orderStatus",
        align: "center",
        customRender({ text }) {
          return <Tag>{t(orderStatusMap[text] || "")}</Tag>;
        },
      },
      {
        title: t("l50"),
        dataIndex: "createTime",
        key: "createTime",
        align: "center",
        customRender({ text }) {
          return text;
        },
      },
    ];
    const { data, run, loading } = usePagination(
      () =>
        relationOrderList({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          relationsIp: props.ip,
          ...query.value,
        }),
      {
        onSuccess(res) {
          pagination.total = res?.total || 0;
        },
      }
    );
    const handleTableChange: TableProps["onChange"] = (pag: {
      pageSize: number;
      current: number;
    }) => {
      pagination.current = pag.current;
      pagination.pageSize = pag.pageSize;
      run();
    };
    const onClick = () => {
      pagination.current = 1;
      pagination.pageSize = 10;
      run();
    };
    const onReset = () => {
      pagination.current = 1;
      pagination.pageSize = 10;
      query.value = {
        asc: false,
        column: "",
        idSet: undefined,
        orderSet: undefined,
        orderStatus: undefined,
      };
      run();
    };

    return () => (
      <>
        <div class="mb-16">
          <Row>
            {inputArr.map((item) => (
              <Col span={6}>
                {item.options ? (
                  <Select
                    class={"w-full"}
                    v-model:value={query.value[item.name]}
                    allowClear
                    {...item}
                  />
                ) : (
                  <Input
                    class={"w-full"}
                    v-model:value={query.value[item.name]}
                    {...item}
                  />
                )}
              </Col>
            ))}
            <Col>
              <Button type="primary" onClick={onClick} class={"mr-10"}>
                {t("search")}
              </Button>
              <Button type="primary" onClick={onReset}>
                {t("reset")}
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          dataSource={data?.value?.data}
          columns={columns}
          pagination={pagination}
          loading={loading.value}
          scroll={{ x: "100%" }}
          onChange={handleTableChange}
          bordered
          row-key={(record: any) => JSON.stringify(record)}
        ></Table>
      </>
    );
  },
});
