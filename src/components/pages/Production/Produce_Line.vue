<template>
  <div>
    <div id="Detail" class="p-3">
      <table class="w-full table-fixed">
        <tbody>
          <tr class="leading-none text-center">
            <td class="w-2/12 border border-gray-500 font-bold">
              Produce_Line
            </td>
            <td class="w-2/12 border border-gray-500">{{ Produce_LineID }}</td>
            <td class="w-2/12 border border-gray-500 font-bold">IsOutside</td>
            <td class="w-2/12 border border-gray-500">false</td>
            <td class="w-2/12 border border-gray-500 font-bold">
              WorkHoursDay
            </td>
            <td class="w-2/12 border border-gray-500">7</td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-button @click="showInLineAdd = true">
      <i class="fas fa-plus-circle pe-2"></i>
      Add Line Process</el-button
    >

    <table class="text-center table-auto border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th>Process_Line_ProcessID</th>
          <th>Process_Name</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in mockData"
          :key="item.index"
          :class="{ 'back-ground-grey': index % 2 === 1 }"
        >
          <td>
            {{ item.process_queueNO }}
          </td>
          <td>{{ item.process_name }}</td>
          <td>
            <button
              class="text-gray-600 hover:text-red-600"
              @click="handleDelete"
            >
              <i class="fa-solid fa-trash fa-lg"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="flex items-center justify-center mt-4 space-x-2"
      v-if="showInLineAdd"
    >
      <div class="w-full space-x-2">
        <el-select
          v-model="selectedProcess"
          placeholder="Choice a process"
          style="width: 160px"
          popper-class="custom-select-dropdown"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button type="success" @click="handleAdd">Add</el-button>
        <el-button @click="showInLineAdd = false">Close</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const Produce_LineID = ref();
const options = ["Cutting", "Sitiching", "Lasting", "Packing"];
const selectedProcess = ref("");
const showInLineAdd = ref(false);

const getID = () => {
  Produce_LineID.value = route.params.Produce_LineID;
};

onMounted(() => {
  getID();
});

const mockData = ref([
  { process_queueNO: "1", process_name: "Cutting" },
  { process_queueNO: "2", process_name: "Sitiching" },
  { process_queueNO: "3", process_name: "Lasting" },
  { process_queueNO: "4", process_name: "Packing" },
]);

const handleAdd = () => {
  if (!selectedProcess.value) {
    ElMessage.warning("Please choice a process");
    return;
  }
  const newId = mockData.value.length + 1;
  mockData.value.push({
    process_queueNO: newId.toString(),
    process_name: selectedProcess.value,
  });
  ElMessage.success("Add success");
  selectedProcess.value = "";
  showInLineAdd.value = false;
};

const handleDelete = async () => {
  let _confirm = false;
  try {
    _confirm = await ElMessageBox.confirm(
      "Are you sure you want to delete this?",
      "warning",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    );
  } catch (error) {
    ElMessage({
      showClose: true,
      type: "info",
      message: "Cancel Delete",
    });
  }
  if (_confirm !== "confirm") return;
  console.log("delete here");
};
</script>

<style scoped>
#Detail {
  margin: 0 0 10px 0;
  clear: both;
  float: none;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
.second {
  border: 1px solid #cccccc;
  padding: 10px 10px 30px 10px;
  margin: 0 0 20px 0;
  text-align: left;
}

.back-ground-grey {
  background-color: #f1f1f1;
}

#Detail {
  margin: 0 0 10px 0;
  clear: both;
  float: none;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
</style>
