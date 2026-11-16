<template>
    <a-card
      style="width: 100%; height: 100%"
      :tab-list="tabList"
      :bordered="false"
      :hoverable="false"
      @tabChange="(key: any) => onTabChange(key)"
      class="setting-page"
    >
      <component :is="comId"></component>
    </a-card>
  </template>
  
  <script lang="ts" setup>
  import recharge from "@/views/config/components/rechargeCancel.vue";
  import withdraw from "@/views/config/components/withdrawCancel.vue";
  import announcement from "@/views/config/components/announcementConfig.vue";
  import banner from "@/views/config/components/bannerConfig.vue";
  import taskRules from "@/views/config/components/taskRules.vue";
  // import leverRules from "@/views/config/components/leverRules.vue";
  import homeAnnouncement from "@/views/config/components/homeAnnouncement.vue";
  import eventContentConfig from "@/views/config/components/eventContentConfig.vue";
  import advertisingSlog from "@/views/config/components/advertisingSlog.vue";
  import { shallowRef,ref } from "vue";
  import { useI18n } from "vue-i18n";
  const comId = shallowRef(recharge);
  const { t } = useI18n();
  const tabList = ref<any[]>([
    {
      key: "recharge",
      tab: t('m33'),
    },
    {
      key: "withdraw",
      tab: t('m34'),
    },
    {
      key: "announcement",
      tab: t('m212'),
    },
    {
      key: "eventContentConfig",
      tab: t('m937'),
    },
    {
      key: "banner",
      tab: t('m213'),
    },
    {
      key: "taskRules",
      tab: t('m378'),
    },
    {
      key: "homeAnnouncement",
      tab: t('m578'),
    },
    {
      key: "advertisingSlog",
      tab: t('n1661'),
    },
    // {
    //   key: "leverRules",
    //   tab: t('n689'),
    // },
  ]);
  const onTabChange = (key: any) => {
    const map = <any>{
        recharge,
        withdraw,
        announcement,
        eventContentConfig,
        banner,
        taskRules, 
        homeAnnouncement,
        advertisingSlog,
        // leverRules,
    };
    comId.value = map[key];
  };
  </script>
  <style>
  .setting-page{
    box-shadow: none;
  }
  </style>
  