<template>
  <div v-if="!isLoading" :class="{'myckEditor':true}" class="comtent">
    <div :class="{'ToolBarHidden':post.ToolBarHidden, 'ck-content-read': !props.post.filepondMode}">
      <div class="detail-description-container" v-show="props.post.editorData !== '' || props.post.filepondMode">
        <ckeditor
          :editor="editor"
          :config="editorConfig"
          :disabled="props.post.editDisabled"
          @ready="initdetailEditorInstance({ _target: $event })"
        />
        <!-- Knowledge_Detail_Publication -->
        <template v-if="!props.post.editDisabled">
          <div class="Version pb-1">
            <div>
              <div style="font-size: 14px; font-weight: bolder; float: left;">
                <i>版本記錄：</i>
              </div>
              <div style="float: right; padding-right: 15px;"><a><i class="fas fa-plus" style="cursor: pointer;" @click="emits('handleknowledgeDetailPublicationSet', {Mode: 0})"></i></a></div>
            </div>
            <table class="listtable table-gridline-both" style="width: 100%;">
              <thead>
                <tr>
                  <th style="width: 70px;">發布日期</th>
                  <th style="width: 550px;">說明</th>
                  <th style="width: 120px;">發佈人</th>
                  <th style="width: 60px;">執行</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(publication, index) in props.post.Knowledge_Detail_Publication" :key="index">
                  <tr>
                    <td><input type="text" v-model="publication.Publication_Date" @change="emits('handleknowledgeDetailPublicationSet', {Mode: 1, Name: 'Publication_Date', items: publication})"></td>
                    <td><input class="w-[100%]" type="text" v-model="publication.Description" @change="emits('handleknowledgeDetailPublicationSet', {Mode: 1, Name: 'Description', items: publication})"></td>
                    <td style="text-align: center;">{{ publication.Publisher }}</td>
                    <td class="flex justify-around" style="text-align: center;">
                      <a><i class="fas fa-atlas" style="cursor: pointer;" @click="emits('handleknowledgeDetailPublicationSet', {Mode: 1, Name: 'Publisher', items: publication})"></i></a>
                      <a><i class="fas fa-trash-alt" style="cursor: pointer;" @click="emits('handleknowledgeDetailPublicationSet', {Mode: 2, items: publication})"></i></a>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else-if="props.post.editDisabled">
          <div class="Version flex flex-col text-[silver] pl-[6px]">
            <div>
              <template v-if="props.post.Knowledge_Detail_Publication.length">
                <div class="float-left cursor-pointer" @click="showVersionHistoryOfDetail = !showVersionHistoryOfDetail"><i>版本記錄</i><i class="fa-solid fa-caret-left ml-1" :class="{'expand': showVersionHistoryOfDetail}"></i></div>
              </template>
            </div>
            <Transition name="versionTable">
              <div v-if="showVersionHistoryOfDetail" class="version-table">
                <table class="w-full">
                  <tbody>
                    <template v-for="(publication, index) in props.post.Knowledge_Detail_Publication" :key="index">
                      <tr>
                        <td class="w-[70px]">{{ publication.Publication_Date }}</td>
                        <td>{{ publication.Description }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </Transition>
          </div>
        </template>
      </div>
      <template v-for="(data, index) in subDetails" :key="index">
        <div v-if="data.Publication_Date !== null || props.post.IsAuthor" :id="`Paragraph${data.Knowledge_SubDetailID}`" class="relative group rounded-sm m-1" :class="[props.post.filepondMode ? 'hover:ring-2 hover:ring-gray-400': '']">
          <div v-if="data.Subtitle !== '' || !data.editDisabled" class="relative" :class="{'bg-[#ffffcc]': data.Publication_Date === null}">
            <template v-if="data.editDisabled">
              <h3 class="!text-lg !font-bold !text-black pl-[6px]" >{{ data.Subtitle }}</h3>
            </template>
            <template v-else>
              <div class="!text-lg !font-bold !text-black relative">
                <input class="border-none min-w-[700px]" name="Subtitle" type="text" v-model="data.Subtitle" @change="subDetailUpdate({index: index, target: 'subTitle'})">
                <p class="absolute top-[50%] -translate-y-[50%] right-[55px] w-fit text-sm">{{data.Data_Updater}} {{ moment(data.Data_Update).format('YYYY/MM/DD') }}</p>
              </div>
            </template>
            <!-- icon -->
            <div class="absolute top-1 right-1 z-[999] hidden" :class="[props.post.filepondMode ? 'group-hover:block': '']">
              <button class="border-0" @click="editSubDescription(index, data)"><i class="fas fa-edit fa"></i></button>
              <button class="border-0 ml-1" @click="emits('handelShowSubPondModal', index)"><i class="fa-solid fa-clapperboard"></i></button>
              <button class="border-0 ml-1" @click="emits('handelDeleteSubDetail', index)"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
          <div v-if="data.Publication_Date && data.Sub_Version_Description && !props.post.filepondMode" class="ck-content">
            <blockquote class="h-[30px] flex items-center !py-0 !ml-1 !mr-2">
              <p>最新更新: {{ data.Sub_Version_Description }}</p>
            </blockquote>
          </div>
          <div class="relative">
            <div class="px-2">
              <VuePlyr ref="player" :autoplay="false" v-if="playerRefresh && data.source.src">
                <video controls autoplay>
                  <source :src="data.source.src" :type="data.source.type" size="1080">
                </video>
              </VuePlyr>
            </div>
            <div class="subDetail-description-container">
              <ckeditor
                :editor="editor"
                :config="editorConfig"
                :disabled="data.editDisabled"
                @ready="initCKEditor({ _target: $event, _index: index })"
              />
            </div>
          </div>
          <template v-if="data.editDisabled">
            <div class="Version flex flex-col text-[silver] pl-[6px]">
              <div>
                <template v-if="data.Publications.length">
                  <div class="float-left cursor-pointer" @click="data.showVersionHistory = !data.showVersionHistory"><i>版本記錄</i><i class="fa-solid fa-caret-left ml-1" :class="{'expand': data.showVersionHistory}"></i></div>
                </template>
              </div>
              <Transition name="versionTable">
                <div v-if="data.showVersionHistory" class="version-table">
                  <table class="w-full">
                    <tbody>
                      <template v-for="(publication, index) in data.Publications" :key="index">
                        <tr>
                          <td class="w-[70px]">{{ publication.Publication_Date }}</td>
                          <td>{{ publication.Description }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </Transition>
            </div>
          </template>

          <!-- 本版紀錄編輯區 -->
          <template v-else-if="!data.editDisabled">
            <div class="Version pb-1">
              <div>
                <div style="font-size: 14px; font-weight: bolder; float: left;"><i>版本記錄：</i></div>
                <div style="float: right; padding-right: 15px;" @click="emits('handleKnowledgeSubDetailPublicationMaintain', {Mode: 0, KnowledgeSubDetailID: data.Knowledge_SubDetailID})"><a><i class="fas fa-plus" style="cursor: pointer;"></i></a></div>
              </div>
              <table class="listtable table-gridline-both" style="width: 100%;">
                <thead>
                  <tr>
                    <th style="width: 70px;">版本</th>
                    <th style="width: 550px;">說明</th>
                    <th style="width: 120px;">發佈人</th>
                    <th style="width: 60px;">執行</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(publication, publicationIndex) in data.Publications" :key="publicationIndex">
                    <tr style="">
                      <td><input type="text" v-model="publication.Publication_Date" @change="emits('handleKnowledgeSubDetailPublicationMaintain', {Mode: 1, PublicationID: publication.Knowledge_SubDetail_PublicationID, KnowledgeSubDetailID: publication.Knowledge_SubDetailID, Publication_Date: publication.Publication_Date, Description: publication.Description, index: publicationIndex})"></td>
                      <td><input class="w-[100%]" type="text" v-model="publication.Description" @change="emits('handleKnowledgeSubDetailPublicationMaintain', {Mode: 1, PublicationID: publication.Knowledge_SubDetail_PublicationID, KnowledgeSubDetailID: publication.Knowledge_SubDetailID, Publication_Date: publication.Publication_Date, Description: publication.Description, index: publicationIndex})"></td>
                      <td style="text-align: center;">{{ publication.Publisher }}</td>
                      <td class="flex justify-around" style="text-align: center;">
                        <a @click="emits('handleKnowledgeSubDetailPublicationMaintain', {Mode: 1, act: 'announce', PublicationID: publication.Knowledge_SubDetail_PublicationID, KnowledgeSubDetailID: publication.Knowledge_SubDetailID, Publication_Date: publication.Publication_Date, Description: publication.Description, index: publicationIndex})" ><i class="fas fa-atlas" style="cursor: pointer;"></i></a>
                        <a @click="emits('handleKnowledgeSubDetailPublicationMaintain', {Mode: 2, PublicationID: publication.Knowledge_SubDetail_PublicationID, KnowledgeSubDetailID: publication.Knowledge_SubDetailID, index: publicationIndex})"><i class="fas fa-trash-alt" style="cursor: pointer;"></i></a>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- 新增段落_Btn -->
    <div v-if="props.post.filepondMode" class="flex justify-center border-4 hover:border-gray-500 cursor-pointer mt-3" @click="addParagraph">
      <button class="bg-gray-500 border rounded-[50%] w-[20px] hover:bg-gray-500/80" plain="">
        <i class="fa-solid fa-plus" style="color: rgb(255, 255, 255);"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
// @skjnldsv/vue-plyr
import VuePlyr from '@skjnldsv/vue-plyr'
import "@skjnldsv/vue-plyr/dist/vue-plyr.css";
import commonFunction from '@/composables/commonFunction'
// about CKEditor5
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import {
  Autoformat,
  ClassicEditor,
  Essentials,
  Alignment,
  Bold,
  BlockQuote,
  Code,
  CodeBlock,
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageStyle,
  ImageResize,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  Table,
  TodoList,
  Highlight,
  ImageToolbar,
  ImageUpload,
  TableToolbar,
  PageBreak,
  Underline,
  disablePlaceholder,
  showPlaceholder,
} from 'ckeditor5'
import translations from 'ckeditor5/translations/zh.js';
import 'ckeditor5/ckeditor5.css'
import { MyCustomUploadAdapterPlugin } from '../../../assets/upload2'
import moment from 'moment'

import { computed, defineProps, nextTick, ref, watch } from 'vue'
const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      delay: 1000,
      IsAuthor: false,
      ToolBarHidden: false,
      Lang: 'cht',
      editorData: '',
      filepondMode: 0,
      Knowledge_Detail_Publication: []
    })
  },
})
const editor = ClassicEditor
const isLoading = ref(false)
const editorConfig = {
  toolbar: {
    items: [
      'heading', '|', 'bold', 'italic', 'underline', 'link', '|', 'bulletedList', 'numberedList', 'todoList', '|', 'Alignment',
      'FontFamily', 'FontSize', 'FontColor', 'FontBackgroundColor',
      // ,'PageBreak',
      'highlight',
      'insertTable', 'imageUpload', 'MediaEmbed', 'blockQuote', 'undo', 'redo', 'horizontalline',
      '|', 'codeBlock'
    ]
  },
  extraPlugins: [MyCustomUploadAdapterPlugin],
  plugins: [
    //, CKFinder, UploadAdapter, EasyImage, Base64UploadAdapter, SimpleUploadAdapter
    Essentials, 
    Autoformat, 
    Bold, 
    Italic, 
    BlockQuote, 
    Highlight, 
    Heading, 
    Image, 
    ImageCaption, 
    ImageStyle, 
    ImageToolbar, 
    ImageUpload, 
    ImageResize, 
    Link, 
    MediaEmbed, 
    List, 
    TodoList, 
    ListProperties,
    Table, 
    TableToolbar, 
    Paragraph, 
    MediaEmbed, 
    Alignment, 
    HorizontalLine, 
    PageBreak, 
    FontFamily, 
    FontSize, 
    FontColor, 
    FontBackgroundColor, 
    Code, 
    CodeBlock, 
    Underline
    //, Markdown
  ],
  licenseKey: 'GPL',
  Heading: {
    options: [
      { modelElement: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { modelElement: 'heading1', viewElement: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { modelElement: 'heading2', viewElement: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
    ]
  },
  MediaEmbed: {
    previewsInData: true,
    // 設定影片為可見的格式
    removeProviders: ['instagram', 'twitter', 'googleMaps', 'flickr', 'facebook']
  },
  fontFamily: {
    options: [
      'default',
      'Arial', 'Courier', 'Courier New',
      'Geneva', 'Georgia', 'Helvetica',
      'Lucida Grande', 'Lucida Sans Unicode', 'monospace',
      'serif', 'sans-serif', 'Tahoma',
      'Times New Roman', 'Trebuchet MS', 'Verdana'
    ]
  },
  fontSize: {
    options: [
      'default', 13, 14, 15, 16, 18, 20, 22, 24//, 26, 28, 32, 36, 40
    ]
  },
  fontColor: {
    colors: [
      { color: 'hsl(0, 0%, 0%)', label: 'Black' },
      { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
      { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
      { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
      { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
      { color: 'hsl(0, 75%, 60%)', label: 'Red' },
      { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
      { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
      { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
      { color: 'hsl(120, 75%, 60%)', label: 'Green' },
    ]
  },
  fontBackgroundColor: {
    colors: [
      { color: 'hsl(0, 75%, 60%)', label: 'Red' },
      { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
      { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
      { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
      { color: 'hsl(120, 75%, 60%)', label: 'Green' },
      { color: 'hsl(0, 0%, 0%)', label: 'Black' },
      { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
      { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
      { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
      { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
    ]
  },
  image: {
    // 設定圖片可選擇的對齊方式
    toolbar: ['imageTextAlternative', '|', 'imageStyle:side', 'imageStyle:full', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
    styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight'],
    resizeUnit: 'px',
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true
    }
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  },
  codeBlock: {
    languages: [ // 設定支援哪幾種語言
      { language: 'plaintext', label: 'Plain text' },
      { language: 'c', label: 'C' },
      { language: 'cs', label: 'C#' },
      { language: 'cpp', label: 'C++' },
      { language: 'css', label: 'CSS' },
      { language: 'diff', label: 'Diff' },
      { language: 'html', label: 'HTML' },
      { language: 'java', label: 'Java' },
      { language: 'javascript', label: 'JavaScript' },
      { language: 'php', label: 'PHP' },
      { language: 'python', label: 'Python' },
      { language: 'ruby', label: 'Ruby' },
      { language: 'typescript', label: 'TypeScript' },
      { language: 'xml', label: 'XML' }
    ],
  },
  translations: [translations]
}
const IsAuthor = computed(() => props.post.IsAuthor)
const subDetails = defineModel('subDetails')
const emits = defineEmits([
  'handelAddParagraph', 
  'handelDeleteSubDetail', 
  'handelShowSubPondModal',
  'handleKnowledgeSubDetailPublicationMaintain',
  'exportdata',
  'handleCloseEditSubDetailAll',
  'handleknowledgeDetailPublicationSet',
])
const playerRefresh = ref(true)
const { $FillUp_Date } = commonFunction()
const showVersionHistoryOfDetail = ref(false)
const addParagraph = () => {
  emits('handelAddParagraph', {Subtitle: `Paragraph${subDetails.value.length + 1}`})
}

// subDetail 切換編輯狀態
const editSubDescription = (_index, _subDetail) => {
  subDetails.value.forEach(e => {
    const taegetElToolBar = document.querySelector(`#Paragraph${e.Knowledge_SubDetailID} .ck.ck-editor__top.ck-reset_all`)
    const taegetEl = document.querySelector(`#Paragraph${e.Knowledge_SubDetailID} .ck.ck-editor__main`)
    if (e.Knowledge_SubDetailID === _subDetail.Knowledge_SubDetailID) {
      e.editDisabled = !e.editDisabled
    } else {
      e.editDisabled = true
    }
    if (taegetElToolBar) { taegetElToolBar.style.display = !e.editDisabled ? 'unset' : 'none' }
    if (taegetEl) { taegetEl.style.border = !e.editDisabled ? '1px solid hsl(220, 6%, 81%)' : 'unset' }
  }) 
}


// 初始化 Detail CKEditor
const initdetailEditorInstance = ({_target}) => {
  _target.setData(props.post.editorData || '')
  _target.model.document.on('change:data', () => {
    const content = _target.getData()
    if (props.post.editorData === content) return
    exportToSaveData(content)
  })
}

const exportToSaveData = (content) => {
  if (!props.post.IsAuthor) return
  emits('exportdata', content)
}

// 初始化 subDetail CKEditor
const editorInstances = ref({})
const initCKEditor = ({_target, _index}) => {
  _target.setData(subDetails.value[_index].Description || '')
  editorInstances.value[_index] = _target

  _target.model.document.on('change:data', () => {
    const content = _target.getData()
    subDetails.value[_index].Description = content
    subDetailUpdate({index: _index})
  })
}

// update
// subDetail update | emits 寫在 initCKEditor() 裡面無反應，故把 API 拉近來使用
const subDetailUpdate = async (_obj) => {
  const _params  = {
    mode: 1,
    ...subDetails.value[_obj.index],
    target: _obj.target
  }
  try {
    await axios.post('/api/Public/Knowledge/Knowledge_SubDetailID', _params)
    if (_obj.target !== 'subTitle') { subDetails.value[_obj.index].Publication_Date = null }
  }
  catch (err) {
    ElMessage({
      showClose: true,
      type: "error",
      message: "subDetail updated Error!"
    })
    console.log(err)
  }
}

watch(
  () => props.post.filepondMode,
  () => {
    if (props.post.filepondMode) return
    emits('handleCloseEditSubDetailAll')
  }
)

watch(
  () => subDetails.value,
  async () => {
    isLoading.value = true
    await nextTick()
    isLoading.value = false
  }
)
</script>

<style>

.ck-content ol,
.ck-content ul {
  padding-left: 40px;
  list-style: auto; /* 或 outside 看你想要的縮排樣式 */
}

.myckEditor .ck-sticky-panel {
  display: unset;
}

.ck.ck-editor__top.ck-reset_all {
  display: none;
}

.myckEditor .ck-editor__editable {
  max-height: 640px;
}

.ck-editor__nested-editable p {
  margin: 0px;
  line-height: 14px;
}

.ck-blurred.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-read-only {
  width: 100%;
}

.ck-rounded-corners .ck.ck-editor__main > .ck-editor__editable, .ck.ck-editor__main > .ck-editor__editable.ck-rounded-corners  {
  width:100%
}


.detail-description-container {
  .ck-blurred.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-read-only {
    padding-left: 10px;
  }
}

.subDetail-description-container {
  .ck-blurred.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-read-only {
    padding-left: 6px;
  }
}

.ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable) {
  /* border: none; */
  border-color: transparent;
  box-shadow: none;
}

.ck-content .table table {
  width: unset;
}

.Version {
  i {
    transition: 0.3s;
    &.expand {
      transform: rotate(-0.25turn);
    }
  }
}

.versionTable-enter-active,
.versionTable-leave-active {
  transition: opacity 0.3s ease;
}

.versionTable-enter-from,
.versionTable-leave-to {
  opacity: 0;
}

::selection {
  background-color: rgba(0, 120, 215, 0.3) !important;
  color: black;
}
</style>