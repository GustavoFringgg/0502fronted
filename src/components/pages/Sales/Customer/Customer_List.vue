<template>
  <div style="font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; text-align: center; width:1150px;">
    <!--  導航菜單 -->
    <NaviMenu v-if="isNaviMenu"></NaviMenu>

    <!-- 權限组件 -->
    <div style="padding-left:5px; text-align:left; float:left; line-height: 32px; font-size: 18px !important; text-shadow: 2px 2px 3px #ccc; ">
      <ComptPermission style="width:390px;float:left;" :post="post"></ComptPermission>
    </div>

    <!-- 插入新客户按钮 -->
    <div @click.prevent="OpenWindow({Name:'Customer', items:{ CustomerID:'Insert'}, width:'1080px', height:'600px'})"
         style="float: right; padding-top: 10px; padding-left: 4px; cursor: pointer; width: 24px; height: 32px; opacity: 0.8;">
      <svg class="svg-inline--fa fa-plus-circle fa-w-16" style="width: 20px; height: 20px;" aria-hidden="true" focusable="false" data-prefix="fas"
           data-icon="plus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
        <path fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z">
        </path>
      </svg>
    </div>

    <!-- 歷史紀錄複選框 -->
    <div style="float: right;">
      <el-checkbox v-model="Query.History_Check" size="small" class="pr-12 pt-5">+ History</el-checkbox>
    </div>
    <!-- <div :style="{ 'float': 'left', 'padding-top': '6px', 'text-align': 'center', 'cursor': 'pointer', 'width': '24px', 'height': '32px' }" @click.prevent="OpenWindow({ Name: 'Customer', ID: 'Insert', width: '1160px', height: '600px' })"><i style="width:20px; height:20px;" class="fas fa-plus-circle"></i></div> -->

    <!-- 抽屉组件 -->
    <el-drawer v-model="drawer" :destroy-on-close="true" :show-close="false" :with-header="false" @close="closeDrawer" direction="rtl" size="1000">
      <router-view @closeDrawer="closeDrawer"></router-view>
    </el-drawer>

    <!-- 客户列表 -->
    <div>
      <!-- 定義一個 Element UI 表格 -->
      <el-table :data="_Customer_List" v-loading="isLoading" :height="696" size="small" style="width: 100%" @keyup.ctrl.enter="getCustomerList()"
                :cell-style="paymentCellStyle">
        <!-- :data="_Customer_List"：綁定表格數據來源。
        v-loading="isLoading"：在數據加載時顯示加載狀態。
        :height="696" 和 size="small"：設置表格高度和尺寸。 -->

        <!-- 客戶ID列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="CustomerID" label="CustomerID" width="150">
          <!-- 表頭顯示一個可雙擊清空的輸入框，用於過濾數據。
          每個客戶ID為可點擊的元素，點擊後調用 navigateToDetail 方法進入客戶詳情頁。 -->
          <!-- 定義表頭模板 -->
          <template #header>
            <div>CustomerID</div>
            <!-- 雙擊清除輸入框的值 -->
            <el-input v-model="Query.CustomerID" size="small" @dblclick="$Input_Clean(Query, 'CustomerID')" />
          </template>
          <!-- 定義默認模板 -->
          <template #default="scope">
            <!-- 點擊客戶ID導航到詳細信息 -->
            <span @click.prevent="OpenWindow({Name:'Customer', items:{ CustomerID: scope.row.CustomerID}, width:'1160px', height:'600px'})" style="cursor: pointer;">{{ scope.row.CustomerID }}</span>
          </template>
        </el-table-column>
        <!-- 客戶姓名列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="Customer_Name" label="Customer Name" width="180">
          <!-- 定義表頭模板 -->
          <template #header>
            <div>Customer Name</div>
            <!-- 雙擊清除輸入框的值 -->
            <el-input v-model="Query.Customer_Name" size="small" @dblclick="$Input_Clean(Query, 'Customer_Name')" />
          </template>
        </el-table-column>
        <!-- 國家列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="Country" label="Country" width="100">
          <!-- 定義表頭模板 -->
          <template #header>
            <div>Country</div>
            <!-- 雙擊清除輸入框的值 -->
            <el-input v-model="Query.Country" size="small" @dblclick="$Input_Clean(Query, 'Country')" />
          </template>
        </el-table-column>
        <!-- 電話號碼列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="Phone_Number" label="Phone Number" width="140" />
        <!-- 傳真號碼列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="Fax_Number" label="Fax Number" width="140" />
        <!-- 業務項目列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="Item_Of_Business" label="Item_Of_Business" width="140">
          <!-- 定義表頭模板 -->
          <template #header>
            <div>Business Items</div>
            <!-- 雙擊清除輸入框的值 -->
            <el-input v-model="Query.Item_Of_Business" size="small" @dblclick="$Input_Clean(Query, 'Item_Of_Business')" />
          </template>
        </el-table-column>
        <!-- 備註列 -->
        <el-table-column show-overflow-tooltip header-align="center" prop="Memo" label="Memo">
          <!-- 定義表頭模板 -->
          <template #header>
            <div>Memo
              <!-- 點擊按鈕調用 getCustomerList 函數 -->
              <button @click="getCustomerList()" class="absolute right-0 top-1/2 transform -translate-y-1/2">
                <n-icon :component="SearchOutline" size="20" :depth="3" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁組件 -->
      <Pagination class="flex justify-end" v-show="_Customer_List.length > 0" v-model:page="currentPage" v-model:limit="pageSize"
                  :total="Customer_List.length" />
      <!-- 在客戶列表有數據時顯示分頁組件。
            用 v-model:page 和 v-model:limit 綁定當前頁碼和每頁顯示數量。
            :total="Customer_List.length" 設置總數據量。 -->
    </div>
  </div>
</template>

<script setup>
/* 引入依賴  */
import NaviMenu from '@/components/pages/Public/Navigate_Menu.vue' //引入了Vue組件Navigate_Menu.vue和Permission.vue
import ComptPermission from '@/components/pages/Public/Permission.vue'
import axios from 'axios' //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue' //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import { NIcon } from 'naive-ui' //引入了Naive UI的NIcon和Ionicons圖標庫中的SearchOutline
import { SearchOutline } from '@vicons/ionicons5'
import commonFunction from '@/composables/commonFunction'  //引入了自定義的commonFunction
import Pagination from '@/components/Pagination.vue'  //引入了Pagination組件
import { useRoute, useRouter } from 'vue-router'  //引入了Vue Router的useRoute和useRouter來處理路由

/* 創建響應式狀態 */
const { $Input_Clean, hostname, host  } = commonFunction() //從commonFunction中獲取$Input_Clean函數
const route = useRoute();
const router = useRouter();
const drawer = ref(false)
const isNaviMenu = ref(false) //使用ref創建了drawer和isNaviMenu兩個響應式狀態
const post = reactive({ Icons: false }) //使用reactive創建了post和Query兩個響應式對象，分別存儲狀態信息。
const Query = reactive({ CustomerID: '', Customer_Name: '', Country: '', Item_Of_Business: '', History_Check: false })
const WinHandle = ref(null) //使用ref創建了WinHandle。


/* 監聽Query.History_Check的變化 */
watch(() => Query.History_Check, () => { getCustomerList() })  //監聽Query.History_Check的變化，當其變化時，調用getCustomerList函數來獲取客戶列表

/* 組件掛載時的初始化邏輯 */
onMounted(async () => {
  if (route.params.Mode != null) {
    const Mode = route.params.Mode
    const CustomerID = route.params.CustomerID
    const GroupID = route.params.GroupID
    await router.push({ name: 'Customer_List' })
    isNaviMenu.value = false
    nextTick(() => {
      isNaviMenu.value = true
    })

    //navigateToDetail(Mode, CustomerID, GroupID)
    Query.CustomerID = CustomerID
  } else {
    isNaviMenu.value = true
  }
  await getCustomerList()
  window.addEventListener('beforeunload', e => Close_WinHandle());
})

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
        default:
        break;
    }
    WinHandle.value = window.open(URL, obj.Name,
        `width=${obj.width},height=${obj.height},left=null, top=null, location=no, directories=no, menubar=no, resizable=no, scrollbars=yes, status=no, titlebar=no, toolbar=no`
    );
    WinHandle.value.moveTo(200,10);
    return false;
};

/*
使用onMounted鉤子在組件掛載時執行一些初始化邏輯。
檢查路由參數中是否有CustomerID。
如果有，則推送到Customer_List路由，並且設置isNaviMenu為false，隨後在下一個DOM更新循環中將其設置為true，並導航到客戶詳細信息頁面。
如果沒有CustomerID，則直接設置isNaviMenu為true。
最後，調用getCustomerList來獲取客戶列表。
*/

/* 創建響應式狀態 */
const Customer_List = ref([]) //Customer_List：一個響應式的空數組，用於存儲客戶列表。
const isLoading = ref(false)  //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const currentPage = ref(1)    //currentPage：一個響應式的整數值，用於存儲當前頁碼。
const pageSize = ref(20)      //pageSize：一個響應式的整數值，用於存儲每頁顯示的記錄數量。

/* 定義getCustomerList函數 */
const getCustomerList = async () => {
  const { CustomerID, Customer_Name, Country, Item_Of_Business } = Query
  if (CustomerID || Customer_Name || Country || Item_Of_Business) {
    Query.History_Check = true
  }
  try {
    isLoading.value = true
    const response = await axios.post(`/api/Sales/Customer/Customer_List`, Query)
    Customer_List.value = response.data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
/*
1.提取查詢條件：從Query對象中提取CustomerID、Customer_Name、Country和Item_Of_Business屬性。

2.設置歷史查詢標誌：如果CustomerID、Customer_Name、Country或Item_Of_Business中任意一個有值，則將Query.History_Check設置為true，這可能是用來標記當前查詢是否來自歷史查詢條件。

3.發送請求：
 。開始加載：將isLoading設置為true，表示數據正在加載。
 。發送HTTP請求：使用axios.post向後端API發送請求，請求URL為/api/Sales/Customer/Customer_List，並傳遞Query作為請求體。
 。更新客戶列表：請求成功後，將響應數據賦值給Customer_List。
4.錯誤處理：如果請求過程中發生錯誤，將錯誤信息輸出到控制台。

5.結束加載：無論請求成功與否，最終都將isLoading設置為false，表示數據加載已完成。
<-- 這段代碼的主要功能是根據查詢條件向後端發送請求，獲取客戶列表數據，並在加載數據時更新加載狀態。這樣可以在用戶界面中顯示加載指示器，並確保數據加載完成後進行相應的處理。 -->
*/

/* 定義計算屬性 _Customer_List */
const _Customer_List = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return Customer_List.value.slice(start, end)
})
/*
計算開始索引：
const start = (currentPage.value - 1) * pageSize.value
currentPage.value：當前頁碼（從1開始）。
pageSize.value：每頁顯示的記錄數量。
start 計算公式為 (currentPage.value - 1) * pageSize.value，這個公式計算當前頁的第一條記錄在整個列表中的索引位置。

計算結束索引：
const end = start + pageSize.value
end 計算公式為 start + pageSize.value，這個公式計算當前頁的最後一條記錄在整個列表中的索引位置。

切割客戶列表：
return Customer_List.value.slice(start, end)
使用 JavaScript 的 Array.prototype.slice 方法根據計算出的 start 和 end 索引對 Customer_List 進行切割，返回當前頁應顯示的客戶列表。
<-- 這個計算屬性實現了客戶列表的分頁功能，根據當前頁碼和每頁顯示的記錄數量動態計算並返回當前頁應顯示的客戶數據。這樣可以有效地管理和顯示大量數據，避免一次性顯示過多數據造成的性能問題。-->
*/

/* 定義 closeDrawer 函數 */
const closeDrawer = () => {
  drawer.value = false
  router.push({ name: 'Customer_List' })
}
/*
關閉抽屜：
drawer.value = false
drawer 是一個響應式引用 (ref)，表示抽屜的開關狀態。
將 drawer.value 設置為 false，表示關閉抽屜。

導航到 Customer_List 頁面：
router.push({ name: 'Customer_List' })
router 是 Vue Router 的實例，用於控制應用的導航。
使用 router.push 方法導航到名為 Customer_List 的路由。
*/

/* 定義 navigateToDetail 函數 
const navigateToDetail = (Mode, CustomerID, GroupID) => {
  router.push({ name: 'Customer', params: { Mode: Mode, CustomerID:CustomerID, GroupID: GroupID } })
  drawer.value = true
}
*/
/*
導航到客戶詳細信息頁面：
router.push({ name: 'Customer', params: { CustomerID } })
router 是 Vue Router 的實例，用於控制應用的導航。
使用 router.push 方法導航到名為 Customer 的路由，並傳遞一個參數 CustomerID。
{ name: 'Customer', params: { CustomerID } } 創建一個路由對象，其中 name 是目標路由的名稱，params 是傳遞的路由參數。

打開抽屜：
drawer.value = true
drawer 是一個響應式引用 (ref)，表示抽屜的開關狀態。
將 drawer.value 設置為 true，表示打開抽屜。
*/

/* 定義 paymentCellStyle 函數 */
const paymentCellStyle = ({ row }) => {
  if (row.History_User) {
    return { 'background-color': '#C7C7C7' }
  }
  return {}
}
/*
參數解構：
const paymentCellStyle = ({ row }) => { ... }
函數接收一個對象作為參數，並使用解構賦值的方式提取其中的 row 屬性。
row 表示當前行的數據。

設置單元格背景顏色：
if (row.History_User) {
  return { 'background-color': '#FFCC99' }
}
如果 row.History_User 為真，則返回一個包含 background-color 屬性的樣式對象，將單元格的背景顏色設置為 #FFCC99。

默認返回：
return {}
如果 row.History_User 不為真，則返回一個空對象，表示不改變默認樣式。
<-- 這個函數的主要功能是根據行數據中的 History_User 屬性來動態設置表格單元格的背景顏色。這樣可以根據某些條件來區分表格中的行，提升用戶體驗和可讀性。 -->
*/
</script>
