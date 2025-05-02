<template>
  <div @click="handleClickOutside">
    <NaviMenu></NaviMenu>
    <div class="cancelEditContent" @click="handleFinishedEdit"></div>
    <div>
      <ComptPermission :post="post"></ComptPermission>
    </div>
    <div>
      <table class="table-content">
        <thead>
          <tr>
            <th>SizeID</th>
            <th>Size Name</th>
          </tr>
          <tr>
            <th>
              <input
                type="number"
                v-model="filters.SizeID"
                class="search-input"
                @keydown="blockENotation"
              />
            </th>
            <th>
              <input
                type="text"
                v-model="filters.Size_Name"
                class="search-input"
              />
            </th>
            <th>
              <button
                class="add-button"
                v-if="
                  _Product_List.length === 0 && filters.Size_Name.trim() !== ''
                "
                @click="Product_Size_Maintain({ mode: 0 })"
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
              </button>
            </th>
          </tr>
        </thead>
        <tbody v-if="_Product_List.length > 0">
          <tr
            v-for="(item, index) in _PageProduct_List"
            :key="item.index"
            :class="{ 'back-ground-grey': index % 2 === 1 }"
          >
            <td class="table-column-and-data text-text-align">
              <input
                type="number"
                v-if="item.isEdit"
                v-model="item.SizeID"
                class="table-input"
                @keydown="blockENotation"
              />
              <span v-else>{{ item.SizeID }}</span>
            </td>
            <td class="table-column-and-data text-text-align">
              <input
                v-if="item.isEdit"
                v-model="item.Size_Name"
                class="table-input"
              />
              <span v-else>{{ item.Size_Name }}</span>
            </td>

            <td>
              <i
                class="fas fa-edit cursor-pointer"
                v-if="!item.isEdit"
                @click="startEdit(item)"
              ></i>
              <i
                class="fas fa-save cursor-pointer"
                v-else
                @click="saveEdit(item)"
              ></i>
              <i
                class="fas fa-trash-alt cursor-pointer delete-icon"
                @click="handleDeleteBtn(item)"
                title="刪除"
              ></i>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="2" class="text-align-center">No data, need to add</td>
          </tr>
        </tbody>
      </table>
      <Pagination
        class="flex justify-start"
        v-show="_Product_List.length > 0"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        :total="_Product_List.length"
      ></Pagination>
    </div>
  </div>
</template>

<script setup>
import NaviMenu from "@/components/pages/Public/Navigate_Menu.vue"; //引入了Vue組件Navigate_Menu.vue和Permission.vue
import ComptPermission from "@/components/pages/Public/Permission.vue";
import commonFunction from "@/composables/commonFunction";
import axios from "axios";
import { ref, reactive, onMounted, computed } from "vue";
import Pagination from "@/components/Pagination.vue";
import { ElMessage } from "element-plus";

const Product_List = ref([]);
const currentPage = ref(1);
const pageSize = ref(30);
const editingItem = ref(null);

const startEdit = (item) => {
  item.isEdit = true;
  item.originalSizeID = item.SizeID; // 存下舊 ID
  editingItem.value = item;
};

//防止使用者誤Key "e" or "+"" notation
const blockENotation = (e) => {
  if (e.key.toLowerCase() === "e" || e.key === "+") {
    e.preventDefault();
  }
};

// 關鍵字搜尋
const filters = reactive({
  SizeID: "",
  Size_Name: "",
});

//取得資料
const getProductSizeList = async () => {
  const res = await axios.post("/api/Public/Product/Product_Size");
  Product_List.value = res.data.map((item) => ({
    ...item,
    Size_Name: item.Size_Name?.trim() ?? "",
  }));
};

//刪除資料
const handleDeleteBtn = async (item) => {
  let _confirm = false;
  try {
    _confirm = await ElMessageBox.confirm(
      `Are you sure you want to delete this?`,
      "warning",
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
  }

  if (_confirm !== "confirm") return;
  await Product_Size_Maintain({ ...item, mode: 2 });
  getProductSizeList();
};

//更新資料
const saveEdit = async (item) => {
  item.Date_Update = new Date().toISOString().split("T")[0];
  item.Size_Name = item.Size_Name?.trim();
  item.isEdit = false;
  await Product_Size_Maintain({ ...item, mode: 1 });
  getProductSizeList();
};

//篩選資料
const _Product_List = computed(() => {
  return Product_List.value.filter((item) => {
    const hasSizeID = filters.SizeID !== "";
    const hasSIzeName = filters.Size_Name !== "";
    const matchSizeID = item.SizeID.toString().includes(filters.SizeID);
    const matchName = item.Size_Name.toLowerCase().includes(
      filters.Size_Name.toLowerCase()
    );
    if (hasSizeID && hasSIzeName) {
      return matchSizeID || matchName;
    } else if (hasSizeID) {
      return matchSizeID;
    } else if (hasSIzeName) {
      return matchName;
    } else {
      return true;
    }
  });
});

//分頁篩選
const _PageProduct_List = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return _Product_List.value.slice(start, end);
});

const Product_Size_Maintain = async (obj) => {
  //obj.mode ===0 add
  //obj.mode ===1 update
  //obj.mode ===2 delete

  //確認是否皆有輸入正確
  if (obj.mode === 0 && (!filters.SizeID || !filters.Size_Name)) {
    ElMessage({
      showClose: true,
      type: "warning",
      message: "Invalid format or missing required fields.",
      duration: 1500,
    });
    return;
  }
  //確認新增是否有小於5個字元 || 確認更新是否有小於5個字元
  if (
    filters.Size_Name.length > 5 ||
    (obj.Size_Name && obj.Size_Name.length > 5)
  ) {
    ElMessage({
      showClose: true,
      type: "warning",
      message: "Size Name must be 5 characters or less.",
      duration: 1500,
    });
    return;
  }

  //比對 SizeID 是否跟現有的的 SizeID 重複
  if (
    filters.SizeID !== "" &&
    Product_List.value.some(
      (item) => Number(item.SizeID) === Number(filters.SizeID)
    )
  ) {
    ElMessage({
      showClose: true,
      type: "warning",
      message: "SizeID already exists. Please use a different SizeID.",
      duration: 1500,
    });
    return;
  }
  if (
    filters.Size_Name !== "" &&
    Product_List.value.some(
      (item) =>
        item.Size_Name?.trim().toLowerCase() ===
        filters.Size_Name.trim().toLowerCase()
    )
  ) {
    ElMessage({
      showClose: true,
      type: "warning",
      message: "Size Name already exists. Please use a different Size Name.",
      duration: 1500,
    });
    return;
  }
  let params = { mode: obj.mode };
  switch (obj.mode) {
    case 0:
      params = {
        mode: params.mode,
        Data_Updater: localStorage.getItem("user"),
        ...filters,
      };
      break;
    case 1:
      params = {
        mode: params.mode,
        SizeID: obj.originalSizeID,
        newSizeID: obj.SizeID,
        Size_Name: obj.Size_Name?.trim(),
        Data_Updater: localStorage.getItem("user"),
      };
      break;
    case 2:
      params = obj;
      break;
  }
  try {
    const response = await axios.post(
      "/api/Public/Product/Product_Size/Product_Size_Maintain",
      params
    );
    if (response.data.Flag) {
      ElMessage({
        type: "success",
        duration: 1500,
        message:
          obj.mode === 0
            ? "Insert Data Success"
            : obj.mode === 1
            ? "Update Date Success"
            : "Delete Date Success",
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
  } catch (error) {
    switch (error.status) {
      case 409:
        ElMessage({
          showClose: true,
          type: "warning",
          message: "SizeID already exists. Please use a different SizeID.",
          duration: 1500,
        });
        break;
    }
  } finally {
    (filters.SizeID = ""), (filters.Size_Name = ""), getProductSizeList();
  }
};

/* 身份驗證用 */
const post = reactive({ Program_Name: "Product Size", Icons: true });
//生命週期
onMounted(async () => {
  await getProductSizeList();
});
</script>

<style scoped>
.size-table {
  border-collapse: collapse;
  width: 100%;
}
.size-table th,
.size-table td {
  padding: 0.5rem;
}

.text-align-center {
  text-align: center;
}
.table-content {
  width: fit-content;
  position: relative;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.back-ground-grey {
  background-color: #f1f1f1;
}

.table-input {
  width: 100px;
  text-align: center;
  font-size: 12px;
  border: none;
  border-bottom: 2px solid #999;
  outline: none;
  background-color: transparent;
  padding: 0;
  height: 20px;
  box-sizing: border-box;
  text-align: center;
}

.table-column-and-data {
  width: 60px;
  text-align: center;
}

.cursor-pointer {
  cursor: pointer;
  margin-left: 5px;
}

.addSVG {
  width: 20px;
  height: 20px;
}

.search-input {
  text-align: center;
  width: 100px;
}
</style>
