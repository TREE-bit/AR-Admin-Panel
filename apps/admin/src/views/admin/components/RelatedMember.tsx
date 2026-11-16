import { defineComponent, reactive, ref } from "vue";
import { Button, Col, Input, Row, Switch, Table, Tag } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { TableColumnsType, TableProps } from "ant-design-vue";
import { usePagination, useRequest } from "vue-request";
import { relationMemberList } from "@/api/log.api";
import router from "@/router";
import { groupListApi } from "@/api/menber";
export default defineComponent({
  name: "RelatedMember",
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
    const TypeText = ["", t("n180"), t("n181"), t("n96")];
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
      memberId: undefined,
      merchantName: undefined,
      externalMemberId: undefined,
      memberAccount: undefined,
    });
    const { data: groupList } = useRequest(
      () =>
        groupListApi({
          pageNo: 1,
          pageSize: 10000,
        }),
      {
        onSuccess(res: any) {
          if (res?.code == 1) {
            run();
          }
        },
      }
    );
    const { data, run, loading } = usePagination(
      () =>
        relationMemberList({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          relationsIp: props.ip,
          ...query.value,
        }),
      {
        manual:true,
        onSuccess(res) {
          pagination.total = res?.total || 0;
        },
      }
    );
    const inputArr = reactive([
      {
        placeholder: t("p4"),
        name: "memberId",
      },
      {
        placeholder: t("p13"),
        name: "merchantName",
      },
      {
        placeholder: t("pl2"),
        name: "externalMemberId",
      },
      {
        placeholder: t("p12"),
        name: "memberAccount",
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
          return (
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
        title: t("c10"),
        dataIndex: "memberAccount",
        key: "memberAccount",
        align: "center",
      },
      {
        title: t("memberListC4"),
        dataIndex: "memberGroup",
        key: "memberGroup",
        align: "center",
        customRender({ text }) {
          const groupitem = groupList.value?.data?.find(item=>item.id===text)
          return groupitem?.name || "-";
        },
      },
      {
        title: t("memberListC10"),
        dataIndex: "memberType",
        key: "memberType",
        align: "center",
        customRender({ text }) {
          return TypeText[text] || "-";
        },
      },
      {
        title: t("memberListC11"),
        dataIndex: "realName",
        key: "realName",
        align: "center",
        customRender({ text }) {
          return text || "-";
        },
      },
      {
        title: t("state"),
        dataIndex: "status",
        key: "status",
        align: "center",
        customRender({ text }) {
          return (
            <Tag color={text === "0" ? "red" : "green"}>
              {text === "0" ? t("disabled") : t("enabled")}
            </Tag>
          );
        },
      },
      {
        title: t("memberListC15"),
        dataIndex: "buyStatus",
        key: "buyStatus",
        align: "center",
        customRender({ text }) {
          return (
            <Switch
              checkedValue="1"
              unCheckedValue="0"
              disabled
              checked={text}
            />
          );
        },
      },
      {
        title: t("memberListC16"),
        dataIndex: "sellStatus",
        key: "sellStatus",
        align: "center",
        customRender({ text }) {
          return (
            <Switch
              checkedValue="1"
              unCheckedValue="0"
              disabled
              checked={text}
            />
          );
        },
      },
    ];

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
        memberId: undefined,
        merchantName: undefined,
        externalMemberId: undefined,
        memberAccount: undefined,
      };
      run();
    };

    return () => (
      <>
        <div class="mb-16">
          <Row>
            {inputArr.map((item) => (
              <Col span={5}>
                <Input
                  class={"w-full"}
                  v-model:value={query.value[item.name]}
                  {...item}
                ></Input>
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
