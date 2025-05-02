<template>
  <div style="font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; text-align: center; width:1240px;">
    <NaviMenu v-if="isNaviMenu"></NaviMenu>
    <div style="padding-left:5px; text-align:left; float:left; line-height: 32px; font-size: 18px !important; text-shadow: 2px 2px 3px #ccc; ">
      <ComptPermission style="width:390px;float:left;" :post="post"></ComptPermission>
    </div>
    <div @click="navigateToDetail('Insert')"
         style="float: right; padding-top: 10px; padding-left: 4px; cursor: pointer; width: 24px; height: 32px; opacity: 0.8;">
      <svg class="svg-inline--fa fa-plus-circle fa-w-16" style="width: 16px; height: 16px;" aria-hidden="true" focusable="false" data-prefix="fas"
           data-icon="plus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
        <path fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z">
        </path>
      </svg>
    </div>
    <div style="float: right;">
      <el-checkbox v-model="Query.History_Check" size="small" class="pr-12 pt-5">+ History</el-checkbox>
    </div>
    <!-- <div :style="{ 'float': 'left', 'padding-top': '6px', 'text-align': 'center', 'cursor': 'pointer', 'width': '24px', 'height': '32px' }" @click.prevent="OpenWindow({ Name: 'Organization', ID: 'Insert', width: '1160px', height: '600px' })"><i style="width:20px; height:20px;" class="fas fa-plus-circle"></i></div> -->
    <el-drawer v-model="drawer" :destroy-on-close="true" :show-close="false" :with-header="false" @close="closeDrawer" direction="rtl" size="580">
      <router-view @closeDrawer="closeDrawer"></router-view>
    </el-drawer>
    <div>
      <div style="border: solid 1px #c7c7c7;border-radius:10px;padding:0px">
      <el-table :data="_Organization_List" v-loading="isLoading" stripe size="small" @keyup.ctrl.enter="getOrganizationList()"
      :header-cell-style="{ background: '#dedede' }"  :cell-style="historyCellStyle" round>
        <el-table-column show-overflow-tooltip header-align="center" prop="OrganizationID" label="ID" width="100">
          <template #header>
            <div>ID</div>
            <el-input v-model="Query.OrganizationID" size="small" @dblclick="$Input_Clean(Query, 'OrganizationID')" />
          </template>
          <template #default="scope">
            <span @click="navigateToDetail(scope.row.OrganizationID)" style="cursor: pointer;">{{ scope.row.OrganizationID }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="Tradmark" >
          <template #default="scope">
                <el-image :src="`${hostname}/` + scope.row.Org_Photo" class="image-container" style="width:200px;height:32px;"/>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="Organization_Name_ENG" label="Organization Name (ENG)" width="180">
          <template #header>
            <div>Organization Name (ENG)</div>
            <el-input v-model="Query.Organization_Name_ENG" size="small" @dblclick="$Input_Clean(Query, 'Organization_Name_ENG')" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="Organization_Name_CHT" label="Organization Name (CHT)" width="180">
          <template #header>
            <div>Organization Name (CHT)</div>
            <el-input v-model="Query.Organization_Name_CHT" size="small" @dblclick="$Input_Clean(Query, 'Organization_Name_CHT')" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="OrganizationAddress_ENG" label="Address (ENG)" width="200" />
        <el-table-column show-overflow-tooltip header-align="center" prop="OrganizationAddress_CHT" label="Address (CHT)" width="200" />
        <el-table-column show-overflow-tooltip header-align="center" label="Contact No" width="140">
          <template #header>
            <div>Contact No
              <button @click="getOrganizationList()" class="absolute right-1 top-1/2 transform -translate-y-1/2">
                <n-icon :component="SearchOutline" size="20" :depth="3" />
              </button>
            </div>
          </template>
          <template #default="scope">
            <div style="line-height:16px">
              Tel: {{ scope.row.Phone_Number }} <br>
              Fax: {{ scope.row.Fax_Number }}</div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination class="flex justify-end" v-show="Organization_List.length > 0" v-model:page="currentPage" v-model:limit="pageSize"
                  :total="Organization_List.length" />
    </div>
    </div>
  </div>
</template>

<script setup>
import NaviMenu from '@/components/pages/Public/Navigate_Menu.vue'
import ComptPermission from '@/components/pages/Public/Permission.vue'
import axios from 'axios'
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { NIcon } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import commonFunction from '@/composables/commonFunction'
import Pagination from '@/components/Pagination.vue'
import { useRoute, useRouter } from 'vue-router'
import { controlledComputed } from '@vueuse/core'

const { hostname, $Input_Clean } = commonFunction()
const route = useRoute();
const router = useRouter();
const drawer = ref(false)
const isNaviMenu = ref(false)
const post = reactive({ Icons: false })
const Query = reactive({ OrganizationID: '', Organization_Name_ENG: '', Organization_Name_CHT: '', History_Check: false })

watch(() => Query.History_Check, () => { getOrganizationList() })  //監聽Query.History_Check的變化，當其變化時，調用getCustomerList函數來獲取客戶列表

onMounted(async () => {
  if (route.params.OrganizationID) {
    const OrganizationID = route.params.OrganizationID
    await router.push({ name: 'Organization_List' })
    isNaviMenu.value = false
    nextTick(() => {
      isNaviMenu.value = true
    })
    navigateToDetail(OrganizationID)
    Query.OrganizationID = OrganizationID
  } else {
    isNaviMenu.value = true
  }
  await getOrganizationList()
})



const Organization_List = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

const getOrganizationList = async () => {
  const { OrganizationID, Organization_Name_ENG, Organization_Name_CHT } = Query
  if (OrganizationID || Organization_Name_ENG || Organization_Name_CHT) {
    Query.History_Check = true
  }
  try {
    isLoading.value = true
    const response = await axios.post(`/api/System/Organization/Organization_List`, Query)
    Organization_List.value = response.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}


const _Organization_List = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return Organization_List.value.slice(start, end)
})


const closeDrawer = () => {
  drawer.value = false
  router.push({ name: 'Organization_List' })
  getOrganizationList()
}


const navigateToDetail = (OrganizationID) => {
  router.push({ name: 'Organization', params: { OrganizationID } })
  drawer.value = true
}

const historyCellStyle = ({ row }) => {
  if (row.History_User) {
    return { 'background-color': '#C7C7C7' }
  }
  return {}
}

</script>
