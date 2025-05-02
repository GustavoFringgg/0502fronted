<template>
  <div style="font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; text-align: center; width:1150px;">
    <NaviMenu></NaviMenu>
    <div class="flex justify-between" style="padding-left:5px; text-align:left; float:left; width:90%; line-height: 32px; font-size: 18px !important; text-shadow: 2px 2px 3px #ccc; ">
      <ComptPermission style="width:390px;float:left;" :post="post"></ComptPermission>
      <template v-if="IsAuthor">
        <div>
          <button class="text-xs border-0 hover:text-orange-500 hover:border-0" @click="sideDrawerShowToggle()">New</button>
        </div>
      </template>
    </div>
    <el-drawer v-model="drawer" class="relative" :destroy-on-close="true" :show-close="false" :with-header="false" @close="closeDrawer" direction="rtl" size="75%">
      <template v-if="sideDrawerShow">
        <button class="absolute top-0 left-1 drawer-close-Btn">
          <i class="fa-solid fa-xmark fa-lg" @click="closeDrawer"></i>
        </button>
        <el-form
          :model="formData"
          calss="add-new-form"
          :rules="rules"
          label-width="21%"
          label-position="left"
        >
          <el-form-item label="Manufacturer ID" prop="FactoryID">
            <el-input v-model="formData.FactoryID" placeholder="Manufacturer ID" clearable />
          </el-form-item>
          <el-form-item label="Manufacturer Name">
            <el-input v-model="formData.Factory_Name" placeholder="Manufacturer Name" clearable />
          </el-form-item>
          <el-form-item label="Country">
            <el-select
              class="w-full text-left"
              v-model="formData.Country"
              filterable
              placeholder="Select"
              :disabled="!IsAuthor"
              size="small"
            >
              <el-option
                v-for="region in regions"
                :key="region.Region"
                :label="region.Region"
                :value="region.Region"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Phone Number">
            <el-input v-model="formData.Phone_Number" placeholder="Phone Number" clearable />
          </el-form-item>
          <el-form-item label="Fax Number">
            <el-input v-model="formData.Fax_Number" placeholder="Fax Number" clearable />
          </el-form-item>
          <el-form-item label="Contact">
            <el-input v-model="formData.Contact" placeholder="Contact" clearable />
          </el-form-item>
          <el-form-item label="Address">
            <el-input
              v-model="formData.Address"
              autosize
              type="textarea"
              placeholder="Address"
            />
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button type="primary" @click="handleClickAddNewSubmitBtn(0)" :disabled="isProcessing || formData.FactoryID === ''">Submit</el-button>
            <el-button @click="handleClickClearFormBtn()" :disabled="isProcessing">Reset</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
        <button class="absolute top-0 left-1 drawer-close-Btn">
          <i class="fa-solid fa-xmark fa-lg" @click="closeDrawer"></i>
        </button>
        <router-view @hadleAfterChanged="afterChanged" :regions="regions"/>
      </template>
    </el-drawer>
    <div>
      <el-table :data="_Manufacturer_List" :height="696" size="small" style="width: 100%" @keyup.ctrl.enter="getManufacturerList()">
        <el-table-column show-overflow-tooltip header-align="center" prop="FactoryID" label="FactoryID">
          <template #header>
            <div>Manufacturer ID</div>
            <el-input v-model="Query.FactoryID" size="small" @dblclick="$Input_Clean(Query, 'FactoryID')" />
          </template>
          <template #default="scope">
            <span @click="navigateToDetail(scope.row.FactoryID)" style="cursor: pointer;">{{ scope.row.FactoryID }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="Factory_Name" label="Customer Name" width="180">
          <template #header>
            <div>Manufacturer Name</div>
            <el-input v-model="Query.Factory_Name" size="small" @dblclick="$Input_Clean(Query, 'Factory_Name')" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="Country" label="Country" width="100">
          <template #header>
            <div>Country</div>
            <el-input v-model="Query.Country" size="small" @dblclick="$Input_Clean(Query, 'Country')" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="Phone_Number" label="Phone Number" width="140" />
        <el-table-column show-overflow-tooltip header-align="center" prop="Fax_Number" label="Fax Number" width="140" />
        <el-table-column show-overflow-tooltip header-align="center" prop="Contact" label="Contact" width="140">
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" prop="Address" label="Address" width="320">
          <template #header>
            <div>Address
              <button @click="getManufacturerList()" class="absolute right-0 top-1/2 border-0 hover:border-0 transform -translate-y-1/2">
                <i class="fa-solid fa-magnifying-glass fa-xl p-1" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination class="flex justify-end" v-show="_Manufacturer_List.length > 0" v-model:page="currentPage" v-model:limit="pageSize" :total="Manufacturer_List.length" />
    </div>
  </div>
</template>

<script setup>
// import components
import NaviMenu from '../Public/Navigate_Menu.vue'
import ComptPermission from '../Public/Permission.vue'

import axios from 'axios'
import { ref, reactive, onMounted, computed } from 'vue'
import commonFunction from '@/composables/commonFunction'
import Pagination from '@/components/Pagination.vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useGroupsStore } from '@/stores/store'

const { $Input_Clean, $CheckGroup } = commonFunction()
const router = useRouter();
const drawer = ref(false)
const post = reactive({ Icons: true })
const Query = reactive({
  FactoryID: '',
  Factory_Name: '',
  Country: ''
})

const Manufacturer_List = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const sideDrawerShow = ref(false)
const formData = reactive({
  FactoryID: '',
  Factory_Name: '',
  Country: '',
  Phone_Number: '',
  Fax_Number: '',
  Contact: '',
  Address: '',
})
const isProcessing = ref(false)
const regions = ref(null)

// Element Plus input 資料驗證
const rules = reactive({
  FactoryID: [
    { required: true, message: 'Please input the FactoryID', trigger: 'blur' },
  ]
})


// get 權限
const IsAuthor = computed(() => $CheckGroup(['it author']))

// sideDrawer 開關
const sideDrawerShowToggle = () => {
  clearForm()
  sideDrawerShow.value = true
  drawer.value = true
}

const getManufacturerList = async () => {
  try {
    isLoading.value = true
    const response = await axios.post(`/api/Production/Manufacturer_List`, Query)
    Manufacturer_List.value = response.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const _Manufacturer_List = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return Manufacturer_List.value.slice(start, end)
})

const closeDrawer = () => {
  sideDrawerShow.value = false
  drawer.value = false
  router.push({ name: 'Manufacturer_List' })
}

const navigateToDetail = (FactoryID) => {
  router.push({ name: 'Manufacturer', params: { FactoryID } })
  drawer.value = true
}

// 新增一筆 Manufacturer
const handleClickAddNewSubmitBtn = async (_mode) =>{
  // _mode === 0 表示新增
  if (isProcessing.value) return
  isProcessing.value = true
  // 權限驗證
  if (!IsAuthor.value) {
    ElMessage({
      showClose: true,
      type: "error",
      message: `You don't have permission`
    })
    isProcessing.value = false
    return
  }
  // 資料驗證
  if (formData.FactoryID === '') {
    ElMessage({
      showClose: true,
      type: "error",
      message: 'Manufacturer ID is required and cannot be empty.'
    })
    isProcessing.value = false
    return
  }
  // check PK
  const res = await axios.post('/api/Production/Manufacturer_Maintain', {Mode: 3, FactoryID: formData.FactoryID})
  const count = res.data.recordset[0].count
  if (count > 0) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: `Violation of PRIMARY KEY constraint 'PK_Factory'. The duplicate key value is ${formData.FactoryID}`
    })
    console.warn('主鍵有重複')
    isProcessing.value = false
    return
  }

  const _params = { ...formData, Mode: _mode }
  try {
    const {data, status} = await axios.post('/api/Production/Manufacturer_Maintain', _params)
    if (status === 200) {
      ElMessage({
        showClose: true,
        type: 'success',
        message: 'Successfully created'
      })
    
      // close sideDrawer
      sideDrawerShow.value = false
      drawer.value = false
      clearForm()
      Query.FactoryID = _params.FactoryID
      getManufacturerList()
    }
  }
  catch(_err) {
    ElMessage({
        showClose: true,
        type: 'error',
        message: _err
      })
    console.log(_err)
  }
  finally {
    isProcessing.value = false
  }
}

// 新增表單_點擊清空_Btn
const handleClickClearFormBtn = async () => {
  let _confirm = false
  try {
    _confirm = await ElMessageBox.confirm(
      `Reset?`,
      'warning!!',
      {
        confirmButtonText: 'Reset',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
  }
  catch (_err) {
    console.log(err)
  }
  
  if (_confirm === 'confirm') clearForm()
}

// 新增表單_清空_input
const clearForm = () => {
  for (const _key in formData) { formData[_key] = '' }
}

// 資料修改後行為
const afterChanged = (_obj) => {
  // 如為刪除資料，則關閉側窗
  if (_obj.Mode === 2) {
    for (const _key in Query) {
      Query[_key] = ''
    }
    closeDrawer()
  }
  // 重新抓資料
  getManufacturerList()
}

// get 國家名 list
const getRegions = async () => {
  try {
    const res = await axios.post('/api/Public/Common/Region')
    regions.value = [...res.data]
  }
  catch(err) {
  }
}

onMounted(() => {
  getManufacturerList()
  getRegions()
})
</script>

<style scoped>
.drawer-close-Btn {
  border: 0px !important;
}

:deep(.el-input__inner:focus), :deep(.el-select__input:focus) {
  box-shadow: none;
}
</style>