<template>
  <div :class="{'myckEditor':true}" class="edit"> 
    <div :class="{'ToolBarHidden':post.ToolBarHidden }">
      <ckeditor
        :editor="editor"
        :modelValue="props.post.editorData"
        ref="editorInstance"
        :config="editorConfig"
        @change=""
      />
    </div>
  </div>
</template>

<script setup>
// about CKEditor5
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import {
  ClassicEditor,
  Essentials,
  Alignment,
  Autoformat,
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
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PageBreak,
  Table,
  TableToolbar,
  TodoList,
  Underline,
  Highlight
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import { MyCustomUploadAdapterPlugin } from '../../../assets/upload2'
import translations from 'ckeditor5/translations/zh.js';

import { defineProps, defineEmits, computed, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      delay: 1000,
      IsAuthor: false,
      ToolBarHidden: false,
      Lang: 'cht',
      editorData: '',
      showModel: null
    })
  }
})
const publications = defineModel('publications')
const emit = defineEmits(['exportdata', 'handleKnowledgeSubDetailPublicationMaintain'])
const editorInstance = ref(null);

const editor = ClassicEditor
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
const IsAuthor = computed(() => post.IsAuthor)
const act = ref(null)

const clickToAnnounce = (_obj) => {
  // 先進行一次存檔
  const editor = editorInstance.value.instance;
  if (props.post.editorData !== editor.getData()) {
    emit('exportdata', editor.getData())
  }
  act.value = 'announce'
  emit('handleKnowledgeSubDetailPublicationMaintain', _obj)
}

// 關閉modal 進行存檔
onBeforeUnmount(() => {
  if (editorInstance.value === null) return
  const editor = editorInstance.value.instance;
  if (props.post.editorData === editor.getData()) return
  emit('exportdata', editor.getData())
})

</script>

<style scoped>

  .myckEditor .ck-sticky-panel {
    display: unset;
  }

  .myckEditor .ToolBarHidden .ck-sticky-panel {
    display: none;
  }


  /* .myckEditor  .ck-editor__editable {
    max-height: 640px;
  }

  .ck-editor__nested-editable p {
    margin: 0px;
    line-height: 14px;
  } */
/* .ck .ck-editor__main {
  width: 100%;
} */

  :deep(.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-focused) {
    overflow-y: scroll;
    min-height: 75vh;
  }

  :deep(.ck-blurred.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline) {
    overflow-y: scroll;
    min-height: 75vh;
  }

  

  :deep(.ck-content .table table) {
    width: unset;
  }
  .myckEditor.edit {
    width: 942px;
    height: fit-content;
  }

</style>