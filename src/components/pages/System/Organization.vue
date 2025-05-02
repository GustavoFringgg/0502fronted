<template>
  <div v-if="Insert_Mode_Invisible" class="w-full">
    <ComptPermission style="width:390px; float:left;" :post="post" @permission="Permission"></ComptPermission>
    <div class="text-xs" style="float:right; height:32px; line-height:32px; text-align:left;">
      <el-tooltip :content="`Create_Date: ${Create_Date}`" :disabled="!Create_Date" placement="top">
        <span> {{ Data_Updater ? `Update: ${Data_Updater} ${Data_Update}` : '' }}</span>
      </el-tooltip>
      <n-icon class="cursor-pointer p-0.5" :component="Trash" size="16" :depth="2" v-if="IsAuthor && IsUserEmpty && Basic_Info_Check"
              @click.prevent="Organization_Maintain({ Mode: 2 })" />
    </div>
    <div id="Head" class="clear-both float-none border-gray-300 rounded p-2 text-xs">
      <table v-for="(item, index) in Organization_Info" :key="index" class="w-full">
        <tbody>
          <tr>
            <td>
              <div style="display:inline-flex;padding:20px">
                <el-image :src="`${hostname}/` + item.Org_Photo" class="image-container" style="width:320px;height:120px" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div id="Head" class="clear-both float-none border border-gray-300 rounded p-2 text-xs">
                <table>
                  <tbody>
                    <tr>
                      <td class="text-right">Organization:</td>
                      <td>
                        <el-input v-model="item.OrganizationID" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="IsAuthor && item.Data.OrganizationID.trim().length > 0 && item.OrganizationID != $route.params.OrganizationID ? Organization_Maintain({ Mode: 1, Name: 'OrganizationID', items: item }) : ''"
                                  @keyup="$RestrictChars_Replace" type="text" size="small" class="w-full text-left" />
                      </td>
                      <td class="text-right" style="white-space:nowrap">Tax Serial Number:</td>
                      <td>
                        <el-input v-model="item.Business_No" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Business_No', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-right" style="white-space:nowrap;">Organization Name (Eng) :</td>
                      <td colspan="3">
                        <el-input v-model="item.Organization_Name_ENG" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Organization_Name_ENG',  items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-right">商業機構 (中文):</td>
                      <td colspan="3">
                        <el-input v-model="item.Organization_Name_CHT" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Organization_Name_CHT',  items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br>
              <hr>
              <br>
              <div id="Head" class="clear-both float-none border border-gray-300 rounded p-2 text-xs">
                <table>
                  <tbody>
                    <tr>
                      <td class="text-right">Region/ Contry (Eng):</td>
                      <td>
                        <el-input v-model="item.Region_ENG" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Region_ENG', items: item })"
                                  type="text" size="small" class="w-full text-left" />
                      </td>
                      <td colspan="2" class="w-[220px]"></td>
                    </tr>
                    <tr>
                      <td class="text-right">區域 / 國家 (中文):<br><br></td>
                      <td>
                        <el-input v-model="item.Region_CHT" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Region_CHT', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" /><br><br>
                      </td>
                      <td colspan="3"></td>
                    </tr>
                    <tr>
                      <td class="text-right">Postcode (郵遞區號):<br><br></td>
                      <td>
                        <el-input v-model="item.Postcode" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Postcode', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" /><br><br>
                      </td>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td class="text-right">State / City (Eng):</td>
                      <td>
                        <el-input v-model="item.State_City_ENG" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'State_City_ENG', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td class="text-right">州府省市 (中文):<br><br></td>
                      <td>
                        <el-input v-model="item.State_City_CHT" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'State_City_CHT', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" /><br><br>
                      </td>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td class="text-right">Township / District (Eng):</td>
                      <td>
                        <el-input v-model="item.Township_District_ENG" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Township_District_ENG',  items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td class="text-right">鄉鎮市區 (中文):<br><br></td>
                      <td>
                        <el-input v-model="item.Township_District_CHT" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Township_District_CHT',  items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" /><br><br>
                      </td>
                      <td colspan="3"></td>
                    </tr>
                    <tr>
                      <td class="text-right">Street (Eng):</td>
                      <td colspan="4">
                        <el-input v-model="item.Street_ENG" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Street_ENG', items: item })"
                                  type="text" size="small"
                                  class="w-[100px] text-left" />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-right">道路街號 (中文):<br><br></td>
                      <td colspan="3">
                        <el-input v-model="item.Street_CHT" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Street_CHT', items: item })"
                                  type="text" size="small"
                                  class="w-[100px]  text-left" /><br><br>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br>
              <div id="Head" class="clear-both float-none  border-gray-300 rounded p-2 text-xs">
                <table>
                  <tbody>
                    <tr>
                      <td class="text-right">Tel No:</td>
                      <td>
                        <el-input v-model="item.Phone_Number" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Phone_Number', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                      <td class="text-right">Chairman:</td>
                      <td>
                        <el-input v-model="item.Chairman_ENG" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Chairman_ENG', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-right">Fax No:</td>
                      <td>
                        <el-input v-model="item.Fax_Number" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Fax_Number', items: item })"
                                  type="text" size="small" class="w-full text-left" />
                      </td>
                      <td class="text-right">Chairma (中文):<br><br></td>
                      <td>
                        <el-input v-model="item.Chairman_CHT" :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                  @change="Organization_Maintain({ Mode: 1, Name: 'Chairman_CHT', items: item })"
                                  type="text" size="small"
                                  class="w-full text-left" /><br><br>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="text-left" :style="`opacity: ${item.Supervisor_Approver_Check ? '0.1' : '1'};`">
                        <span class="align-middle">History:</span>
                        <el-checkbox v-model="item.History_Check"
                                    :disabled="!(IsAuthor || item.Basic_Info_Check)"
                                    @change="Organization_Maintain({ Mode: 1, Name: 'History_Check', items: item })"
                                    :label="item.History_User ? `${item.History_User} ${item.Histiry_Date}` : ''" class="pl-1 align-middle" size="small" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <el-dialog v-model="dialogOrganizationVisible" :before-close="handleOrganizationBeforeClose" modal-class="custom-dialog" width="250" top="5vh">
    <div class="text-xs">
      <table>
        <caption style="height:30px; padding:5px 0px 3px 0px; line-height: 2;">Create Organization Data</caption>
        <tbody>
          <tr>
            <td>OrganizationID:</td>
            <td>
              <el-input type="text" size="small" :input-style="{ 'width': '100px', 'color': Check_OrganizationID_Flag ? 'black' : 'red' }"
                        @keyup="$RestrictChars_Replace" @change="checkOrganizationID(Organization_Insert.OrganizationID)"
                        v-model="Organization_Insert.OrganizationID" />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align:center; height:15px;">
              <hr />
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center; height:40px;"> <el-button style="width:80px; border: 1px solid #cccccc;" v-if="Organization_Insert_Flag"
                         @click.prevent="Organization_Maintain({ Mode: 0, items: Organization_Insert })">Save</el-button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </el-dialog>

</template>

<script setup>
import ComptPermission from '@/components/pages/Public/Permission.vue'
import axios from 'axios'
import { ref, reactive, onMounted, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { Trash, Mail, PaperPlaneOutline, AddCircle, Pencil, Home, InformationCircleOutline, Save } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'
import { useGroupsStore } from '@/stores/store'
import commonFunction from '@/composables/commonFunction'

const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const { hostname, host_cors, $CheckGroup, $RestrictChars, $RestrictChars_Replace, $CheckDate, $FillUp_Date } = commonFunction()

const post = reactive({ Beta: false, Program_Name: 'Organization', IDValue: route.params.OrganizationID, Icons: true })
const emit = defineEmits(['closeDrawer'])
const tabActiveName = ref('first')

onMounted(() => {
  if (route.params.OrganizationID === 'Insert') {
    dialogOrganizationVisible.value = true
  } else {
    getOrganization_Info()
  }
})

const dialogOrganizationVisible = ref(false)
const Organization_Insert = reactive({ OrganizationID: '' })
const Check_OrganizationID_Flag = ref(false)
const checkOrganizationID = async (OrganizationID) => {
  Check_OrganizationID_Flag.value = false
  if (OrganizationID.length <= 0) {
    return
  }
  try {
    let param = { OrganizationID: OrganizationID }
    const response = await axios.post(`/api/System/Organization/Check_OrganizationID`, param)
    Check_OrganizationID_Flag.value = response.data.Flag
  } catch (error) {
    console.log(error)
  }
}
const handleOrganizationBeforeClose = async () => {
  emit('closeDrawer')
}

const Organization_Info = ref([])
const Data_Updater = ref('')
const Data_Update = ref('')
const Create_Date = ref('')
const Basic_Info_Check = ref(0)
const getOrganization_Info = async () => {
  let params = { OrganizationID: route.params.OrganizationID }
  await axios.post(`/api/System/Organization/Organization_Info`, params)
    .then(async (response) => {
      Organization_Info.value = response.data;
      Data_Updater.value = response.data[0].Data_Updater;
      Data_Update.value = response.data[0].Data_Update;
      Create_Date.value = response.data[0].Create_Date;
      Basic_Info_Check.value = response.data[0].Basic_Info_Check;
    })
    .catch(function (error) {
      console.log(error)
    })
}


const Organization_Maintain = async (obj) => {
  let result = false
  let OrganizationID = obj.Mode == 0 ? obj.items.OrganizationID.trim().replace($RestrictChars, '').substr(0, 15).toUpperCase() : route.params.OrganizationID
  let params = { Mode: obj.Mode, OrganizationID: OrganizationID }
  // req.body.Mode === 0 表示新增
  // req.body.Mode === 1 表示修改
  // req.body.Mode === 2 表示刪除
      params.Name = obj.Name
      let Value = ''
      let MName=obj.Name
      params.DataType=obj.items.DataType[0][obj.Name]
      params.ColSize=obj.items.ColSize[0][obj.Name]
  switch (obj.Mode) {
    case 0:
    case 2:
      break
    case 1:
      switch (obj.Name) {
        case 'OrganizationID':
          Value = obj.items[obj.Name].trim().substr(0, 10).toUpperCase()
          OrganizationID = Value
          break
        case 'History_Check':
          Value = obj.items[obj.Name] ? 1 : 0
          break
        default:
          Value = obj.items[obj.Name]
          break
      }
      if ($CheckGroup(['it author']) === true) {
        //alert(params['UserID'])
        //alert(Value);
      }
      params.Value = Value
      break
    default:
      break
  }


  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete OrganizationID [${OrganizationID}] data ?`) : ''
  if ((obj.Mode == 2 && result == false)) {
    return
  }
  try {
    const response = await axios.post(`/api/System/Organization/Organization_Maintain`, params)
    let Flag = response.data.Flag
    let Msg = ''
    // console.log(response.data)
    switch (obj.Mode) {
      case 0:
        Msg = `Insert Organization Data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 1:
        Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
        break
      case 2:
        Msg = `Delete Organization Data ${Flag ? 'Success!' : 'fail!'}`
        break
      default:
        break
    }
    if (Flag) {
      window.$message.success(Msg)
      switch (obj.Mode) {
        case 0:
          await router.replace({ name: 'Organization', params: { OrganizationID: OrganizationID } })
          getOrganization_Info()
          dialogOrganizationVisible.value = false
          break
        case 1:
          switch (obj.Name) {
            case 'OrganizationID':
              await router.replace({ name: 'Organization', params: { OrganizationID: OrganizationID } })
              getOrganization_Info()
              break
            default:
              getOrganization_Info()
              break
          }
          break
        case 2:
          router.push({ name: 'Organization_List' })
          break
      }
    } else {
      getOrganization_Info()
      window.$message.error(Msg)
    }
  } catch (error) {
    console.log(error)
  }
}



/* const dialogCreateClientVisible = ref(false)
const Client = ref([])
const Client_Insert = ref('')
const getClient = async () => {
  let params = { OrganizationID: route.params.OrganizationID }
  try {
    const response = await axios.post(`/api/Sales/Organization/Client`, params)
    Client.value = response.data.map(function (item) {
      return {
        "value": item.Client,
        "label": item.Client
      }
    })
  } catch (error) {
    console.log(error)
  }
} */

const State = reactive({})
const Permission = (item) => {
  State.value = item
}
const IsAuthor = computed(() => {
  return (
    //$CheckGroup(['it author', 'sales author']) &&
    (route.params.OrganizationID === 'Insert' ||
      State.value?.IsCrew ||
      State.value?.IsSuperior ||
      State.value?.IsOwner ||
      State.value?.IsDeputy ||
      State.value?.IsCooperator ||
      State.value?.IsUserEmpty)
  )
})
const IsUserEmpty = computed(() => {
  return State.value?.IsUserEmpty
})
const IsSuperior = computed(() => {
  const { Superior } = Organization_Info.value[0]
  return groupsStore.UserID === Superior
    || $CheckGroup(["it admin", "it author", "it read"])
})
/* const IsDepartment_Superior = computed(() => {
  const { Department_Superior } = Organization_Info.value[0]
  return groupsStore.UserID === Department_Superior
    || $CheckGroup(["it admin", "it author", "it read"])
}) */
/* const IsAccounting = computed(() => {
  return ($CheckGroup(["it admin", "it author", "it read"]))
})
const Is_IT_Author = computed(() => {
  return ($CheckGroup(['it author']))
}) */
const Insert_Mode_Invisible = computed(() => {
  return route.params.OrganizationID !== 'Insert' && Organization_Info.value.length > 0
})
const Author_Organization_Flag = computed(() => {
  return (IsAuthor.value && Check_OrganizationID_Flag.value)
})
const Organization_Insert_Flag = computed(() => {
  return (Author_Organization_Flag.value && Organization_Insert.OrganizationID)
})

</script>

<style lang="css" scoped>
.inputNumberNoSpin :deep(input::-webkit-inner-spin-button),
.inputNumberNoSpin :deep(input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
}
</style>

<style>
.el-table__placeholder {
  display: none !important;
}

.Payment_Detail .el-table tbody tr:hover>td {
  background: none !important;
}

.Payment_Detail .el-table .el-table__inner-wrapper .el-table__header-wrapper {
  display: none !important;
}
</style>
