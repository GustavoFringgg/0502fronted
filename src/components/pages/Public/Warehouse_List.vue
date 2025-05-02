<template>
  <div class="page-container">
    <!--  導航菜單 -->
    <NaviMenu></NaviMenu>

    <!-- 權限组件 -->
    <div>
      <ComptPermission :post="post"></ComptPermission>
    </div>

    <!-- 詳細清單 -->
    <el-drawer
      v-model="drawer"
      class="relative"
      :show-close="false"
      :with-header="false"
      @close="closeDrawer"
      direction="rtl"
      size="40%"
    >
      <router-view @closeDrawer="closeDrawer" ></router-view>
    </el-drawer>

    <!-- 倉庫 -->
    <div class="table-content">
      <!-- 插入倉庫按钮 -->
      <div class="add-button-histiry-button-container">
        <!-- history按鈕 -->
        <el-checkbox
          v-model="isHistoryChecked"
          @click="reload()"
          size="default"
          class="pr-12"
          >History</el-checkbox
        >
        <!-- 插入倉庫按钮 -->
        <div
          class="add-icon"
          @click="navigateToDetail('Create')"
        >
          <svg
            class="svg-inline--fa fa-plus-circle fa-w-16 add-svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="plus-circle"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="warehouseListComputed"
        :header-cell-style="headerStyle"
        :row-style="hideHistoryRows"
      >
        <!-- 倉庫ID名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="WarehouseID"
          label="WarehouseID"
          width="110"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="text-size">WarehouseID</span>
            <el-input
              v-model="query.WarehouseID"
              size="small"
              @input="reload()"
            />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="td-text text-size"
              >{{ row.WarehouseID }}</span
            >
          </template>
        </el-table-column>
        <!-- 組織代碼名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="organizationID"
          label="organizationID"
          width="110"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="text-size">OrganizationID</span>
            <el-input
              v-model="query.OrganizationID"
              size="small"
              @input="reload()"
            />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="td-text text-size"
              >{{ row.OrganizationID }}</span
            >
          </template>
        </el-table-column>
        <!-- 倉庫地址 (中文)名列 -->
        <el-table-column
          header-align="center"
          prop="Address_Cht"
          label="Address_Cht"
          width="260"
          align="left"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="text-size">Address_Cht</span>
            <el-input
              v-model="query.Address_Cht"
              size="small"
              @input="reload()"
            />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="td-text text-size"
              >{{ row.Address_Cht }}</span
            >
          </template>
        </el-table-column>
        <!-- 倉庫地址 (英文)名列 -->
        <el-table-column
          header-align="center"
          prop="Address_Eng"
          label="Address_Eng"
          width="260"
          align="left"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="text-size">Address_Eng</span>
            <el-input
              v-model="query.Address_Eng"
              size="small"
              @input="reload()"
            />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="td-text text-size"
              >{{ row.Address_Eng }}</span
            >
          </template>
        </el-table-column>
        <!-- History icon列 -->
        <el-table-column
          header-align="center"
          label=""
          width="50"
          align="left"
        >
          <!-- 定義thead模板 -->
          <template #header>
        
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <el-tooltip
                effect="dark"
                :content=" row.Data_Updater ? 
                'Last Edited By ' + row.Data_Updater + ' And Last Modified at ' + row.Data_Update.replace('T', '  ').replace('Z', '').split('.')[0] : 'This data has not been modified.'"
                placement="top"
              >
                <i class="icon-infor cursorPointer"></i>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁組件 -->
      <Pagination
        v-show="warehouseListComputed.length > 0"
        class="flex justify-end"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        :total="warehouseList.length"
      />
      <!-- 在客戶列表有數據時顯示分頁組件。
            用 v-model:page 和 v-model:limit 綁定當前頁碼和每頁顯示數量。
            :total="warehouseList.length" 設置總數據量。 -->
    </div>
  </div>
</template>

<script setup>
/* 引入依賴  */
import NaviMenu from "@/components/pages/Public/Navigate_Menu.vue"; //引入了Vue組件Navigate_Menu.vue和Permission.vue
import ComptPermission from "@/components/pages/Public/Permission.vue";
import commonFunction from "@/composables/commonFunction";
import axios from "axios"; //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, nextTick, watch } from "vue"; //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import Pagination from "@/components/Pagination.vue"; //引入了Pagination組件
import { useRoute, useRouter } from "vue-router"; //引入了Vue Router的useRoute和useRouter來處理路由
import warehouse from "./Warehouse.vue";

/* 創建響應式狀態 */
const { $Input_Clean, $CheckGroup } = commonFunction();
const route = useRoute();
const router = useRouter();
const warehouseList = ref([
  {
    WarehouseID: "BM",
    OrganizationID: "BM",
    Address_Cht: "台中市42876大雅區三和里建興路45巷11號",
    Address_Eng:
      "No.11, Ln. 45, Jiansing Rd., Sanhe Vil., Daya Dist., Taichung City 42876, Taiwan (R.O.C.)	",
    Create_Date: "2024-12-26T15:27:52.720Z",
    History_Date: "",
    UserID: "21",
    Data_Updater: "bruce-liu",
    Data_Update: "2024-12-26T15:27:52.720Z",
  },
]); //warehouseList：一個響應式的空數組，用於存儲客戶列表。
const warehouseListComputed = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return warehouseList.value.slice(start, end);
});
const isLoading = ref(false); //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const drawer = ref(false);
const isHistoryChecked = ref(false);
watch(isHistoryChecked, (newVal) => {
  reload();
});
const query = ref({
  WarehouseID: "",
  OrganizationID: "",
  Address_Cht: "",
  Address_Eng: "",
});
watch(
  query,
  (newVal) => {
    isHistoryChecked.value = true;
  },
  { deep: true }
);

const currentPage = ref(1); //currentPage：一個響應式的整數值，用於存儲當前頁碼。
const pageSize = ref(20); //pageSize：一個響應式的整數值，用於存儲每頁顯示的記錄數量。

/* 身份驗證用 */
const post = reactive({ Program_Name: "Warehouse List", Icons: true });

// 資料驗證
const State = reactive({}) //初始化 State：將 State 初始化為一個空對象。
const isAuthor = computed(() => $CheckGroup(["it author"]));
// const isAuthor = computed(() => false);


/* 定義table樣式 */
/* 定義 headerStyle 函數 */
const headerStyle = () => {
  return {
    background: "#CCCCCC", // Element Plus 主色
    color: "",
    "font-weight": "bold",
  };
};
/* 定義 每一行呈現方式 */
const hideHistoryRows = ({ row }) => {
  const isHistoryDateExist = row.History_Date !== null ? true : false;
  if (isHistoryChecked.value & isHistoryDateExist) {
    return { backgroundColor: "rgb(220, 220, 220)" };
  }
  return {};
};

/* 畫面控制 */
// 開啟詳細資訊
const navigateToDetail = (mode, value) => {
  if (mode === "Edit") {
    router.push({
      name: "Warehouse",
      params: { mode: mode, warehouseID: value.WarehouseID },
    });
  } else {
    router.push({ name: "Warehouse", params: { mode: mode, warehouseID: 0 } });
  }
  drawer.value = true;

};
// 關閉詳細資訊
const closeDrawer = (obj) => {
  if(!obj){
    drawer.value = false
    router.push({ name: "Warehouse_List" });
  }
  reload();
};

/* CRUD 函式 */
// 讀
const WarehouseList = async () => {
  try {
    isLoading.value = true;
    let params = { ...query.value, isHistoryChecked: isHistoryChecked.value };
    // params['isHistoryChecked'] = isHistoryChecked.value
    const response = await axios.post(
      `/api/Public/Warehouse/Warehouse_List`,
      params
    );
    warehouseList.value = response.data;
    // console.log(warehouseList.value);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
// 畫面重載
const reload = async () => {
  await WarehouseList();
};

/* 組件掛載時的初始化邏輯 */
onMounted(async () => {
  await WarehouseList();    
});
</script>

<style scoped>
.text-size {
  font-size: 12px;
}
.add-button-histiry-button-container {
  display: flex;
  position: absolute;
  top: -30px;
  right: 10px;
  z-index: 10;
  background-color: transparent;
}
.page-container {
  -webkit-font-smoothing: antialiased;
}
td,
th {
  border: black 2px solid;
}
.add-icon {
  margin-top: 5px;
  cursor: pointer;
  width: 24px;
  height: 32px;
  opacity: 0.8;
}
.add-svg {
  width: 20px;
  height: 20px;
}
.table-content {
  padding: 5px;
  background-color: #cccccc;
  border-radius: 10px;
  width: fit-content;
  position: relative;
}
.el-table {
  background-color: #cccccc;
  position: relative;
  z-index: 1;
}
.td-text {
  cursor: pointer;
}
</style>