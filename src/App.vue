<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { NLoadingBarProvider, NDialogProvider, NNotificationProvider, NMessageProvider } from 'naive-ui'
import naiveProviderTools from '@/components/naiveProviderTools.vue'
import { nextTick, provide, ref } from "vue";

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg

const showPage = ref(true);
console.log("test2")
const reload = async () => {
  showPage.value = false;
  await nextTick();
  showPage.value = true;
};
provide("reload", reload);

useHead({
  title: 'ERP WEB',
  meta: [
    { name: 'description', content: 'ERP WEB' },
  ],
})
</script>

<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <router-view v-if="showPage"/>
          <naiveProviderTools /> 
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>
