<template>
  <div class="brandTitle textSize">Brand</div>
  <button class="absolute top-0 left-1 drawer-close-Btn">
    <i class="fa-solid fa-xmark fa-lg" @click="emit('closeDrawer')"></i>
  </button>
  <!-- 編輯資料畫面ＵＩ -->
  <template v-if="mode === 'Edit'">
    <el-form
      class="brandForm"
      :model="formData"
      calss="add-new-form"
      label-width="21%"
      label-position="left"
    >
      <el-form-item label="Brand">
        <el-input
          class="formDataInput"
          v-model="newData.Brand"
          placeholder="Brand Name"
          clearable
        />
      </el-form-item>
      <el-form-item label="BrandID">
        <el-input
          class="formDataInput"
          v-model="newData.BrandID"
          placeholder="BrandID Name"
          clearable
        />
      </el-form-item>

      <el-checkbox v-model="isHistoryCheckedFormData" @change="changHistory" size="default" class="pt-2 pr-2 pl-2 pb-6">
        History
        <span v-if="isHistoryCheckedFormData" class="ml-2">{{formData.History_User? formData.History_User : userName}}</span>
        <span v-if="isHistoryCheckedFormData" class="ml-4">{{formData.Histiry_Date? 'GMT+8  ' + formData.Histiry_Date.split(".")[0].replace('T', ' '): getTaiwanTime()}}</span>
      </el-checkbox>

      <br />

      <el-button size="small" @click="Brand_Maintain({ Mode: 1 })"
        >Submit</el-button
      >
      <el-button size="small" type="danger" @click="Brand_Maintain({ Mode: 2 })"
        >Delete Data</el-button
      >
    </el-form>
  </template>

  <!-- 新增資料ＵＩ -->
  <template v-else-if="mode === 'Create'">
    <el-form
      class="brandForm"
      :model="formData"
      calss="add-new-form"
      label-width="21%"
      label-position="left"
    >
      <el-form-item label="Brand">
        <el-input
          class="formDataInput"
          v-model="insertData.Brand"
          placeholder="Brand Name"
          clearable
        />
      </el-form-item>
      <el-form-item label="BrandID">
        <el-input
          class="formDataInput"
          v-model="insertData.BrandID"
          placeholder="BrandID Name"
          clearable
        />
      </el-form-item>

      <el-checkbox v-model="isHistoryCheckedInsertData" size="default" class="pr-12 pl-2 pb-6">
        History
        <span v-if="isHistoryCheckedInsertData" class="ml-2">{{userName}}</span>
        <span v-if="isHistoryCheckedInsertData" class="ml-4">{{getTaiwanTime()}}</span>
      </el-checkbox>
      

      <br />

      <el-button size="small" @click="Brand_Maintain({ Mode: 0 })"
        >Submit</el-button
      >
    </el-form>
  </template>
</template>

<script setup>
/* 引入依賴  */
import NaviMenu from "@/components/pages/Public/Navigate_Menu.vue"; //引入了Vue組件Navigate_Menu.vue和Permission.vue
import axios from "axios"; //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, nextTick, watch } from "vue"; //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import Pagination from "@/components/Pagination.vue"; //引入了Pagination組件
import moment from "moment";

/* 創建響應式狀態 */
const props = defineProps(["mode", "formData", "insertData"]);
const emit = defineEmits(["closeDrawer"]);
const isProcessing = ref(false);
const isLoading = ref(false);
const isHistoryCheckedFormData = ref(false);
const isHistoryChange = ref(false)
const isHistoryCheckedInsertData = ref(false);
const insertData = ref({
  Brand: "",
  BrandID: "",
  History_User: "",
});
const newData = ref({
  Brand: "",
  BrandID: "",
  Histiry_Date: "",
  History_User: "",
  isHistoryChange: false
});
const originData = ref({
  Brand: "",
  BrandID: "",
  Histiry_Date: "",
  History_User: "",
});
const userName = ref('UserName')

//取得台灣時間
function getTaiwanTime() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const taiwanOffset = 8 * 60 * 60000
  const taiwanDate = new Date(utc + taiwanOffset)

  const year = taiwanDate.getFullYear()
  const month = taiwanDate.getMonth() + 1
  const day = taiwanDate.getDate()
  const hour = taiwanDate.getHours()
  const minute = taiwanDate.getMinutes()
  const second = taiwanDate.getSeconds()

  return `GMT+8 ${year}/${month}/${day} ${hour}:${minute}:${second}`
}

const changHistory = ()=>{
  isHistoryChange.value = !isHistoryChange.value
  console.log(isHistoryChange.value)
}

//並未使用Brand_Info 改用props將值傳入元件 

/* 串後端API */
const Brand_Maintain = async (_obj) => {
  // _obj.Mode === 0 表示新增
  // _obj.Mode === 1 表示修改
  // _obj.Mode === 2 表示刪除
  if (isProcessing.value) return;
  isProcessing.value = true;

  let _params = {
    Mode: _obj.Mode,
  };

  switch (_obj.Mode) {
    // create
    case 0:
      // 確認必要欄位是否都有輸入
      if ((insertData.value.Brand === "") | (insertData.value.BrandID === "")) {
        ElMessage({
          showClose: true,
          type: "error",
          message: "Brand and BrandID requires input",
        });
        return;
      }
      // 確認data是不是已經存在
      let isDataExistCreate = false;
      try {
        const checkBrandID = { BrandID: insertData.value.BrandID}
        isLoading.value = true;
        const response = await axios.post(
          `/api/Public/Brand/Brand_List`,
          checkBrandID
        );
        if (response.data.length > 0) {
          isDataExistCreate = true;
          ElMessage({
            showClose: true,
            type: "error",
            message: "BrandID is already exist",
          });
          emit("closeDrawer");
        }
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
      if (isDataExistCreate) return;

      if(isHistoryCheckedInsertData.value){
        insertData.value.History_User = userName.value;
        insertData.value.isHistoryCheck = true
      }
      _params.insertData = insertData.value;


      console.log(insertData.value);
      break;
    // upDate
    case 1:
      // 確認data是不是已經存在
      let isDataExistUpdate = false;
      try {
        const checkBrandID = { BrandID: newData.value.BrandID}
        isLoading.value = true;
        const response = await axios.post(
          `/api/Public/Brand/Brand_List`,
          checkBrandID
        );
        if (response.data.length > 0) {
          isDataExistUpdate = true;
          ElMessage({
            showClose: true,
            type: "error",
            message: "BrandID is already exist",
          });
          emit("closeDrawer");
        }
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
      if (isDataExistUpdate) return;

      if(isHistoryChange.value){
        newData.value.History_User = userName.value;
        newData.value.isHistoryChange = true
      }
      _params.newData = newData.value;
      _params.originData = originData.value;
      console.log(newData.value);
      break;
    // Del
    case 2:
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
      _params.cancelData = newData.value;
      break;
  }

  // 送出 API
  try {
    const response = await axios.post(
      `/api/Public/Brand/Brand_Maintain`,
      _params
    );
    console.log("response:", response);
  } catch (_err) {
    console.log(_err);
  } finally {
    isProcessing.value = false;
    emit("closeDrawer");
  }
};

const setData = (mode) => {
  if (mode === "Edit") {
    newData.value.Brand = props.formData.Brand;
    newData.value.BrandID = props.formData.BrandID;
    newData.value.Histiry_Date = props.formData.Histiry_Date;
    newData.value.History_User = props.formData.History_User;

    originData.value.Brand = props.formData.Brand;
    originData.value.BrandID = props.formData.BrandID;
    originData.value.Histiry_Date = props.formData.Histiry_Date;
    originData.value.History_User = props.formData.History_User;

    isHistoryCheckedFormData.value = props.formData.History_User ? true : false;
  }
  userName.value = localStorage.getItem('user')
  insertData.History_User = localStorage.getItem('user')
};

onMounted(() => {
  setData(props.mode);
});
</script>

<style scoped>
.textSize {
  font-size: 12px;
}

.formText {
  font-size: 14px;
  padding-top: 5px;
}


.formDateTimeContainer {
  display: grid;
  grid-template-columns: 21fr 40fr 39fr;
  margin-bottom: 18px;
}
.brandTitle {
  padding: 0.3em 0.5em 0.4em 0.5em;
  font: 16px "Microsoft JhengHei", "Lucida Sans Unicode", "Helvetica", "Arial",
    "Verdana", "sans-serif";
  text-shadow: 2px 2px 3px #ccc;
  line-height: 22px;
  margin-top: 1em;
}

.brandForm {
  border: black 1px solid;
  border-radius: 20px;
  padding: 20px;
  width: 500px;
}

.formDataInput {
  width: 300px;
}
.formDataInputDateTime {
  height: 20px;
  margin-top: 5px;
  margin-right: 10px;
  border: solid #e5e7eb 1px;
  border-radius: 5px;
}
</style>