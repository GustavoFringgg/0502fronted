<template>
  <div id="container" class="!w-[1250px]">
    <go-top :size="40" :bottom="10" :right="'50%'" bg-color="#C0C0C0" alt="gotop" :boundary="500"></go-top>
    <div class="container" v-if="playlistLoaded" style="width:75%; float:left; padding: 4px;">
      <div v-show="isImage" class="panzoomImage">
        <div ref="img">
          <button style="position: absolute; z-index:100; left: 96%; top: 4px; height: 25px;" @click="closeImage"><span style="color:red;"><i class="fas fa-times fa-sm"></i></span></button>
          <img ref="img" style="max-width: 100%;" :src="nowFocus.poster" />
        </div>
      </div>
      <div>
        <div class="w-[937px]" style="font-size:12px; font-weight:bolder;" >
          <ComptPermission v-show="false" style="width:390px;float:left;" :post="post" @permission="Permission"></ComptPermission>
          <div style="width:60%; float:left; padding-left: 20px;">
            <div class="flex gap-2">
              <div style="padding: 3px 0px; font-family: 'Poiret One', 'Microsoft JhengHei'; font-size: 24px; line-height: 46px; font-weight: bold; float: left;">{{ Knowledge_Title }}</div>
              <div :style="photoObject" class="avatar-photo-cover">
                <img id="Author" :src="Author_Photo" />
              </div>
              <div>
                <img class="poseter-photo h-[60px]" :src="nowFocus.poster" />
              </div>
            </div>
            <br v-if="filepondMode && playingID">
          </div>
          <div class="noprint pr-[6px]" style="width:40%; float:right;">
            <div id="buttons" class="flex" v-if="filepondMode && refresh" style="padding: 5px 0px;">
              <button @click="filepondMode = 3" class="upload-btn" :class="filepondMode == 3 ? 'ManageMode' : ''" v-if="playingID">Upload Cover</button>
              <button @click="filepondMode = 2" class="upload-btn" :class="filepondMode == 2 ? 'ManageMode' : ''" v-if="playingID">Upload Video</button>
              <!-- <button @click="$modal.show('addModal')"><i class="fas fa-plus-circle"></i></button> -->
              <button @click="showModel = 'addNew'"><i class="fas fa-plus-circle"></i></button>
              <!-- del -->
              <button v-if="filepondMode && playingID" class="noprint" @click="toggleEditMode">
                <i class="fas fa-edit fa"></i>
              </button>
              <button @click="detailDelete" v-if="playingID"><i class="fas fa-trash-alt"></i></button>
              <button @click="filepondMode = 0" v-if="playingID"><i class="fas fa-redo fa-flip-horizontal"></i></button>
              <span style="vertical-align: middle; display: none;">
                <input style="margin: 0px 5px;" id="IAO" type="checkbox" class="enterIndex" v-model="nowFocus.Image_Always_On" />
                <label for="IAO">Image Always On</label>
              </span>
            </div>
            <div id="buttons" v-if="IsAuthor && playlistLoaded && !filepondMode" style="float: right">
              <button v-if="!filepondMode" @click="filepondMode = 3"><i class="fas fa-edit fa fa-lg"></i></button>
            </div>
            <div v-if="!filepondMode" style="float: right;">
              <button class="border-2 rounded-md flex items-center" style="margin: 3px; padding: 4px; height: 24px;">
                <a :href="`mailto:?subject=知識庫：${nowFocus.Title}&body=知識庫：${nowFocus.Title}%0D%0A%0D%0A ${host}/Knowledge/${nowFocus.KnowledgeID}/${nowFocus.Knowledge_DetailID}`"><i class="fas fa-paper-plane"></i> Share Knowledge</a>
              </button>
            </div>
            <div style="position: relative; padding-top: 4px;">
              <VueLoading loader="bars" :active.sync="isUploading" :is-full-page="false"></VueLoading>
              <FilePond
                v-if="refresh && filepondMode"
                :server="myServerConfig"
                name="filepond"
                ref="pond"
                :accepted-file-types="acceptedTypes"
                :labelIdle="labelIdle"
                dropOnPage="true"
                checkValidity="true"
                v-model="uploadFiles"
                @init="handleFilePondInit"
                @processfilestart="handleProcessFileStart"
                @processfile="handleProcessFile"
              />
            </div>
          </div>
        </div>
      </div>
      <div id="DivTextarea" name="DivTextarea" class="min-w-[937px] max-w-[937px] w-[937px]">
        <div class="flex !w-[907px] ml-[6px] bold" :class="{'!bg-[#ffffcc]': nowFocus.Publication_Date === null}">
          <template v-if="filepondMode && playingID">
            <textarea
              type="text"
              v-autowidth="{maxWidth: `${filepondMode ? '545px' : '785px;'}`, minWidth: '20px', comfortZone: 0}" 
              :disabled="!filepondMode" 
              :value="nowFocus.Title"
              @input="titleModify"
              class="flex-1 bg-white h-[30px] mb-[1px] text-xl select-none p-[0px] border-0 z-[999] bg-[#ffffcc] text-[21px]"
              :class="{'!bg-[#ffffcc]': nowFocus.Publication_Date === null}"
            />
          </template>
          <template v-else>
            <p class="flex-1 top-detail-title" ref="testEl" style="font-size: 21px !important; user-select:none; margin: 0 !important; border:none; padding: 0;">{{ nowFocus.Title }}</p>
          </template>
        </div>
        <div class="flex gap-[100px] w-[900px] ml-[6px]">
          <p v-if="nowFocus.Publication_Date && !(filepondMode && playingID)" style="font-weight: normal; font-style: italic;"> {{ moment(nowFocus.Publication_Date).format("YYYY-MM-DD")  }} </p>
          <div v-else-if="(filepondMode && playingID)">
            <label for="Detail_Publication_Date">Publication Date: </label>
            <input  type="text" name="Detail_Publication_Date" class="text-xs w-[70px] !border-[0px]" v-model="nowFocus.Publication_Date" disabled="true">
          </div>
          <span v-if="filepondMode && playingID" class="noprint" style="font-style:italic;">
            tags:
              <input type="text" name="tagsInput" v-autowidth="{maxWidth: '785px', minWidth: '80px', comfortZone: 0}" :disabled="!filepondMode" style="font-size: 12px !important; font-style:italic; user-select:none; background-color: #F8F8F8 !important;" class="headline w-[200px]" :value="nowFocus.Tags" @input="tagsModify" />
          </span>
          <p v-if="filepondMode && playingID">url: /Knowledge/{{$route.params.KnowledgeID}}/{{playingID}}</p>
        </div>
        <div class="noprint" v-if="nowFocus.source.src" style="padding: 21px;">
          <!-- 影片播放器 -->
          <div v-if="playerRefresh && nowFocus.source.src">
            <VuePlyr ref="player" :autoplay="false">
              <video controls autoplay>
                <source :src="nowFocus.source.src" :type="nowFocus.source.type" size="1080">
              </video>
            </VuePlyr>
          </div>
        </div>
        <ComptCkContents 
          :post="{
            IsAuthor: IsAuthor, 
            ToolBarHidden: true, 
            Lang: 'chtOpenModal', 
            editorData: nowFocus.Description, 
            editDisabled: nowFocus.editDisabled, 
            filepondMode: filepondMode, 
            Knowledge_Detail_Publication: Knowledge_Detail_Publication,
          }"
          v-model:subDetails="nowFocus.subDetails" 
          @handelAddParagraph="addParagraph" 
          @handelDeleteSubDetail="deleteSubDetail"
          @handelShowSubPondModal="showSubPondModal"
          @handleKnowledgeSubDetailPublicationMaintain="Knowledge_SubDetail_Publication_Maintain"
          @handleCloseEditSubDetailAll="closeEditSubDetailAll"
          @exportdata="descriptionSave"
          @handleknowledgeDetailPublicationSet="Knowledge_Detail_Publication_Maintain"
        />
      </div>
      <span id="DivTextarea" class="text-[silver]" v-if="!filepondMode && playingID && nowFocus.Tags" style="font-style:italic; padding-left: 20px;">
        tags: {{ nowFocus.Tags }}
      </span>
      <div style="margin-bottom: 50px;"></div>
    </div>
    <div v-if="!isSinglePage" class="noprint sticky top-[15px] left-[962px] bg-white overflow-auto max-h-[calc(100vh-24px)] w-[290px] !border-2 rounded-md" style="width: 25%; float:left; margin-top: 15px;">
      <div id="playlist" v-if="playlistLoaded" class="plyr-playlist-wrappe py-[5px] w-[290px] px-[10px]">
        <draggable tag="ul" class="plyr-playlist" group="parent-group" style="display: inline-block; width: 100%;" v-model="playlist" :itemKey="uuidv4()" @end="dragEnd" :disabled="!filepondMode">
          <template #item="{ element:  Knowledge_Detail}">
            <li v-if="Knowledge_Detail.isPublished || IsAuthor">
              <div>
                <a @click="routerSet(Knowledge_Detail);" class="draggable-title !text-xs" :class="nowFocus.Knowledge_DetailID === Knowledge_Detail.Knowledge_DetailID ? 'active' : ''" :title="Knowledge_Detail.Title" :style="`${!IsAuthor && !Knowledge_Detail.Publication_Date ? 'display: none;' : ''} ${!Knowledge_Detail.Publication_Date ? 'background-color: #ffffcc;' : ''}`"><span v-if="!Knowledge_Detail.Publication_Date">*</span>{{ Knowledge_Detail.Title }}</a>
                <template v-if="Knowledge_Detail.subDetails.length > 0">
                  <draggable tag="ul" class="draggable-subDetail-area w-[100%] pl-4" :class="`ttt-${Knowledge_Detail.Knowledge_DetailID}-ddd-${nowFocus.Knowledge_DetailID}`" group="child-group" style="display: inline-block;" v-model="Knowledge_Detail.subDetails" :itemKey="uuidv4()"  @end="subDetailDragEnd" :disabled="!filepondMode || Knowledge_Detail.Knowledge_DetailID !== nowFocus.Knowledge_DetailID">
                    <template #item="{ element: Knowledge_SubDetail}">
                      <li 
                        v-if="(Knowledge_SubDetail.Subtitle !== '' && Knowledge_SubDetail.Publication_Date) || (Knowledge_SubDetail.Subtitle !== '' && IsAuthor)" 
                        class="draggable-subTitle" 
                        :class="{'no-publication_date text-[brown] italic': Knowledge_SubDetail.Publication_Date === null}"
                        :title="Knowledge_SubDetail.Subtitle"
                      >
                        <a :class="{'active': Knowledge_SubDetail.scrollYTop <= windowInnerHeight && Knowledge_SubDetail.scrollYBottom >= windowInnerHeight && Knowledge_SubDetail.Knowledge_DetailID === nowFocus.Knowledge_DetailID}" @click="handleClickScrollToTarget(`Paragraph${Knowledge_SubDetail.Knowledge_SubDetailID}`, Knowledge_Detail.Knowledge_DetailID)">{{ Knowledge_SubDetail.Subtitle }}</a>
                      </li>
                    </template>
                  </draggable>
                </template>
              </div>
            </li>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Modals -->
      <!-- adNew Modal -->
    <Teleport to="body">
      <div v-if="showModel === 'addNew'" class="modal-container z-[999]" @click="showModel = null">
        <div class="add-new-modal-box" @click.stop>
          <div style="padding-bottom: 10px;">
            <b>Add New</b>
          </div>
          <div class="cornerbox">
            <table>
              <tbody>
                <tr>
                  <td class="color_field">Title:</td>
                  <td><input class="" type="text" v-model="addNew.Title" v-autowidth="{maxWidth: '180px', minWidth: '180px', comfortZone: 0}" style="background-color: white;"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="float: right; clear: both; padding: 10px 0px;">
            <button @click="detailAdd()" style="border-style: solid;">Save</button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- subdeatil filepond -->
    <Teleport to="body">
      <div v-if="refresh && showModel === 'subPond'" class="modal-container subDetail-upload-container" @click="showModel = null">
        <div style="position: relative; padding-top: 4px;" @click.stop>
          <VueLoading loader="bars" :active.sync="isUploading" :is-full-page="false"></VueLoading>
          <FilePond
            :server="myServerConfig"
            name="filepond"
            ref="subPond"
            :accepted-file-types="acceptedTypes"
            :labelIdle="`<b>Add</b> Video File: Drag & Drop <b>Video</b> file here or <span class='filepond--label-action'>Browse</span>`"
            dropOnPage="true"
            checkValidity="true"
            v-model="uploadFiles"
            @init="handleFilePondInit"
            @processfilestart="handleProcessFileStart"
            @processfile="handleProcessFile"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import vueFilePond, { setOptions } from "vue-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileRename from "filepond-plugin-file-rename";
import { ElMessageBox, ElMessage } from 'element-plus';
import VuePlyr from '@skjnldsv/vue-plyr'
import { VueFinalModal } from 'vue-final-modal'
import commonFunction from '@/composables/commonFunction'
import { GoTop } from '@inotom/vue-go-top';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios'
import debounce from 'lodash/debounce';
import VueLoading from 'vue-loading-overlay'
import moment from "moment"

import "filepond/dist/filepond.min.css";
import 'vue-loading-overlay/dist/css/index.css'

import draggable from 'vuedraggable'

import hljs from "highlight.js"
import "highlight.js/styles/github.css"

import "@skjnldsv/vue-plyr/dist/vue-plyr.css";

// 組件
import ComptCkContents from "./myCKContents.vue";
import ComptCkEditor from "./myCKEditor.vue";
import ComptPermission from '../Public/Permission.vue'

import { useRouter, useRoute } from 'vue-router';
import { computed, nextTick, onMounted, onBeforeMount, ref, onUnmounted, watch, reactive } from 'vue';

const router = useRouter()
const route = useRoute()
const { $CheckGroup, host, $FillUp_Date } = commonFunction()

// Import FilePond
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);


// data
const post = reactive({ Beta: false, Program_Name: 'Knowledge', IDValue: route.params.KnowledgeID, Icons: true })
const State = reactive({}) //初始化 State：將 State 初始化為一個空對象。
const Permission = (item) => { State.value = item }
const myFiles = ref(["cat.jpeg"])
const player = ref(null)
const showModel = ref(null)
const hostname = ref(process.env.NODE_ENV === 'production' ? `https://${location.hostname}:3433` : `http://${location.hostname}:3433`)
const file = ref('')
const uploadFiles = ref('')
const filePond = ref(true)
const isUploading = ref(false)
const isPIP = ref(false)
const isImage = ref(false)
const isHtmlExpand = ref(true)
const filepondMode = ref(0) // 1 = Add Video, 2 = Edit Video, 3 = Edit Photo
const refresh = ref(true)
const subPond = ref(null)
const addNew = ref({
  Title: '',
  Description: ''
})
const myServerConfig = ref({
  url: ``,
  process: {
    method: 'POST',
    withCredentials: false,
    headers: {
      authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    timeout: 3600000,
    ondata: (formData) => {
      formData.append('testfield', 'testdata');
      return formData;
    }
  },
  revert: null,
})
const playlistLoaded = ref(false)
const nowFocus = ref({
  Knowledge_DetailID: 0,
  Image_Always_On: false,
  ImageInput: false,
  Title: '',
  poster: '',
  source: {
    type: '',
    src: ''
  },
  Description: '',
  subDetails: []
})
const playerRefresh = ref(true)
const playlist = ref([])
const knowledgeListIndex = ref(0)
const Knowledge_Title = ref('')
const Knowledge_Author = ref('')
const Author_Photo = ref('')
const options = ref({
  content: '',
  placement: 'right',
  classes: ['info'],
  targetClasses: ['it-has-a-tooltip'],
  delay: {
    show: 100,
    hide: 500
  }
})
const photoObject = ref({
  'background-image': '',
  'background-size': '35.84px',
  'background-position': '-1.92px -1.92px',
  'background-color': '#FFFFFF',
  color: 'white',
  'line-height': '32px',
  'text-align': 'right',
  width: '32px',
  height: '32px',
  'margin-top': '10px',
})
const Knowledge_Detail_Publication = ref([])
const pond = ref(null)
const ckeditorDataCache = ref('')
const nowEditDescriptionIndex = ref(null)
const editingSubDetailID = ref(null)
const windowInnerHeight = ref(0)

// computed
// 是否可編輯
const IsAuthor = computed(() => {
  return (
    $CheckGroup([
      'accounting author', 
      'develop author',
      'it author',
      'personnel author',
      'ppic author',
      'purchase author',
      'qc author',
      'sales author', 
      'shipping author', 
      'stock author'
    ]) &&
      State.value?.IsCrew ||
      State.value?.IsSuperior ||
      State.value?.IsOwner ||
      State.value?.IsDeputy ||
      State.value?.IsCooperator ||
      State.value?.IsUserEmpty
  )
})
const playingID = computed(() => nowFocus.value ? nowFocus.value.Knowledge_DetailID : 0)
const labelIdle = computed(() => {
  switch (filepondMode.value) {
        case 1:
          return `<b>Add</b> Video File: Drag & Drop <b>Video</b> file here or <span class='filepond--label-action'>Browse</span>`
          break;
        case 2:
          return `<b>Edit</b> Video File: Drag & Drop <b>Video</b> file here or <span class='filepond--label-action'>Browse</span>`
          break;
        case 3:
          return `<b>Edit</b> Photo File: Drag & Drop <b>Photo</b> file here or <span class='filepond--label-action'>Browse</span>`
          break;
        default:
          break;
      }
})
const acceptedTypes = computed(() => {
  if (filepondMode.value == 3) {
    return ['image/jpeg']
  } else {
    return ['video/mp4']
  }
})
const hasMedias = computed(() => {
  let desString = nowFocus.value.Description
  return desString.indexOf('img src') > -1 || desString.indexOf('media') > -1 || desString.indexOf('raw-html-embed') > -1
})
const isSinglePage = computed(() => route.params.isPage)
const IsPlayingPic = computed(() => nowFocus.value.poster.indexOf('blank.png') === -1)
const versionAtBottom = computed(() => Knowledge_Detail_Publication.value.filter(el => !el.Public_Flag && el.Description))

// fn()
// 暫停計時器
const pauseTimer = (ms) => {
    return new Promise(res => setTimeout(res, ms))
  }

const OpenModal = (name) => {
  setTimeout(() => {
    nextTick(() => {
      showModel.value = name
    });
  }, 100);
}

const routerSet = (item) => {
  playerRefresh.value = false
  window.scrollTo({ top: 0})
  router.replace({
    name: "Knowledge",
    params: {
      KnowledgeID: item.KnowledgeID,
      Knowledge_DetailID: item.Knowledge_DetailID
    },
  })
  nowFocus.value = item
  filepondMode.value = 0
  getKnowledgeDetailPublicationList(item.Knowledge_DetailID)
  nextTick(() => {
    playerRefresh.value = true
  })
}

const eventTrigger = async () => {
  // nextTick(() => { console.log(document.pictureInPictureElement) })
  await nextTick()
  console.log(document.pictureInPictureElement)
}

const handleFilePondInit = () => {
  // example of instance method call on pond 
  if (filepondMode.value === 4) {
    subPond.value.getFiles();
  } else {
    pond.value.getFiles();
  }
}

const handleProcessFileStart = (error, file) => {
  console.log('file', file)
  isUploading.value = true
}

const handleProcessFile = (error, file) => {
  console.log('fileasds', file)
  isUploading.value = false
  if (error) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: 'Server is busy now, please try again.'
    });
  } else {
    ElMessage({
      showClose: true,
      type: 'success',
      message: filepondMode.value == 3 ? 'Photo Save Successfully' : 'Video Save Successfully'
    });
    getKnowledgeList()
  }
}

const refreshFilepond = async () => {
  refresh.value = false
  await nextTick()
  refresh.value = true
}

const getKnowledgeList = async () => {
  playlist.value = []
  try {
    const res = await axios.get(`/api/Public/Knowledge/PlayList/${route.params.KnowledgeID}`)
    if (res.data) {
      playlist.value = res.data.List
      Knowledge_Title.value = res.data.Title
      Author_Photo.value = res.data.Author_Photo
      Knowledge_Author.value = res.data.Knowledge_Author
      options.value.content = `<div id='tooltip-content'><table ><tr><td style='text-align:center;padding:0px'><div style='background-image: url("${Author_Photo.value}"); background-size: 201.6px; background-position: -28.8px -10.8px; background-color: rgb(128, 92, 136); color: rgb(255, 255,255); display: inline-block; line-height: 60px; width: 144px; height: 180px;border-radius: 1%; border: 0px solid #c7b89e;overflow: hidden;text-align: center;'></div></td></tr><tr><td style='text-align:center;padding:0px'><span style='font-weight:bolder;font-size:14px;color:black;'>${Knowledge_Author.value}<span></td></tr></table></div>`
      
      playlist.value.forEach(detailItem => {
        detailItem.editDisabled = true
        detailItem.isPublished = detailItem.Publication_Date < $FillUp_Date(new Date()) ? true : false
        detailItem.subDetails.forEach(subDetail => {
          subDetail.editDisabled = true
          subDetail.showVersionHistory = false
        })
      })
      
      initPlaylist()
    }
  }
  catch(err) {
    console.log(err)
  }
}

const initPlaylist = async () => {
  playlistLoaded.value = false
  await nextTick()
  setTimeout(() => {
    playlistLoaded.value = true
  }, 100);
}

const playVideo = async (index) => {
  knowledgeListIndex.value = index;
  nowFocus.value = playlist.value[index];
  isImage.value = false
  refreshFilepond()
  playerRefresh.value = false
  await nextTick()
  playerRefresh.value = true
  getKnowledgeDetailPublicationList(nowFocus.value.Knowledge_DetailID);
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

const descriptionSave = async (item) => {
  try {
    await axios.post(`/api/Public/Knowledge/Description_Save/${playingID.value}`, { Description: item })
    ckeditorDataCache.value = item
    nowFocus.value.Description = item
    nowFocus.value.Publication_Date = null
  }
  catch(err) {
    ElMessage({
      showClose: true,
      type: "error",
      message: "Description updated Error!"
    });
    console.log(err);
  }
}

const titleModify = debounce((e) => {
  if (e.target.value.length === 0) {
    e.target.value = e.target._value
    return
  }
  
  const params = {
    Title: e.target.value.trim()
  }
  axios.post(`/api/Public/Knowledge/Title_Modify/${playingID.value}`, params)
    .then(response => {
      if (response.data) {
        nowFocus.value.Title = response.data
        ElMessage({
          showClose: true,
          type: "success",
          message: "Title has been updated!"
        });
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        type: "error",
        message: "Title updated Error!"
      })
      console.log(error);
    });
}, 1000)

const tagsModify = debounce((e) => {
  if (e.target.value.length === 0) {
    e.target.value = e.target._value
    return
  }
  const params = {
    Tags: e.target.value.trim()
  }
  axios.post(`/api/Public/Knowledge/Tags_Modify/${playingID.value}`, params)
    .then(response => {
      if (response.data) {
        nowFocus.value.Tags = response.data
        ElMessage({
          showClose: true,
          type: "success",
          message: "Tags has been updated!"
        });
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        type: "error",
        message: "Tags updated Error!"
      })
      console.log(error);
    });
}, 1000)

const htmlModify = debounce((e) => {
  const params = {
    HTML_Draft: nowFocus.value.HTML_Draft
  }

  axios.post(`/api/Public/Knowledge/HTML_Modify/${playingID.value}`, params)
    .then(response => {
      if (response.data) {
        ElMessage({
          showClose: true,
          type: "success",
          message: "HTML Draft has been updated!"
        });
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        type: "error",
        message: "HTML Draft updated Error!"
      })
      console.log(error);
    });
}, 500)

const closeImage = () => { isImage.value = false }

const ImageInput = () => {
  const params = {
    Image_Always_On: nowFocus.value.ImageInput ? 1 : 0
  }
  axios.post(`/api/Public/Knowledge/Image_Always_On/${playingID.value}`, params)
    .then(res => {
      if (res.data) {
        nowFocus.value.Image_Always_On = res.data
        ElMessage({
          showClose: true,
          type: "success",
          message: "Image Always On has been updated!"
        });
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        type: "error",
        message: "Image Always On updated Error!"
      })
      console.log(error);
    });
}

const dragEnd = (e) => {
  if (e.oldIndex === e.newIndex) return
  const params = {
    PlayList_Detail: []
  }
  playlist.value.forEach((item, index) => {
    item.SortID = index + 1
    params.PlayList_Detail.push({
      Knowledge_DetailID: item.Knowledge_DetailID,
      SortID: item.SortID
    })
  })
  const KonwledgeID = playlist.value[0].KnowledgeID
  axios.post(`/api/Public/Knowledge/Reorder_SortID/${KonwledgeID}`, params)
    .then(res => {
      if (res.data === 'reorder ok!') {
        ElMessage({
          showClose: true,
          type: "success",
          message: "Sort has been updated!"
        });
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        type: "error",
        message: "Sort updated Error!"
      })
      console.log(error);
    });
}

const detailAdd = () => {
  const params = {
    Title: addNew.value.Title,
    Description: addNew.value.Description
  }
  const KnowledgeID = playlist.value[0].KnowledgeID
  axios.post(`/api/Public/Knowledge/Detail_Add/${KnowledgeID}`, params)
    .then(res => {
      if (res.data === 'add ok' && res.status === 200) {
        getKnowledgeList()
        addNew.value.Title = ''
        addNew.value.Description = ''
        showModel.value = null
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        type: "error",
        message: "Add New Error!"
      })
      console.log(error)
    })
}

const detailDelete = () => {
  ElMessageBox.confirm(
    `Do you really want to delete ${nowFocus.value.Title}?`, 'Warning!!',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    axios.delete(`/api/Public/Knowledge/Detail_Delete/${playingID.value}`)
      .then(response => {
        if (response.data === 'delete ok' && response.status == 200) {
          knowledgeListIndex.value = 0
          getKnowledgeList();
          ElMessage({
            showClose: true,
            type: "success",
            message: `${nowFocus.value.Title} Delete ok!`
          });
          router.push({path: `/Knowledge/${route.params.KnowledgeID}`})
        }
      })
      .catch(function (error) {
        ElMessage({
          showClose: true,
          type: "error",
          message: `${nowFocus.value.Title} Delete Error!`
        })
        console.log(error);
      });
  }).catch(() => {
    ElMessage({
      showClose: true,
      type: 'info',
      message: 'Cancel Delete'
    })
  });
}

const getKnowledgeDetailPublicationList = (Knowledge_DetailID) => {
  Knowledge_Detail_Publication.value = []
  axios.get(`/api/Public/Knowledge/Knowledge_Detail_Publication/${Knowledge_DetailID}`)
    .then(response => {
      if (response.data) {
        Knowledge_Detail_Publication.value = response.data
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

const Knowledge_Detail_Publication_Maintain = (obj) => {
  let result = true
  let params = {
    Mode: obj.Mode
  }
  // console.log(obj.items)
  // Mode === 0 表示新增
  // Mode === 1 表示修改
  // Mode === 2 表示刪除
  params.Knowledge_DetailID = nowFocus.value.Knowledge_DetailID
  console.log('obj', obj)
  switch (obj.Mode) {
    case 0:
      break;
    case 1:
      let Value = '';
      params.Name = obj.Name;
      switch (obj.Name) {
        case 'Description':
          Value = obj.items[obj.Name];
          break;
        case 'Publication_Date':
          Value = obj.items[obj.Name]
          Value = Value.length > 0 ? $FillUp_Date(Value) : null;
          obj.items[obj.Name] = Value;
          break;
      }
      params.Value = Value
      params.Publication_Date = obj.items.Publication_Date
      params.Knowledge_Detail_PublicationID = obj.items.Knowledge_Detail_PublicationID
      break;
    case 2:
      params.Knowledge_Detail_PublicationID = obj.items.Knowledge_Detail_PublicationID
      break;
  }
  obj.Mode == 2 ? result = confirm(`Are you sure you want to delete Publication data ?`) : '';
  if ((obj.Mode == 2 && result == false)) {
    return;
  }
  console.log('params', params)
  axios.post(`/api/Public/Knowledge/Knowledge_Detail_Publication_Maintain`, params)
    .then(response => {
      // console.log(response.data)
      let Flag = response.data.Flag
      let Msg = ''
      switch (obj.Mode) {
        case 0:
          Msg = `Insert Publication Data ${Flag ? 'Success!' : 'fail!'}`
          break
        case 1:
          Msg = `Update [${obj.Name}] field data ${Flag ? 'Success!' : 'fail!'}`
          break
        case 2:
          Msg = `Delete Publication Data ${Flag ? 'Success!' : 'fail!'}`
          break
      }
      if (Flag) {
        if (obj.Mode === 1 && obj.Name === 'Publisher') {
          nowFocus.value.Publication_Date = obj.items.Publication_Date.replaceAll('/', '-')
          filepondMode.value = 0
        }
        getKnowledgeDetailPublicationList(nowFocus.value.Knowledge_DetailID);
      }
      ElMessage({
        showClose: true,
        type: Flag ? 'success' : 'error',
        message: Msg
      })
    })
    .catch(function (error) {
      ElMessage({
        showClose: true,
        type: 'error',
        message: 'Data save fail!'
      })
      console.log(error)
    })
}

const Knowledge_Detail_Publication_Set = async ({_mode, publication: _publication}) => {
  try {
    const _params = {
      Publication_Date: nowFocus.value.Publication_Date.trim() !== '' ? $FillUp_Date(nowFocus.value.Publication_Date) : null
    }
    const _res = await axios.post(`/api/Public/Knowledge/Knowledge_Detail_Publication/${nowFocus.value.Knowledge_DetailID}`, _params)
    if (_res.status !== 200) { throw new Error(`Publication Data Update fail!`) }
    ElMessage({
      showClose: true,
      type: 'success',
      message: `Publication Data has been updated!`
    })
  } catch (_err) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: _err
    })
  }
}

const Knowledge_SubDetail_Publication_Maintain = async(obj) => {
  // Mode === 0 表示新增
  // Mode === 1 表示修改
  // Mode === 2 表示刪除
  let params = {
    mode: obj.Mode,
    Description: ''
  }
  const _KnowledgeSubDetailID = obj.KnowledgeSubDetailID
  switch (obj.Mode) {
    case 0:
      break
    case 1:
      params.Publication_Date = $FillUp_Date(obj.Publication_Date)
      params.Description = obj.Description
      params.Knowledge_SubDetail_PublicationID = obj.PublicationID
      params.Knowledge_SubDetailID = _KnowledgeSubDetailID
      params.act = obj.act === 'announce' ? 'announce' : null
      break
    case 2:
      const _isConfirm = await ElMessageBox.confirm(
        `Are you sure you want to delete?`, 'Warning!!',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
    if (_isConfirm !== 'confirm') return
      params.Knowledge_SubDetail_PublicationID = obj.PublicationID
      break
  }
  try {
    const _res = await axios.post(`/api/Public/Knowledge/Knowledge_SubDetail_Publication/${_KnowledgeSubDetailID}`, params)
    let status = _res.status
    let Msg = ''
    switch (obj.Mode) {
      case 0:
        if (status !== 200) { throw new Error(`Insert Publication Data fail!`) }
        _res.data.recordset[0].Publication_Date = $FillUp_Date(_res.data.recordset[0].Publication_Date)
        nowFocus.value.subDetails.forEach(e => {
          if (e.Knowledge_SubDetailID === _KnowledgeSubDetailID) {
            e.Publications.unshift(_res.data.recordset[0])
          }
        })
        Msg = `Insert Publication Data Success!`
        break
      case 1:
        if (status !== 200) { throw new Error(`Update data fail!`) }
        if (obj.act === 'announce') {
          nowFocus.value.subDetails.forEach(e => {
            if (e.Knowledge_SubDetailID === obj.KnowledgeSubDetailID) {
              e.Publication_Date = obj.Publication_Date
              e.Sub_Version_Description = obj.Description
              e.Publications.forEach(el => {
                if (el.Knowledge_SubDetail_PublicationID === obj.PublicationID) {
                  el.Publisher = State.value.UserID
                }
              })
            }
          })
          filepondMode.value = 0
        }
        Msg = `Update data Success!`
        break
      case 2:
        if (status !== 200) { throw new Error(`Delete Publication Data fail!`) }
        nowFocus.value.subDetails.forEach(e => {
          if (e.Knowledge_SubDetailID === _KnowledgeSubDetailID) {
            e.Publications = e.Publications.filter(e => e.Knowledge_SubDetail_PublicationID !== obj.PublicationID)
          }
        })
        Msg = `Delete Publication Data Success!`
        break
    }
    ElMessage({
      showClose: true,
      type: 'success',
      message: Msg
    })
  }
  catch (_err) {
    console.log(_err)
    ElMessage({
      showClose: true,
      type: 'error',
      message: _err
    })
  }
}

// closeComptCkEditor
const closeComptCkEditor = () => {
  showModel.value = null
  if (ckeditorDataCache.value === '') return
  nowFocus.value.Description = ckeditorDataCache.value
  ckeditorDataCache.value = ''
}

// 確認讀取權限
const CheckIsReader = async () => {
  const res = await axios.post('/api/Public/Knowledge/isReader', { KnowledgeID: route.params.KnowledgeID })
  const roleSet = new Set(State.value.Groups)
  const readableGroups = res.data
  if (readableGroups[0] === null) return State.value.isReader = true
  State.value.isReader  = readableGroups.some(role => roleSet.has(role)) || IsAuthor.value
  if (!State.value.isReader) return router.push({name: 'Program_Disabled'})
}

// SubDetailAdd
const addParagraph = async (_obj) => {
  const _params = {
    mode: 0,
    Knowledge_DetailID: route.params.Knowledge_DetailID,
    Subtitle: _obj.Subtitle,
    Description: '',
  } 
  try {
    const _res = await axios.post('/api/Public/Knowledge/Knowledge_SubDetailID', _params)
    if (_res.status === 200) {
      nowFocus.value.subDetails.push({
        Description: _res.data.Description,
        Knowledge_SubDetailID: _res.data.Knowledge_SubDetailID,
        SortID: _res.data.SortID,
        Subtitle: _res.data.Subtitle,
        Data_Update: _res.data.Data_Update,
        Data_Updater: _res.data.Data_Updater,
        Publication_Date: _res.data.Publication_Date,
        editDisabled: _res.data.editDisabled,
        showVersionHistory: _res.data.showVersionHistory,
        Publications: [],
        source: {
          src: null,
          type: null
        },
        editDisabled: true
      })
      ElMessage({
        showClose: true,
        type: 'success',
        message: `Successfully added a paragraph`
      })
    }
  } catch(err) {
    ElMessage({
      showClose: true,
      type: 'success',
      message: `Failed to add a paragraph`
    })
    console.log(err)
  }
}

// subDetail sortID Update
const subDetailDragEnd = async (e) => {
  if (e.oldIndex === e.newIndex) return
  const _params = {
    subDetails: []
  }
  // SortID 賦新值
  nowFocus.value.subDetails.forEach((e, i) => {
    e.SortID = i + 1
    _params.subDetails.push({
      Knowledge_SubDetailID: e.Knowledge_SubDetailID,
      SortID: e.SortID,
    })
  })
  // 送出 API
  try {
    const { data } = await axios.post(`/api/Public/Knowledge/Reorder_SortID_SubDetailID/${nowFocus.value.Knowledge_DetailID}`, _params)
    if (data === 'reorder ok!') {
      ElMessage({
        showClose: true,
        type: "success",
        message: "Sort has been updated!"
      });
    }
  } catch (err) {
    ElMessage({
      showClose: true,
      type: "error",
      message: "Sort updated Error!"
    })
    console.log(err);
  }
}

// SubDetailDel
const deleteSubDetail = async (_index) => {
  try {
    const isConfirm = await ElMessageBox.confirm(
      `Are you sure you want to delete ${nowFocus.value.subDetails[_index].Subtitle}?`, 'Warning!!',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    if (isConfirm !== 'confirm') return
    const _params = {
      mode: 2,
      ...nowFocus.value.subDetails[_index]
    }
    const { status } = await axios.post('/api/Public/Knowledge/Knowledge_SubDetailID', _params)
    if (status === 200) {
      nowFocus.value.subDetails.splice(_index, 1)
      ElMessage({
        showClose: true,
        type: 'success',
        message: 'Deletion successful'
      })
    }
  }
  catch(err) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: 'Deletion failed'
    })
    console.log(err)
  }
}

// 點擊側邊段落移動至目標
const handleClickScrollToTarget = async (_targetID, _Knowledge_DetailID) => {
  // current Knowledge_DetailID !== target _Knowledge_DetailID，則跳轉頁面
  router.replace({
    name: 'Knowledge',
    params: {
      KnowledgeID: nowFocus.value.KnowledgeID,
      Knowledge_DetailID: _Knowledge_DetailID
    },
    query: {
      f: _targetID
    }
  })
  getKnowledgeDetailPublicationList(_Knowledge_DetailID)
  if (_Knowledge_DetailID !== nowFocus.value.Knowledge_DetailID) {
    filepondMode.value = 0
    nowFocus.value = playlist.value.find((el) => el.Knowledge_DetailID === _Knowledge_DetailID)
    await pauseTimer(300) // 須 delay 後再 scrollTo
    window.scrollTo({top: 0,})
    closeEditSubDetailAll()
    // 
  }
  scrollToTarget(_targetID)
}

// scroll to target
const scrollToTarget = async (_targetID) => {
  const element = document.querySelector(`#${_targetID}`)
  if (!element) return
  const offsetTop = element.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2)
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  })
}

const showSubPondModal = (_index) => {
  editingSubDetailID.value = nowFocus.value.subDetails[_index].Knowledge_SubDetailID
  showModel.value = 'subPond'
  filepondMode.value = 4
}

const closeEditSubDetailAll = () => {
  nowFocus.value.subDetails.forEach(e => {
    const taegetElToolBar = document.querySelector(`#Paragraph${e.Knowledge_SubDetailID} .ck.ck-editor__top.ck-reset_all`)
    const taegetEl = document.querySelector(`#Paragraph${e.Knowledge_SubDetailID} .ck.ck-editor__main`)
    e.editDisabled = true
    if (taegetElToolBar) { taegetElToolBar.style.display = 'none' }
    if (taegetEl) { taegetEl.style.border = 'unset' }
  }) 

  const CKToolBarEls = document.querySelectorAll('.ck.ck-editor__top.ck-reset_all')[0]
  const CKContentContainer = document.querySelectorAll('.ck.ck-editor__main')[0]
  nowFocus.value.editDisabled = true
  if (CKToolBarEls) { CKToolBarEls.style.display = 'none' }
  if (CKContentContainer) { CKContentContainer.style.border = 'unset' }
}

onMounted(async () => {
  getKnowledgeList();
  setOptions({
    fileRenameFunction: file => {
      return file.basename;
    },
  });

  setTimeout(() => {
    // console.log(document.querySelectorAll('pre code'))
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, 1000);

  if (route.query?.f) { 
    await pauseTimer(300) // 須 delay 後再 scrollTo
    scrollToTarget(route.query.f)
  }
  updateWindowHeight()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateWindowHeight)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateWindowHeight)
})

const handleScroll = () => {
  nowFocus.value.subDetails.forEach((item) => {
    const element = document.querySelector(`#Paragraph${item.Knowledge_SubDetailID}`)
    // console.log('element.getBoundingClientRect()', element.getBoundingClientRect())
    if (element) {
      item.scrollYTop = Math.ceil(element.getBoundingClientRect().top) - 1
      item.scrollYBottom = Math.ceil(element.getBoundingClientRect().bottom) + 1
    }
  })
}

const updateWindowHeight = () => {
  windowInnerHeight.value = (window.innerHeight / 2)
}

const toggleEditMode = () => {
  const CKToolBarEls = document.querySelectorAll('.ck.ck-editor__top.ck-reset_all')[0]
  const CKContentContainer = document.querySelectorAll('.ck.ck-editor__main')[0]
  nowFocus.value.editDisabled = !nowFocus.value.editDisabled
  if (CKToolBarEls) { CKToolBarEls.style.display = !nowFocus.value.editDisabled ? 'unset' : 'none' }
  if (CKContentContainer) { CKContentContainer.style.border = !nowFocus.value.editDisabled ? '1px solid hsl(220, 6%, 81%)' : 'unset' }
}

// watch
watch(
  () => playlistLoaded.value,
  (newVal, oldVal) => {
    if (playlistLoaded.value && route.params.Knowledge_DetailID) {
      let index = playlist.value.findIndex((el) => { return el.Knowledge_DetailID === Number(route.params.Knowledge_DetailID) })
      nowFocus.value = playlist.value[index]
    } else if (playlistLoaded.value) {
      nowFocus.value = playlist.value[knowledgeListIndex.value]
    }
    getKnowledgeDetailPublicationList(nowFocus.value.Knowledge_DetailID)
  }
)

watch(
  () => uploadFiles.value,
  () => { filePond.value = true }
)

watch(
  () => filepondMode.value,
  (newVal) => {
    switch (newVal) {
        case 1:
          nextTick(() => {
            myServerConfig.value.url = `${hostname.value}/api/Public/Knowledge/Video_Add/${Knowledge_Title.value}`
          })
          break;
        case 2:
          nextTick(() => {
            myServerConfig.value.url = `${hostname.value}/api/Public/Knowledge/Video_Edit/${playingID.value}`
          })
          break;
        case 3:
          nextTick(() => {
            myServerConfig.value.url = `${hostname.value}/api/Public/Knowledge/Photo_Edit/${playingID.value}`
          })
          break;
        case 4:
          nextTick(() => {
            myServerConfig.value.url = `${hostname.value}/api/Public/Knowledge/Sub_Video_Edit/${nowFocus.value.KnowledgeID}/${nowFocus.value.Knowledge_DetailID}/${editingSubDetailID.value}`
          })
          break
        default:
          break;
      }
      refreshFilepond()
  }
)

watch(
  () => nowFocus.value?.Knowledge_DetailID,
  (newVal) => {
    if (filepondMode.value == 1) {
      return
    } else if (filepondMode.value == 2) {
      myServerConfig.value.url = `${hostname.value}/api/Public/Knowledge/Video_Edit/${newVal}`
    } else if (filepondMode.value == 3) {
      myServerConfig.value.url = `${hostname.value}/api/Public/Knowledge/Photo_Edit/${newVal}`
    }
    refreshFilepond()
  }
)

watch(
  () => nowFocus.value?.Image_Always_On,
  (newVal) => {
    if (typeof newVal === 'boolean') {
      const params = {
        Image_Always_On: newVal ? 1 : 0
      }
      axios.post(`/api/Public/Knowledge/Image_Always_On/${playingID.value}`, params)
        .then(res => {
          if (res.status === 200) {
            nowFocus.value.Image_Always_On = res.data
            ElMessage({
              showClose: true,
              type: "success",
              message: "Image Always On has been updated!"
            })
          }
        })
        .catch((error) => {
          ElMessage({
            showClose: true,
            type: "error",
            message: "Image Always On updated Error!"
          })
          console.log(error)
        })
    }
  }
)

watch(
  () => State.value?.Groups,
  () => {
    CheckIsReader()
  }
)

watch(
  () => filepondMode.value,
  () => {
    if (filepondMode) return
    closeEditSubDetailAll()
  }
)
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Poiret+One);
@media print {
  .noprint {
    display: none;
  }
}

.noprint {
  .plyr.plyr--full-ui.plyr--video.plyr--html5.plyr--fullscreen-enabled {
    width: 100% !important;
  }
}

#container {
  width: 1280px;
  /* margin: 2rem auto; */
}

#buttons>button {
  border-style: solid;
  margin: 3px;
}

#buttons>button:hover {
  background-color: orange;
  color: white;
}

.modal-container {
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100vh;
  z-index: 102;
  border: 1px solid green;
  display: flex;
  justify-content: center;
  background-color: rgba(246, 248, 247, 0.3);
  backdrop-filter: blur(1px);
  .add-new-modal-box {
    height: fit-content;
    padding: 10px;
    margin: 10px;
    /* border: 1px solid tomato; */
    box-shadow: 0 3px 6px rgba(0, 0, 0, .15);
    width: 250px;
    background-color: #fff;
    input {
      border: none;
      outline: none !important;
      box-shadow: none !important;
    }
    button {
      padding: 4px;
    }
  }

  .myckEditor.edit {
    background-color: #f6f7f8;
    /* height: 80vh;; */
    box-shadow: 0 3px 6px rgba(0, 0, 0, .15);
    margin: 10px;
  }

  &.subDetail-upload-container {
    flex-flow: column;
    align-items: center;
    &>div {
      width: 80%;
      /* .filepond--root {
          min-height: 500px;
      } */
    }
  }
}

.HtmlDraft {
  margin-top: 40px;
  width: 90vh;
  background-color: #fff;
  border: 1px solid #d9dbdd;
  box-shadow: 0 3px 6px rgba(0, 0, 0, .15);
  height: 90vh;
}

.ManageMode {
  background-color: rgb(242, 202, 142);
}

/* Playlist  */
/* scrollbar rules have to be separate, browsers not supporting this syntax will skip them when combined. */
.plyr-playlist-wrapper ul::-webkit-scrollbar {
  width: 6px;
}

.plyr-playlist-wrapper ul::-webkit-scrollbar-track {
  /* background: rgba(0, 0, 0, 0.3); */
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
}

.plyr-playlist-wrapper ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  /*  background: #fff; */
  background: #3498db;
}

.plyr-playlist-wrapper {
  /* background: rgba(0, 0, 0, 0.8); */
  position: relative;
  padding: 0.5em 0.5em 0.5em 0.25em;
}

.plyr-playlist-wrapper .plyr-playlist {
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: relative;
  margin-top: 0;
  width: 100%;
  box-sizing: border-box;
  /* padding: 6px 4px; */
  /* border-top: 1px solid rgba(0, 0, 0, 0.05); */
  /* -moz-box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 8px 0px inset;
  -webkit-box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 8px 0px inset;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 8px 0px inset; */
}

.plyr-playlist-wrapper ul {
  padding: 0;
  margin: 0;
  /* overflow-y: scroll; */
  -webkit-overflow-scrolling: touch;
}

.plyr-playlist-wrapper ul li {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.plyr-playlist-wrapper .plyr-playlist li {
  list-style: none;
  background-color: rgba(255, 255, 255, 0.03);
  padding: 0px;
  margin-bottom: 3px;
  font-size: 120%;
}

.plyr-playlist-wrapper .plyr-playlist li.pls-playing,
.plyr-playlist-wrapper .plyr-playlist li:hover {
  color: #3498db;
  background-color: rgba(255, 255, 255, 0.09);
}

.plyr-playlist-wrapper .plyr-playlist li.pls-playing a {
  color: #3498db;
}

.plyr-playlist-wrapper .plyr-playlist li a {
  text-decoration: none;
  font-family: arial;
  color: black;
  display: block;
  padding: 10px 0;
  outline: none;
  padding: 0.25em 0.25em 0.25em 0.75em;
  font-size: 90%;
  /* vertical-align: middle; */
  padding-bottom: 10px;
}

.plyr-playlist-wrapper .plyr-playlist li:last-child a {
  border-bottom: 0;
}

.plyr-playlist li a:hover,
.plyr-playlist li a:focus,
.plyr-playlist li a:active {
  color: #04a9f3;
}

/* .plyr-playlist li {
  height: 95px;
} */

.plyr-miniposter {
  height: 95px;
  width: 120px;
  float: left;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plyr-miniposter>img {
  max-height: 85px;
  min-width: 120px;
  max-width: 120px;
  -webkit-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 2px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
}

.plyr__progress__container {
  flex-grow: 2;
}

#DivTextarea {
  padding: 15px 10px;
  width: auto;
  max-height: none;
  border: none;
}

#DivTextarea .ck-editor__editable:not(table) {
  /* width: 100%; */
  max-height: none;
  /* background: #000; */
}

.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
  border-color: white;
}

#DivTextarea .ck-content .image>img {
  max-width: 100%;
  /* border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid #d9dbdd; */
}

#buttons {
  .upload-btn {
    padding: 4px;
    margin: 3px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button:not(.upload-btn) {
    border: none;
  }
}
  
.lineClamp2 {
  display: -webkit-box;
  list-style-position: inside;
  overflow: hidden;
  text-overflow: ellipsis;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  white-space: normal !important;
  /* color: */
}

.lineClamp3 {
  display: -webkit-box;
  list-style-position: inside;
  overflow: hidden;
  text-overflow: ellipsis;
  /* -webkit-line-clamp: 3; */
  -webkit-box-orient: vertical;
  white-space: normal !important;
}


.draggable-title {
  font-size: 1rem !important;
  padding: 0 0 0 5px !important;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  display: inline-block;
  width: 100%;
  &.active {
    color: #3498db !important;
  }
}

.draggable-subTitle {
  padding: 0 0 0 5px !important;
  border-top: none !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  a {
    font-size: 12px !important;
    width: 100%;
    height: fit-content;
    position: relative;
    padding: 0 0.8rem !important;
    
    &::before {
      position: absolute;
      top: 6px;
      left: 0;
      /* transform: translateY(-50%); */
      content: '';
      background-color: grey;
      width: 0.3rem;
      height: 0.3rem;
      display: inline-block;
      border-radius: 50%;
    }
    &.active {
      color: #3498db !important;
    }
    &.publish {
      color: brown !important;
      font-style: italic;
    }
  }
}

.color_field {
  text-align: right;
  padding: 3px 5px;
}

.theater {
  transform: scale(1.2, 1.2);
  position: fixed;
  left: 400px;
  top: 100px;
  border-right: 100% solid black;
  border-left: 100% solid black;
  margin: auto;
}

.theater-toggle {
  margin: auto;
}

.panzoomImage {
  position: absolute;
  z-index: 99;
  left: 12px;
  padding-top: 40px;
  max-width: 880px;
  height: auto;
  -webkit-filter: drop-shadow(10px 10px 5px rgba(0, 0, 0, 0.7));
  filter: drop-shadow(10px 10px 5px rgba(0, 0, 0, 0.7))
}

.ck-content .image>figcaption {
  background-color: transparent;
}

.filepond--root {
  min-height: 2em;
}

.filepond--root .filepond--drop-label {
  font-size: 12px;
  min-height: 2em;
}

.v--modal-box.v--modal {
  top: 50px !important;
}

#Author {
  position: relative;
  color: black;
  text-align: center;
  max-width: 48px;
  max-height: 48px;
  left: -5%;
  width: 112%;
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

table p {
  margin-bottom: unset !important
}


/*{font-family: 'Poiret One', cursive;}*/

.listtable {
  input:focus {
    box-shadow: none;
  }
}

.subDetail-upload-container {
  .filepond--wrapper {
    display: flex;
    justify-content: center;
  }
  .filepond--root,
  .filepond--root .filepond--drop-label  {
    width: 100%;
    height: 222px;   
  } 
}
</style>
