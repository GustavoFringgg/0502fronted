<template>
  <div class="regionTitle textSize">Region</div>
  <button class="absolute top-0 left-1 drawer-close-Btn">
    <i class="fa-solid fa-xmark fa-lg" @click="emit('closeDrawer')"></i>
  </button>
  <!-- 編輯資料畫面ＵＩ -->
  <template v-if="mode === 'Edit'">
    <el-form
      class="regionForm"
      :model="formData"
      calss="add-new-form"
      label-width="21%"
      label-position="left"
    >
      <el-form-item label="Region">
        <el-input
          class="formDataInput"
          v-model="newData.Region"
          placeholder="Region Name"
          clearable
        />
      </el-form-item>

      <el-button size="small" @click="Region_Maintain({ Mode: 1 })">Submit</el-button>
      <el-button size="small" type="danger" @click="Region_Maintain({ Mode: 2 })">Delete Data</el-button>
    </el-form>
  </template>

  <!-- 新增資料ＵＩ -->
  <template v-else-if="mode === 'Create'">
    <el-form
      class="regionForm"
      :model="insertData"
      calss="add-new-form"
      label-width="21%"
      label-position="left"
    >
      <el-form-item label="Region">
        <el-input
          class="formDataInput"
          v-model="insertData.Region"
          placeholder="Region Name"
          clearable
        />
      </el-form-item>

      <el-button size="small" @click="Region_Maintain({ Mode: 0 })">Submit</el-button>
    </el-form>
  </template>
</template>

<script setup>
/* 引入依賴  */
import NaviMenu from "@/components/pages/Public/Navigate_Menu.vue"; //引入了Vue組件Navigate_Menu.vue和Permission.vue
import axios from "axios"; //引入axios來進行HTTP請求。
import { ref, reactive, onMounted, computed, nextTick, watch } from "vue"; //從Vue中引入了多個組件和函數，用於創建響應式狀態和生命週期鉤子
import Pagination from "@/components/Pagination.vue"; //引入了Pagination組件
import { useRoute, useRouter } from "vue-router"; //引入了Vue Router的useRoute和useRouter來處理路由
import { formDark } from "naive-ui";

/* 創建響應式狀態 */
const route = useRoute();
const router = useRouter();
const props = defineProps(["mode", "formData", "insertData"]);
const emit = defineEmits(["closeDrawer"]);
const isProcessing = ref(false);
const isLoading = ref(false)
let insertData = ref({ Region: "" });
const newData = ref({ Region: "" });
const originData = ref({ Region: "" });

const setData = (mode) => {
  if (mode === "Edit") {
    newData.value.Region = props.formData.Region;
    originData.value.Region = props.formData.Region;
  }
};

//並未使用Region_Info 改用props將值傳入元件 

/* 串後端API */
const Region_Maintain = async (_obj) => {
  // _obj.Mode === 0 表示新增
  // _obj.Mode === 1 表示修改
  // _obj.Mode === 2 表示刪除
  // if (isProcessing.value) return;
  isProcessing.value = true;

  let _params = {
    Mode: _obj.Mode,
  };

  switch (_obj.Mode) {
    // create
    case 0:
      let _isDataExist = false;
      try {
        isLoading.value = true;
        const response = await axios.post(
          `/api/Public/Region/Region_List`,
          insertData.value
        );
        
        if (response.data.length>0) {
          _isDataExist = true
            ElMessage({
              showClose: true,
              type: "error",
              message: "Data is already exist",
            });
          emit('closeDrawer')
        }
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }

      if(_isDataExist) return
      _params.insertData = insertData.value;

      break;
    // upDate
    case 1:
      // 確認data是不是已經存在
      let isDataExistUpdate = false;
      try {
        const checkRegion = { Region: newData.value.Region}
        isLoading.value = true;
        const response = await axios.post(
          `/api/Public/Region/Region_List`,
          checkRegion
        );
        if (response.data.length > 0) {
          isDataExistUpdate = true;
          ElMessage({
            showClose: true,
            type: "error",
            message: "Region is already exist",
          });
          emit("closeDrawer");
        }
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
      if (isDataExistUpdate) return;

      _params.newData = newData.value;
      _params.originData = originData.value;
      break;
    // Del
    case 2:
      let _deleteConfirm = false;
      try {
        _deleteConfirm = await ElMessageBox.confirm(
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

      if (_deleteConfirm !== "confirm") return;

      _params.cancelData = newData.value;
      break;
  }

  // // 送出 API
  try {
    const response = await axios.post(
      `/api/Public/Region/Region_Maintain`,
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

onMounted(() => {
  setData(props.mode);
});
</script>

<style scoped>
.textSize {
  font-size: 12px;
}

.regionTitle {
  padding: 0.3em 0.5em 0.4em 0.5em;
  font: 16px "Microsoft JhengHei", "Lucida Sans Unicode", "Helvetica", "Arial",
    "Verdana", "sans-serif";
  text-shadow: 2px 2px 3px #ccc;
  line-height: 22px;
  margin-top: 1em;
}

.regionForm {
  border: black 1px solid;
  border-radius: 20px;
  padding: 20px;
  width: 500px;
}

.formDataInput {
  width: 300px;
}
</style>