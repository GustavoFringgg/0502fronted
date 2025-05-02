<template>
  <div style=" font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale; text-align: center; width:1280px;">
      <el-dialog v-model="InsertDialogVisible">
        <div style="padding:6px 16px;">
          <div style="height:10px;border-bottom:1px solid #cccccc;"></div>
            <table >
              <caption style="height:30px; padding:5px 0px 3px 0px; line-height: 2;" >Create Funds Request Data</caption>
              <tbody>
                <tr>
                    <td class="model_field">Brand:</td>
                    <td>
                      <el-select v-model="Funds_Request_Insert.Brand" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Brand" :key="index" :label="option.Brand" :value="option.Brand" />
                      </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="model_field">Supplier:</td>
                    <td>
                      <el-select v-model="Funds_Request_Insert.SupplierID" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Supplier" :key="index" :label="option.SupplierID" :value="option.SupplierID" />
                      </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="model_field">Currency:</td>
                    <td>
                      <el-select v-model="Funds_Request_Insert.Currency" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Currency" :key="index" :label="option.Currency" :value="option.Currency" />
                      </el-select>
                    </td>
                </tr>
              </tbody>
              <tfoot>
                <tr><td colspan="2" style="text-align:center; height:15px;"><hr/></td></tr>
                <tr><td colspan="2" style="text-align:center; height:40px;">
                        <button style="width:80px; border: 1px solid #cccccc;" v-if="Supplier_Insert_Flag"  @click.prevent="Supplier_Insert_Flag ? Supplier_Maintain({Mode:0, items:Supplier_Insert}):''" >Save</button>
                    </td>
                </tr>
              </tfoot>
            </table>
        </div>
      </el-dialog>      
      <div v-if="Insert_Mode_Invisible" style=" text-shadow: 2px 2px 3px #ccc; ">
        <ComptPermission style="width:390px;float:left;" :post="post" @permission="Permission"></ComptPermission>
        <div style="width:240px; float:right; height:32px; line-height:32px; text-align:left;"  >Update: {{Data_Updater}} {{Data_Update}}</div>
        <div style="float: none; clear: both;">
          <table style="width:100%;" v-for="(item, index) in Funds_Request_Info" :key="index">
            <tbody >
              <tr>
                <td class="model_field">Funds Request ID:</td>
                <td>{{item.Funds_RequestID}}</td>
                <td class="model_field">Apply Date:</td>
                <td>{{item.Apply_Date}}</td>
                <td class="model_field">Department:</td>
                <td>{{item.Department}}</td>
                <td rowspan="5" style="text-align:center;">
                  <table>
                    <caption style="height:30px; padding:5px 0px 3px 0px; line-height: 2;" >Purchase Order</caption>
                    <thead>
                      <tr>
                        <th >Date</th>
                        <th >PP No</th>
                        <th >Purchase No</th>
                        <th >Amount</th>
                      </tr>
                      <tr>
                        <th>{{Purchase_Order_Insert.Purchase_Date}}</th>
                        <th>{{Purchase_Order_Insert.Purchase_Project_No}}</th>
                        <th>
                          <el-select v-model="Purchase_Order_Insert.Purchase_No" filterable size="small" placeholder=" ">
                            <el-option v-for="(option, index) in Purchase_Order_Info" :key="index" :label="option.label" :value="option.value" />
                          </el-select>
                        </th>
                        <th>{{Purchase_Order_Insert.Pay_Amount}}</th>
                      </tr>
                    </thead>
                  </table>
                  <!--
                  <table>
                    <tbody>
                      <tr>
                        <td class="model_field">Order No:</td>
                        <td>{{item.Order_No}}</td>
                      </tr>
                      <tr>
                        <td class="model_field">Description:</td>
                        <td>{{item.Description}}</td>
                      </tr>
                      <tr>
                        <td class="model_field">Qty:</td>
                        <td>{{item.Qty}}</td>
                      </tr>
                      <tr>
                        <td class="model_field">Delivery Date:</td>
                        <td>{{item.Delivery_Date}}</td>
                      </tr>
                    </tbody>
                  </table>
                  -->
                </td>
              </tr>
              <tr>
                <td class="model_field">Brand:</td>
                <td>{{item.Brand}}</td>
              </tr>
              <tr>
                <td class="model_field">Supplier:</td>
                <td>{{item.SupplierID}}</td>
              </tr>
              <tr>
                <td class="model_field">Currency:</td>
                <td>{{item.Currency}}</td>
              </tr>
              <tr>
                <td class="model_field">Currency:</td>
                <td>{{item.Currency}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
</template>
<script setup>
  import ComptPermission from '@/components/pages/Public/Permission.vue' 
  import { onMounted, ref, computed, reactive, watch } from "vue"
  import { useRoute } from "vue-router"
  import axios from "axios"
  import commonFunction from '@/composables/commonFunction'

  const route = useRoute()

  //從commonFunction中獲取函數
  const { $Input_Clean, $CheckDate, $CheckGroup, $CommaFormat, $CommaFormat_F, hostname, host  } = commonFunction() 

  const State = reactive({}) //初始化 State：將 State 初始化為一個空對象。
  const Data_Updater = ref('') //資料更新者
  const Data_Update = ref('') //資料更新時間
  const post = reactive({ Icons: false }) 
  const InsertDialogVisible = ref(false)
  const Purchase_Order_Insert = ref({ Purchase_Date: '', Purchase_Project_No: '', Purchase_No: '', Pay_Amount: 0 })
  const Funds_Request_Insert = reactive({ Funds_RequestID: '',Brand:'', SupplierID: '', Qty: 0, Currency: 'USD', Delivery_Date: '' })
  const Query = reactive({ Mode:0, Funds_RequestID: route.params.Funds_RequestID, Brand: '', SupplierID: '', Order_No: '', Description: '', Currency: '', Date_From: '', Date_To: '', UserID: '' })
  const WinHandle = ref(null) 
  const Purchase_Order_Info = ref([])
  const Funds_Request_Info = ref([]) 
  const isLoading = ref(false)  
 
  const IsPurchaseAuthor = ref($CheckGroup(['purchase author'])) 
  const IsAccountingAuthor = ref($CheckGroup(['accounting author'])) 
  const IsITAuthor = ref($CheckGroup(['it author'])) 

  onMounted(async () => {
    Load_Purchase_Order_Info()
    await Load_Funds_Request_Info()
    window.addEventListener('beforeunload', e => Close_WinHandle());
  })

  const Permission = (item) => {
    State.value = item
    Data_Updater.value = item.Data_Updater
    Data_Update.value = item.Data_Update
  }

// 取得Purchase Order資料
  const Load_Purchase_Order_Info = async () => {
    try {
      const response = await axios.post(`/api/Purchasing/Funds_Request/Purchase_Order_Info`, Query)
      Purchase_Order_Info.value = response.data
    } catch (error) {
      console.error('Error loading Purchase Order Info:', error)
    } finally {
    }
  }

// 取得Funds Request資料
  const Load_Funds_Request_Info = async () => {
    isLoading.value = true
    try {
      const response = await axios.post(`/api/Purchasing/Funds_Request/Funds_Request_Info`, Query)
      Funds_Request_Info.value = response.data.Funds_Request_Info
    } catch (error) {
      console.error('Error loading Funds Request Info:', error)
    } finally {
      isLoading.value = false
    }
  }

  const Close_WinHandle = () => {
    if (WinHandle.value) {
      WinHandle.value.close()
      WinHandle.value = null
    }
  }

  const Insert_Mode_Invisible = computed(() => {
    return route.params.Funds_RequestID !== 'Insert' 
  })

// 監聽 Funds_Request_Insert 的變化
  watch(
  () => Purchase_Order_Insert.value?.Purchase_No,
  (newVal) => {
    if (newVal) {
      const selectedOption = Purchase_Order_Info.value.find(option => option.value === newVal)
      if (selectedOption) {
        Purchase_Order_Insert.value.Purchase_Date = selectedOption.Purchase_Date
        Purchase_Order_Insert.value.Purchase_Project_No = selectedOption.Purchase_Project_No
        Purchase_Order_Insert.value.Pay_Amount = selectedOption.Pay_Amount
      }
    }
  }
)

</script>

<style scoped>

</style>