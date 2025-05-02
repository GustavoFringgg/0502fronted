<template>
  <div style="padding:0px; width:100%; max-height:35px">
    <div id="Title">
      <span style="font-size: 16px !important; padding: 0px !important;" class="headline">{{ $route.meta.title }}</span>
    </div>
    <div id="Beta" v-if="groupsStore.Program_Tag">
      <span>{{ groupsStore.Program_Tag }}</span>
    </div>
    <!-- <div id="Tutor">
      <Tutor></Tutor>
    </div> -->
    <div v-if="!state.IsUserEmpty" :style="avatarStyleObject">
      <el-tooltip :content="avatarContent" effect="light" placement="right-start" raw-content>
        <img id="DataOwner" ref="DataOwner" :src="`${state.Owner_Photo}`" />
      </el-tooltip>
    </div>
    <div v-if="props.post.Icons && (state.IsOwner || state.IsSuperior || state.IsDeputy)" id="Share" @click="OpenWindow({ Name: 'Program_Cooperator' })"><img src="../../../assets/Share_64.png" style="height: 32px;" /></div>
    <div v-if="props.post.Icons && state.IsSuperior" id="Superior" title="Superior!">SU</div>
    <div v-if="props.post.Icons && state.IsDeputy" id="Deputy" title="Deputy!">DP</div>
    <div v-if="props.post.Icons && state.IsCrew" id="Crew" title="Crew!">CW</div>
    <div v-if="props.post.Icons && state.IsCooperator" id="Cooperator" title="Cooperator!">CO</div>
    <div style="float: none; clear: both;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGroupsStore } from '@/stores/store'
import axios from 'axios'
import commonFunction from '@/composables/commonFunction'
const { hostname } = commonFunction()
// import Tutor from './Tutor.vue';

onMounted(() => {
  if (props.post.Icons) {
    Get_UserPrivilege(props.post)
  }
})

const route = useRoute()
const groupsStore = useGroupsStore()
const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      Beta: false,
      Program_Name: '',
      IDValue: '',
      Title: '',
      Icons: false
    })
  }
});

const avatarContent = ref('');
const avatarStyleObject = ref({
  'background-image': '',
  'background-size': '35.84px',
  'background-position': '-1.92px -1.92px',
  'background-color': '#FFFFFF',
  color: 'white',
  display: 'inline-block',
  'line-height': '32px',
  'text-align': 'center',
  width: '32px',
  height: '32px',
  float: 'left',
  'margin-right': '2px',
  'border-radius': '50%',
  border: '0px solid #c7b89e',
  overflow: 'hidden'
});

const emit = defineEmits(['permission'])
const state = ref({
  IsGroups: false,
  IsUserEmpty: true,
  IsOwner: false,
  IsSuperior: false,
  IsDeputy: false,
  IsCooperator: false,
  IsCrew: false,
  DataOwner: '',
  Owner_Photo: `${(process.env.NODE_ENV === 'production') ? `https://${location.hostname}` : `https://erp.shinymark.com`}/datas/Images/System/Blank.png`,
  Groups: {},
});
const Get_UserPrivilege = async (item) => {
  try {
    const response = await axios.post(`/api/permission/Get_UserPrivilege`, {
      ProgramID: route.meta.ProgramID,
      Beta: item.Beta,
      IDValue: item.IDValue,
      Icons: item.Icons,
      Program_Name: item.Program_Name,
      Title: route.meta.title
    })
    state.value = response.data
    avatarContent.value = `
      <div>
        <table>
          <tr>
            <td style='text-align:center;padding:0px'>
              <div style='background-image: url("${state.value.Owner_Photo_Large}"); background-size: 201.6px; background-position: -28.8px -10.8px; background-color: rgb(128, 92, 136); color: rgb(255, 255,255); display: inline-block; line-height: 60px; width: 144px; height: 180px;border-radius: 1%; border: 0px solid #c7b89e;overflow: hidden;text-align: center;'></div>
            </td>
          </tr>
          <tr>
            <td style='text-align:center;padding:0px'>
              <span style='font-weight:bolder;font-size:14px;color:black;'>${state.value.DataOwner}<span>
            </td>
          </tr>
          <tr>
            <td style='text-align:center;padding:0px'>
              <div id="Superior" style="font-size: 12px; height: 22px; width: 22px; line-height: 22px;" title="Superior!">SU</div>
              <span style='font-size:12px; color:black; line-height: 22px;'>${state.value.Superior}<span>
            </td>
          </tr>
          <tr>
            <td style='text-align:center;padding:0px'>
              <div id="Deputy" style="font-size: 12px; height: 22px; width: 22px; line-height: 22px;" title="Deputy!">DP</div>
              <span style='font-size:12px; color:black; line-height: 22px;'>${state.value.Deputy}<span>
            </td>
          </tr>
        </table>
      </div>
    `
    emit('permission', state)
  } catch (error) {
    console.log(error)
    emit('permission', state)
  }
}

const OpenWindow = async (obj) => {
  //console.log(obj)
  var URL = '';
  var width = 600, height = 800
  switch (obj.Name) {
    case 'Program_Cooperator':
      URL = `${hostname}/Public/Program_Cooperator.aspx?User_Name=${state.value.DataOwner}&Program_Name=${state.value.SharePG_Program}`;
      break;
  }
  window.open(URL, obj.Name,
    `width=${width},height=${height},left=null, top=null,location=no, directories=no, menubar=no, resizable=no, scrollbars=yes, status=no, titlebar=no, toolbar=no`
  );
}

const Tutor_List = ref([]);
const Tutor_DetailID = ref(0);
const isActiveTab = ref(true);

</script>

<style lang="scss">
@mixin IconBox($bgColor, $color: white, $size: 32px) {
  background-color: $bgColor;
  color: $color;
  line-height: $size;
  width: $size;
  height: $size;
  margin-right: 1px;
  float: left;
  border-radius: 4px;
  border: 0px solid #c7b89e;
  overflow: hidden;
  text-align: center;
  font-size: 16px;
}

#Share {
  @include IconBox(#d9534f);

  :hover {
    cursor: pointer;
  }
}

#Superior {
  @include IconBox(#d9534f);
}

#Deputy {
  @include IconBox(#f0ad55);
}

#Cooperator {
  @include IconBox(#477be6);
}

#Crew {
  @include IconBox(#3caf17);
}

#Title {
  @include IconBox(unset, black);
  width: auto;
  font-size: 18px !important;
  font-weight: bolder;
  text-shadow: 2px 2px 3px #ccc;
}

#Beta {
  @include IconBox(white, #f0ad55);
  padding-left: 8px;
  width: auto;
}

#Tutor {
  @include IconBox(white, black);
  padding: 0px 4px;
  width: auto;
}
</style>

<style>
#DataOwner {
  position: relative;
  color: black;
  text-align: center;
  max-width: 48px;
  max-height: 48px;
  top: -2px;
  left: -3px
}

#tooltip-content {
  position: absolute;
  z-index: 10000;
  border: 1px solid #999;
  background-color: #eee;
  padding: 5px;
  opacity: 1;
  border-radius: 4px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .3);
}

#tooltip-content table {
  border-spacing: 0px;
  border-width: 0px;
}

@media print {
  #Tutor {
    display: none;
  }
}
</style>
