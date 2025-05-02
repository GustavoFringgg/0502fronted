<template>
  <div class="app-container">
    <div>
      <el-input v-model="searchInput" :placeholder="$t('form.placeholder.enter', { key: `${$t('glossary.keywords')}` })" class="search-bar" :prefix-icon="Search" :disabled="loading" @keyup.enter="getTags('search')" />
      <el-button type="primary" :disabled="loading" @click="getTags('search')">
        {{ $t('button.search') }}
      </el-button>
    </div>

    <el-table v-loading="loading" :data="pagedTableData" border fit highlight-current-row style="width: 100%" @sort-change="sortChange">
      <el-table-column width="80" align="center" :label="$t('form.key.id')" prop="id">
        <template v-slot="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" align="center" :label="$t('form.key.recommended')" prop="isRecommended" sortable="custom">
        <template v-slot="{ row }">
          <el-switch v-model="row.isRecommended.value" :disabled="!row.edit" class="ml-2" />
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" :label="$t('form.key.name')" prop="name" sortable="custom">
        <template v-slot="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.name.value" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.name?.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="`${$t('glossary.actions')}`" width="200">
        <template v-slot="{ row, $index }">
          <div class="test-actions">
            <template v-if="row.edit">
              <button type="button" class="el-button el-button--primary el-button--small" :class="{ 'is-loading': loading }" @click="confirmEdit(row)">
                <i v-if="loading" class="el-icon-loading" />
                <SvgIcon icon-class="save" />
                {{ $t('button.save') }}
              </button>
              <el-button class="cancel-btn" size="small" :icon="Refresh" type="warning" @click="cancelEdit(row)">
                {{ $t('button.cancel') }}
              </el-button>
            </template>
            <template v-else>
              <el-button type="primary" size="small" :icon="EditPen" @click="row.edit = !row.edit">
                {{ $t('button.edit') }}
              </el-button>
              <el-button type="danger" size="small" :icon="Delete" @click="triggerDelete(row, $index)">
                {{ $t('button.delete') }}
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="currentTotal > 0" :total="currentTotal" v-model:page="searchQuery.page" v-model:limit="searchQuery.limit" @pagination="getTags" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Demo',
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination.vue'
import { cloneDeep } from 'lodash-es'
import { Delete, EditPen, Refresh, Search } from '@element-plus/icons-vue'
// import { compare } from '@/utils/mixinTools'

const searchInput = ref('')
const rawSearchQuery = {
  page: 1,
  limit: 20,
  keyword: '',
  sort: {
    prop: null as string | null,
    order: null as string | null
  }
}

const searchQuery = ref(cloneDeep(rawSearchQuery))
const loading = ref(false)
const list = ref([] as Record<string, any>[])
const canEditedKeys = [
  { key: 'isRecommended', needCheck: false },
  { key: 'name', needCheck: true }
]
const dialog = ref({
  show: false,
  hashtagId: ''
})

const mockTestItems = ref([] as Record<string, any>[])

const init = async () => {
  try {
    // get tags from api
    const result = await getMockItems()
    mockTestItems.value = result || []
    await getTags()
    return true
  } catch (err) {
    console.log(err)
  }
}

const getMockItems = async () => {
  try {
    const result = [
      { id: 1, isRecommended: true, name: 'HashTag #1' },
      { id: 2, isRecommended: true, name: 'HashTag #2' },
      { id: 3, isRecommended: true, name: 'HashTag #3' },
      { id: 4, isRecommended: true, name: 'HashTag #4' },
      { id: 5, isRecommended: false, name: 'HashTag #5' },
      { id: 6, isRecommended: true, name: 'HashTag #6' },
      { id: 7, isRecommended: true, name: 'HashTag #7' },
      { id: 8, isRecommended: true, name: 'HashTag #8' },
      { id: 9, isRecommended: true, name: 'HashTag #9' },
      { id: 10, isRecommended: false, name: 'HashTag #10' },
      { id: 11, isRecommended: true, name: 'HashTag #11' },
      { id: 12, isRecommended: true, name: 'HashTag #12' },
      { id: 13, isRecommended: true, name: 'HashTag #13' },
      { id: 14, isRecommended: true, name: 'HashTag #14' },
      { id: 15, isRecommended: false, name: 'HashTag #15' },
      { id: 16, isRecommended: true, name: 'HashTag #16' },
      { id: 17, isRecommended: true, name: 'HashTag #17' },
      { id: 18, isRecommended: true, name: 'HashTag #18' },
      { id: 19, isRecommended: true, name: 'HashTag #19' },
      { id: 20, isRecommended: false, name: 'HashTag #20' },
      { id: 21, isRecommended: true, name: 'HashTag #21' }
    ]
    return result
  } catch (err) {
    console.log(err)
  }
}

const pagedTableData = computed(() => {
  return list.value.slice((searchQuery.value.page - 1) * searchQuery.value.limit, searchQuery.value.page * searchQuery.value.limit)
})

const currentTotal = computed(() => {
  return list.value.length
})

const getTags = async (type?: string, options?: null | undefined | Record<'prop' | 'order', string | null>) => {
  try {
    loading.value = true

    if (type === 'search') {
      const preResult = {
        limit: searchQuery.value.limit,
        sort: { ...searchQuery.value.sort }
      }
      resetList()
      searchQuery.value.keyword = searchInput.value
      searchQuery.value.limit = preResult.limit
      searchQuery.value.sort = preResult.sort
    }

    if (type === 'sort') {
      const preResult = {
        keyword: searchQuery.value.keyword,
        limit: searchQuery.value.limit,
        sort: { ...searchQuery.value.sort }
      }
      resetList()
      searchQuery.value.keyword = preResult.keyword
      searchQuery.value.limit = preResult.limit
      searchQuery.value.sort = preResult.sort
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    let result = mockTestItems.value
      .filter(v => v.name.includes(searchQuery.value.keyword.trim()) || (searchQuery.value.keyword.trim() === ''))

    if (type === 'sort' || (searchQuery.value.sort.prop !== null && searchQuery.value.sort.order !== null)) {
      const prop = options?.prop || searchQuery.value.sort.prop
      const order = options?.order || searchQuery.value.sort.order
      // result = result.sort(compare(prop, order))
    }

    list.value = result.map(v => {
      const newObj = {
        ...v,
        edit: false,
      } as Record<string, any>

      canEditedKeys.forEach((str) => {
        newObj[str.key] = {
          key: str.key,
          original: v[str.key],
          value: v[str.key]
        }
      })

      return newObj
    })

    loading.value = false
    return true
  } catch (err) {
    console.log(err)
  }
}

const sortChange = async ({ prop, order }: { prop: string | null, order: string | null }) => {
  try {
    searchQuery.value.sort.prop = prop
    searchQuery.value.sort.order = order
    await getTags('sort', { prop, order })
  } catch (err) {
    console.log(err)
  }
}

const cancelEdit = (row: Record<string, any>) => {
  canEditedKeys.forEach(str => {
    row[str.key].value = row[str.key].original
  })
  row.edit = false
  ElMessage({
    message: 'The data has been restored to the original value',
    type: 'warning'
  })
}

const confirmEdit = async (row: Record<string, any>) => {
  try {
    loading.value = true
    canEditedKeys.forEach(str => {
      row[str.key].original = row[str.key].value
    })

    row.edit = false

    /* mock save data via api*/
    await new Promise(resolve => setTimeout(resolve, 500))
    mockTestItems.value[mockTestItems.value.findIndex(obj => obj.id === row.id)] = {
      id: row.id,
      isRecommended: row.isRecommended.value,
      name: row.name.value
    }
    list.value[list.value.findIndex(obj => obj.id === row.id)] = {
      ...row
    }

    ElMessage({
      message: 'The data has been edited',
      type: 'success'
    })
    loading.value = false
  } catch (err) {
    console.log(err)
  }
}

const triggerDelete = async (row: Record<string, any>, index: number) => {
  try {
    console.log('ready to delete', row, index)

    /* mock delete via api */
    await new Promise(resolve => setTimeout(resolve, 500))
    mockTestItems.value.splice(mockTestItems.value.findIndex(obj => obj.id === row.id), 1)
    list.value.splice(index, 1)

    console.log('finish delete')
  } catch (err) {
    console.log(err)
  }
}

const resetList = () => {
  list.value = []
  searchQuery.value = cloneDeep(rawSearchQuery)
}

init()
</script>