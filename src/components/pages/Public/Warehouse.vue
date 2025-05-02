<template>
  <ComptPermission style="width: 390px" :post="post" @permission="Permission"></ComptPermission>
  <button class="absolute top-0 left-1 drawer-close-Btn">
    <i class="fa-solid fa-xmark fa-lg" @click="emit('closeDrawer')"></i>
  </button>
  <div v-if="isDataEdit" class="cancelEditContent" @click="handleFinishedEdit"></div>
  <!-- 編輯資料畫面ＵＩ -->
  <template v-if="mode === 'Edit'">
    <el-form class="warehouse-form" :model="warehouse" label-width="35%" label-position="left">
      <el-form-item label="WarehouseID">
        <el-input class="form-data-input" v-model="warehouse.WarehouseID" placeholder="WarehouseID" clearable />
      </el-form-item>
      <el-form-item label="OrganizationID">
        <el-input class="form-data-input" v-model="warehouse.OrganizationID" placeholder="OrganizationID" clearable />
      </el-form-item>
      <el-form-item label="Address_Cht(中文)">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6 }"
          class="form-data-input"
          v-model="warehouse.Address_Cht"
          placeholder="Address_Cht"
          clearable
        />
      </el-form-item>
      <el-form-item label="Address_Eng(English)">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 10 }"
          class="form-data-input"
          v-model="warehouse.Address_Eng"
          placeholder="Address_Eng"
          clearable
        />
      </el-form-item>
      <el-checkbox v-model="warehouse.isEditHistoryChecked" size="default" class="pt-2 pr-2 pl-2 pb-6">
        History
        <span class="ml-2">{{ warehouse.History_Date ? warehouse.Data_Updater : "" }}</span>
        <span class="ml-4">{{
          warehouse.History_Date ? "GMT+8  " + warehouse.History_Date.split(".")[0].replace("T", " ") : ""
        }}</span>
      </el-checkbox>
      <br />

      <el-button
        v-if="isAuthor"
        size="small"
        type="primary"
        @click="Warehouse_Maintain({ mode: 1, table: 'warehouse' })"
        >Submit Data</el-button
      >
      <el-button v-if="isAuthor && rankList.length == 0" size="small" type="danger" @click="Warehouse_Maintain({ mode: 2, table: 'warehouse' })"
        >Delete Data</el-button
      >
    </el-form>
    <div class="table-content">
      <!-- 表格 -->
      <table class="my-table">
        <thead>
          <tr>
            <th class="table-column-and-data text-size">Rank Name</th>
            <th class="table-column-and-data text-size">History</th>

            <th class="text-size add-icon-div"></th>
          </tr>
          <tr>
            <th class="table-column-and-data text-size">
              <input
                class="text-text-align text-size"
                type="text"
                v-model="query.Rank_Name"
                @input="handleQueryData(rankList)"
              />
            </th>
            <th class="align-center">
              <input v-model="isInsertHistoryChecked" style="margin-top: 5px;" v-if="!isRankNameExist" type="checkbox" >
            </th>
            <th>
              <!-- 插入rank按钮 -->
              <div
                class="add-Icon"
                :class="{ 'opacity-light': isRankNameExist }"
                @click="isRankNameExist ? '' : handleAddNewRankBN('edit')"
              >
                <svg
                  class="svg-inline--fa fa-plus-circle fa-w-16 add-SVG"
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
          <tr v-for="(rank, index) in rankList" :key="index" :class="{ 'back-ground-grey': index % 2 === 1 }">
            <td class="table-column-and-data text-size table-data">
              <span v-if="!rank.isDataEdit">{{ rank.Rank_Name }}</span>
              <input
                v-if="rank.isDataEdit"
                class="text-size text-text-align"
                type="text"
                v-model="rank.Rank_Name"
                @keyup.enter="handleFinishedEdit"
                @change="handleFinishedEdit"
              />
            </td>
            <td class="align-center">
              <input type="checkbox" v-model="rank.isRankHistoryCheck" :disabled="!rank.isDataEdit">
            </td>

            <td class="table-column-and-data info-edit-td">
              <i @click="handleEditBtn('edit', index)" v-if="!rank.isDataEdit" class="icon-edit cursor-pointer"></i>
              <i
                v-if="rank.isDataEdit"
                class="fas fa-trash-alt cursor-pointer"
                @click="handleDeleteBtn('edit', index)"
                style="margin-left: 4px; margin-right: 5px"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </template>

  <!-- 新增資料ＵＩ -->
  <template v-else-if="mode === 'Create'">
    <el-form class="warehouse-form" :model="insertDataWarehouse" label-width="35%" label-position="left">
      <el-form-item label="WarehouseID">
        <el-input
          class="form-data-input"
          v-model="insertDataWarehouse.WarehouseID"
          placeholder="WarehouseID"
          clearable
        />
      </el-form-item>
      <el-form-item label="OrganizationID">
        <el-input
          class="form-data-input"
          v-model="insertDataWarehouse.OrganizationID"
          placeholder="OrganizationID"
          clearable
        />
      </el-form-item>
      <el-form-item label="Address_Cht(中文)">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6 }"
          class="form-data-input"
          v-model="insertDataWarehouse.Address_Cht"
          placeholder="Address_Cht"
          clearable
        />
      </el-form-item>
      <el-form-item label="Address_Eng(English)">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 6 }"
          class="form-data-input"
          v-model="insertDataWarehouse.Address_Eng"
          placeholder="Address_Eng"
          clearable
        />
      </el-form-item>

      <el-checkbox v-model="isCreateHistoryChecked" size="default" class="pt-2 pr-2 pl-2 pb-6">
        History
        <span class="ml-2">{{ isCreateHistoryChecked ? insertDataWarehouse.Data_Updater : "" }}</span>
        <span class="ml-4">{{ isCreateHistoryChecked ? getTaiwanTime() : "" }}</span>
      </el-checkbox>
      <br />
    </el-form>

    <div class="table-content">
      <!-- 表格 -->
      <table class="my-table">
        <thead>
          <tr>
            <th class="table-column-and-data text-size">Rank Name</th>
            <th class="table-column-and-data text-size">History</th>
            <th class="text-size add-icon-div"></th>
          </tr>
          <tr>
            <th class="table-column-and-data text-size">
              <input
                class="text-text-align text-size"
                type="text"
                v-model="query.Rank_Name"
                @input="handleQueryData(insertDataRank)"
              />
            </th>
            <th class="align-center">
              <input v-model="isInsertHistoryChecked" style="margin-top: 5px;" v-if="!isRankNameExist" type="checkbox" >
            </th>
            <th>
              <!-- 插入rank按钮 -->
              <div
                class="add-Icon"
                :class="{ 'opacity-light': isRankNameExist, 'cursor-none': isRankNameExist }"
                @click="isRankNameExist ? '' : handleAddNewRankBN('insert')"
              >
                <svg
                  class="svg-inline--fa fa-plus-circle fa-w-16 add-SVG"
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
          <tr v-for="(rank, index) in insertDataRank" :key="index" :class="{ 'back-ground-grey': index % 2 === 1 }">
            <td class="table-column-and-data text-size table-data">
              <span v-if="!rank.isDataEdit">{{ rank.Rank_Name }}</span>
              <input
                v-if="rank.isDataEdit"
                class="text-size text-text-align"
                type="text"
                v-model="rank.Rank_Name"
                @keyup.enter="handleFinishedEdit"
                @change="handleFinishedEdit"
              />
            </td>
            <td class="align-center">
              <input type="checkbox" v-model="rank.isRankHistoryCheck" :disabled="!rank.isDataEdit">
            </td>

            <td class="table-column-and-data info-edit-td">
              <i @click="handleEditBtn('insert', index)" v-if="!rank.isDataEdit" class="icon-edit cursorPointer"></i>
              <i
                v-if="rank.isDataEdit"
                class="fas fa-trash-alt cursor-pointer"
                @click="handleDeleteBtn('insert', index)"
                style="margin-left: 4px; margin-right: 5px"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <br />
    <el-button
      v-if="isAuthor"
      @click="Warehouse_Maintain({ mode: 0, table: 'warehouse' })"
      class="submit-bn"
      type="primary"
    >
      <span style="margin-left: 6px">Submit</span>
    </el-button>
  </template>
</template>

<script setup>
/* 引入依賴  */
import ComptPermission from "../Public/Permission.vue";
import commonFunction from "@/composables/commonFunction";
import axios from "axios"; //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, watch, onBeforeMount } from "vue"; //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import { useRoute, useRouter } from "vue-router"; //引入了Vue Router的useRoute和useRouter來處理路由

/* 創建響應式狀態 */
const route = useRoute();
const router = useRouter();
const { $Input_Clean, $CheckGroup } = commonFunction();
const emit = defineEmits(["closeDrawer"]);
const Permission = (item) => {
  State.value = item;
};
const post = reactive({
  Program_Name: "Warehouse",
  IDValue: route.params.warehouseID,
  Icons: true,
});

const userName = ref(localStorage.getItem("user"));
const isLoading = ref(false);
const mode = computed(() => route.params.mode);
const isCreateHistoryChecked = ref(false);
const isDataEdit = ref(false);
const isRankNameExist = ref(true);
const warehouse = ref({});
// const warehouse = ref({
//   WarehouseID: "test",
//   OrganizationID: "BM",
//   Address_Cht: "台中市42876大雅區三和里建興路45巷11號",
//   Address_Eng: "No.11, Ln. 45, Jiansing Rd., Sanhe Vil., Daya Dist., Taichung City 42876, Taiwan (R.O.C.)	",
//   Create_Date: "2024-12-26T15:27:52.720Z",
//   History_Date: "2024-12-26T15:27:52.720Z",
//   UserID: "21",
//   Data_Updater: "bruce-liu",
//   Data_Update: "2024-12-26T15:27:52.720Z",
// });
const rankList = ref([]);
const insertDataWarehouse = ref({
  WarehouseID: "",
  OrganizationID: "",
  Address_Cht: "",
  Address_Eng: "",
  UserID: userName.value,
  Data_Updater: userName.value,
});
// const insertDataWarehouse = ref({
//   WarehouseID: "TEST",
//   OrganizationID: "TEST",
//   Address_Cht: "TEST",
//   Address_Eng: "TEST",
//   UserID: userName.value,
//   Data_Updater: userName.value,
// });
const insertDataRank = ref([]);
// const insertDataRank = ref([
//   {
//     Rank_Name: "XXXX",
//     isHistoryChecked: false,
//     isDataEdit: false,
//     isRankHistoryCheck: false
//   },
//   {
//     Rank_Name: "TEST2",
//     isHistoryChecked: true,
//     isDataEdit: false,
//     isRankHistoryCheck: false
//   },
// ]);

const originWarehouseData = ref({
  WarehouseID: "",
  OrganizationID: "",
  Address_Cht: "",
  Address_Eng: "",
});
const originRankList = ref({
  WarehouseID: "",
  OrganizationID: "",
  Address_Cht: "",
  Address_Eng: "",
});
const query = ref({
  Rank_Name: "",
});
const isInsertHistoryChecked = ref(false)

function handleAddNewRankBN(mode, value = undefined) {
  // ElMessage({
  //       showClose: true,
  //       type: "error",
  //       message: "Rank Name is Exist",
  // });

  if (query.value.Rank_Name.trim() != "") {
    if (mode === "insert") {
      insertDataRank.value.push({
        Rank_Name: query.value.Rank_Name.toUpperCase(),
        isRankHistoryCheck: isInsertHistoryChecked.value,
        isDataEdit: false,
      });
      query.value.Rank_Name = ''
      isInsertHistoryChecked.value = false
    }
    if (mode === "edit") {
      Warehouse_Maintain({ mode: 0, table: "rank"});
    }
  }
}
function handleDeleteBtn(mode, index) {
  if (mode === "insert") {
    insertDataRank.value.splice(index, 1);
    return;
  }
  if (mode === "edit") {
    Warehouse_Maintain({ mode: 2, table: "rank", index: index });
    // console.log("寄api");
  }
}
function handleEditBtn(mode, index) {
  isDataEdit.value = true;
  if (mode === "insert") {
    insertDataRank.value[index].isDataEdit = true;
    return;
  }
  if (mode === "edit") {
    rankList.value[index].isDataEdit = true;
    return;
  }
}
function handleFinishedEdit() {
  if(mode.value ==='Edit'){
    const index = rankList.value.findIndex(obj => obj.isDataEdit === true); 
    // console.log(index);
    
    Warehouse_Maintain({mode: 1, index: index, table: 'rank'})
  }
  if (isDataEdit.value) {
    for (let item of rankList.value) {
      item.isDataEdit = false;
    }
    for (let item of insertDataRank.value) {
      item.isDataEdit = false;
    }
    isDataEdit.value = false; 
  }
}

// 資料驗證
const State = reactive({}); //初始化 State：將 State 初始化為一個空對象。
const isAuthor = computed(
  () =>
    $CheckGroup(["it author"]) &&
    (State.value?.IsCrew ||
      State.value?.IsSuperior ||
      State.value?.IsOwner ||
      State.value?.IsDeputy ||
      State.value?.IsCooperator ||
      State.value?.IsUserEmpty)
);
// const isAuthor = computed(() => false);
// const isAuthor = computed(() => true);

//取得台灣時間
function getTaiwanTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const taiwanOffset = 8 * 60 * 60000;
  const taiwanDate = new Date(utc + taiwanOffset);

  const year = taiwanDate.getFullYear();
  const month = taiwanDate.getMonth() + 1;
  const day = taiwanDate.getDate();
  const hour = taiwanDate.getHours();
  const minute = taiwanDate.getMinutes();
  const second = taiwanDate.getSeconds();

  return `GMT+8 ${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

const handleQueryData = async (list) => {
  if (query.value.Rank_Name !== "") {
    const findRankName = list.find((obj) => obj.Rank_Name === query.value.Rank_Name.toUpperCase());
    // console.log("get", findRankName);
    isRankNameExist.value = findRankName !== undefined ? true : false;
  } else {
    isRankNameExist.value = true;
  }
};

const Warehouse_Info = async (obj) => {
  // 當路由回到/warehouse_list時 就return
  if (!obj?.warehouseID) return;
  // 當新增資料的時候 就return
  if (obj.mode === "Create") return;

  let params = { WarehouseID: obj.warehouseID };

  try {
    isLoading.value = true;
    const response = await axios.post(`/api/Public/Warehouse/Warehouse_Info`, params);
    rankList.value = response.data;
    rankList.value = rankList.value.map((item) => {
      let newItem = {
        ...item,
        isRankHistoryCheck: item.Rank_History_Date ? true : false,
        isDataEdit: false,
      };
      return newItem;
    });
    originRankList.value = response.data.map((item) => {
      let newItem = {
        ...item,
        isRankHistoryCheck: item.Rank_History_Date ? true : false,
        isDataEdit: false,
      };
      return newItem;
    });
    rankList.value[0].Rank_Name === null ? (rankList.value = []) : "";
    // console.log(rankList.value);

    warehouse.value = {
      WarehouseID: response.data[0].WarehouseID,
      OrganizationID: response.data[0].OrganizationID,
      Address_Cht: response.data[0].Address_Cht,
      Address_Eng: response.data[0].Address_Eng,
      Create_Date: response.data[0].Warehouse_Create_Date,
      History_Date: response.data[0].Warehouse_History_Date,
      UserID: response.data[0].UserID,
      Data_Updater: response.data[0].Warehouse_Data_Updater,
      Data_Update: response.data[0].Warehouse_Data_Update,
      isEditHistoryChecked: response.data[0].Warehouse_History_Date ? true : false,
    };

    originWarehouseData.value = {
      WarehouseID: response.data[0].WarehouseID,
      OrganizationID: response.data[0].OrganizationID,
      Address_Cht: response.data[0].Address_Cht,
      Address_Eng: response.data[0].Address_Eng,
      Create_Date: response.data[0].Warehouse_Create_Date,
      History_Date: response.data[0].Warehouse_History_Date,
      UserID: response.data[0].UserID,
      Data_Updater: response.data[0].Warehouse_Data_Updater,
      Data_Update: response.data[0].Warehouse_Data_Update,
      isEditHistoryChecked: response.data[0].Warehouse_History_Date ? true : false,
    };
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

/* 串後端API */
const Warehouse_Maintain = async (obj) => {
  // obj.mode === 0 表示新增
  // obj.mode === 1 表示修改
  // obj.mode === 2 表示刪除
  if (isLoading.value) return;
  isLoading.value = true;
  let params = {
    mode: obj.mode,
  };

  switch (obj.mode) {
    // create
    case 0:
      switch (obj.table) {
        case "warehouse":
          //確認每個欄位是否有填
          let isColumnEmpty = false;
          if (
            (insertDataWarehouse.value.WarehouseID === "") |
            (insertDataWarehouse.value.OrganizationID === "") |
            (insertDataWarehouse.value.Address_Cht === "") |
            (insertDataWarehouse.value.Address_Eng === "")
          ) {
            isColumnEmpty = true;
          }
          for (let item of insertDataRank.value) {
            if (item.Rank_Name === "") isColumnEmpty = true;
          }
          if (isColumnEmpty) {
            ElMessage({
              showClose: true,
              type: "error",
              message: "Each field is required.",
            });
            isLoading.value = false;
            return;
          }

          //確認資料是否已經存在
          let isDataExist = false;
          try {
            isLoading.value = true;
            const response = await axios.post(`/api/Public/Warehouse/Check_WarehouseID`, insertDataWarehouse.value);
            isDataExist = response.data;
            if (isDataExist) {
              ElMessage({
                showClose: true,
                type: "error",
                message: "Data is already exist",
              });
              isLoading.value = false;
              emit("closeDrawer");
              return;
            }
          } catch (error) {
            console.log(error);
            isLoading.value = false;
          }

          params = {
            ...insertDataWarehouse.value,
            rankList: insertDataRank.value,
            isWarehouseHistoryChecked: isCreateHistoryChecked.value,
            mode: params.mode,
          };
          break;
        case "rank":
          //確認每個欄位是否有填
          let isRankNameEmpty = false;
          if (obj.Rank_Name === "") isRankNameEmpty = true;
          if (isRankNameEmpty) {
            ElMessage({
              showClose: true,
              type: "error",
              message: "Rank Name is required.",
            });
            isLoading.value = false;
            return;
          }
          params.newData = {
            Rank_Name: query.value.Rank_Name,
            WarehouseID: warehouse.value.WarehouseID,
            isRankHistoryCheck: isInsertHistoryChecked.value,
            Data_Updater: userName.value
          };


          break;
      }
      params.table = obj.table;

      // console.log(params);

      break;
    // upDate
    case 1:
      switch (obj.table) {
        case "warehouse":
          params.newData = {
            WarehouseID: warehouse.value.WarehouseID,
            OrganizationID: warehouse.value.OrganizationID,
            Address_Cht: warehouse.value.Address_Cht,
            Address_Eng: warehouse.value.Address_Eng,
            isEditHistoryChecked: warehouse.value.isEditHistoryChecked,
          };
          params.originData = {
            WarehouseID: originWarehouseData.value.WarehouseID,
            OrganizationID: originWarehouseData.value.OrganizationID,
            Address_Cht: originWarehouseData.value.Address_Cht,
            Address_Eng: originWarehouseData.value.Address_Eng,
            isEditHistoryChecked: originWarehouseData.value.isEditHistoryChecked,
          };

          break;
        case "rank":
          // console.log(rankList.value[obj.index]);
          // console.log(obj.index);
          
          params.newData = {
            ...rankList.value[obj.index],
            WarehouseID: warehouse.value.WarehouseID,
          };
          params.originData = {
            ...originRankList.value[obj.index],
            WarehouseID: warehouse.value.WarehouseID,
          };
          

          break;
      }

      params.Data_Updater = userName.value;
      params.table = obj.table;
      // console.log(params);
      break;
    // // Del
    case 2:
      let confirm = false;
      try {
        confirm = await ElMessageBox.confirm(`Are you sure you want to delete this?`, "warning!!", {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        });
      } catch (err) {
        ElMessage({
          showClose: true,
          type: "info",
          message: "Cancel Delete",
        });
      }
      if (confirm !== "confirm") {
        isLoading.value = false;
        return;
      }

      switch (obj.table) {
        case "warehouse":
          params.deleteData = originWarehouseData.value;
          params.WarehouseID = originWarehouseData.value.WarehouseID;
          break;
        case "rank":
          params.deleteData = originRankList.value[obj.index];
          params.WarehouseID = originWarehouseData.value.WarehouseID;
          break;
      }

      params.table = obj.table;
      // console.log(params);

      break;
  }

  // 送出 API
  try {
    const response = await axios.post(`/api/Public/Warehouse/Warehouse_Maintain`, params);
    console.log("response:", response);
    if (response.data.FlagA | response.data.FlagB) {
      ElMessage({
        showClose: true,
        type: "info",
        message:
          obj.mode === 0 ? "Insert Data Success" : obj.mode === 1 ? "Update Data Success" : "Delete Data Success",
      });
    } else {
      if (response.data.message === "WarehouseID Existed") {
        ElMessage({
          showClose: true,
          type: "error",
          message: "WarehouseID Existed",
        });
      } else if (response.data.message === "Rank Name Existed") {
        ElMessage({
          showClose: true,
          type: "error",
          message: "Rank Name Existed",
        });
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    if ((obj.mode === 0 && obj.table === 'rank') | (obj.mode === 1) | (obj.mode === 2 && obj.table === "rank")) {
      emit("closeDrawer", { closeDrawer: false });
      Warehouse_Info({
        warehouseID: originWarehouseData.value.WarehouseID,
        mode: "Edit",
      });
    } else {
      emit("closeDrawer");
    }
    isLoading.value = false;
    isInsertHistoryChecked.value = false
    query.value.Rank_Name = ''
  }
};

onMounted(async () => {
  await Warehouse_Info({
    warehouseID: route.params.warehouseID,
    mode: route.params.mode,
  });
  // console.log(warehouse.value);
  // console.log(rankList.value);

});
</script>

<style scoped>
.text-size {
  font-size: 12px;
}
form {
  margin-bottom: 30px;
}

.cancelEditContent {
  width: 100%;
  height: 95vh;
  position: absolute;
  z-index: 0;
  /* background-color: black; */
}

.warehouse-title {
  padding: 0.3em 0.5em 0.4em 0.5em;
  font: 16px "Microsoft JhengHei", "Lucida Sans Unicode", "Helvetica", "Arial", "Verdana", "sans-serif";
  text-shadow: 2px 2px 3px #ccc;
  line-height: 22px;
  margin-top: 1em;
}
.rank-title {
  padding: 0.3em 0.5em 0.4em 0.5em;
  margin-bottom: 0.4em;
  font: 12px "Microsoft JhengHei", "Lucida Sans Unicode", "Helvetica", "Arial", "Verdana", "sans-serif";
  text-shadow: 2px 2px 3px #ccc;
  line-height: 22px;
  margin-top: 1em;
}

.add-new-rank-bn {
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  justify-content: center;
}
.submit-bn {
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  justify-content: center;
  margin-top: 70px;
  margin-bottom: 30px;
}

.warehouse-form {
  border: black 1px solid;
  border-radius: 20px;
  padding: 20px;
  max-width: 500px;
}
.el-form-item {
  margin-bottom: 5px;
}
.el-form-item__label {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
}

.form-data-input {
  width: 300px;
}

.text-size {
  font-size: 12px;
}
.text-text-align {
  text-align: center;
}

.table-content {
  width: fit-content;
  position: relative;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}
.add-icon-div {
  width: 30px;
}
.add-Icon {
  background-color: transparent;
  display: flex;
  justify-content: center;
  text-align: center;
  margin: auto;

  cursor: pointer;
  width: 24px;
  height: 32px;
  opacity: 0.8;
}
.add-SVG {
  width: 15px;
}
.my-table {
  z-index: 1;
  border-collapse: separate; /* 這行很重要 */
  border-spacing: 0;
  border: 1px solid black;
  border-radius: 20px;
  overflow: hidden;
  padding: 5px;
}
thead {
  background: white;
  z-index: 10;
}
thead tr:nth-of-type(1) th {
  border: none;
}

.table-column-and-data {
  width: 100px;
  text-align: center;
}
.table-data {
  height: 20px;
}
.back-ground-grey {
  background-color: #f1f1f1;
}
.info-edit-td {
  width: 50px;
  height: 14px;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-none {
  cursor: default;
}
.opacity-light {
  opacity: 0.2;
}
.align-center{
  display: flex;
  justify-self: center;
}
input[type="checkbox"]:disabled {
  cursor: not-allowed; /* 滑鼠變成禁止的樣子 */
  opacity: 0.5; /* 整個透明一點 */
}
</style>