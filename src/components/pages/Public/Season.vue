<template>
  <div class="pageContainer" @click="handleClickOutside">
    <!--  導航菜單 -->
    <NaviMenu></NaviMenu>
    <div class="cancelEditContent" @click="handleFinishedEdit"></div>
    <!-- 權限组件 -->
    <div>
      <ComptPermission :post="post"></ComptPermission>
    </div>

    <!-- 城市清單Table -->
    <div class="tableContent">
      <!-- 表格 -->
      <table class="myTable">
        <thead>
          <tr>
            <th class="tableColumnAndData textSize">Season</th>
            <th class="tableColumnAndData textSize">SortID</th>
            <th class="textSize addIconDiv"></th>
          </tr>
          <tr>
            <th class="tableColumnAndData textSize">
              <input
                class="textTextAlign textSize"
                type="text"
                v-model="query.Season"
                @input="handleQueryData"
              />
            </th>
            <th class="tableColumnAndData textSize">
              <input
                class="textTextAlign textSize"
                type="text"
                v-model="query.SortID"
                @input="handleQueryData"
              />
            </th>
            <th>
              <!-- 插入Season按钮 -->
              <div
                v-if="IsAuthor & isDataNew"
                class="addIcon"
                @click="Season_Maintain({ mode: 0 })"
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
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(season, index) in _seasonList"
            :key="index"
            :class="{ backGroundGrey: index % 2 === 1 }"
          >
            <td class="tableColumnAndData textSize tableData">
              <span v-if="!season.isDataEdit">{{ season.Season }}</span>
              <input
                v-if="season.isDataEdit"
                class="textSize textTextAlign"
                type="text"
                v-model="edit.Season"
                @keyup.enter="handleFinishedEdit"
                @change="
                  Season_Maintain({
                    mode: 1,
                    columnName: 'Season',
                    items: season,
                  })
                "
              />
            </td>
            <td class="tableColumnAndData textSize tableData">
              <span v-if="!season.isDataEdit">{{ season.SortID }}</span>
              <input
                v-if="season.isDataEdit"
                class="textSize textTextAlign"
                type="text"
                v-model="edit.SortID"
                @keyup.enter="handleFinishedEdit"
                @change="
                  Season_Maintain({
                    mode: 1,
                    columnName: 'SortID',
                    items: season,
                  })
                "
              />
            </td>
            <td class="tableColumnAndData infoEditTd">
              <i
                @click="handleEditBtn(index)"
                v-if="!season.isDataEdit"
                class="icon-edit cursorPointer"
              ></i>
              <i
                v-if="season.isDataEdit"
                class="fas fa-trash-alt cursorPointer"
                @click="handleDeleteBtn(season)"
                style="margin-left: 4px; margin-right: 5px"
              ></i>
              <el-tooltip
                effect="dark"
                :content="
                  season.Data_Updater
                    ? 'Last Edited By ' +
                      season.Data_Updater +
                      ' And Last Modified at ' +
                      season.Data_Update.replace('T', '  ')
                        .replace('Z', '')
                        .split('.')[0]
                    : 'This data has not been modified.'
                "
                placement="top"
              >
                <i class="icon-infor cursorPointer"></i>
              </el-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
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

/* 創建響應式狀態 */
const { $CheckGroup } = commonFunction();
const seasonList = ref([]);
const _seasonList = computed(() => {
  return seasonList.value.map((item, index) => {
    item["isDataEdit"] = false;
    item["oringinSortID"] = item.SortID;
    return item;
  });
});

const isLoading = ref(false); //isLoading：一個響應式的布爾值，用於指示數據是否正在加載
const isDataNew = ref(false);
const isDataEdit = ref(false);
const isProcessing = ref(false);
const myTable = ref(null);
const formDataMode = ref("Close");
const query = ref({
  Season: "",
  SortID: "",
});
const edit = ref({
  Season: "",
  SortID: "",
});
/* 身份驗證用 */
const post = reactive({ Program_Name: "Season List", Icons: true });
const IsAuthor = computed(() => $CheckGroup(["it author"]));
// const IsAuthor = computed(() => false);

const handleEditBtn = (index) => {
  //先關掉所有data的修訂狀態
  for (let item of seasonList.value) {
    item.isDataEdit = false;
  }
  if (IsAuthor.value) {
    //賦值到Edit 並修改全局isDataEdit狀態為true 該筆資料狀態也為true
    edit.value.Season = seasonList.value[index].Season;
    edit.value.SortID = seasonList.value[index].SortID;
    isDataEdit.value = true;
    seasonList.value[index].isDataEdit = true;
  } else {
    ElMessage({
      showClose: true,
      type: "error",
      message: "You don't have permission to edit.",
    });
  }
};

const handleFinishedEdit = async (obj) => {
  if (isDataEdit.value) {
    for (let item of seasonList.value) {
      item.isDataEdit = false;
    }
    isDataEdit.value = false;
  }
};

const handleQueryData = async () => {
  getSeasonList();
  if ((query.value.Season !== "") & (query.value.SortID !== "")) {
    //寄request 確認資料是否重複
    let isDataExist = await checkDataExist(query.value);
    if (isDataExist) {
      isDataNew.value = false;
    } else {
      isDataNew.value = true;
    }
  } else {
    isDataNew.value = false;
  }
};

const handleDeleteBtn = async (data) => {
  let _confirm = false;
  try {
    _confirm = await ElMessageBox.confirm(
      `Are you sure you want to delete this?`,
      "warning!!",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    );
  } catch (_err) {
    ElMessage({
      showClose: true,
      type: "info",
      message: "Cancel Delete",
    });
    isProcessing.value = false;
  }

  if (_confirm !== "confirm") return;
  isDataEdit.value = false;
  await Season_Maintain({ ...data, mode: 2 });
  getSeasonList();
};

/* CRUD 函式 */
// 讀
const getSeasonList = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post(
      `/api/Public/Season/Season_List`,
      query.value
    );
    seasonList.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const checkDataExist = async (data) => {
  let result = null;
  try {
    isLoading.value = true;

    const response = await axios.post(`/api/Public/Season/Check_SortID`, data);

    result = response;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
  console.log(result);

  return result.data;
};

const Season_Maintain = async (obj) => {
  // obj.mode === 0 表示新增
  // obj.mode === 1 表示修改
  // obj.mode === 2 表示刪除
  if (isProcessing.value) return;
  isProcessing.value = true;

  let params = {
    mode: obj.mode,
  };

  switch (obj.mode) {
    // create
    case 0:
      params = {
        mode: params.mode,
        Data_Updater: localStorage.getItem("user"),
        ...query.value,
      };
      isDataNew.value = false;
      // console.log(params);
      break;
    // upDate
    case 1:
      let isDataExist = await checkDataExist(edit.value);
      if (isDataExist) {
        ElMessage({
          showClose: true,
          type: "error",
          message: "Data is already exist",
        });
        return;
      }
      switch (obj.columnName) {
        case "Season":
          params = {
            mode: params.mode,
            Data_Updater: localStorage.getItem("user"),
            columnName: obj.columnName,
            value: edit.value.Season,
            SortID: obj.items.oringinSortID,
          };
          // console.log(params);

          break;
        case "SortID":
          params = {
            mode: params.mode,
            Data_Updater: localStorage.getItem("user"),
            columnName: obj.columnName,
            value: edit.value.SortID,
            SortID: obj.items.oringinSortID,
          };
          // console.log(params);
          break;
      }
      break;
    // Del
    case 2:
      params = obj;
      break;
  }

  // 送出 API
  try {
    const response = await axios.post(
      `/api/Public/Season/Season_Maintain`,
      params
    );
    if (response.data.Flag) {
      ElMessage({
        showClose: true,
        type: "info",
        message:
          obj.mode === 0
            ? "Insert Data Success"
            : obj.mode === 1
            ? "Update Data Success"
            : "Delete Data Success",
      });
    } else {
      ElMessage({
        showClose: true,
        type: "info",
        message:
          obj.mode === 0
            ? "Insert Data Failed"
            : obj.mode === 1
            ? "Update Data Failed"
            : "Delete Data Failed",
      });
    }

    // console.log("response:", response);
  } catch (_err) {
    console.log(_err);
  } finally {
    query.value.Season = "";
    query.value.SortID = "";
    isProcessing.value = false;
    getSeasonList();
  }
};

/* 組件掛載時的初始化邏輯 */
onMounted(async () => {
  await getSeasonList();
});
</script>

<style scoped>
.textSize {
  font-size: 12px;
}
.textTextAlign {
  text-align: center;
}

.pageContainer {
  -webkit-font-smoothing: antialiased;
}
.cancelEditContent {
  width: 100%;
  height: 95vh;
  position: absolute;
  z-index: 0;
}

.tableContent {
  width: fit-content;
  position: relative;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}
.addIconDiv {
  width: 30px;
}
.addIcon {
  background-color: transparent;
  display: flex;
  justify-content: center;
  text-align: center;

  cursor: pointer;
  width: 24px;
  height: 32px;
  opacity: 0.8;
}
.addSVG {
  width: 15px;
}
.myTable {
  z-index: 1;
}
thead {
  position: sticky;
  top: 0px;
  background: white;
  z-index: 10;
}
thead tr:nth-of-type(1) th {
  border: none;
  outline: white solid 1px;
}
thead tr:nth-of-type(2) th {
  outline: silver solid 1px;
  border: silver solid 2px;
}

td {
  border: silver 1px solid;
}
.tableColumnAndData {
  width: 100px;
  text-align: center;
}
.trashCanIcon {
  margin-right: 2px;
}
.tableData {
  height: 20px;
}
.backGroundGrey {
  background-color: #f1f1f1;
}
.infoEditTd {
  width: 50px;
  height: 14px;
}
.cursorPointer {
  cursor: pointer;
}
</style>