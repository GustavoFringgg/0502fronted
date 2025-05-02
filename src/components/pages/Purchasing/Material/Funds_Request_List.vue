<template>
    <div style=" font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; text-align: center; width:1280px;">         
        <NaviMenu></NaviMenu>
        <div style="padding-left:5px; text-align:left; float:left; width:350px; line-height: 32px; font-size: 18px !important; text-shadow: 2px 2px 3px #ccc; ">
            <ComptPermission style="width:390px;float:left;" :post="post"></ComptPermission>
        </div>
        <div :style="{'font-size': '20px', 'float':'right', 'padding-top':'6px', 'text-align': 'center', 'cursor': 'pointer', 'width':'24px', 'height':'32px'}" title="'Create New Material'"
        v-if="IsAuthor" @click.prevent="IsITAuthor ? OpenWindow({Name:'Material_Edit', ID:'Insert', width:'1250px', height:'600px'}):''" ><i style="width:20px; height:20px;" class="fas fa-plus-circle"></i></div>
        <div style="clear:both; float:none; min-height:510px">
            <table style="width:100%; " class="listtable table-gridline-both " v-on:keypress.ctrl="Load_Funds_Request_List()" >
                <thead>
                    <tr >
                        <th style="width:60px;">ID</th>
                        <th style="width:100px;">Brand</th>
                        <th style="width:100px;">SupplierID</th>
                        <th style="width:100px;">Order No</th>
                        <th style="width:120px;">Description</th>
                        <th style="width:60px;">Qty</th>
                        <th style="width:30px;" >Currency</th>
                        <th style="width:80px;">Amount</th>
                        <th style="width:80px;">Used Amount</th>
                        <th style="width:65px;">Payment Terms</th>
                        <th style="width:65px;">Delivery Date</th>
                        <th style="width:80px;">Est.Pay Date</th>
                        <th style="width:80px;">Delivery Term</th>
                        <th style="width:65px;">UserID</th>
                        <th style="width:60px;" rowspan="2">
                          <div id="Funds_Request_List_click" @click.prevent="Load_Funds_Request_List()"
                                style="font-size: 20px; width:40px; height:40px; cursor: pointer; vertical-align: middle; margin-right:3px; text-align: center;" >
                                <i style="width:20px; height:20px; " class="fab fa-youtube"></i>
                            </div>
                        </th>
                    </tr>
                    <tr >
                        <th><input type="text" style="width:100%;" v-model="Query.Funds_RequestID" @dblclick="$Input_Clean(Query, 'Funds_RequestID')" /></th>
                        <th><input type="text" style="width:100%;" v-model="Query.Brand" @dblclick="$Input_Clean(Query, 'Brand')" /></th>
                        <th><input type="text" style="width:100%;" v-model="Query.SupplierID" @dblclick="$Input_Clean(Query, 'SupplierID')" /></th>
                        <th><input type="text" style="width:100%;" v-model="Query.Order_No" @dblclick="$Input_Clean(Query, 'Order_No')" /></th>
                        <th><input type="text" style="width:100%;" v-model="Query.Description" @dblclick="$Input_Clean(Query, 'Description')" /></th>
                        <th></th>
                        <th><input type="text" style="width:100%;" v-model="Query.Currency" @dblclick="$Input_Clean(Query, 'Currency')" /></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th><input class="Orig hove" placeholder="From" type="text" :style="{'color': ($CheckDate(Query.Date_From) ? 'black':'red')}" v-model="Query.Date_From" @dblclick="$Input_Clean(Query, 'Date_From')" />~
                            <input class="Orig hove" placeholder="To" type="text" :style="{'color': ($CheckDate(Query.Date_To) ? 'black':'red')}" v-model="Query.Date_To" @dblclick="$Input_Clean(Query, 'Date_To')" />
                        </th>
                        <th></th>
                        <th></th>
                        <th><input type="text" style="width:100%;" v-model.lazy="Query.UserID" @dblclick="$Input_Clean(Query, 'UserID')" /></th>
                    </tr>
                </thead>
                <tbody style="min-height:220px;">
                    <tr v-for="(item, index) in DataTable" :key="index" >
                        <td>
                            <div :style="{'text-align':'center','white-space': 'nowrap', 'cursor': 'pointer', 'width': '50px', 'height':'20px'}" 
                            @click.prevent="OpenWindow({Name:'Funds_Request_Edit', items:item})"
                            >{{item.Funds_RequestID}}</div>
                        </td>
                        <td>
                            <div style=" display: block; "                            
                            >{{item.Brand}}</div>
                        </td>
                        <td>
                            <div style=" display: block; " 
                            >{{item.SupplierID}}</div>
                        </td>
                        <td>
                            <div style=" display: block; " 
                            >{{item.Order_No}}</div>
                        </td>
                        <td> 
                            <div style="display: block; "
                            >{{item.Description}}</div>
                        </td>
                        <td> 
                            <div style="display: block; text-align: right;"
                            >{{$CommaFormat(item.Qty)}}</div>
                        </td>
                        <td>
                          <div style=" display: block; text-align: center;"
                            >{{item.Currency}}</div>
                        </td>
                        <td>
                          <div style="display: block; text-align: right;"
                            >{{$CommaFormat_F(item.Pay_Amount,2)}}</div>
                        </td>
                        <td>
                          <div style="display: block; text-align: right;"
                            >{{$CommaFormat_F(item.Paid_Amount,2)}}</div>
                        </td>
                        <td>
                          <div style=" display: block; "
                            >{{item.Payment_Terms}}</div>
                        </td>
                        <td>
                          <div style=" display: block; "
                            >{{item.Delivery_Date}}</div>
                        </td>
                        <td>
                          <div style=" display: block; "
                            >{{item.Est_Pay_Date}}</div>
                        </td>
                        <td>
                          <div style="display: block; "
                            >{{item.Delivery_Term}}</div>
                        </td>
                        <td>
                          <div style=" display: block; "
                            >{{item.UserID}}</div>
                        </td>
                        <td colspan="2">
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="20"  >
                          <Pagination class="flex justify-end" style="display: inline-block;" v-show="DataTable.length > 0" v-model:page="currentPage" v-model:limit="pageSize"
                                      :total="Funds_Request_List.length" />
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>  
import NaviMenu from '@/components/pages/Public/Navigate_Menu.vue' //引入了Vue組件Navigate_Menu.vue和Permission.vue
import ComptPermission from '@/components/pages/Public/Permission.vue'
import axios from 'axios' //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue' //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import { NIcon } from 'naive-ui' //引入了Naive UI的NIcon和Ionicons圖標庫中的SearchOutline
import { SearchOutline } from '@vicons/ionicons5'
import commonFunction from '@/composables/commonFunction'  //引入了自定義的commonFunction
import Pagination from '@/components/Pagination.vue'  //引入了Pagination組件
import { useRoute, useRouter } from 'vue-router'  //引入了Vue Router的useRoute和useRouter來處理路由

const { $Input_Clean, $CheckDate, $CheckGroup, $CommaFormat, $CommaFormat_F, hostname, host  } = commonFunction() //從commonFunction中獲取$Input_Clean函數
const route = useRoute();
const router = useRouter();

const IsAuthor = ref($CheckGroup(['purchase author'])) //使用ref創建了IsAuthor和IsITAuthor兩個響應式狀態
const IsITAuthor = ref($CheckGroup(['it author'])) //使用ref創建了IsITAuthor。
const isNaviMenu = ref(false) //使用ref創建了isNaviMenu兩個響應式狀態
const post = reactive({ Icons: false }) //使用reactive創建了post和Query兩個響應式對象，分別存儲狀態信息。
const Query = reactive({ Funds_RequestID: '', Brand: '', SupplierID: '', Order_No: '', Description: '', Currency: '', Date_From: '', Date_To: '', UserID: '' })
const WinHandle = ref(null) //使用ref創建了WinHandle。
const Funds_Request_List = ref([]) //Funds_Request_List：一個響應式的空數組，用於存儲預付款列表。
const isLoading = ref(false)  //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const currentPage = ref(1)    //currentPage：一個響應式的整數值，用於存儲當前頁碼。
const pageSize = ref(20)      //pageSize：一個響應式的整數值，用於存儲每頁顯示的記錄數量。

onMounted(async () => {
  isNaviMenu.value = true
  await Load_Funds_Request_List()
  window.addEventListener('beforeunload', e => Close_WinHandle());
})

const Load_Funds_Request_List = async () => {
  try {
    isLoading.value = true
    const response = await axios.post(`/api/Purchasing/Funds_Request/Funds_Request_List`, Query)
    Funds_Request_List.value = response.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
};

const Close_WinHandle = () => {
    if( WinHandle.value != null) {
        WinHandle.value.close();
        WinHandle.value = null;
    }
};

const OpenWindow = (obj) => {
    //console.log(obj)
    var URL = '';
    obj.Name = obj.Name ? obj.Name : 'Report';
    obj.height = obj.height ? obj.height : 600;
    obj.width  = obj.width  ? obj.width : 800;
    try {
      Close_WinHandle();
    } catch (error) {
      //console.log(error)
    }
    switch(obj.Name) {
        case 'Funds_Request_Edit':
            obj.height = 950;
            obj.width = 1080;
            URL= `${host}/${obj.Name}/${encodeURIComponent(obj.items.Funds_RequestID)}`
        break;
        default:
        break;
    }
    WinHandle.value = window.open(URL, obj.Name,
        `width=${obj.width},height=${obj.height},left=null, top=null, location=no, directories=no, menubar=no, resizable=no, scrollbars=yes, status=no, titlebar=no, toolbar=no`
    );
    WinHandle.value.moveTo(200,10);
    return false;
};

const DataTable = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return Funds_Request_List.value.slice(start, end)
})
</script>

<style lang="css" scoped>
    input[type=text]{
      font-size:12px;
    }
    .hove:focus {
        width:65px !important;
        text-indent: revert;
        text-align: initial;
    }
     
    .Orig {
        width:30px !important;
        text-indent: -30px;
        text-align: right;
    }
</style>