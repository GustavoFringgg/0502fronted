<template>
  <div>
    <div id="Detail" class="p-3">
      <table class="w-full table-fixed">
        <tbody>
          <tr class="leading-none">
            <td class="w-1/12 border border-gray-500 font-bold">Factory</td>
            <td class="w-3/12 border border-gray-500">
              {{ resFactorySubData.Factory_SubID }}
            </td>
            <td class="w-1/12 border border-gray-500 font-bold">Country</td>
            <td class="w-3/12 border border-gray-500">
              {{ resFactorySubData.Country }}
            </td>
            <td class="w-1/12 border border-gray-500 font-bold">Port</td>
            <td class="w-3/12 border border-gray-500">
              {{ resFactorySubData.Port }}
            </td>
          </tr>
          <tr class="leading-none">
            <td class="w-1/12 border border-gray-500 font-bold">Fax</td>
            <td class="w-3/12 border border-gray-500">
              {{ resFactorySubData.Fax_Number }}
            </td>
            <td class="w-1/12 border border-gray-500 font-bold">Phone</td>
            <td class="w-3/12 border border-gray-500">
              {{ resFactorySubData.Phone_Number }}
            </td>
            <td class="w-1/12 border border-gray-500 font-bold">Contact</td>
            <td class="w-3/12 border border-gray-500">
              {{ resFactorySubData.Contact }}
            </td>
          </tr>
          <tr class="leading-none">
            <td class="w-1/12 border border-gray-500 font-bold">Name</td>
            <td class="border border-gray-500" colspan="5">
              {{ resFactorySubData.Factory_Sub_Name }}
            </td>
          </tr>
          <tr class="leading-none">
            <td class="w-1/12 border border-gray-500 font-bold">Address</td>
            <td class="border border-gray-500" colspan="5">
              {{ resFactorySubData.Address }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-button @click="dialogAddVisible = true">
      <i class="fas fa-plus-circle pe-2"></i>
      Add Produce Line</el-button
    >

    <table class="text-center table-auto border-separate border-spacing-y-2">
      <thead>
        <tr v-if="resProduceLineData.length > 0">
          <th>Line ID</th>
          <th>IsOutsider</th>
          <th>WorkHoursPerDay</th>
          <th>WorkdayPerMonth</th>
          <!-- <th>Pairs_Month</th> -->
        </tr>
        <tr v-else style="color: red">
          There are no Produce Line
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in resProduceLineData"
          :key="item.index"
          :class="{ 'back-ground-grey': index % 2 === 1 }"
        >
          <td
            class="font-bold cursor-pointer"
            @click="openProduceLine(item.Produce_LineID)"
          >
            {{ item.Produce_LineID }}
          </td>
          <td>{{ item.Outsider === 0 ? "False" : "True" }}</td>
          <td>{{ item.Workhours_Per_Day }}</td>
          <td>{{ item.Workday_Per_Month }}</td>
          <!-- <td>{{ item.Pairs_Month }}</td> -->
          <td>
            <i class="fas fa-edit fa-lg cursor-pointer" v-if="!item.isEdit"></i>
            <i class="fas fa-save fa-lg cursor-pointer" v-else></i>

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

    <el-dialog
      v-model="dialogAddVisible"
      title="Add Produce Line"
      width="50%"
      top="10vh"
    >
      <div>
        <label for="produceLineName">
          Produce Line Name:
          <input type="text" id="produceLineName" placeholder="Enter a name" />
        </label>
      </div>
      <div class="mt-5">
        <label for="isOutsider"
          >isOutsider:
          <input
            type="checkbox"
            name="isOutsider"
            id="isOutsider"
            v-model="isOutsider"
          />
          {{ isOutsider }}
        </label>
      </div>
      <div class="items-center space-x-2 mt-5">
        <label for="workHours" class="w-40"
          >Work Hours Per Day
          <el-select
            v-model="selectedHour"
            placeholder="請選擇"
            style="width: 160px"
            id="workHours"
          >
            <el-option
              v-for="n in 6"
              :key="n"
              :label="n + 4"
              :value="n + 4"
            /> </el-select
        ></label>
      </div>
      <div class="items-center spaceMo-x-2 mt-5">
        <label for="workHoursMonth" class="w-40"
          >Work Hours Per Month
          <el-select
            v-model="selectedMonth"
            placeholder="請選擇"
            style="width: 160px"
            id="workHoursMonth"
          >
            <el-option
              v-for="n in 10"
              :key="n"
              :label="n + 20"
              :value="n + 4"
            />
          </el-select>
        </label>
      </div>
      <template #footer>
        <span class="dialog-footer space-x-6 space-x-6">
          <el-button @click="handleAdd" type="success">Add Line</el-button>
          <el-button @click="dialogAddVisible = false">Close</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from "axios";
import { ElMessage, ElMessageBox, tourEmits } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const dialogAddVisible = ref(false);
const route = useRoute();
const selectedHour = ref(7);
const selectedMonth = ref(24);
const isOutsider = ref(false);

const resFactorySubData = ref({});
const resProduceLineData = ref([]);
const getFactorySubInfo = async (FactorySubID) => {
  try {
    const res = await axios.post(`/api/Production/Factory`, { FactorySubID });
    resFactorySubData.value = res.data[0];
  } catch (error) {
    console.log("錯誤", error);
  }
};

const getProduceLineInfo = async (FactorySubID) => {
  try {
    const res = await axios.post(`/api/Production/Factory/Produce_Line`, {
      FactorySubID,
    });
    resProduceLineData.value = res.data;
  } catch (error) {
    console.log("錯誤", error);
  }
};

onMounted(async () => {
  const { FactorySubID } = route.params;
  await getFactorySubInfo(FactorySubID);
  await getProduceLineInfo(FactorySubID);
});

const handleAdd = () => {
  console.log("here");
  dialogAddVisible.value = false;
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
};

let popupWindow = null;
const openProduceLine = (Produce_LineID) => {
  const url = `/Produce_Line/${encodeURIComponent(Produce_LineID)}`;
  if (popupWindow && !popupWindow.closed) {
    popupWindow.location.href = url;
    popupWindow.focus();
  } else {
    popupWindow = window.open(
      url,
      "ProduceLineWindow",
      "width=1200,height=800"
    );
  }
};

window.addEventListener("unload", () => {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close();
  }
});
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

.display-flex {
  display: flex;
}

.back-ground-grey {
  background-color: #f1f1f1;
}
</style>
