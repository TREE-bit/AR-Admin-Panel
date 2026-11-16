<template>
  <div class="search">
    <h2>{{ $getMenuName() }}</h2>
    <!-- @click="mySearch()" -->
    <div class="statusDataBox">
      <a-tag color="#108ee9" class="pointer">
        {{ $t('n1051') }}：{{ statusData.inProgressCount || 0 }}
      </a-tag>
      <!-- <span v-if="statusData.list.length">
        <a-tag v-for="(item,index) in statusData.list" :key="index" 
        :color="ticketStatusColorMap[item.currentProcessStatus]" 
        class="pointer" @click="statusSearch(item.currentProcessStatus)">
          {{ ticketStatusMap[item.currentProcessStatus] }}：{{ item.count || 0 }}
        </a-tag>
      </span> -->
    </div>
    <a-row>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.workOrderNo"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562') + $t('n988')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allowClear
          v-model:value="query.relatedOrderNo"
          class="searchstyle"
          :min="0"
          :placeholder="$t('m562') + $t('n990')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.memberId"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562') + $t('c9')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.registerPhoneNumber"
          allow-clear
          class="searchstyle"
          :placeholder="$t('m562') + $t('m878')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          allowClear
          v-model:value="query.currentHandler"
          class="searchstyle"
          :min="0"
          :placeholder="$t('m562') + $t('n991')"
        />
      </a-col>
      <a-col :span="3">
        <a-input v-trim
          v-model:value="query.workOrderName"
          allowClear
          class="searchstyle"
          :min="0"
          :placeholder="$t('m562') + $t('n955')"
        />
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.loginLimit"
          :placeholder="$t('m563') + $t('n958')"
          class="searchstyle"
        >
          <a-select-option :value="0">{{ $t('n959') }}</a-select-option>
          <a-select-option :value="1">{{ $t('m704') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.currentProcessStatus"
          :placeholder="$t('m563') + $t('n992')"
          class="searchstyle"
        >
          <a-select-option v-for="(item, key) in ticketStatusMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.currentBusinessStatus"
          :placeholder="$t('m563') + $t('n1023')"
          class="searchstyle"
        >
          <a-select-option v-for="(item, key) in currentBusinessStatusMap" :value="key">{{
            item
          }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          v-model:value="query.appealHistory"
          :placeholder="$t('m563') + $t('n993')"
          class="searchstyle"
        >
          <a-select-option  :value="2">{{ $t('s17') }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-select
          allowClear
          show-search
          v-model:value="query.merchantCode"
          :placeholder="$t('m563') + $t('l92')"
          class="searchstyle"
        >
          <a-select-option
            v-for="item in merchantList"
            :key="item.value"
            :value="item.value"
            >{{ item.username }}</a-select-option
          >
        </a-select>
      </a-col>

      <a-col>
        <timeRange v-model:startTime="query.startTime" v-model:endTime="query.endTime" :title="$t('n106')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.lastSubmitTimeStart" v-model:endTime="query.lastSubmitTimeEnd" :title="$t('n1172')" :type="1"/>
      </a-col>
      <a-col>
        <timeRange v-model:startTime="query.startTime1" v-model:endTime="query.endTime1" :title="$t('n989')" :type="1"/>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          :icon="h(SearchOutlined)"
          @click="search()"
          :loading="loading"
          >{{ $t("search") }}</a-button
        >
        <a-button type="primary" @click="resetQuery" :loading="loading">{{
          $t("reset")
        }}</a-button>
        <a-button 
          type="primary" :disabled="ticketTransIds.length == 0 || !isInPreUser"
          @click="showTicketTransBatch()"
          v-permission="'admin:workOrderRecord:batchTransferWorkOrders'"
        >{{ $t('n1095') }}</a-button>
        <a-button 
          type="primary" class="green-btn" :disabled="ticketLockIds.length == 0 || !isInPreUser"
          @click="batchLockTickets()"
          v-permission="'admin:workOrderRecord:batchLockWorkOrders'"
        >{{ $t('n1214') }}</a-button>
        <ExportButton
            :query="query"
            :api="workOrderRecordExport"
            permission="admin:workOrderRecord:export"
          />
      </a-col>
    </a-row>
  </div>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: '100%' , y : getTabH+'px'}"
    @change="handleTableChange"
    bordered
    :row-selection="{
      selectedRowKeys: selectRows,
      onChange: onSelectChange,
      getCheckboxProps: (record) => {
        const canSelect =
          (
            [1].includes(record.currentProcessStatus) &&
            !record.nextNodeOperatorId &&
            isInPreUser
          ) ||
          (
            [2, 3, 4].includes(record.currentProcessStatus) &&
            record.nextNodeOperatorId == loginUserId &&
            isInPreUser
          );

        return {
          disabled: !canSelect
        };
      }
    }"
    :row-key="(record: any) => JSON.stringify(record)">
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'workOrderName'">
        <a-tooltip v-if="record.workOrderName">
          <template #title>{{ record.workOrderName }}</template>
          <div class="toopTipStyle">
              {{ record.workOrderName }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'currentProcessStatus'">
        <a-tag :color="ticketStatusColorMap[record.currentProcessStatus]">
          {{ ticketStatusMap[record.currentProcessStatus] || '-' }}
        </a-tag>
      </template>
      <template v-if="column.key === 'currentBusinessStatus'">
        {{ $getMapItem(currentBusinessStatusMap,record.currentBusinessStatus) || '-' }}
      </template>
      <template v-if="column.key === 'appealHistory'">
        {{ $getMapItem(appealHistoryMap,record.appealHistory) || '-' }}
      </template>
      <template v-if="column.key === 'merchantName'">
        <a-tooltip v-if="record.merchantName">
          <template #title>{{ record.merchantName }}</template>
          <div class="toopTipStyle">
              {{ record.merchantName }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'internalCompletionRemark'">
        <a-tooltip v-if="record.internalCompletionRemark">
          <template #title>{{ record.internalCompletionRemark }}</template>
          <div class="toopTipStyle">
              {{ record.internalCompletionRemark }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'relatedOrderNo'">
        <a-tooltip v-if="record.relatedOrderNo">
          <template #title>{{ record.relatedOrderNo }}</template>
          <div class="toopTipStyle">
              {{ record.relatedOrderNo }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'processingDuration'">
        {{ record.processingDuration || '-' }}
      </template>
      <template v-if="column.key === 'internalRejectReason'">
        <a-tooltip v-if="record.internalRejectReason">
          <template #title>{{ record.internalRejectReason }}</template>
          <div class="toopTipStyle">
              {{ record.internalRejectReason }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'workOrderTypeName'">
        <a-tooltip v-if="record.workOrderTypeName">
          <template #title>{{ record.workOrderTypeName }}</template>
          <div class="toopTipStyle">
              {{ record.workOrderTypeName }}
          </div>
        </a-tooltip>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'loginLimit'">
        {{ record.loginLimit == 1 ? $t('m704') :record.loginLimit == 0? $t('n959') : '-' }}
      </template>
      <template v-if="column.key === 'currentHandler'">
        {{ record.currentHandler || '-' }}
      </template>
      <template v-if="column.key === 'submitTime'">
        {{ record.submitTime || '-' }}
      </template>
      <template v-if="column.key === 'lastOperationTime'">
        {{ record.lastOperationTime || '-' }}
      </template>
      <template v-if="column.key === 'action'">
        <!-- 锁定 -->
        <!-- ([1].includes(record.currentProcessStatus) && getUserPre) ||  -->
        <a-popconfirm
          :title="$t('n994')"
          :ok-text="$t('b28')"
          :cancel-text="$t('b10')"
          @confirm="ticketTrans(record,2)"
          :ok-button-props="{ loading: loading }"
        >
          <a-tag
            color="#52c41a"
            style="cursor: pointer"
            size="small"
            v-if="([1].includes(record.currentProcessStatus) && !record.nextNodeOperatorId && isInPreUser)"
            v-permission="'admin:workOrderRecord:transitionWorkOrder1'"
            >{{ $t("n995") }}
          </a-tag>
        </a-popconfirm>
        <!-- 转移 -->
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showTicketTrans(record,5)"
          v-if="([2,3,4].includes(record.currentProcessStatus) && record.nextNodeOperatorId == loginUserId && isInPreUser)"
          v-permission="'admin:workOrderRecord:transitionWorkOrder2'"
          >{{ $t("n996") }}
        </a-tag>
        <!-- 查看/处理工单 -->
        <a-tag
          color="rgba(22, 155, 213, 1)"
          style="cursor: pointer"
          size="small"
          @click="showCheckTicket(record)"
          >{{ $t("b24") }}
        </a-tag>
      </template>
    </template>
    <!-- <template #summary>
      <SummaryBottom 
        :summaryRows="summaryRows"
        :dynamicColumns="columns"
        :firstColumnLabel="'phoneNumber'"
        />
    </template> -->
  </a-table>
  <!-- 工单转移 -->
  <a-modal
    v-model:open="ticketTransModalVisible"
    :width="ticketTransForm.currentBusinessStatus == 5 ? 400:800"
    :destroyOnClose="true"
    :footer="null"
    centered
    @cancel="cancelTicketModal"
  >
    <template #title>
      <div class="ticketTransModal" v-if="ticketTransForm.currentBusinessStatus == 5">{{ $t('n996') }}</div>
      <div class="ticketTransModal" v-if="ticketTransForm.currentBusinessStatus == 3">{{ $t('n998') }}</div>  
      <div class="ticketTransModal" v-if="ticketTransForm.currentBusinessStatus == 6">{{ $t('n999') }}</div>  
    </template>
    <div v-if="ticketTransForm.currentBusinessStatus == 5">
      <label for="ticketTransForm_transferOrderReceiver">{{ $t('n1000') }}：</label>
      <a-select
        v-model:value="ticketTransForm.transferOrderReceiver"
        show-search
        id="ticketTransForm_transferOrderReceiver"
        style="width: 260px;"
        :placeholder="$t('m563')+$t('n1000')"
        >
        <a-select-option
          v-for="item in userList"
          :key="item.value"
          :value="item.label"
          :plasholder="$t('n984')"
          >
            <div @click="ticketTransForm.transferOrderReceiverId = item.id">
              {{ item.label }}
            </div>
          </a-select-option
        >
      </a-select>
    </div>
    <div class="ticketConfig" v-if="[3,6].includes(ticketTransForm.currentBusinessStatus)">
      <div class="ticketConfig-item"><span>{{ $t('n955') }}：{{ ticketDetail.workOrderName || '-' }}</span></div>
      <div class="ticketConfig-item"><span>{{ $t('c9') }}：{{ ticketDetail.memberId || '-' }}</span></div>
      <div class="ticketConfig-item"><span>{{ $t('n106') }}：{{ ticketDetail.submitTime || '-' }}</span></div>
      <div class="ticketConfig-item"><span>{{ $t('n992') }}：{{ ticketStatusMap[ticketDetail.currentProcessStatus] || '-' }}</span></div>
      <div class="ticketConfig-item"><span>{{ $t('n1012') }}：{{ ticketDetail.processingDuration || '-' }}</span></div>
      <div class="ticketConfig-item"><span>{{ $t('n1013') }}：{{ ticketDetail.currentHandler || '-' }}</span></div>
      <div class="ticketConfig-item"><span>{{ $t('m878') }}：{{ ticketDetail.registerPhoneNumber  || '-' }}</span></div>
    </div>
    <div class="turnDownBox" v-if="[3,6].includes(ticketTransForm.currentBusinessStatus)">
      <div class="turnDownBox-item">
        <label for="ticketTransForm_internalRemark1" v-if="ticketTransForm.currentBusinessStatus == 3">
          <b>{{ $t('n1001') }}：</b></label>
        <label for="ticketTransForm_internalRemark1" v-if="ticketTransForm.currentBusinessStatus == 6">
          <b>{{ $t('n1002') }}：</b></label>
        <a-textarea
          id="ticketTransForm_internalRemark1"
          style="width: 356px;"
          v-model:value="ticketTransForm.externalRemark"
          :placeholder="$t('m562')+$t('n1003')"
          :rows="4"
          />
        <div style="margin-top: 14px;">
          <p><b>{{ $t('n966') }}</b></p>
          <p>
            <span v-if="ticketTransForm.currentBusinessStatus == 3">{{ $t('n1004') }}：</span>
            <span v-if="ticketTransForm.currentBusinessStatus == 6">{{ $t('n1005') }}：</span>
            {{ ticketTransForm.externalRemark }}
            <a href="javascript:(0)" style="text-decoration: underline;" 
            v-if="ticketTransForm.currentBusinessStatus == 3">{{ $t('n1006') }}</a>
          </p>
        </div>
      </div>
      <div class="turnDownBox-item">
        <label for="ticketTransForm_externalRemark2"><b>{{ $t('n1007') }}：</b></label>
        <a-textarea
          id="ticketTransForm_externalRemark2"
          style="width: 356px;"
          v-model:value="ticketTransForm.internalRemark"
          :placeholder="$t('m562')+$t('n1008')"
          :rows="4"
          />
      </div>
    </div>
    <div style="text-align: center;margin-top: 14px;">
      <a-button style="margin-right: 20px;" @click="cancelTicketModal">{{ $t('b10') }}</a-button>
      <a-button type="primary" v-if="isBatch"
      :loading="loading" @click="batchTicketTrans">{{ $t('b9') }}</a-button>
      <a-button type="primary" v-if="ticketTransForm.currentBusinessStatus == 5 && !isBatch"
      :loading="loading" @click="ticketTrans">{{ $t('b9') }}</a-button>
      <a-button type="primary" v-if="ticketTransForm.currentBusinessStatus == 6"
      :loading="loading" @click="ticketTrans">{{ $t('n1009') }}</a-button>
      <a-button type="primary" v-if="ticketTransForm.currentBusinessStatus == 3" danger
      :loading="loading" @click="ticketTrans">{{ $t('n1010') }}</a-button>
    </div>
  </a-modal>
  <!-- 查看/处理工单 -->
   <a-modal
    v-model:open="checkTicketVisible"
    :width="800"
    :footer="null"
    destroyOnClose
    >
      <template #title>
        <span class="text-center" style="width: 100%; display: block;">{{ $t('n1011') }}</span>
      </template>
      <div class="ticketConfig">
        <div class="ticketConfig-item"><span>{{ $t('n955') }}：{{ ticketDetail.workOrderName || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n988') }}：{{ ticketDetail.workOrderNo || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('c9') }}：{{ ticketDetail.memberId || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n106') }}：{{ ticketDetail.submitTime || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n992') }}：{{ ticketStatusMap[ticketDetail.currentProcessStatus] || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n1012') }}：{{ ticketDetail.processingDuration || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n1013') }}：{{ ticketDetail.currentHandler || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('m878') }}：{{ ticketDetail.registerPhoneNumber  || '-' }}</span></div>
      </div>
      <div class="ticketOperateBtn"
        v-if="([2,4].includes(Number(ticketDetail.currentProcessStatus)) && isPreUser && isInPreUser)">
        <!-- ([2,4].includes(Number(ticketDetail.currentProcessStatus)) && getUserPre) -->
         <!-- 驳回 -->
        <a-button type="primary" danger 
        @click="showTicketTrans(ticketDetail,3)"
        v-permission="'admin:workOrderRecord:transitionWorkOrder3'"
        >{{ $t('n1010') }}</a-button>
        <!-- 处理完成 -->
        <a-button type="primary" 
        @click="showTicketTrans(ticketDetail,6)"
        v-permission="'admin:workOrderRecord:transitionWorkOrder4'"
        >{{ $t('n1009') }}</a-button>
      </div>
      <div class="ticketHistory">
        <h3>{{ $t('n1014') }}</h3>
        <div v-if="ticketHistory.length && !loading">
          <a-timeline>
            <a-timeline-item v-for="(item, index) in ticketHistory" :key="index" :color="item.currentBusinessStatus === 1 ? 'blue' : item.currentBusinessStatus === 2 ? 'green' : 'red'">
              <div>
                <b style="color:rgb(255,150,50)">{{ item.currentHandler || ''  }}&nbsp;</b>
                <b>{{ $getMapItem(currentBusinessStatusMap,item.currentBusinessStatus) || '-' }}</b>
                <b v-if="item.currentBusinessStatus == 5">{{ $t('n1090') }}</b>
                <b v-if="item.currentBusinessStatus == 5" style="color:rgb(255,150,50)">&nbsp;{{ item.transferOrderReceiver || ''  }}</b>：
                <span>{{ item.businessTime }}</span>
              </div>
              <div class="ticketHistoryContent"
                v-if="[1,4].includes(item.currentBusinessStatus)"
                >
                <div v-for="(itemC,idx) in item.businessContentList" :key="idx">
                  <p v-if="[1,2,3,7,8].includes(itemC.labelType)">
                    {{ itemC.labelTitle }}：
                    <span v-if="itemC.labelContent.length == 21 && (itemC.labelContent.startsWith('MR') || itemC.labelContent.startsWith('MC'))">
                      <a-button type="link" v-if="itemC.labelContent.startsWith('MR')" @click="goAssemble(itemC.labelContent,true)">
                        {{ itemC.labelContent }}
                      </a-button >
                      <a-button type="link" v-if="itemC.labelContent.startsWith('MC')" @click="goAssemble(itemC.labelContent,false)">
                        {{ itemC.labelContent }}
                      </a-button >
                    </span>
                    <span v-else>
                      {{ itemC.labelContent || '-' }}
                    </span>
                  </p>
                  <p v-if="itemC.labelType == 4">
                    {{ itemC.labelTitle }}：
                    <a target="script:(0)"  @click="() => showFiles(true,itemC,1,item)">{{ $t('n1016') }}</a>
                    &nbsp;&nbsp;
                    <a-button type="link" @click="downloadImgFile(itemC.labelContent)">{{ $t('n1017') }}</a-button>
                  </p>
                  <p v-if="itemC.labelType == 5">{{ itemC.labelTitle }}：
                    <a target="script:(0)"  @click="() => showFiles(true,itemC,2,item)">{{ $t('n1016') }}</a>
                    &nbsp;&nbsp;
                    <a-button type="link" @click="downloadFile(itemC.labelContent)">{{ $t('n1017') }}</a-button>
                  </p>
                  <p v-if="itemC.labelType == 6">{{ itemC.labelTitle }}：
                    <a target="script:(0)"  @click="() => showFiles(true,itemC,3,item)">{{ $t('n1016') }}</a>
                    &nbsp;&nbsp;
                    <a-button type="link" @click="downloadFile(itemC.labelContent)">{{ $t('n1017') }}</a-button>
                    &nbsp;&nbsp;
                    <span v-if="itemC.pdfPassword && itemC.pdfPassword != 'null'">{{$t('n1019')}}：{{ itemC.pdfPassword }}</span>
                  </p>
                </div>
              </div>
              <div class="ticketHistoryContent" v-if="[3,6].includes(item.currentBusinessStatus)">
                <div class="ticketHistoryContentFlex" v-if="[3].includes(item.currentBusinessStatus)">
                  <div class="ticketHistoryContentFlexItem">
                    <b>{{ $t('n1020') }}：</b>
                  </div>
                  <div class="ticketHistoryContentFlexItem">
                    {{ item.internalRemark || '-' }}
                  </div>
                </div>
                <div class="ticketHistoryContentFlex" v-if="[6].includes(item.currentBusinessStatus)">
                  <div class="ticketHistoryContentFlexItem">
                    <b>{{ $t('n1021') }}：</b>
                  </div>
                  <div class="ticketHistoryContentFlexItem">
                    {{ item.internalRemark || '-' }}
                  </div>
                </div>
                <div class="ticketHistoryContentFlex">
                  <div class="ticketHistoryContentFlexItem">
                    <b>{{ $t('n1022') }}：</b>
                  </div>
                  <div class="ticketHistoryContentFlexItem">
                    {{ item.externalRemark || '-' }}
                  </div>
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
        <span class="ticketInfoLoading" v-if="!ticketHistory.length && loading">
          <LoadingOutlined />
        </span>
        <a-empty v-else-if="!ticketHistory.length && !loading"></a-empty>
      </div>
   </a-modal>
    <!-- 查看文件 -->
   <a-modal
    v-model:open="showFilesVisible"
    :title="fileForm.labelTitle"
    :footer="null"
    width="1400px"
    centered
    @cancel="cancelShowFiles"
   >
   <div class="historyShowCtxBox">
    <div class="historyShowCtx" v-if="showContentForm">
      <div class="ticketConfig">
        <div class="ticketConfig-item"><span>{{ $t('n955') }}：{{ ticketDetail.workOrderName || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n988') }}：{{ ticketDetail.workOrderNo || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('c9') }}：{{ ticketDetail.memberId || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n106') }}：{{ ticketDetail.submitTime || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n992') }}：{{ ticketStatusMap[ticketDetail.currentProcessStatus] || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n1012') }}：{{ ticketDetail.processingDuration || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('n1013') }}：{{ ticketDetail.currentHandler || '-' }}</span></div>
        <div class="ticketConfig-item"><span>{{ $t('m878') }}：{{ ticketDetail.registerPhoneNumber  || '-' }}</span></div>
      </div>
      <div>
        <b style="color:rgb(255,150,50)">{{ showContentForm.currentHandler || ''  }}&nbsp;</b>
        <b>{{ $getMapItem(currentBusinessStatusMap,showContentForm.currentBusinessStatus) || '-' }}</b>
        <b v-if="showContentForm.currentBusinessStatus == 5">{{ $t('n1090') }}</b>
        <b v-if="showContentForm.currentBusinessStatus == 5" style="color:rgb(255,150,50)">&nbsp;{{ showContentForm.transferOrderReceiver || ''  }}</b>：
        <span>{{ showContentForm.businessTime }}</span>
      </div>
      <div class="ticketHistoryContent"
        v-if="[1,4].includes(showContentForm.currentBusinessStatus)"
        >
        <div v-for="(itemC,idx) in showContentForm.businessContentList" :key="idx">
          <p v-if="[1,2,3,7,8].includes(itemC.labelType)">
            {{ itemC.labelTitle }}：
            <span v-if="itemC.labelContent.length == 21 && (itemC.labelContent.startsWith('MR') || itemC.labelContent.startsWith('MC'))">
              <a-button type="link" v-if="itemC.labelContent.startsWith('MR')" @click="goAssemble(itemC.labelContent,true)">
                {{ itemC.labelContent }}
              </a-button >
              <a-button type="link" v-if="itemC.labelContent.startsWith('MC')" @click="goAssemble(itemC.labelContent,false)">
                {{ itemC.labelContent }}
              </a-button >
            </span>
            <span v-else>
              {{ itemC.labelContent || '-' }}
            </span>
          </p>
          <p v-if="itemC.labelType == 6">
            <span v-if="itemC.pdfPassword && itemC.pdfPassword != 'null'">{{$t('n1019')}}：{{ itemC.pdfPassword }}</span>
          </p>
        </div>
      </div>
      <div class="ticketHistoryContent" v-if="[3,6].includes(showContentForm.currentBusinessStatus)">
        <div class="ticketHistoryContentFlex" v-if="[3].includes(showContentForm.currentBusinessStatus)">
          <div class="ticketHistoryContentFlexItem">
            <b>{{ $t('n1020') }}：</b>
          </div>
          <div class="ticketHistoryContentFlexItem">
            {{ showContentForm.internalRemark || '-' }}
          </div>
        </div>
        <div class="ticketHistoryContentFlex" v-if="[6].includes(showContentForm.currentBusinessStatus)">
          <div class="ticketHistoryContentFlexItem">
            <b>{{ $t('n1021') }}：</b>
          </div>
          <div class="ticketHistoryContentFlexItem">
            {{ showContentForm.internalRemark || '-' }}
          </div>
        </div>
        <div class="ticketHistoryContentFlex">
          <div class="ticketHistoryContentFlexItem">
            <b>{{ $t('n1022') }}：</b>
          </div>
          <div class="ticketHistoryContentFlexItem">
            {{ showContentForm.externalRemark || '-' }}
          </div>
        </div>
      </div>
    </div>
    <div class="historyShowCtx">
      <div class="previewImgFies" v-if="fileType == 1">
          <div v-if="fileForm.labelContent" v-for="(itemImg,key) in fileForm.labelContent.split(',')" :key="key" >
            <img :src="itemImg" alt="">
          </div>
      </div>
      <div class="previewFies" v-if="fileType == 2" style="text-align: center">
        <video :src="fileForm.labelContent" controls autoplay style="max-width: 100%; max-height: 90vh;" />
      </div>
      <div class="previewFies" v-else-if="fileType == 3" style="text-align: center">
        <div v-if="fileForm.pdfPassword && fileForm.pdfPassword != 'null'">{{$t('n1019')}}：{{ fileForm.pdfPassword }}</div>
        <!-- <embed :src="fileForm.labelContent" type="application/pdf" style="width: 100%; height: 90vh;" /> -->
        <iframe
          :src="`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileForm.labelContent)}`"
          style="width:100%; height:88vh;"
        ></iframe>
      </div>
    </div>
   </div>
   </a-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref, h, computed, watchEffect } from "vue";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { 
  workOrderRecordListPage,
  workOrderRecordGetOrderRecordDetail,
  workOrderRecordGetWorkOrderProcessPendingStatistics,
  workOrderRecordTransitionWorkOrder,
  workOrderPermissionListPage,
  getOperatorAuthority,
  workOrderRecordBatchTransferWorkOrders,
  workOrderRecordBatchLockWorkOrders,
  workOrderRecordExport,
 } from "@/api";
import { useI18n } from "vue-i18n";
import { useRoute,onBeforeRouteLeave } from "vue-router";
import router from "@/router";
import { useTabHeight } from "@/hooks/useTabHeight.hooks";
import { useTableData } from "@/hooks/useTableData.hook";
import { useTableChange } from "@/hooks/useTableChange.hooks";
import SummaryBottom from "@/components/Other/SummaryBottom.vue";
import { getStartAndEndOfDay } from "@/plugins/dataMap";
import { useMerchantStore } from '@/stores/useMerchantStore'
import {  replaceEmptyWithUndefined } from "@/utils/index";
import { message } from "ant-design-vue";
import { usePageCash } from "@/hooks/usePageCash.hook"; 
const route = useRoute();
const { pageCash,setPageCash,getPageCash,clearPageCash } = usePageCash();
const resultData = ref({});
const isUseCash = ref(false);
onBeforeRouteLeave(() => {
  setPageCash(route.fullPath.split('?')[0], query.value, resultData.value, extendData.value);
})
const merchantStore = useMerchantStore();
const merchantList = computed(() => merchantStore.merchantList);
const [startIndiaTime,endIndiaTime,inputTime] = getStartAndEndOfDay()
const { getTabH } = useTabHeight();
const { t } = useI18n();
// const dataSource = ref([]);
const statusData = ref<any>({ list: [], inProgressCount: 0 });
// const extendData = ref({
//   cntPageTotal: 0,
//   cntTotal: 0,
// });
const ticketHistory:any = ref([])
// const loading = ref(false);
const query = ref({
  asc: true,
  column: "submitTime",
  pageNo: 1,
  pageSize: 20,
  workOrderNo: undefined,
  workOrderName: undefined,
  memberId: undefined,
  registerPhoneNumber: undefined,
  workOrderTypeId:undefined,
  currentHandler:undefined,
  relatedOrderNo:undefined,
  currentProcessStatus:undefined as any,
  loginLimit:undefined,
  currentBusinessStatus:undefined,
  appealHistory:undefined,
  merchantCode:undefined,
  startTime: startIndiaTime,
  endTime: endIndiaTime,
  startTime1: '',
  endTime1: '',
  lastSubmitTimeStart: '',
  lastSubmitTimeEnd: '',
});
const columns:any = [
  {
    title: t("n988"),
    dataIndex: "workOrderNo",
    key: "workOrderNo",
    align: "center",
    width: 220,
  },
  {
    title: t("l92"),
    dataIndex: "merchantName",
    key: "merchantName",
    align: "center",
    width: 150,
  },
  {
    title: t("c9"),
    dataIndex: "memberId",
    key: "memberId",
    align: "center",
    width: 180,
  },
  {
    title: t("m878"),
    dataIndex: "registerPhoneNumber",
    key: "registerPhoneNumber",
    align: "center",
    width: 150,
  },
  {
    title: t("n955"),
    dataIndex: "workOrderName",
    key: "workOrderName",
    align: "center",
    width: 150,
  },
  {
    title: t("n958"),
    dataIndex: "loginLimit",
    key: "loginLimit",
    align: "center",
    width: 150,
  },
  {
    title: t("n992"),
    dataIndex: "currentProcessStatus",
    key: "currentProcessStatus",
    align: "center",
    width: 150,
  },
  {
    title: t("n1023"),
    dataIndex: "currentBusinessStatus",
    key: "currentBusinessStatus",
    align: "center",
    width: 150,
  },
  {
    title: t("n42"),
    dataIndex: "orderAmount",
    key: "orderAmount",
    align: "center",
    width: 150,
  },
  {
    title: t("n960"),
    dataIndex: "workOrderTypeName",
    key: "workOrderTypeName",
    align: "center",
    width: 150,
  },
  {
    title: t("n993"),
    dataIndex: "appealHistory",
    key: "appealHistory",
    align: "center",
    width: 150,
  },
  {
    title: t("n990"),
    dataIndex: "relatedOrderNo",
    key: "relatedOrderNo",
    align: "center",
    width: 220,
  },
  {
    title: t("n1024"),
    dataIndex: "workOrderHandleCount",
    key: "workOrderHandleCount",
    align: "center",
    width: 220,
  },
  {
    title: t("n106"),
    dataIndex: "submitTime",
    key: "submitTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n1172"),
    dataIndex: "lastSubmitTime",
    key: "lastSubmitTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n989"),
    dataIndex: "lastOperationTime",
    key: "lastOperationTime",
    align: "center",
    width: 140,
  },
  {
    title: t("n1025"),
    dataIndex: "currentHandler",
    key: "currentHandler",
    align: "center",
    width: 150,
  },
  {
    title: t("n1004"),
    dataIndex: "internalRejectReason",
    key: "internalRejectReason",
    align: "center",
    width: 150,
  },
  {
    title: t("n1026"),
    dataIndex: "internalCompletionRemark",
    key: "internalCompletionRemark",
    align: "center",
    width: 150,
  },
  {
    title: t("n1012"),
    dataIndex: "processingDuration",
    key: "processingDuration",
    align: "center",
    width: 150,
  },
  {
    title: t("operation"),
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 150,
    fixed: 'right',
  },
];
const ticketStatusMap:any = {
  1: t('s26'), //待处理
  2: t('m685'), //处理中
  3: t('n1027'), //已驳回
  4: t('n1028'), //复审
  5: t('n1029'), //处理完成
}
const ticketStatusColorMap:any = {
  1: 'blue', //待处理
  2: 'green', //处理中
  3: 'red', //已驳回
  4: 'orange', //复审
  5: 'gray', //处理完成
}
const currentBusinessStatusMap:any = {
  1: t('n1030'), //用户提交工单
  2: t('n1031'), //锁定工单
  3: t('n1032'), //驳回工单
  4: t('n1033'), //用户更新资料
  5: t('n1034'), //转移工单
  6: t('n1029'), //处理完成
}
const appealHistoryMap:any = {
  1: t('s16'), //申诉成功
  2: t('s17'), //申诉失败
}
const summaryRows = computed(() => [
  {
    label: t("m54"),
    fields: {
      cnt: extendData.value.cntPageTotal || 0,
    },
  },
  {
    label: t("m55"),
    fields: {
      cnt: extendData.value.cntTotal || 0,
    },
  },
]);
// const pagination = ref({
//   total: 0,
//   current: 1,
//   pageSize: 20,
//   showSizeChanger: true,
//   showTotal: (total: any) => t("total", [total]),
// });
const loginUserId = ref<any>(null);//登录用户id
const loginUserName = ref<any>(null);//登录用户名
const {
  dataSource,
  extendData,
  pagination,
  loading,
  response,
  handleTableChange,
  getList,
  resetQuery,
} = useTableData({
  query,
  handleQueryFields: (q) => ({
    ...q,
    column: "submitTime",
  }),
  api: workOrderRecordListPage,
  fetchType: 2,
  resDataType: 2,
  defaultPageSize: 20,
  filterRules: [],
  afterFetch: (data) =>{
    getStatsData();
    return data;
  },
});
watchEffect(() => {
  if(!isUseCash.value) resultData.value = response.value;
});
// const getList = async () => {
//   loading.value = true;
//   pagination.value.current = query.value.pageNo;
//   pagination.value.pageSize = query.value.pageSize;
//   const queryParams = replaceEmptyWithUndefined(query.value);
//   const res: any = await workOrderRecordListPage(queryParams).finally(()=>loading.value = false);
//   if (res && res.code === "1") {
//     dataSource.value = res.data.list || [];
//     // extendData.value = res.extend || {};
//     pagination.value.total = res.data.total;
//     resultData.value = res;
//   }
//   getStatsData();
// };
const getStatsData = async () => {
  const res: any = await workOrderRecordGetWorkOrderProcessPendingStatistics().finally(()=>{});
  if (res && res.code === "1") {
    statusData.value = res.data || {};
  }
};
// const { handleTableChange } = useTableChange({
//   query,
//   pagination,
//   getList,
//   filterRules: [],
// });
// const handleTableChange: any = (pag: { pageSize: number; current: number }) => {
//   pagination.value.current = pag.current;
//   pagination.value.pageSize = pag.pageSize;
//   query.value.pageNo = pag.current;
//   query.value.pageSize = pag.pageSize;
//   getList();
// };
const search = () => {
  // query.value.pageNo = 1;
  // pagination.value.current = 1;
  getList(1);
}
// const mySearch = () => {
//   resetQueryValue();
//   query.value.currentHandler = loginUserName.value;
//   getList();
// }
// const statusSearch = (status: number) => {
//   resetQueryValue();
//   query.value.currentProcessStatus = status;
//   getList();
// }
// const resetQueryValue = () => {
//   query.value = {
//     asc: true,
//     column: "submitTime",
//     pageNo: 1,
//     pageSize: 20,
//     workOrderNo: undefined,
//     workOrderName: undefined,
//     memberId: undefined,
//     registerPhoneNumber: undefined,
//     workOrderTypeId:undefined,
//     currentHandler:undefined,
//     relatedOrderNo:undefined,
//     currentProcessStatus:undefined,
//     loginLimit:undefined,
//     currentBusinessStatus:undefined,
//     appealHistory:undefined,
//     merchantCode:undefined,
//     startTime: '',
//     endTime: '',
//     startTime1: '',
//     endTime1: '',
//     lastSubmitTimeStart: '',
//     lastSubmitTimeEnd: '',
//   };
//   pagination.value.pageSize = 20;
//   pagination.value.current = 1;
// }
// const resetQuery = () => {
//   resetQueryValue();
//   getList();
// };
// 查看/处理工单
const isPreUser = ref(false);//当前用户是否有处理权限
const getUserPre = ref(false);//当前用户是管理员
const isInPreUser = ref(false);//当前用户是否有处理权限
const checkTicketVisible = ref(false);
const ticketDetail = ref<any>({});
const showCheckTicket = async (val:any) => {
  ticketHistory.value = [];
  checkTicketVisible.value = true;
  ticketDetail.value = val;
  if (val.nextNodeOperatorId == loginUserId.value || !val.nextNodeOperatorId ) {
    isPreUser.value = true;
  } else {
    isPreUser.value = false;
  }
  let id = val.id;
  loading.value = true;
  const res: any = await workOrderRecordGetOrderRecordDetail({id}).finally(()=>loading.value = false);
  if (res && res.code === "1") {
    ticketHistory.value = res.data || {};
  }else{
    ticketHistory.value = [];
  }
}
const showFilesVisible = ref<boolean>(false);
const fileForm = ref<any>({
  labelContent: '',
  labelTitle: ''
});
const fileType = ref<number>(1);//1图片 2视频 3pdf
const showContentForm = ref<any>({});
const showFiles = (isShow:any,val:any,type:any,item:any): void => {
  showFilesVisible.value = isShow;
  checkTicketVisible.value = false;
  fileForm.value = val;
  fileType.value = type;
  showContentForm.value = item;
};
const cancelShowFiles = (): void => {
  showFilesVisible.value = false;
  fileForm.value = '';
  fileType.value = 1;
  showContentForm.value = {};
  checkTicketVisible.value = true;
};
// 工单流转
const ticketTransForm:any = ref({
  workOrderNo: undefined,
  currentBusinessStatus: undefined,
  transferOrderReceiver: undefined,
  transferOrderReceiverId: undefined,
  externalRemark: undefined,
  internalRemark: undefined,
});
const ticketTransModalVisible = ref(false);
const userIdSel = ref(undefined);
const handleUserId = ref(undefined);
const showTicketTrans = (val:any,type:any) => {
  const { workOrderNo,currentHandlerId } = val;
  handleUserId.value = currentHandlerId;
  ticketTransForm.value.workOrderNo = workOrderNo;
  ticketTransForm.value.currentBusinessStatus = type;
  ticketTransModalVisible.value = true;
  if(type == 5){
    getUserList();
  }
}
const ticketTrans = async (val:any = null,type:any = null) => {
  if (val&&type) {
    ticketTransForm.value.workOrderNo = val.workOrderNo;
    ticketTransForm.value.currentBusinessStatus = type;
  }
  if(ticketTransForm.value.currentBusinessStatus == 5 ){
    if(!ticketTransForm.value.transferOrderReceiverId) {
      ticketTransForm.value.transferOrderReceiverId = userList.value.find(
        (item:any) => ticketTransForm.value.transferOrderReceiver == item.label)?.id;
    }
    if(!ticketTransForm.value.transferOrderReceiverId) {
      message.error(t("m563")+t('n1000'));
      return;
    }
    if(ticketTransForm.value.transferOrderReceiverId == handleUserId.value){
      message.error(t('n1035'));
      return;
    }
  }
  if([3,6].includes(ticketTransForm.value.currentBusinessStatus) ){
    if(!ticketTransForm.value.externalRemark) {
      message.error(t("m562")+t('n1003'));
      return;
    }
    if(!ticketTransForm.value.internalRemark) {
      message.error(t("m562")+t('n1008'));
      return;
    }
  }
  loading.value = true;
  const res: any = await workOrderRecordTransitionWorkOrder(ticketTransForm.value).finally(()=>{
    loading.value = false;
  });
  if (res && res.code == "1") {
    message.success(t("s10"));
    getList();
    cancelTicketModal();
    checkTicketVisible.value = false;
  }
}
const cancelTicketModal = () => {
  ticketTransModalVisible.value = false;
  ticketTransForm.value = {
    workOrderNo: undefined,
    currentBusinessStatus: undefined,
    transferOrderReceiver: undefined,
    transferOrderReceiverId: undefined,
    externalRemark: undefined,
    internalRemark: undefined,
  };
  handleUserId.value = undefined;
  userIdSel.value = undefined;
}
const userList:any = ref([]);
const getUserList = async () => {
  const res: any = await workOrderPermissionListPage({ pageNo: 1, pageSize: 1000 });
  if (res && res.code === "1") {
    userList.value = res.data.list.map((item: any) => ({
      label: item.operatorName,
      value: item.operatorName,
      id: item.operatorId,
    })) || [];
    isInPreUser.value = userList.value.some((item: any) => item.id == loginUserId.value);
  }
};
const downloadImgFile = (val:any) => {
  if(!val) return;
  const imgArr = val.split(',');
  imgArr.forEach((item:any) => {
    downloadFile(item);
  });
  
}
const downloadFile = async (url:any) => {
  // const a = document.createElement('a');
  // const fileName = url.split('/').pop() || 'file'
  // console.log('fileName',fileName);
  // a.href = url.downloadUrl;
  // a.download = fileName;
  // a.target = '_blank'; // 避免阻止
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) throw new Error('下载失败')

    const blob = await response.blob()
    const fileName = url.split('/').pop() || 'file'
    const blobUrl = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    window.URL.revokeObjectURL(blobUrl)
  } catch (e) {
    console.error('下载出错:', e)
  }
}
const getPro = async () => {
  const res: any = await getOperatorAuthority({id: loginUserId.value});
  if (res && res.code == "1") {
    if(res.data.roleId == 1){
      getUserPre.value = true;
    }else{
      getUserPre.value = true;
    }
  }else{
    getUserPre.value = false;
  }
};
// 批量转移/批量锁定工单
const selectRows = ref<any>([]);//选中行
const ticketTransIds = ref<any>([]);//转移选中工单号
const ticketLockIds = ref<any>([]);//锁定选中工单号
const isBatch = ref(false);//是否批量操作
const onSelectChange = (records:any) => {
  selectRows.value = records;
  ticketTransIds.value = records.filter((item:any) => [2,3,4].includes(JSON.parse(item).currentProcessStatus))
  .map((item:any) => JSON.parse(item).workOrderNo);
  ticketLockIds.value = records.filter((item:any) => [1].includes(JSON.parse(item).currentProcessStatus))
  .map((item:any) => JSON.parse(item).workOrderNo);
};
const showTicketTransBatch = () => {
  isBatch.value = true;
  ticketTransForm.value.currentBusinessStatus = 5;
  ticketTransModalVisible.value = true;
  getUserList();
}
const batchTicketTrans = async () => {
  loading.value = true;
  
  if(!ticketTransForm.value.transferOrderReceiverId){
    ticketTransForm.value.transferOrderReceiverId = userList.value.find((item:any)=>item.label==ticketTransForm.value.transferOrderReceiver)?.id;
  }
  const res: any = await workOrderRecordBatchTransferWorkOrders({
    transferOrderReceiver: ticketTransForm.value.transferOrderReceiver,
    transferOrderReceiverId: ticketTransForm.value.transferOrderReceiverId,
    workOrderNos: ticketTransIds.value.join(','),
  }).finally(()=>{
    loading.value = false;
  });
  if (res && res.code == "1") {
    message.success(t("s10"));
    getList();
    cancelTicketModal();
    isBatch.value = false;
    ticketTransIds.value = [];
  }
}
const batchLockTickets = async () => {
  if(ticketLockIds.value.length == 0){
    message.error(t('n1036'));
    return;
  }
  loading.value = true;
  const res: any = await workOrderRecordBatchLockWorkOrders({
    workOrderNos: ticketLockIds.value.join(','),
  }).finally(()=>{
    loading.value = false;
  });
  if (res && res.code == "1") {
    message.success(t("s10"));
    getList();
    ticketLockIds.value = [];
  }
}
//跳转撮合列表
const goAssemble = (id: any, isrecharge: boolean = true) => {
  const query: any = {};
  if (isrecharge) {
    query.recharge = id;
  } else {
    query.withdraw = id;
  }
  router.push({ path: "/order/assemble/index", query });
};
onMounted(async() => {
  const userInfo = localStorage.getItem('userInfo');
  loginUserId.value = userInfo ? JSON.parse(userInfo).userId : null;
  loginUserName.value = userInfo ? JSON.parse(userInfo).username : null;
  const pathName = route.fullPath.split('?')[0];
  if(pageCash.value.includes(pathName) && Object.keys(route.query).length == 0){
    const { queryCash, res, extend } = getPageCash(pathName);
    if(res.data.list && res.data.length == 0) {
      isUseCash.value = false;
      await getList();
    }else{
      isUseCash.value = true;
      query.value = queryCash;
      dataSource.value = res.data.list;
      extendData.value = extend;
      resultData.value = res;
      pagination.value.total = res.data.total;
      pagination.value.current = query.value.pageNo;
      pagination.value.pageSize = query.value.pageSize;
    }
  }else{
    clearPageCash(route.fullPath);
    await getList();
  }
  await getUserList();
  // await getPro();
  getTabH.value = useTabHeight(1).getTabH.value;
});
</script>
<style lang="less" scoped>
.ticketTransModal{
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
.statusDataBox{
  margin-bottom: 4px;
  a-tag{
    margin-right: 10px;
    font-size: 14px;
    padding: 5px 10px;
  }
}
.ticketConfig{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .ticketConfig-item{
    padding: 10px 0;
    span{
      font-weight: 600;
    }
  }
}
.ticketOperateBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}
:deep(.ant-timeline-item-head) {
  background-color: #1677ff !important; /* 改为实心色 */
  border-color: #1677ff !important;     /* 去掉边框 */
}
.ticketHistoryContent{
  border: 1px solid #1677ff;
  border-radius: 5px;
  font-size: 12px;
  p{
    padding: 1px 8px;
  }
  .ticketHistoryContentFlex{
    display: grid;
    grid-template-columns: auto repeat(1, 1fr);
    .ticketHistoryContentFlexItem{
      padding: 1px 8px;
    }
  }
}
.turnDownBox{
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr; 
  gap: 20px;
  .turnDownBox-item{
    width: 356px;
  }
}
.previewImgFies{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 10px;
  >div{
    max-height: 80vh;
    text-align: center;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 10px;
    background-color: #f5f5f5;
  }
  img{
    max-width: 100%;
    max-height: 100%;
  }
}
.ticketHistory{
  h3{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
}
.ticketInfoLoading{
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  font-size: 30px;
  padding: 20px;
}
.historyShowCtxBox{
  display: grid;
  grid-template-columns: 400px auto;
  gap: 20px;
  .ticketConfig{
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #f5f5f5;
  }
}
</style>
