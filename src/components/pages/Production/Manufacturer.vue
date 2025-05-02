<template>
  <div class="text-size">
    <div>
      <ComptPermission style="width:390px;float:left;" :post="post" @permission="Permission"></ComptPermission>
      <p v-if="Manufacturer.Data_Updater">Update: {{ Manufacturer.Data_Updater }} {{ Manufacturer.Data_Update }}</p>
    </div>
    <div :style="{ 'width': '100%' }">
      <div id="Header" class="clear-both float-none h-[175px] border border-gray-400 rounded-md p-5 mb-3 relative">
        <table>
          <tbody>
            <tr class="el-table__row">
              <td class="text-right">ID</td>
              <td>
                <el-input
                  type="text"
                  class="w-full text-left"
                  :disabled="!IsAuthor"
                  v-model="newFactoryID"
                  @keyup="$RestrictChars_Replace"
                  @change="IsAuthor && newFactoryID.trim().length > 0 && Manufacturer.FactoryID != newFactoryID ? Manufacturer_Maintain({ Mode: 1,  keyName: 'FactoryID'}) : ''" 
                />
              </td>
              <td class="text-right">Country</td>
              <td>
                <el-select
                  class="w-full text-left"
                  v-model="Manufacturer.Country"
                  filterable
                  placeholder="Select"
                  :disabled="!IsAuthor"
                  style="min-width: 120px"
                  size="small"
                  @change="IsAuthor ? Manufacturer_Maintain({ Mode: 1, keyName: 'Country' }) : ''"
                >
                  <el-option
                    v-for="region in props.regions"
                    :key="region.Region"
                    :label="region.Region"
                    :value="region.Region"
                  />
                </el-select>
              </td>
              <td class="text-right">Fax</td>
              <td>
                <el-input
                  type="text"
                  class="w-full text-left valid:border-green-500"
                  :disabled="!IsAuthor"
                  v-model="Manufacturer.Fax_Number"
                  @change="IsAuthor ? Manufacturer_Maintain({ Mode: 1, keyName: 'Fax_Number' }) : ''"
                />
              </td>
              <td class="text-right">Phone</td>
              <td>
                <el-input
                  type="text" class="w-full text-left valid:border-green-500"
                  :disabled="!IsAuthor"
                  v-model="Manufacturer.Phone_Number"
                  @change="IsAuthor ? Manufacturer_Maintain({ Mode: 1, keyName: 'Phone_Number' }) : ''"
                />
              </td>
            </tr>
            <tr>
              <td class="text-right">Name</td>
              <td colspan="7">
                <el-input
                  type="text" 
                  class="w-full text-left valid:border-green-500"
                  :disabled="!IsAuthor"
                  v-model="Manufacturer.Factory_Name"
                  @change="IsAuthor ? Manufacturer_Maintain({ Mode: 1, keyName: 'Factory_Name' }) : ''"
                />
              </td>
            </tr>
            <tr>
              <td class="text-right">Address</td>
              <td colspan="7">
                <el-input
                  type="text"
                  class="w-full text-left valid:border-green-500"
                  :disabled="!IsAuthor"
                  v-model="Manufacturer.Address"
                  @change="IsAuthor ? Manufacturer_Maintain({ Mode: 1, keyName: 'Address' }) : ''"
                />
              </td>
            </tr>
            <tr>
              <td class="text-right">Contact</td>
              <td colspan="7">
                <el-input 
                  type="text"
                  class="w-full text-left valid:border-green-500"
                  :disabled="!IsAuthor"
                  v-model="Manufacturer.Contact"
                  @change="IsAuthor ? Manufacturer_Maintain({ Mode: 1, keyName: 'Contact' }) : ''"
                />
              </td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
        <template v-if="!Manufacturer_Info.length && IsAuthor">
          <button
            class="absolute bottom-0 right-0 m-1 border-0 rounded-md hover:border-gray-500/50 hover:bg-gray-500/10 p-1"
            @click="Manufacturer_Maintain({Mode: 2})"
            :disabled="isProcessing || !IsAuthor"
          >
          <i class="fa-solid fa-trash fa-lg"></i>
        </button>
      </template>
      </div>
      <hr class="my-2" />
      <!-- add new factory_sub -->
      <div v-if="IsAuthor" class="flex justify-end my-1">
        <button class="bg-gray-500 border rounded-[50%] w-[20px] hover:bg-gray-500/80" plain @click="dialogFormVisible = true">
          <i class="fa-solid fa-plus" style="color: #fff" />
        </button>
      </div>
      <!-- Manufacturer Detail Info -->
      <template v-for="(item, index) in Manufacturer_Info" :key="index">
        <div id="Detail" class="p-3">
          <table class="w-full table-fixed">
            <tbody>
              <tr class="leading-none">
                <td class="w-1/12 border border-gray-500 cursor-pointer" @click="openFactory(item.Factory_SubID)">Factory</td>
                <td class="w-3/12 border border-gray-500 p-0">
                  <el-input
                    v-model="item.newFactory_SubID"
                    placeholder="Factory_SubID"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Factory_SubID', Factory_SubID: item.Factory_SubID, value: item.newFactory_SubID})"
                    :disabled="!IsAuthor"
                  />
                </td>
                <td class="w-1/12 border border-gray-500">Country</td>
                <td class="w-3/12 border border-gray-500 p-0">
                  <el-select
                    class="w-full text-left"
                    v-model="item.Sub_Country"
                    filterable
                    placeholder="Select"
                    style="min-width: 120px"
                    size="small"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Sub_Country', Factory_SubID: item.Factory_SubID, value: item.Sub_Country})"
                    :disabled="!IsAuthor"
                  >
                    <el-option
                      v-for="region in props.regions"
                      :key="region.Region"
                      :label="region.Region"
                      :value="region.Region"
                    />
                  </el-select>
                </td>
                <td class="w-1/12 border border-gray-500">Port</td>
                <td class="w-3/12 border border-gray-500 p-0">
                  <el-input
                    v-model="item.Port"
                    placeholder="Port"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Port', Factory_SubID: item.Factory_SubID, value: item.Port})"
                    :disabled="!IsAuthor"
                  />
                </td>
              </tr>
              <tr class="leading-none">
                <td class="w-1/12 border border-gray-500">Fax</td>
                <td class="w-3/12 border border-gray-500 p-0">
                  <el-input
                    v-model="item.Sub_Fax_Number"
                    placeholder="Sub_Fax_Number"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Sub_Fax_Number', Factory_SubID: item.Factory_SubID, value: item.Sub_Fax_Number})"
                    :disabled="!IsAuthor"
                  />
                </td>
                <td class="w-1/12 border border-gray-500">Phone</td>
                <td class="w-3/12 border border-gray-500 p-0">
                  <el-input
                    v-model="item.Sub_Phone_Number"
                    placeholder="Sub_Phone_Number"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Sub_Phone_Number', Factory_SubID: item.Factory_SubID, value: item.Sub_Phone_Number})"
                    :disabled="!IsAuthor"
                  />
                </td>
                <td class="w-1/12 border border-gray-500">Contact</td>
                <td class="w-3/12 border border-gray-500 p-0">
                  <el-input
                    v-model="item.Sub_Contact2"
                    placeholder="Contact"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Sub_Contact2', Factory_SubID: item.Factory_SubID, value: item.Sub_Contact2})"
                    :disabled="!IsAuthor"
                  />
                </td>
              </tr>
              <tr class="leading-none">
                <td class="w-1/12 border border-gray-500">Name</td>
                <td class="border border-gray-500 p-0" colspan="5">
                  <el-input
                    v-model="item.Factory_Sub_Name"
                    placeholder="Factory_Sub_Name"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Factory_Sub_Name', Factory_SubID: item.Factory_SubID, value: item.Factory_Sub_Name})"
                    :disabled="!IsAuthor"
                  />
                </td>
              </tr>
              <tr class="leading-none">
                <td class="w-1/12 border border-gray-500">Address</td>
                <td class="border border-gray-500 p-0" colspan="5">
                  <el-input
                    v-model="item.Sub_Address"
                    placeholder="Sub_Address"
                    autocomplete="off"
                    @change="Manufacturer_FactorySub({mode: 1, keyName: 'Sub_Address', Factory_SubID: item.Factory_SubID, value: item.Sub_Address})"
                    :disabled="!IsAuthor"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="relative" :class="{'h-3': item.Sub_Data_Updater === null && IsAuthor}">
            <p v-if="item.Sub_Data_Updater">Update: {{item.Sub_Data_Updater}} {{item.Sub_Data_Update}}</p>
            <button class="absolute top-1 right-1 border-0" v-if="IsAuthor" @click="Manufacturer_FactorySub({mode: 2, factorySubID: item.Factory_SubID})">
              <i class="fa-solid fa-trash fa-lg" />
            </button>
          </div>
        </div>
      </template>
    </div>
    
    <!-- dialog -->
    <el-dialog v-model="dialogFormVisible" title="New Factory" width="400" @close="testFn">
      <el-form :model="formData" :rules="rules">
        <el-form-item label="Factory Sub ID" prop="factorySubID">
          <el-input v-model="formData.factorySubID" placeholder="Factory_SubID" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-select
            class="w-full text-left"
            v-model="formData.country"
            filterable
            placeholder="Select"
            size="small"
          >
            <el-option
              v-for="region in props.regions"
              :key="region.Region"
              :label="region.Region"
              :value="region.Region"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Port" prop="port">
          <el-input v-model="formData.port" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false" :disabled="isProcessing">Cancel</el-button>
          <el-button type="primary" @click="Manufacturer_FactorySub({mode: 0})" :disabled="isProcessing || requiredNull">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入組件
import ComptPermission from '../Public/Permission.vue'

import axios from "axios"
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref, onMounted, computed, reactive } from "vue"
import { useRoute } from 'vue-router'
import commonFunction from '@/composables/commonFunction'
import { useGroupsStore } from "@/stores/store";
import { storeToRefs } from "pinia";

const groupsStore = useGroupsStore()
const { UserID } = storeToRefs(groupsStore)
const { $RestrictChars_Replace, $CheckGroup } = commonFunction()
const props = defineProps({
  regions: Array
})

const route = useRoute();
const emit = defineEmits(['hadleAfterChanged'])
const Manufacturer_Info = ref([])
const Manufacturer = ref({})
const isLoading = ref(false)
const isProcessing = ref(false)
const IsAuthor = computed(() => {
  return $CheckGroup(['it author'])
})
const post = reactive({ Beta: false, Program_Name: 'Manufacturer', IDValue: route.params.FactoryID, Icons: true })
const newFactoryID = ref('')
const State = reactive({}) //初始化 State：將 State 初始化為一個空對象。
const Permission = (item) => { State.value = item }
const dialogFormVisible = ref(false)
const formData = reactive({
  factorySubID: '',
  country: '',
  port: ''
})
const rules = ref({
  factorySubID: [
    { required: true, message: 'Please input the Factory', trigger: 'blur'}
  ],
  country: [
    { required: true, message: 'Please input the Country', trigger: 'change'}
  ],
  port: [
    { required: true, message: 'Please input the  Port', trigger: 'blur'}
  ]
})
const requiredNull = computed(() => {
  return formData.factorySubID ==='' || formData.country ==='' || formData.port ===''
})


let popupWindow = null;
const openFactory = (FactorySubID) => {
  const url = `/Factory/${encodeURIComponent(FactorySubID)}`;

  // 如果已經有開視窗且沒被關閉，就 focus 回去
  if (popupWindow && !popupWindow.closed) {
    popupWindow.location.href = url;
    popupWindow.focus();
  } else {
    popupWindow = window.open(url, 'FactoryWindow', 'width=1200,height=800');
  }
};

// 頁面卸載（關閉或重新整理）時，自動關閉 popup
window.addEventListener('unload', () => {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close();
  }
});

const getManufacturerSub_Info = async () => {
  let params = { FactoryID: route.params.FactoryID }
  try {
    isLoading.value = true
    const response = await axios.post(`/api/Production/Manufacturer_Info`, params)
    Manufacturer_Info.value = response.data
    Manufacturer_Info.value = Manufacturer_Info.value.filter(item => item.Factory_SubID !== null)
    Manufacturer_Info.value.forEach(e => e.newFactory_SubID = e.Factory_SubID)
    Manufacturer.value = {
      Address: response.data[0].Address,
      Contact: response.data[0].Contact,
      Country: response.data[0].Country,
      FactoryID: response.data[0].FactoryID,
      Fax_Number: response.data[0].Fax_Number,
      Phone_Number: response.data[0].Phone_Number,
      Factory_Name: response.data[0].Factory_Name,
      Data_Updater: response.data[0].Data_Updater,
      Data_Update: response.data[0].Data_Update
    }
    newFactoryID.value = Manufacturer.value.FactoryID
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

// Manufacturer_Maintain
const Manufacturer_Maintain = async (_obj) =>{
  // _obj.Mode === 1 表示修改
  // _obj.Mode === 2 表示刪除
  if (isProcessing.value) return
  isProcessing.value = true

  // 權限驗證
  if (!IsAuthor.value) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: `You don't have permission`
    })
    isProcessing.value = false
    return
  }

  const _params = {
    Mode: _obj.Mode,
    FactoryID: Manufacturer.value.FactoryID
  }

  switch (_obj.Mode) {
    // create -> 在 Manufacturer_List.vue
    case 0:
      break
    // upDate
    case 1:
      if (_obj.keyName === 'FactoryID') {
        _params.keyName = 'FactoryID'
        _params.newFactoryID = newFactoryID.value
        _params.FactoryID = Manufacturer.value.FactoryID
        // check PK
        const res = await axios.post('/api/Production/Manufacturer_Maintain', {Mode: 3, FactoryID: newFactoryID.value})
        const count = res.data.recordset[0].count
        if (count > 0) {
          ElMessage({
            showClose: true,
            type: 'error',
            message: `Violation of PRIMARY KEY constraint 'PK_Factory'. The duplicate key value is ${newFactoryID.value}`
          })
          newFactoryID.value = Manufacturer.value.FactoryID
          console.warn('主鍵有重複')
          isProcessing.value = false
          return
        }
      } else {
        isProcessing.value = false
        _params.keyName = _obj.keyName
        _params[_obj.keyName] = Manufacturer.value[_obj.keyName]
      }
      break
    // Del
    case 2:
      let _confirm = false
      try {
        _confirm = await ElMessageBox.confirm(
          `Are you sure you want to delete this?`,
          'warning!!',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
      }
      catch (_err) {
        ElMessage({
          showClose: true,
          type: 'info',
          message: 'Cancel Delete'
        })
        isProcessing.value = false
      }

      if (_confirm !== 'confirm') return
      break
    default:
      break
  }

  // 送出 API
  try {
    const res = await axios.post('/api/Production/Manufacturer_Maintain', _params)
    // 信息須根據動作回應
    if (res.data.Flag) {
      let _query = '', _msg = ''
      switch (_obj.Mode) {
        case 1:
          // 日期 yyyy/mm/dd
          const _formatter = new Intl.DateTimeFormat("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          const _date = _formatter.format(new Date())
          Manufacturer.value.Data_Updater = UserID.value
          Manufacturer.value.Data_Update = _date
          _msg = 'Successfully modified data'
          break
        case 2: 
          _msg = 'Successfully deleted'
          break
      }
      ElMessage({
        showClose: true,
        type: 'success',
        message: _msg,
      })
      switch (_obj.Mode) {
        case 1:
          Manufacturer.value.FactoryID = _params.newFactoryID ? _params.newFactoryID : _params.FactoryID
          // _query = Manufacturer.value.FactoryID
          break
        case 2:
          break
      }
      emit('hadleAfterChanged', {query: _query, Mode: _obj.Mode})
    } else {
      console.log('Flag: ', res.data.Flag)
    }
  }
  catch (_err) {
    console.log(_err)
  }
  finally {
    isProcessing.value = false
  }
}

// Manufacturer_FactorySub
const Manufacturer_FactorySub = async (_obj) => {
  // 權限
  if (!IsAuthor.value) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: `Permission denied`
    })
    return
  }
  
  isProcessing.value = true
  const _params = {
    Mode: _obj.mode,
  }
  switch (_obj.mode) {
    case 0:
      _params.FactoryID = Manufacturer.value.FactoryID,
      _params.Factory_SubID = formData.factorySubID,
      _params.Country = formData.country,
      _params.Port = formData.port
      // check
      const res = await axios.post('/api/Production/Manufacturer_FactorySub', {Mode: 3, Factory_SubID: formData.factorySubID})
      const count = res.data.recordset[0].count
      if (count > 0) {
        ElMessage({
          showClose: true,
          type: 'error',
          message: `Violation of PRIMARY KEY constraint 'PK_Factory_Sub'. The duplicate key value is ${formData.factorySubID}`
        })
        console.warn('主鍵有重複')
        isProcessing.value = false
        return
      }
      break
    case 1:
      // 消除前後空白
      if (_obj.value !== null) { _obj.value = _obj.value.trim() }
      // required 不可空白
      if (
        (_obj.keyName  === 'Factory_SubID' || _obj.keyName  === 'Sub_Country' || _obj.keyName  === 'Port')
        &&
        _obj.value === ''
      ) {
        ElMessage({
          showClose: true,
          type: 'error',
          message: `${_obj.keyName} cannot be empty`
        })
        return
      }

      _params.Factory_SubID = _obj.Factory_SubID
      // 特殊處裡，與資料庫欄位名稱不一 or 更改主鍵名稱
      switch (_obj.keyName) {
        case 'Sub_Address':
          _params.Address = _obj.value
          _params.keyName = 'Address'
          break
        case 'Sub_Country':
          _params.Country = _obj.value
          _params.keyName = 'Country'
          break
        case 'Sub_Fax_Number':
          _params.Fax_Number = _obj.value
          _params.keyName = 'Fax_Number'
          break
        case 'Sub_Phone_Number':
          _params.Phone_Number = _obj.value
          _params.keyName = 'Phone_Number'
          break
        case 'Sub_Contact2':
          _params.Contact = _obj.value
          _params.keyName = 'Contact'
          break
        case 'Factory_SubID':
          _params.Factory_SubID = _obj.Factory_SubID
          _params.keyName = 'Factory_SubID'
          _params.value = _obj.value
          //  check PK
          const res = await axios.post('/api/Production/Manufacturer_FactorySub', {Mode: 3, Factory_SubID: _obj.value})
          const count = res.data.recordset[0].count
          if (count > 0) {
            ElMessage({
              showClose: true,
              type: 'error',
              message: `Violation of PRIMARY KEY constraint 'PK_Factory_Sub'. The duplicate key value is ${_obj.value}`
            })
            // input 改回原來值
            const target = Manufacturer_Info.value.find(item => item.Factory_SubID === _obj.Factory_SubID)
            target.newFactory_SubID = _obj.Factory_SubID
            console.warn('主鍵有重複')
            isProcessing.value = false
            return
          }
          break
        default:
          _params[_obj.keyName] = _obj.value
          _params.keyName = _obj.keyName
          break
      }
      break
    case 2:
      // _confirm messageBox
      let _confirm = false
      try {
        _confirm = await ElMessageBox.confirm(
          `Are you sure you want to delete this?`,
          'warning!!',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
      }
      catch (_err) {
        ElMessage({
          showClose: true,
          type: 'info',
          message: 'Cancel Delete'
        })
        isProcessing.value = false
      }

      if (_confirm !== 'confirm') return

      _params.Factory_SubID = _obj.factorySubID
      break
    default:
      break
  }

  try {
    const res = await axios.post('/api/Production/Manufacturer_FactorySub', _params)
    if (res.data.Flag) {
      // 日期 yyyy/mm/dd
      const _formatter = new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      const _date = _formatter.format(new Date())
      
      switch (_obj.mode) {
        case 0:
          ElMessage({ showClose: true,  type: 'success',  message: 'Successfully created'})
          Manufacturer_Info.value.unshift({
            Factory_SubID: formData.factorySubID,
            Sub_Country: formData.country,
            Port: formData.port,
            Sub_Fax_Number: '',
            Sub_Phone_Number: '',
            Contact: '',
            Factory_Sub_Name: '',
            Sub_Address: '',
            newFactory_SubID: formData.factorySubID,
            Sub_Data_Updater: UserID.value,
            Sub_Data_Update: _date,
          })
          // 清空表單
          for (const key in formData) { formData[key] = '' }
          break
        case 1:
          ElMessage({ showClose: true,  type: 'success',  message: 'Successfully modified data'})
          // 修改畫面資料
          Manufacturer_Info.value.forEach(_el => {
            if (_el.Factory_SubID === _obj.Factory_SubID) {
              _el[_obj.keyName] = _obj.value
              _el.Sub_Data_Update = _date
            }
          });
          break
        case 2:
          ElMessage({ showClose: true,  type: 'success',  message: 'Successfully deleted'})
          // 修改畫面資料
          Manufacturer_Info.value = Manufacturer_Info.value.filter(e => e.Factory_SubID !== _obj.factorySubID)
          break
      }
    } else {
      console.log('Flag: ', res.data.Flag)
    }
  }
  catch (_err) {
    ElMessage({ showClose: true,  type: 'error',  message: _err})
    console.log(_err)
  }
  finally {
    isProcessing.value = false
    dialogFormVisible.value = false
  }
}

const testFn = () => {
  for (const _key in formData) {
    formData[_key] = ''
  }
}

onMounted(() => {
  getManufacturerSub_Info()
})
</script>


<style scoped>
.text-size {
  font-size: 12px;
}

#Header {
  table {
    border-collapse: separate !important;
    border-spacing: 0 5px !important;
    tbody {
      input {
        box-shadow: none !important;
      }
    }
  }
}

:deep(.el-input__inner:focus), :deep(.el-select__input:focus) {
  box-shadow: none;
}

#Detail {
  margin: 0 0 10px 0;
  clear:both;
  float:none;
  border: 1px solid #cccccc;
  border-radius: 5px;
  .el-input {
    height: 100%;
    :deep(.el-input__wrapper) {
      border-radius: 0;
    }
  }
  :deep(.el-select__wrapper) {
    border-radius: 0;
  }
}

.cursor-pointer {
  cursor: pointer;
  font-weight: bold;
}
</style>
