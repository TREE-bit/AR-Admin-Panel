<script setup lang="ts">
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { computed, reactive, ref } from 'vue'
import { FormInstance } from 'ant-design-vue'

const expand = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<Record<string, any>>({})
const formProps = computed(() => ({}))
const resetFields = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
const onFinish = () => {}
</script>

<template>
  <div class="mb-15 crud-search">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      @finish="onFinish"
      v-bind="formProps"
    >
      <a-row :gutter="24">
        <template v-for="i in 10" :key="i">
          <a-col v-show="expand || i <= 6" :span="8">
            <a-form-item
              :name="`field-${i}`"
              :label="`field-${i}`"
              :rules="[{ required: true, message: 'input something' }]"
            >
              <a-input v-trim v-model:value="formState[`field-${i}`]" placeholder="placeholder"></a-input>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" html-type="submit">{{$t('search')}}</a-button>
          <a-button style="margin: 0 8px" @click="resetFields">{{$t('m158')}}</a-button>
          <a style="font-size: 12px" @click="expand = !expand">
            <template v-if="expand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            {{$t('m159')}}
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<style scoped lang="less"></style>
