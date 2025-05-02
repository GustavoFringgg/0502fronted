<!-- content.vue -->
<template></template>

<script>
  import { useLoadingBar, useDialog, useMessage, useNotification } from 'naive-ui'
  import { defineComponent } from 'vue'

  // content
  export default defineComponent({
    setup() {
      window.$loadingBar = useLoadingBar()
      window.$dialog = useDialog()
      window.$message = useMessage()
      window.$notification = useNotification()
    }
  })
</script>