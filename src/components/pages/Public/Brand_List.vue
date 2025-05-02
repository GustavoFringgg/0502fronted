<template>
  <div class="pageContainer">
    <!--  導航菜單 -->
    <NaviMenu></NaviMenu>

    <!-- 權限组件 -->
    <div>
      <ComptPermission :post="post"></ComptPermission>
    </div>

    <!-- 詳細清單 -->
    <el-drawer
      v-if="IsAuthor"
      v-model="drawer"
      class="relative"
      :destroy-on-close="true"
      :show-close="false"
      :with-header="false"
      @close="closeDrawer"
      direction="rtl"
      size="40%"
    >
      <brand
        :mode="formDataMode"
        :formData="formData"
        @closeDrawer="closeDrawer"
      ></brand>
    </el-drawer>

    <!-- 品牌清單Table -->
    <div class="tableContainer">
      <!-- 插入與histiry按钮div -->
      <div class="addButtonHistiryButtonContainer">
        <!-- history按鈕 -->
        <el-checkbox v-model="isHistoryChecked" size="default" class="pr-12"
          >History</el-checkbox
        >
        <!-- 插入品牌按钮 -->
        <div
          v-if="IsAuthor"
          class="addIcon"
          @click="navigateToDetail('Create')"
        >
          <svg
            class="svg-inline--fa fa-plus-circle fa-w-16 addSVG"
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
        stripe
        :data="_Brand_List"
        :header-cell-style="headerStyle"
        :row-style="hideHistoryRows"
      >
        <!-- 品牌名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="Brand"
          label="Brand"
          width="200"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="textSize">Brand</span>
            <el-input
              v-model="Query.Brand"
              size="small"
              @input="queryReload()"
            />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="tdText textSize"
              >{{ row.Brand }}</span
            >
          </template>
        </el-table-column>

        <!-- 品牌ＩＤ名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="BrandID"
          label="BrandID"
          width="100"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="textSize">BrandID</span>
            <el-input
              v-model="Query.BrandID"
              size="small"
              @input="queryReload()"
            />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="tdText textSize"
              >{{ row.BrandID }}</span
            >
          </template>
        </el-table-column>

        <!-- 資料使用日名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="Access_Date"
          label="Access_Date"
          width="200"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="textSize">Access_Date</span>
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="tdText textSize"
              >{{
                row.Access_Date
                  ? row.Access_Date.replace("T", " ").replace("Z", "")
                  : ""
              }}</span
            >
          </template>
        </el-table-column>

        <!-- 創建日名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="Create_Date"
          label="Create_Date"
          width="200"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="textSize">Create_Date</span>
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="tdText textSize"
              >{{
                row.Create_Date
                  ? row.Create_Date.replace("T", " ").replace("Z", "")
                  : ""
              }}</span
            >
          </template>
        </el-table-column>

        
      </el-table>

      <!-- 分頁組件 -->
      <Pagination
        v-show="_Brand_List.length > 0"
        class="flex justify-end"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        :total="Brand_List.length"
      />
      <!-- 在客戶列表有數據時顯示分頁組件。
            用 v-model:page 和 v-model:limit 綁定當前頁碼和每頁顯示數量。
            :total="Brand_List.length" 設置總數據量。 -->
    </div>
  </div>
</template>

<script setup>
/* 引入依賴  */
import NaviMenu from "@/components/pages/Public/Navigate_Menu.vue"; //引入了Vue組件Navigate_Menu.vue和Permission.vue
import ComptPermission from "@/components/pages/Public/Permission.vue";
import commonFunction from "@/composables/commonFunction";
import axios from "axios"; //引入axios來進行HTTP請求。
import moment from "moment";
import { ref, reactive, onMounted, computed, nextTick, watch } from "vue"; //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import Pagination from "@/components/Pagination.vue"; //引入了Pagination組件
import { useRoute, useRouter } from "vue-router"; //引入了Vue Router的useRoute和useRouter來處理路由
import brand from "./Brand.vue";

/* 創建響應式狀態 */
const { $Input_Clean, $CheckGroup } = commonFunction();
const route = useRoute();
const router = useRouter();
const Brand_List = ref([
  {
    Brand: "Test",
    BrandID: "Tes",
    Access_Date: "2018/5/24 13:18:07.797",
    Create_Date: "2018/5/24 13:18:07.797",
    Histiry_Date: "2018/5/24 13:18:07.797",
    History_User: "Bruce",
  },
  {
    Brand: "Test2",
    BrandID: "Te2",
    Access_Date: "2018/5/24 13:18:07.797",
    Create_Date: "2018/5/24 13:18:07.797",
    Histiry_Date: "",
    History_User: "",
  },
]); //Brand_List：一個響應式的空數組，用於存儲客戶列表。

const _Brand_List = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return Brand_List.value.slice(start, end);
});
const isLoading = ref(false); //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const isHistoryChecked = ref(false);
const drawer = ref(false);
const formDataMode = ref("Close");
const formData = ref({
  Brand: "",
  BrandID: "",
  Access_Date: "",
  Create_Date: "",
  Histiry_Date: "",
  History_User: "",
});
let Query = ref({
  Brand: "",
  BrandID: "",
  History_User: "",
});

const currentPage = ref(1); //currentPage：一個響應式的整數值，用於存儲當前頁碼。
const pageSize = ref(20); //pageSize：一個響應式的整數值，用於存儲每頁顯示的記錄數量。

/* 身份驗證用 */
const post = reactive({ Program_Name: "Brand List", Icons: true });
const IsAuthor = computed(() => $CheckGroup(["it author"]));

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
  const isHistiryDateExist = row.Histiry_Date ? true : false;
  if (!isHistoryChecked.value & isHistiryDateExist) {
    return { display: "none" };
  }
  if (isHistiryDateExist) {
    return { backgroundColor: "rgb(220, 220, 220)" };
  }
  return {};
};

/* 畫面控制 */
// 開啟詳細資訊
const navigateToDetail = (Mode, value) => {
  drawer.value = true;
  formDataMode.value = Mode;
  if (Mode === "Edit") {
    formData.value = {
      Brand: value.Brand,
      BrandID: value.BrandID,
      Access_Date: value.Access_Date,
      Create_Date: value.Create_Date,
      Histiry_Date: value.Histiry_Date,
      History_User: value.History_User,
    };
  }
};
// 關閉詳細資訊
const closeDrawer = async () => {
  formDataMode.value = "Close";
  drawer.value = false;
  formData.value = {
    Brand: "",
    BrandID: "",
    Access_Date: "",
    Create_Date: "",
    Histiry_Date: "",
    History_User: "",
  };
  await reload();
};

/* CRUD 函式 */
// 讀
const getBrandList = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post(
      `/api/Public/Brand/Brand_List`,
      Query.value
    );
    Brand_List.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
// 畫面重載
const reload = async () => {
  Query.value = {
    Brand: "",
    BrandID: "",
    History_User: "",
  };
  await getBrandList();
};
const queryReload = async () => {
  isHistoryChecked.value = true;
  await getBrandList();
};

/* 組件掛載時的初始化邏輯 */
onMounted(async () => {
  await getBrandList();
  // console.log(Brand_List.value);
});
</script>

<style scoped>
.textSize {
  font-size: 12px;
}

.pageContainer {
  -webkit-font-smoothing: antialiased;
}
.addButtonHistiryButtonContainer {
  display: flex;
  position: absolute;
  top: -30px;
  right: 10px;
  z-index: 10;
  background-color: transparent;
}

.addIcon {
  margin-top: 5px;
  cursor: pointer;
  width: 24px;
  height: 32px;
  opacity: 0.8;
}
.addSVG {
  width: 20px;
  height: 20px;
}
.tableContainer {
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
td,
th {
  border: black 2px solid;
}
.tdText {
  cursor: pointer;
}
</style>