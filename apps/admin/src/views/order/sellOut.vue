<template>
  <div class="sell-out-page">
    <h2>{{ currentTitle }}</h2>
    <div class="sell-out-tab-buttons">
      <a-button
        v-for="item in tabList"
        :key="item.key"
        :type="item.active ? 'primary' : undefined"
        @click="onTabChange(item.key)"
      >
        {{ item.tab }}
      </a-button>
    </div>
    <component :is="comId" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import SellOutCreateTab from "@/components/orderManagement/SellOutCreateTab.vue";
import SellOutLogTab from "@/components/orderManagement/SellOutLogTab.vue";
import SellOutImportLogTab from "@/components/orderManagement/SellOutImportLogTab.vue";

type PageTabKey = "create" | "log" | "importLog";

const SELL_OUT_IMPORT_TAB_SESSION_KEY = "sellOutPreferredTab";
const { t } = useI18n();
const route = useRoute();

const tabList = ref([
  { key: "create" as PageTabKey, tab: t("sellOutTitle"), active: true },
  { key: "log" as PageTabKey, tab: t("sellOutQuickOrderLog"), active: false },
  { key: "importLog" as PageTabKey, tab: t("sellOutImportOrderLog"), active: false },
]);

const tabComponentMap: Record<PageTabKey, any> = {
  create: SellOutCreateTab,
  log: SellOutLogTab,
  importLog: SellOutImportLogTab,
};

const currentTab = ref<PageTabKey>("create");
const comId = shallowRef(tabComponentMap.create);

const currentTitle = computed(() => {
  if (currentTab.value === "create") return t("sellOutTitle");
  return currentTab.value === "importLog" ? t("sellOutImportOrderLog") : t("sellOutQuickOrderLog");
});

const resolvePageTabKeyByQuery = (tab: unknown): PageTabKey => {
  if (Array.isArray(tab)) return resolvePageTabKeyByQuery(tab[0]);
  if (tab === "importLog") return "importLog";
  if (tab === "log") return "log";
  return "create";
};

const consumePreferredPageTab = (): PageTabKey => {
  const preferredTab = sessionStorage.getItem(SELL_OUT_IMPORT_TAB_SESSION_KEY);
  if (preferredTab === "importLog" || preferredTab === "log") {
    sessionStorage.removeItem(SELL_OUT_IMPORT_TAB_SESSION_KEY);
    return preferredTab;
  }
  return "create";
};

const syncTabState = (key: PageTabKey) => {
  currentTab.value = key;
  comId.value = tabComponentMap[key];
  tabList.value.forEach((item) => {
    item.active = item.key === key;
  });
};

const onTabChange = (key: PageTabKey) => {
  syncTabState(key);
};

const applyRouteQueryTab = (tab: unknown) => {
  let targetTab = resolvePageTabKeyByQuery(tab);
  if (targetTab !== "create") {
    sessionStorage.removeItem(SELL_OUT_IMPORT_TAB_SESSION_KEY);
  } else {
    targetTab = consumePreferredPageTab();
  }
  syncTabState(targetTab);
};

applyRouteQueryTab(route.query.tab);

watch(
  () => route.query.tab,
  (tab) => {
    applyRouteQueryTab(tab);
  }
);
</script>

<style scoped lang="less">
.sell-out-page {
  padding: 5px 0;
}

.sell-out-page > h2 {
  padding-left: 10px;
  margin-bottom: 8px;
  border-left: 4px solid #f9a600;
}

.sell-out-tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
