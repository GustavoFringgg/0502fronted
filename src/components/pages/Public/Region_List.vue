<template>
  <div class='pageContainer'>

    <!--  導航菜單 -->
    <NaviMenu></NaviMenu>

    <!-- 權限组件 -->
    <div>
      <ComptPermission :post="post"></ComptPermission>
    </div>
    

    <!-- 詳細清單 -->
    <el-drawer v-if="IsAuthor" v-model="drawer" class="relative" :destroy-on-close="true" :show-close="false" :with-header="false" @close="closeDrawer" direction="rtl" size="40%">
      <Region :mode='formDataMode' :formData='formData' :insertData='insertData' @closeDrawer='closeDrawer'></Region>
    </el-drawer>

    <!-- Region清單Table -->
    <div class="tableContent" >
      <!-- 插入Region按钮 -->
      <div v-if="IsAuthor" class="addIcon" @click="navigateToDetail('Create')">
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

      <!-- 表格 -->
      <el-table
        stripe
        :data="_Region_List"
        :header-cell-style="headerStyle"
      >
        <!-- Region名列 -->
        <el-table-column
          show-overflow-tooltip
          header-align="center"
          prop="Region"
          label="Region"
          width="360"
          align="center"
        >
          <!-- 定義thead模板 -->
          <template #header>
            <span class="textSize">Region</span>
            <el-input v-model="Query.Region" size="small" @input="reload()" />
          </template>
          <!-- 定義tbody模板 -->
          <template #default="{ row }">
            <span
              @click="navigateToDetail('Edit', row)"
              class="tdText textSize"
              >{{ row.Region }}</span
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁組件 -->
      <Pagination
        v-show="_Region_List.length > 0"
        class="flex justify-end"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        :total="Region_List.length"
      />
      <!-- 在客戶列表有數據時顯示分頁組件。
            用 v-model:page 和 v-model:limit 綁定當前頁碼和每頁顯示數量。
            :total="Region_List.length" 設置總數據量。 -->
    </div>
  </div>
</template>

<script setup>
/* 引入依賴  */
import NaviMenu from "@/components/pages/Public/Navigate_Menu.vue"; //引入了Vue組件Navigate_Menu.vue和Permission.vue
import ComptPermission from "@/components/pages/Public/Permission.vue";
import commonFunction from '@/composables/commonFunction'
import axios from "axios"; //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, nextTick, watch } from "vue"; //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import Pagination from "@/components/Pagination.vue"; //引入了Pagination組件
import { useRoute, useRouter } from "vue-router"; //引入了Vue Router的useRoute和useRouter來處理路由
import Region from './Region.vue'

/* 創建響應式狀態 */
const { $Input_Clean, $CheckGroup } = commonFunction()
const route = useRoute();
const router = useRouter();
const Region_List = ref([{Region:'AFRICA.S'},{Region:'ALBANIA'}]); //Region_List：一個響應式的空數組，用於存儲客戶列表。
const _Region_List = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return Region_List.value.slice(start, end);
});
const isLoading = ref(false); //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const drawer = ref(false);
const formDataMode = ref("Close");
const formData = ref({ Region: "" });
const Query = ref({ Region: "" });
const insertData = ref({ Region: "" });

const currentPage = ref(1); //currentPage：一個響應式的整數值，用於存儲當前頁碼。
const pageSize = ref(20); //pageSize：一個響應式的整數值，用於存儲每頁顯示的記錄數量。

/* 身份驗證用 */
const post = reactive({ Program_Name: 'Region List', Icons: true })
const IsAuthor = computed(() => $CheckGroup(['it author']))

/* 定義table樣式 */
/* 定義 headerStyle 函數 */
const headerStyle = () => {
  return {
    background: "#CCCCCC", // Element Plus 主色
    color: "",
    "font-weight": "bold",
  };
};

/* 畫面控制 */
// 開啟詳細資訊
const navigateToDetail = (Mode, value) => {
  drawer.value = true;
  formDataMode.value = Mode;
  if (Mode === "Edit") {
    formData.value = {
      Region: value.Region,
    };
  }  
};
// 關閉詳細資訊
const closeDrawer = () => {
  formDataMode.value = "Close";
  drawer.value = false;
  formData.value = { Region: ""};
  reload()
};

/* CRUD 函式 */
// 讀
const getRegionList = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post(`/api/Public/Region/Region_List`, Query.value);
    Region_List.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
// 畫面重載
const reload = async () => {
  await getRegionList();
};

/* 組件掛載時的初始化邏輯 */
onMounted(async () => {
  await getRegionList();
});



</script>

<style scoped>
.textSize{
  font-size: 12px;
}

.pageContainer{
  -webkit-font-smoothing: antialiased
}
.regionTitle {
  padding: 0.3em 0.5em 0.4em 0.5em;
  font: 16px "Microsoft JhengHei", "Lucida Sans Unicode", "Helvetica", "Arial",
    "Verdana", "sans-serif";
  text-shadow: 2px 2px 3px #ccc;
  line-height: 22px;
  margin-top: 1em;
}
td,
th {
  border: black 2px solid;
}
.addIcon {
  position: absolute;
  top: 0px;
  right: 10px;
  z-index: 10;
  background-color: transparent;
  padding-top: 10px;
  padding-left: 4px;
  cursor: pointer;
  width: 24px;
  height: 32px;
  opacity: 0.8;
}
.addSVG{
  width: 20px; 
  height: 20px
}

.tableContent {
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
.tdText{
  cursor: pointer
}
</style>