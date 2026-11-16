// TsxTest.tsx
import { defineComponent } from "vue";
import { Table } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { TableColumnsType, TableProps } from "ant-design-vue";
import { taskEventMap,taskTypeMap, taskCycleMap } from '@/utils/publicData';
export default defineComponent({
  name: "taskTable",
  emits: ["changePagination"],
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    pagination: {
      type: Object,
      default: () => ({}),
    },
    query: { type: Object, default: () => ({}) },
    loading: {
      type: Boolean,
    },
  },
  components: {
    Table,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const typeList = {
      1: t("m370"),
      2: t("m371"),
      3: t("m372"),
      4: t("m373"),
    };

    const cycleList = {
      "1": t("m361"),
      "2": t("m362"),
      "3": t("n790"),
    };
    const columns: TableColumnsType = [
      {
        title: t("c9"),
        dataIndex: "memberId",
        key: "memberId",
        align: "center",
        width: 180,
      },
      {
        title: t("l92"),
        dataIndex: "merchantName",
        key: "merchantName",
        width: 140,
        align: "center",
        customRender({ text }) {
          return text|| "-";
        },
      },
      {
        title: t("n47"),
        dataIndex: "orderNo",
        key: "orderNo",
        align: "center",
        width: 220,
      },
      {
        title: t("taskName"),
        dataIndex: "taskName",
        key: "taskName",
        width: 180,
        align: "center",
      },
      {
        title: t("n678"),
        dataIndex: "exclusiveFlag",
        key: "exclusiveFlag",
        width: 120,
        align: "center",
        customRender({ text, record, index, column }) {
          return text == 1 ? t("yes") : t("no");
        },
      },
      {
        title: t("n679"),
        dataIndex: "eventFlag",
        key: "eventFlag",
        width: 140,
        align: "center",
        customRender({ text, record, index, column }) {
          return text ? t(taskEventMap[text].name) : "-";
        },
      },
      {
        title: t("taskType"),
        dataIndex: "taskType",
        key: "taskType",
        width: 120,
        align: "center",
        customRender({ text, record, index, column }) {
          return taskTypeMap[text] || "-";
        },
      },
      {
        title: t("taskCycle"),
        dataIndex: "taskCycle",
        key: "taskCycle",
        align: "center",
        width: 140,
        customRender({ text }) {
          return text ? taskCycleMap[text] : "-";
        },
      },
      {
        title: `${t("reportColumns6")}/ARB`,
        dataIndex: "rewardAmount",
        key: "rewardAmount",
        width: 120,
        align: "center",
      },
      {
        title: t("l39"),
        dataIndex: "completionTime",
        key: "completionTime",
        align: "center",
        width: 170,
        customRender({ text }) {
          return text|| "-";
        },
      },
      {
        title: t("collectionTime"),
        dataIndex: "createTime",
        key: "createTime",
        align: "center",
        width: 170,
        customRender({ text }) {
          return text|| "-";
        },
      },
    ];

    const handleTableChange: TableProps["onChange"] = (pag: {
      pageSize: number;
      current: number;
    }) => {
      emit("changePagination", pag);
    };

    return () => (
      <>
        <Table
          dataSource={props?.data?.data}
          columns={columns}
          pagination={props.pagination}
          loading={props.loading}
          scroll={{ x: "100%" , y : '580px' }}
          onChange={handleTableChange}
          bordered
          row-key={(record: any) => JSON.stringify(record)}
          v-slots={{
            summary: () => {
              return (
                <> 
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={8} align="left">
                      {t("m54")}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      {props.data.extend?.pageRewardAmount || 0}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2} />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={8} align="left">
                      {t("m55")}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      {props.data.extend?.totalRewardAmount || 0}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2} />
                  </Table.Summary.Row>
                </>
              );
            },
          }}
        ></Table>
      </>
    );
  },
});
