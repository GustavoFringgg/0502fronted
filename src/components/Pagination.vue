<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination size="small" :background="background" v-model:current-page="currentPage" v-model:page-size="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
const props = defineProps({
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, prev, pager, next, sizes'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed<number | undefined>({
  get: () => props.page,
  set: value => {
    emit('update:page', value)
  }
})
const pageSize = computed<number | undefined>({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
function handleSizeChange(val: number) {
  emit('pagination', { page: currentPage, limit: val })
}
function handleCurrentChange(val: number) {
  currentPage.value = val
  emit('pagination', { page: val, limit: props.limit })
}
</script>

<style scoped>
.pagination-container {
  padding: 8px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
