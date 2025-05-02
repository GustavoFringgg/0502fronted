<template>
    <div style=" font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; text-align: center; width:1280px;">         
        <NaviMenu></NaviMenu>
        <div style="padding-left:5px; text-align:left; float:left; width:350px; line-height: 32px; font-size: 18px !important; text-shadow: 2px 2px 3px #ccc; ">
            <ComptPermission style="width:390px;float:left;" :post="post"></ComptPermission>
        </div>
        <div v-if="isLoading" style="position: fixed; box-sizing: border-box; left: 0; top: 0; width: 100%; height: 100vh; background: rgba(255,255,255,.5) !important; z-index: 999; opacity: 1;">
            <div id='loadingDiv' :style="{'margin-top':'400px', 'margin-left':'570px'}" ><img src="@/assets/Loading.gif"  /></div>
        </div>
        <div style="clear:both; float:none; min-height:510px">
          <table style="width:100%; " v-on:keypress.ctrl="Load_Production_Progress_List()" >
            <thead>
                <tr >
                    <th style="width:60px;">Customer:</th>
                    <th style="width:60px;">
                      <el-select v-model="Query.CustomerID" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Customer" :key="index" :label="option.CustomerID" :value="option.CustomerID" />
                      </el-select>
                    </th>
                    <th style="width:60px;">Brand:</th>
                    <th style="width:60px;">
                      <el-select v-model="Query.Brand" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Brand" :key="index" :label="option.Brand" :value="option.Brand" />
                      </el-select>
                    </th>
                    <th style="width:60px;">Delivery:</th>
                    <th style="width:120px;">
                      <input type="text" :style="{ 'width':'60px', 'color': ($CheckDate(Query.Delivery_From) ? 'black':'red') }" 
                        v-model="Query.Delivery_From" @dblclick="$Input_Clean(Query, 'Delivery_From')" />~
                        <input type="text" :style="{ 'width':'60px', 'color': ($CheckDate(Query.Delivery_To) ? 'black':'red') }" 
                        v-model="Query.Delivery_To" @dblclick="$Input_Clean(Query, 'Delivery_To')" />
                    </th>
                    <th style="width:60px;" >Factory:</th>
                    <th style="width:60px;">
                      <input type="text" style="width:100%;" v-model="Query.Factory_SubID" @dblclick="$Input_Clean(Query, 'Factory_SubID')" />
                    </th>
                    <th style="width:60px;">E.Last:</th>
                    <th style="width:120px;">
                      <input type="text" :style="{ 'width':'60px', 'color': ($CheckDate(Query.Est_Last_From) ? 'black':'red') }" 
                        v-model="Query.Est_Last_From" @dblclick="$Input_Clean(Query, 'Est_Last_From')" />~
                        <input type="text" :style="{ 'width':'60px', 'color': ($CheckDate(Query.Est_Last_To) ? 'black':'red') }" 
                        v-model="Query.Est_Last_To" @dblclick="$Input_Clean(Query, 'Est_Last_To')" />
                    </th>
                    <th style="width:60px;" >
                      <el-checkbox v-model="Query.Shipment_Closed"
                      label="+ Shipped"
                       class="pl-1 align-middle" size="small" />
                    </th>
                    <th style="width:120px;">
                        <input type="radio" name="Report_Radio" id="Report_Radio" value="Brand" v-model="Query.Exprot_Type" />
                        <label for="Report_Radio" style="margin-right:5px;">Brand</label>
                        <input type="radio" name="Report_Radio1" id="Report_Radio1" value="Line" v-model="Query.Exprot_Type" />
                        <label for="Report_Radio1">Line</label>
                    </th>
                </tr>
            </thead>
          </table>
          <table style="width:100%; " v-on:keypress.ctrl="Load_Production_Progress_List()" >
            <thead>
                <tr >
                    <th style="width:60px;">Season:</th>
                    <th style="width:60px;">
                      <el-select v-model="Query.Season" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Season" :key="index" :label="option.Season" :value="option.Season" />
                      </el-select>
                    </th>
                    <th style="width:60px;">Purpose:</th>
                    <th style="width:60px;">
                      <el-select v-model="Query.Purpose" filterable size="small" placeholder=" ">
                        <el-option v-for="(option, index) in Purpose" :key="index" :label="option.Purpose" :value="option.Purpose" />
                      </el-select>
                    </th>
                    <th style="width:60px;">PP.No:</th>
                    <th style="width:60px;">
                      <input type="text" style="width:100%;" v-model="Query.Purchase_Project_No" @dblclick="$Input_Clean(Query, 'Purchase_Project_No')" />
                    </th>
                    <th style="width:60px;" >Lot No:</th>
                    <th style="width:60px;">
                      <input type="text" style="width:100%;" v-model="Query.Produce_No" @dblclick="$Input_Clean(Query, 'Produce_No')" />
                    </th>
                    <th style="width:60px;">Line:</th>
                    <th style="width:60px;">
                      <input type="text" style="width:100%;" v-model="Query.Produce_LineID" @dblclick="$Input_Clean(Query, 'Produce_LineID')" /> 
                    </th>
                    <th style="width:60px;">Last:</th>
                    <th style="width:120px;">
                      <input type="text" :style="{ 'width':'60px', 'color': ($CheckDate(Query.Last_From) ? 'black':'red') }" 
                        v-model="Query.Last_From" @dblclick="$Input_Clean(Query, 'Last_From')" />~
                        <input type="text" :style="{ 'width':'60px', 'color': ($CheckDate(Query.Last_To) ? 'black':'red') }" 
                        v-model="Query.Last_To" @dblclick="$Input_Clean(Query, 'Last_To')" />
                    </th>
                    <th style="width:60px;" >
                      <div id="Production_Progress_List_click" @click.prevent="Load_Production_Progress_List()"
                            style="font-size: 20px; width:40px; height:40px; cursor: pointer; vertical-align: middle; margin-right:3px; text-align: center;" >
                            <i style="width:20px; height:20px; " class="fab fa-youtube"></i>
                        </div>
                    </th>
                    <th style="width:60px;">
                      <div id="Export_To_Excel_click" 
                        @click.prevent="OpenWindow({Mode:1 ,Name:'Export_To_Excel', items:Query, width:'1160px', height:'600px'})"
                            style="font-size: 20px; width:40px; height:40px; cursor: pointer; vertical-align: middle; margin-right:3px; text-align: center;" >
                            <i style="width:25px !important; height: 25px !important;" class="fas fa-file-excel"></i>
                      </div>
                    </th>
                </tr>
            </thead>
          </table>
          <table style="width:100%; font-weight: bolder;">
            <tbody>
              <tr >
                <td style="width:450px;"></td>
                <td style="">Total Qty: {{ $CommaFormat(Total_Qty) }}</td>
                <td style="">Cutting: {{ $CommaFormat(Total_Cutting_Qty) }}</td>
                <td style="">Stitching: {{ $CommaFormat(Total_Stitching_Qty) }}</td>
                <td style="">Lasting: {{ $CommaFormat(Total_Lasting_Qty) }}</td>
                <td style="width:150px;"></td>
              </tr>
            </tbody>
          </table>
          <table style="width:100%; " class="listtable table-gridline-both " v-on:keypress.ctrl="Load_Production_Progress_List()" >
              <thead>
                  <tr >
                      <th style="width:60px;">PP No</th>
                      <th style="width:100px;">Factory</th>
                      <th style="width:100px;">Customer</th>
                      <th style="width:100px;">Article No</th>
                      <th style="width:60px;">Photo</th>
                      <th style="width:60px;">Last</th>
                      <th style="width:30px;" >Qty</th>
                      <th style="width:80px;">Upp.ETA</th>
                      <th style="width:80px;" colspan="2">Cutting</th>
                      <th style="width:80px;" colspan="2">Stitching</th>
                      <th style="width:80px;" colspan="2">Lasting</th>
                      <th style="width:80px;">Orig.Ship</th>
                      <th style="width:260px;">Order/Destination/Qty</th>
                  </tr>
                  <tr >
                    <th style="width:60px;">Lot No</th>
                      <th style="width:100px;">Line</th>
                      <th style="width:100px;">Brand</th>
                      <th style="width:100px;">Shoe Name</th>
                      <th style="width:60px;"></th>
                      <th style="width:60px;">Outsole No</th>
                      <th style="width:30px;" ></th>
                      <th style="width:80px;">But.ETA</th>
                      <th style="width:50px;" >Start</th>
                      <th style="width:50px;" >Finish</th>
                      <th style="width:50px;" >Start</th>
                      <th style="width:50px;" >Finish</th>
                      <th style="width:50px;" >Start</th>
                      <th style="width:50px;" >Finish</th>
                      <th style="width:80px;">Est.Ship</th>
                  </tr>
              </thead>
              <tbody style="min-height:220px;">
                  <tr v-for="(item, index) in DataTable" :key="index" >
                      <td>
                          <div style=" display: block; " >{{item.Purchase_Project_No}}</div>
                          <hr>
                          <div style=" display: block; cursor: pointer; " 
                          @click.prevent="OpenWindow({Mode:0 ,Name:'Produce', Produce_No:item.Produce_No, Product_No:item.Product_No, width:'1160px', height:'600px'})"
                          >{{item.Produce_No}}</div>
                      </td>
                      <td>
                          <div style=" display: block; " >{{item.Factory_SubID}}</div>
                          <div style=" display: block; " >{{item.Produce_LineID}}</div>
                      </td>
                      <td>
                        <div style=" display: block; " >{{item.CustomerID}}</div>
                        <div style=" display: block; " >{{item.Brand}}</div>
                      </td>
                      <td>
                        <div style=" display: block; " >{{item.Product_No}}</div>
                        <hr>
                        <div style=" display: block; " >{{item.Name}}</div>
                      </td>
                      <td> 
                        <div style=" display: block; height:40ph; padding:2px; text-align: center;" >
                          <img class="thumbnail" style="max-width: 50px; max-height: 50px; margin-top: 0px;  border-width: 0px; padding: 0px;" 
                          @load="handleLoad($event.target)" v-bind:src="Show_Photo_Main(item)" @error="handleError"/>                        
                        </div>
                      </td>
                      <td> 
                        <div style=" display: block; " >{{item.Last_No}}</div>
                        <hr>
                        <div style=" display: block; " >{{item.Outsole_No}}</div>
                      </td>
                      <td>
                        <div style=" display: block; cursor:pointer " 
                        @click.prevent="OpenWindow({Mode:0 ,Name:'Produce_Daily_List', Produce_No:item.Produce_No, Product_No:item.Product_No, width:'1160px', height:'600px'})"
                        >{{$CommaFormat(item.Qty)}}</div>
                      </td>
                      <td style="padding: 0px;  ">
                        <div style=" display: block; text-align: right;" >{{item.Upper_A}}</div>
                        <div style=" display: block; text-align: right;" >{{item.Buttom_A}}</div>
                      </td>
                      <td style="  ">
                        <div style=" display: block; text-align: right;" >{{item.P_Cutting_S ? moment(item.P_Cutting_S).format('MM/DD'):''}}</div>
                        <div :style="{'color': item.P_Cutting_S < item.D_Cutting_S ? 'red':'black' ,'display': 'block', 'text-align': 'right'}" >{{item.D_Cutting_S ? moment(item.D_Cutting_S).format('MM/DD'):''}}</div>
                      </td>
                      <td style="  ">
                        <div style=" display: block; text-align: right;" >{{item.P_Cutting_F ? moment(item.P_Cutting_F).format('MM/DD'):''}}</div>
                        <div v-if="item.Qty == item.P_Cutting_Qty" :style="{'color': item.P_Cutting_F < item.D_Cutting_F ? 'red':'black' , 'display': 'block', 'text-align': 'right'}" >{{item.D_Cutting_F ? moment(item.D_Cutting_F).format('MM/DD'):''}}</div>
                        <div v-else style=" display: block; text-align: right;" >{{item.Qty - item.P_Cutting_Qty}}</div>
                      </td>
                      <td style="  ">
                        <div style=" display: block; text-align: right;" >{{item.P_Stitching_S ? moment(item.P_Stitching_S).format('MM/DD'):''}}</div>
                        <div :style="{'color': item.P_Stitching_S < item.D_Stitching_S ? 'red':'black' ,'display': 'block', 'text-align': 'right'}" >{{item.D_Stitching_S ? moment(item.D_Stitching_S).format('MM/DD'):''}}</div>
                      </td>
                      <td style="  ">
                        <div style=" display: block; text-align: right;" >{{item.P_Stitching_F ? moment(item.P_Stitching_F).format('MM/DD'):''}}</div>
                        <div v-if="item.Qty == item.P_Stitching_Qty" :style="{'color': item.P_Stitching_F < item.D_Stitching_F ? 'red':'black' , 'display': 'block', 'text-align': 'right'}" >{{item.D_Stitching_F ? moment(item.D_Stitching_F).format('MM/DD'):''}}</div>
                        <div v-else style=" display: block; text-align: right;" >{{item.Qty - item.P_Stitching_Qty}}</div>
                      </td>
                      <td style=" ">
                        <div style=" display: block;  text-align: right;" >{{item.P_Lasting_S ? moment(item.P_Lasting_S).format('MM/DD'):''}}</div>
                        <div :style="{'color': item.P_Lasting_S < item.D_Lasting_S ? 'red':'black' ,'display': 'block', 'text-align': 'right'}" >{{item.D_Lasting_S ? moment(item.D_Lasting_S).format('MM/DD'):''}}</div>
                      </td>
                      <td style="  ">
                        <div style=" display: block; text-align: right;" >{{item.P_Lasting_F ? moment(item.P_Lasting_F).format('MM/DD'):''}}</div>
                        <div v-if="item.Qty == item.P_Lasting_Qty" :style="{'color': item.P_Lasting_F < item.D_Lasting_F ? 'red':'black' , 'display': 'block', 'text-align': 'right'}" >{{item.D_Lasting_F ? moment(item.D_Lasting_F).format('MM/DD'):''}}</div>
                        <div v-else style=" display: block; text-align: right;" >{{item.Qty - item.P_Lasting_Qty}}</div>
                      </td>
                      <td style="  ">
                        <div style=" display: block; text-align: right;" >{{item.Orig_Shipping_Date}}</div>
                        <div style=" display: block; text-align: right;" >{{item.Est_Shipping_Date}}</div>
                      </td>
                      <td style="padding: 0px; vertical-align: top;">
                        <div style=" display: block; ">
                          <table style="width:100%; ">
                            <tr v-for="(obj, idx) in item.Order_Destination_Info" :key="idx">
                              <td style="width:100px; border:1px solid #cccccc;">{{obj.Order_No}}</td>
                              <td style="width:80px; border:1px solid #cccccc;">{{obj.Destination}}</td>
                              <td style="width:80px; border:1px solid #cccccc;">{{$CommaFormat(obj.Qty)}}</td>
                            </tr>
                          </table>
                        </div>
                      </td>
                  </tr>
              </tbody>
              <tfoot>
                  <tr>
                      <td colspan="20"  >
                        <Pagination class="flex justify-end" style="display: inline-block;" v-show="DataTable.length > 0" v-model:page="currentPage" v-model:limit="pageSize"
                                    :total="Production_Progress_List.length" />
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
import moment from 'moment' //引入了moment.js庫來處理日期和時間
import commonFunction from '@/composables/commonFunction'  //引入了自定義的commonFunction
import Pagination from '@/components/Pagination.vue'  //引入了Pagination組件
import { useRoute, useRouter } from 'vue-router'  //引入了Vue Router的useRoute和useRouter來處理路由

const { $Input_Clean, $CheckDate, $CheckGroup, $FillUp_Date, $CommaFormat, $CommaFormat_F, hostname, host  } = commonFunction() //從commonFunction中獲取$Input_Clean函數
const route = useRoute();
const router = useRouter();

const IsAuthor = ref($CheckGroup(['purchase author'])) //使用ref創建了IsAuthor兩個響應式狀態
const IsITAuthor = ref($CheckGroup(['it author'])) //使用ref創建了IsITAuthor。
const isNaviMenu = ref(false) //使用ref創建了isNaviMenu兩個響應式狀態
const post = reactive({ Icons: false }) //使用reactive創建了post和Query兩個響應式對象，分別存儲狀態信息。
const Query = reactive({ CustomerID: '', Brand: '', Season: '', Purpose: 'All', Factory_SubID: ''
, Produce_LineID: '', Purchase_Project_No: '', Produce_No: ''
//, Delivery_From: moment().add(-3, 'months').format("YYYY/MM/DD"), Delivery_To: moment().add(+3, 'months').format("YYYY/MM/DD")
, Delivery_From: '', Delivery_To: ''
, Est_Last_From: '', Est_Last_To: '', Last_From: '', Last_To: '', Shipment_Closed: false, Exprot_Type: 'Brand' }) //Query：一個響應式的對象，用於存儲查詢條件。
const WinHandle = ref(null) //使用ref創建了WinHandle。
const Production_Progress_List = ref([]) //Production_Progress_List：一個響應式的空數組，用於存儲列表。
const Total_Qty = ref(0) //Total_Qty：一個響應式的對象，用於存儲總數量。
const Total_Cutting_Qty = ref(0) //Total_Qty：一個響應式的對象，用於存儲總數量。
const Total_Stitching_Qty = ref(0) //Total_Qty：一個響應式的對象，用於存儲總數量。
const Total_Lasting_Qty = ref(0) //Total_Qty：一個響應式的對象，用於存儲總數量。
const Brand = ref([]) //Brand：一個響應式的空數組，用於存儲Brand列表。
const Customer = ref([]) //Customer：一個響應式的空數組，用於存儲Customer列表。
const Season = ref([]) //Season：一個響應式的空數組，用於存儲Season列表。
const Purpose = ref([{Purpose:'All'},{Purpose:'Official'},{Purpose:'Internal'},{Purpose:'Sample'},{Purpose:'Cancel'}]) //Purpose：一個響應式的數組，用於存儲Purpose的選項。
const isLoading = ref(false)  //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const currentPage = ref(1)    //currentPage：一個響應式的整數值，用於存儲當前頁碼。
const pageSize = ref(10)      //pageSize：一個響應式的整數值，用於存儲每頁顯示的記錄數量。

onMounted(async () => {
  //isNaviMenu.value = true
  Load_Brand();
  Load_Customer();
  Load_Season();
  //await Load_Production_Progress_List()
  window.addEventListener('beforeunload', e => Close_WinHandle());
})

const handleLoad = async (e) => {
    e.style.display = "unset";
};

const handleError = async (e) => {
    e.target.style.display = "none";
};

const Show_Photo_Main = (obj) => {
  return `${hostname}/datas/Images/Products/Photos/${obj.Photo_Month}/Thumb/${obj.Product_No}.jpg?${moment().format("YYYY-MM-DD HH:mm:ss")}` 
};

const Load_Brand = async () => {
  try {
    const response = await axios.post(`/api/Public/Common/Brand`,{Mode:1})
    response.data.splice(0, 0, {Brand:''} )
    Brand.value = response.data.map((obj)=>({Brand:obj.Brand}))
  } catch (error) {
    console.log(error)
  } finally {
  }
};

const Load_Customer = async () => {
  try {
    const response = await axios.post(`/api/Production/Customer`)
    response.data.splice(0, 0, {CustomerID:''} )
    Customer.value = response.data.map((obj)=>({CustomerID:obj.CustomerID}))
  } catch (error) {
    console.log(error)
  } finally {
  }
};

const Load_Season = async () => {
  try {
    const response = await axios.post(`/api/Production/Season`)
    response.data.splice(0, 0, {Season:''} )
    Season.value = response.data.map((obj)=>({Season:obj.Season}))
  } catch (error) {
    console.log(error)
  } finally {
  }
};

const Load_Production_Progress_List = async () => {
  try {
    isLoading.value = true
    Query.Delivery_From = $CheckDate(Query.Delivery_From) ? $FillUp_Date(Query.Delivery_From): '';
    Query.Delivery_To = $CheckDate(Query.Delivery_To) ? $FillUp_Date(Query.Delivery_To): '';
    Query.Est_Last_From = $CheckDate(Query.Est_Last_From) ? $FillUp_Date(Query.Est_Last_From): '';
    Query.Est_Last_To = $CheckDate(Query.Est_Last_To) ? $FillUp_Date(Query.Est_Last_To): '';
    Query.Last_From = $CheckDate(Query.Last_From) ? $FillUp_Date(Query.Last_From): '';
    Query.Last_To = $CheckDate(Query.Last_To) ? $FillUp_Date(Query.Last_To): '';

    const response = await axios.post(`/api/Production/Production_Progress_List`, Query)
    Production_Progress_List.value = response.data.Data_Info
    Total_Qty.value = response.data.Total_Qty;
    Total_Cutting_Qty.value = response.data.Total_Cutting_Qty;
    Total_Stitching_Qty.value = response.data.Total_Stitching_Qty;
    Total_Lasting_Qty.value = response.data.Total_Lasting_Qty;
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
        case 'Customer':
            obj.height = 950;
            obj.width = 1080;
            URL= `${host}/${obj.Name}/0/${encodeURIComponent(obj.items.CustomerID)}/0`
        break;
        case 'Produce_Daily_List':
            obj.height = 950;
            obj.width = 1080;
            URL= `${hostname}//Production/Public/Produce_Daily_List.asp?Produce_No=${encodeURIComponent(obj.Produce_No)}&Product_No=${encodeURIComponent(obj.Product_No)}`
        break;
        case 'Produce':
            obj.height = 950;
            obj.width = 1080;
            URL= `https://${location.hostname}:3443/Produce/${encodeURIComponent(obj.Produce_No)}`
        break;
        case 'Production_Sheet':
            obj.height = 950;
            obj.width = 1080;
            URL= `${hostname}//Production/Public/Production_Sheet.asp?Produce_No=${encodeURIComponent(obj.Produce_No)}&Product_No=${encodeURIComponent(obj.Product_No)}`
        break;

        case 'Export_To_Excel':
            obj.height = 950;
            obj.width = 1080;
            var jsonData = JSON.stringify({
                  //FileName: `${Season.replace(/\//g,'')}_DailyReport_${yyyy}${mm}${dd}.xlsx`,
                  FileName: `DailyReport_${moment().format("YYYYMMDD")}.xlsx`,
                  CustomerID: obj.items.CustomerID ? obj.items.CustomerID : '%',
                  Season: obj.items.Season ? obj.items.Season : '%',
                  Brand: obj.items.Brand ? obj.items.Brand : '%',
                  Produce_LineID: obj.items.Produce_LineID ? obj.items.Produce_LineID : '%',
                  Purpose: obj.items.Purpose == 'All' ? '%' : obj.items.Purpose,
                  Purchase_Project_No: obj.items.Purchase_Project_No ? obj.items.Purchase_Project_No : '%',
                  Produce_No: obj.items.Produce_No ? obj.items.Produce_No : '%',
                  Factory_SubID: obj.items.Factory_SubID ? obj.items.Factory_SubID : '%',
                  Not_Finish: 0,
                  Re_order: 0,
                  Est_Last_Date_From: obj.items.Est_Last_From,
                  Est_Last_Date_To: obj.items.Est_Last_To,
                  Last_Date_From: obj.items.Last_From,
                  Last_Date_To: obj.items.Last_To,
                  Est_Shipping_Date_From: '',
                  Est_Shipping_Date_To: '',
                  Orig_Shipping_Date_From: obj.items.Delivery_From,
                  Orig_Shipping_Date_To: obj.items.Delivery_To,
                  Split_Sheet: obj.items.Exprot_Type
                });

                URL= `${hostname}/Production/Public/Production_Progress_Report.aspx?@jsonData=${encodeURIComponent(jsonData)}`
        break;
        default:
        break;
    }
    WinHandle.value = window.open(URL, obj.Mode == 0 ? obj.Name : '_Self',
        `width=${obj.width},height=${obj.height},left=null, top=null, location=no, directories=no, menubar=no, resizable=no, scrollbars=yes, status=no, titlebar=no, toolbar=no`
    );
    WinHandle.value.moveTo(200,10);
    return false;
};

const DataTable = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return Production_Progress_List.value.slice(start, end)
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